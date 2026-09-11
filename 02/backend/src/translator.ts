export type Language = 'sk' | 'de';

export interface TranslationRequest {
  text: string;
  source: Language;
  target: Language;
}

export interface TranslationResponse {
  source: Language;
  target: Language;
  originalText: string;
  translatedText: string;
}

/** Provider-neutral contract. The concrete AI provider is injected later. */
export interface TranslationProvider {
  translate(request: TranslationRequest): Promise<TranslationResponse>;
}

export function validateLanguagePair(source: Language, target: Language): void {
  if (source === target) {
    throw new Error('Source and target languages must be different.');
  }
}
