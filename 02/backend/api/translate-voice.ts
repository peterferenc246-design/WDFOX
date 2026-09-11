import { experimental_generateSpeech as generateSpeech, experimental_transcribe as transcribe, generateText } from 'ai';
import { gateway } from '@ai-sdk/gateway';

const LANGUAGES = new Set(['sk', 'de']);

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store' } });
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
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

    const transcription = await transcribe({
      model: gateway.transcriptionModel(process.env.TRANSCRIPTION_MODEL || 'openai/whisper-1'),
      audio: audioBytes,
      mediaType: audio.type || 'audio/webm',
      maxRetries: 0,
      abortSignal: AbortSignal.timeout(25000),
    });

    const transcript = transcription.text.trim();
    if (!transcript) {
      return json({ error: 'No speech detected' }, 422);
    }

    const translation = await generateText({
      model: gateway(process.env.TRANSLATION_MODEL || 'openai/gpt-4o-mini'),
      system: `You are a professional live interpreter. Translate faithfully from ${sourceLanguage === 'sk' ? 'Slovak' : 'German'} to ${targetLanguage === 'sk' ? 'Slovak' : 'German'}. Preserve meaning, tone and intent. Return only the translated text. Do not explain anything.`,
      prompt: transcript,
      temperature: 0.1,
      maxRetries: 0,
      abortSignal: AbortSignal.timeout(20000),
    });

    const translatedText = translation.text.trim();
    let audioBase64: string | undefined;
    let audioMimeType: 'audio/mpeg' | 'audio/wav' | undefined;

    if (speakResult && translatedText) {
      const speech = await generateSpeech({
        model: gateway.speechModel(process.env.SPEECH_MODEL || 'openai/tts-1'),
        text: translatedText,
        voice: targetLanguage === 'de' ? 'nova' : 'alloy',
        outputFormat: 'mp3',
        maxRetries: 0,
        abortSignal: AbortSignal.timeout(20000),
      });
      audioBase64 = uint8ArrayToBase64(speech.audio.uint8Array);
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
    return json({ error: `Translation service failed: ${message}` }, 500);
  }
}
