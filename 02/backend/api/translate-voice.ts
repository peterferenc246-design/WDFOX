const LANGUAGES = new Set(['sk', 'de']);
const AI_GATEWAY_URL = 'https://ai-gateway.vercel.sh';

function json(body: unknown, status = 200): Response {
  return Response.json(body, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

async function gatewayFetch(
  path: string,
  model: string,
  body: unknown,
  timeoutMs: number,
): Promise<any> {
  const apiKey = process.env.AI_GATEWAY_API_KEY;
  if (!apiKey) {
    throw new Error('AI_GATEWAY_API_KEY is not configured in Vercel');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${AI_GATEWAY_URL}${path}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'ai-model-id': model,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    const text = await response.text();
    let result: any;
    try {
      result = text ? JSON.parse(text) : {};
    } catch {
      result = { raw: text };
    }

    if (!response.ok) {
      const detail = result?.error?.message || result?.error || result?.message || `HTTP ${response.status}`;
      throw new Error(`AI Gateway ${response.status}: ${String(detail)}`);
    }

    return result;
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const form = await request.formData();
    const audio = form.get('audio');
    const sourceLanguage = String(form.get('sourceLanguage') ?? '');
    const targetLanguage = String(form.get('targetLanguage') ?? '');
    const speakResult = String(form.get('speakResult') ?? 'true') === 'true';

    if (!(audio instanceof File)) {
      return json({ error: 'Missing audio file' }, 400);
    }
    if (!LANGUAGES.has(sourceLanguage) || !LANGUAGES.has(targetLanguage)) {
      return json({ error: 'sourceLanguage and targetLanguage must be sk or de' }, 400);
    }
    if (sourceLanguage === targetLanguage) {
      return json({ error: 'Source and target languages must be different' }, 400);
    }

    const audioBytes = new Uint8Array(await audio.arrayBuffer());
    if (!audioBytes.length) {
      return json({ error: 'Audio file is empty' }, 400);
    }

    const transcription = await gatewayFetch(
      '/v4/ai/transcription-model',
      process.env.TRANSCRIPTION_MODEL || 'openai/whisper-1',
      {
        audio: uint8ArrayToBase64(audioBytes),
        mediaType: audio.type || 'audio/webm',
      },
      25000,
    );

    const transcript = String(transcription?.text || '').trim();
    if (!transcript) {
      return json({ error: 'No speech detected' }, 422);
    }

    const sourceName = sourceLanguage === 'sk' ? 'Slovak' : 'German';
    const targetName = targetLanguage === 'sk' ? 'Slovak' : 'German';

    const translation = await gatewayFetch(
      '/v1/chat/completions',
      process.env.TRANSLATION_MODEL || 'openai/gpt-4o-mini',
      {
        messages: [
          {
            role: 'system',
            content: `You are a professional live interpreter. Translate faithfully from ${sourceName} to ${targetName}. Preserve meaning, tone and intent. Return only the translated text. Do not explain anything.`,
          },
          { role: 'user', content: transcript },
        ],
        temperature: 0.1,
        max_tokens: 1000,
        stream: false,
      },
      20000,
    );

    const translatedText = String(translation?.choices?.[0]?.message?.content || '').trim();
    if (!translatedText) {
      throw new Error('AI Gateway returned an empty translation');
    }

    let audioBase64: string | undefined;
    let audioMimeType: 'audio/mpeg' | undefined;

    if (speakResult) {
      const speech = await gatewayFetch(
        '/v4/ai/speech-model',
        process.env.SPEECH_MODEL || 'openai/tts-1',
        {
          text: translatedText,
          voice: targetLanguage === 'de' ? 'nova' : 'alloy',
          outputFormat: 'mp3',
        },
        20000,
      );

      if (typeof speech?.audio !== 'string' || !speech.audio) {
        throw new Error('AI Gateway returned no speech audio');
      }
      audioBase64 = speech.audio;
      audioMimeType = 'audio/mpeg';
    }

    return json({
      transcript,
      translatedText,
      sourceLanguage,
      targetLanguage,
      ...(audioBase64 ? { audioBase64, audioMimeType } : {}),
    });
  } catch (error) {
    console.error('translate-voice failed', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    const status = message.includes('AI_GATEWAY_API_KEY') ? 503 : 500;
    return json({ error: `Translation service failed: ${message}` }, status);
  }
}
