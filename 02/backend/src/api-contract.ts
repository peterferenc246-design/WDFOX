export interface VoiceTranslationResult {
  transcript: string;
  translatedText: string;
  sourceLanguage: 'sk' | 'de';
  targetLanguage: 'sk' | 'de';
  audioBase64?: string;
  audioMimeType?: 'audio/mpeg' | 'audio/wav';
}

/**
 * POST /api/translate-voice
 * multipart/form-data:
 *   audio: recorded audio
 *   sourceLanguage: sk | de
 *   targetLanguage: sk | de
 *   speakResult: true | false
 */
export type TranslateVoiceResponse = VoiceTranslationResult;
