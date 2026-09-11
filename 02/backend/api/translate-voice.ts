const LANGUAGES = new Set(['sk', 'de']);
const GEMINI_API = 'https://generativelanguage.googleapis.com/v1beta/models';

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function base64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

function wavFromPcm(pcm: Uint8Array, sampleRate = 24000, channels = 1, bits = 16): Uint8Array {
  const out = new Uint8Array(44 + pcm.length);
  const view = new DataView(out.buffer);
  const text = (offset: number, value: string) => [...value].forEach((c, i) => view.setUint8(offset + i, c.charCodeAt(0)));
  text(0, 'RIFF'); view.setUint32(4, 36 + pcm.length, true); text(8, 'WAVE'); text(12, 'fmt ');
  view.setUint32(16, 16, true); view.setUint16(20, 1, true); view.setUint16(22, channels, true);
  view.setUint32(24, sampleRate, true); view.setUint32(28, sampleRate * channels * bits / 8, true);
  view.setUint16(32, channels * bits / 8, true); view.setUint16(34, bits, true); text(36, 'data');
  view.setUint32(40, pcm.length, true); out.set(pcm, 44); return out;
}

async function gemini(model: string, body: unknown, timeoutMs = 30000): Promise<any> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error('GEMINI_API_KEY is not configured in Vercel');
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(`${GEMINI_API}/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(body), signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Gemini ${response.status}: ${await response.text()}`);
    return response.json();
  } finally { clearTimeout(timer); }
}

function firstText(data: any): string {
  return String(data?.candidates?.[0]?.content?.parts?.find((p: any) => p.text)?.text || '').trim();
}

export async function POST(request: Request): Promise<Response> {
  try {
    const form = await request.formData();
    const audio = form.get('audio');
    const sourceLanguage = String(form.get('sourceLanguage') ?? '');
    const targetLanguage = String(form.get('targetLanguage') ?? '');
    const speakResult = String(form.get('speakResult') ?? 'true') === 'true';

    if (!(audio instanceof File)) return json({ error: 'Missing audio file' }, 400);
    if (!LANGUAGES.has(sourceLanguage) || !LANGUAGES.has(targetLanguage) || sourceLanguage === targetLanguage) {
      return json({ error: 'sourceLanguage and targetLanguage must be different sk/de values' }, 400);
    }

    const bytes = new Uint8Array(await audio.arrayBuffer());
    if (!bytes.length) return json({ error: 'Audio file is empty' }, 400);
    if (bytes.length > 15 * 1024 * 1024) return json({ error: 'Audio file is too large for inline Gemini processing' }, 413);

    const sourceName = sourceLanguage === 'sk' ? 'Slovak' : 'German';
    const targetName = targetLanguage === 'sk' ? 'Slovak' : 'German';
    const mimeType = audio.type || 'audio/mp4';
    const model = process.env.TRANSCRIPTION_MODEL || process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    const transcription = await gemini(model, {
      contents: [{ parts: [
        { text: `Transcribe this spoken ${sourceName} audio exactly. Return only the spoken words, with no commentary. Do not translate.` },
        { inlineData: { mimeType, data: base64(bytes) } },
      ] }],
    });
    const transcript = firstText(transcription);
    if (!transcript) return json({ error: 'No speech detected' }, 422);

    const translation = await gemini(process.env.TRANSLATION_MODEL || model, {
      contents: [{ parts: [{ text: `You are a professional live interpreter. Translate the following ${sourceName} text into ${targetName}. Preserve meaning, tone and intent. Return only the translation.\n\n${transcript}` }] }],
    }, 15000);
    const translatedText = firstText(translation);
    if (!translatedText) throw new Error('Gemini returned an empty translation');

    let audioBase64: string | undefined;
    let audioMimeType: string | undefined;
    if (speakResult) {
      try {
        const tts = await gemini(process.env.SPEECH_MODEL || 'gemini-2.5-flash-preview-tts', {
          contents: [{ parts: [{ text: translatedText }] }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: targetLanguage === 'de' ? 'Kore' : 'Aoede' } } },
          },
        }, 20000);
        const part = tts?.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData);
        if (part?.inlineData?.data) {
          const pcm = Uint8Array.from(atob(part.inlineData.data), c => c.charCodeAt(0));
          audioBase64 = base64(wavFromPcm(pcm));
          audioMimeType = 'audio/wav';
        }
      } catch (error) { console.error('Gemini TTS failed', error); }
    }

    return json({ transcript, translatedText, sourceLanguage, targetLanguage,
      ...(audioBase64 ? { audioBase64, audioMimeType } : {}) });
  } catch (error) {
    console.error('translate-voice failed', error);
    return json({ error: `Translation service failed: ${error instanceof Error ? error.message : 'Unknown error'}` }, 500);
  }
}
