# 02 — FOX Live Translator — Backend

Backend contract and implementation for the mobile FOX Live Translator.

## Production endpoint

Vercel project: `wdfox-live-translat-api`

Vercel Root Directory: `02/backend`

The production API endpoint is:

`POST /api/translate-voice`

The final public hostname is assigned by Vercel after the first successful production deployment.

## Flow

`Android → multipart audio → STT → AI translation → optional TTS → JSON response`

## Request

`POST /api/translate-voice`

Content-Type: `multipart/form-data`

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
  "audioMimeType": "audio/mpeg"
}
```

## Environment variables

Configure these in Vercel → Project → Environment Variables:

- `AI_GATEWAY_API_KEY` — server-side AI Gateway credential
- `TRANSLATION_MODEL` — optional
- `TRANSCRIPTION_MODEL` — optional
- `SPEECH_MODEL` — optional

Never put the AI Gateway key in the Android application.

## Deployment

Pushes to the connected `main` branch trigger Vercel deployment for this project. The Vercel project must use `Other` as Framework Preset and `02/backend` as Root Directory.

## Security

API credentials stay server-side. The mobile app only calls the public API endpoint.
