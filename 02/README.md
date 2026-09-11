# 02 — FOX Live Translator

Mobile-first bilingual AI translator. MVP target: Slovak ↔ German, with architecture prepared for additional EU languages, realtime voice translation and future WhatsApp integration.

## MVP
- Select language A and B
- Record speech
- Show recognized text
- Translate in both directions through a backend API
- Prepare text-to-speech output

## Architecture
`Android app → Translator API → Speech/Translation/TTS providers`

WhatsApp integration is intentionally isolated from the core translator so the app does not depend on WhatsApp for realtime conversation.
