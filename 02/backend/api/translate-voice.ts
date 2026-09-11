const LANGUAGES = new Set(['sk', 'de']);
const OPENAI_API = 'https://api.openai.com/v1';

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

async function openaiFetch(path: string, init: RequestInit, timeoutMs: number): Promise<Response> {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error('OPENAI_API_KEY is not configured in Vercel');
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(`${OPENAI_API}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...(init.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return json({ error: 'OPENAI_API_KEY is not configured in Vercel' }, 503);
    }

    const form = await request.formData();
    const audio = form.get('audio');
    const sourceLanguage = String(form.get('sourceLanguage') ?? '');
    const targetLanguage = String(form.get('targetLanguage') ?? '');
    const speakResult = String(form.get('speakResult') ?? 'true') === 'true';

    if (!(audio instanceof File)) return json({ error: 'Missing audio file' }, 400);
    if (!LANGUAGES.has(sourceLanguage) || !LANGUAGES.has(targetLanguage)) {
      return json({ error: 'sourceLanguage and targetLanguage must be sk or de' }, 400);
    }
    if (sourceLanguage === targetLanguage) {
      return json({ error: 'Source and target languages must be different' }, 400);
    }

    const audioBytes = new Uint8Array(await audio.arrayBuffer());
    if (!audioBytes.length) return json({ error: 'Audio file is empty' }, 400);

    // OpenAI Audio Transcriptions API. Use the browser-provided filename/type
    // so common WebM/MP4 recordings are handled correctly.
    const transcriptionForm = new FormData();
    const filename = audio.name || 'recording.webm';
    transcriptionForm.append('file', new Blob([audioBytes], { type: audio.type || 'audio/webm' }), filename);
    transcriptionForm.append(
      'model',
      process.env.TRANSCRIPTION_MODEL || 'gpt-4o-mini-transcribe',
    );
    transcriptionForm.append('response_format', 'json');

    const transcriptionResponse = await openaiFetch(
      '/audio/transcriptions',
      { method: 'POST', body: transcriptionForm },
      18000,
    );

    if (!transcriptionResponse.ok) {
      const detail = await transcriptionResponse.text();
      throw new Error(`OpenAI transcription ${transcriptionResponse.status}: ${detail}`);
    }

    const transcription = (await transcriptionResponse.json()) as { text?: string };
    const transcript = String(transcription.text || '').trim();
    if (!transcript) return json({ error: 'No speech detected' }, 422);

    const sourceName = sourceLanguage === 'sk' ? 'Slovak' : 'German';
    const targetName = targetLanguage === 'sk' ? 'Slovak' : 'German';

    const translationResponse = await openaiFetch(
      '/chat/completions',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env.TRANSLATION_MODEL || 'gpt-4o-mini',
          temperature: 0.1,
          max_tokens: 1000,
          messages: [
            {
              role: 'system',
              content: `You are a professional live interpreter. Translate faithfully from ${sourceName} to ${targetName}. Preserve meaning, tone and intent. Return only the translated text. Do not explain anything.`,
            },
            { role: 'user', content: transcript },
          ],
        }),
      },
      12000,
    );

    if (!translationResponse.ok) {
      const detail = await translationResponse.text();
      throw new Error(`OpenAI translation ${translationResponse.status}: ${detail}`);
    }

    const translation = (await translationResponse.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const translatedText = String(translation.choices?.[0]?.message?.content || '').trim();
    if (!translatedText) throw new Error('OpenAI returned an empty translation');

    let audioBase64: string | undefined;
    let audioMimeType: string | undefined;
    let speechWarning: string | undefined;

    if (speakResult) {
      try {
        const speechResponse = await openaiFetch(
          '/audio/speech',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              model: process.env.SPEECH_MODEL || 'tts-1',
              input: translatedText,
              voice: targetLanguage === 'de' ? 'nova' : 'alloy',
              response_format: 'mp3',
            }),
          },
          8000,
        );

        if (!speechResponse.ok) {
          const detail = await speechResponse.text();
          throw new Error(`OpenAI speech ${speechResponse.status}: ${detail}`);
        }

        const speechBytes = new Uint8Array(await speechResponse.arrayBuffer());
        audioBase64 = uint8ArrayToBase64(speechBytes);
        audioMimeType = 'audio/mpeg';
      } catch (error) {
        speechWarning = error instanceof Error ? error.message : 'TTS failed';
        console.error('translate-voice TTS failed', error);
      }
    }

    return json({
      transcript,
      translatedText,
      sourceLanguage,
      targetLanguage,
      ...(audioBase64 ? { audioBase64, audioMimeType } : {}),
      ...(speechWarning ? { speechWarning } : {}),
    });
  } catch (error) {
    console.error('translate-voice failed', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return json({ error: `Translation service failed: ${message}` }, 500);
  }
}
