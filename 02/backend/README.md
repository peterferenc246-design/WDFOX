# FOX Live Translator API

Backend contract for 02.

## Flow
1. Android sends recorded audio to `POST /api/translate-voice`.
2. Backend transcribes audio.
3. Backend translates the transcript from source language to target language.
4. Backend optionally generates speech audio.
5. Backend returns transcript, translation and optional audio payload.

API keys remain server-side.

## Environment
- `AI_GATEWAY_API_KEY`
- `TRANSLATION_MODEL` (optional)
- `TRANSCRIPTION_MODEL` (optional)
- `SPEECH_MODEL` (optional)
