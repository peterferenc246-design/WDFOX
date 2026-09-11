# FOX Live Translator API

Backend for **02 — FOX Live Translator**.

## Live flow

`Android microphone → POST /api/translate-voice → STT → AI translation → TTS → Android playback`

The MVP supports:

- Slovak (`sk`) ↔ German (`de`)
- multipart audio upload
- speech-to-text with AI Gateway
- faithful text translation
- optional text-to-speech audio returned as base64 MP3
- API keys kept server-side

The current implementation uses Vercel AI Gateway through the AI SDK. AI Gateway supports transcription and speech generation in addition to text generation. citeturn0search9turn0search0

## API

`POST /api/translate-voice`

`multipart/form-data`:

- `audio` — recorded audio file
- `sourceLanguage` — `sk` or `de`
- `targetLanguage` — `sk` or `de`
- `speakResult` — `true` or `false`

Response:

```json
{
  "transcript": "Dobrý deň",
  "translatedText": "Guten Tag",
  "sourceLanguage": "sk",
  "targetLanguage": "de",
  "audioBase64": "...",
  "audioMimeType": "audio/mpeg"
}
```

## Environment

Required:

- `AI_GATEWAY_API_KEY`

Optional:

- `TRANSLATION_MODEL` — default `openai/gpt-4o-mini`
- `TRANSCRIPTION_MODEL` — default `openai/gpt-4o-mini-transcribe`
- `SPEECH_MODEL` — default `openai/tts-1`

## Deploy

Deploy `02/backend` as the Vercel project root. Add `AI_GATEWAY_API_KEY` as a server-side environment variable. Never put the key into the Android application.

After deployment, put the deployed `/api/translate-voice` URL into `TRANSLATOR_API_URL` in `02/app/build.gradle.kts`, then build the Android app.
