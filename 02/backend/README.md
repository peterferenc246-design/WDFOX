# 02 — FOX Live Translator — Backend

Backend contract and implementation for the mobile FOX Live Translator.

## Production endpoint

Vercel project: `wdfox-live-translat-api`

Production API:

`https://wdfox-live-translat-jz8mjkdcf-peters-projects-db101134.vercel.app/api/translate-voice`

## Flow

`Android → multipart audio → Gemini audio understanding → translation → optional Gemini TTS → JSON response`

## Request

`POST /api/translate-voice` with `multipart/form-data`:

- `audio`: recorded audio file
- `sourceLanguage`: `sk` or `de`
- `targetLanguage`: `sk` or `de`
- `speakResult`: `true` or `false`

## Response

```json
{
  "transcript": "Dobrý deň",
  "translatedText": "Guten Tag",
  "sourceLanguage": "sk",
  "targetLanguage": "de",
  "audioBase64": "...",
  "audioMimeType": "audio/wav"
}
```

## Environment variables

Configure these in Vercel → Project → Environment Variables:

- `GEMINI_API_KEY` — server-side Google Gemini API key
- `GEMINI_MODEL` — optional, default `gemini-2.5-flash`
- `TRANSCRIPTION_MODEL` — optional
- `TRANSLATION_MODEL` — optional
- `SPEECH_MODEL` — optional, default `gemini-2.5-flash-preview-tts`

**Never put the Gemini API key in the Android application.**

## Deployment

Pushes to the connected `main` branch trigger Vercel deployment. Root Directory is `02/backend`.

## Security

API credentials stay server-side. The mobile app only calls the public API endpoint.
