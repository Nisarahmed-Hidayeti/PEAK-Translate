// Core types for Peak Translation extension

export interface VocabularyItem {
  id: string;
  word: string;
  normalizedWord: string;
  sourceLanguage: string;
  targetLanguage: string;
  translation: string;
  examples?: string[];
  context?: string;
  createdAt: number;
  updatedAt: number;
  pronunciation?: string;
  audioAvailable?: boolean;
}

export interface ExtensionSettings {
  nativeLanguage: string;
  learningLanguage: string;
  audioEnabled: boolean;
  ocrLanguagePreference: string;
}

export interface TranslationRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export interface TranslationResult {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  pronunciation?: string;
  examples?: string[];
  confidence: number;
}

export interface TranslationProvider {
  translate(request: TranslationRequest): Promise<TranslationResult>;
  getSupportedLanguages(): Promise<string[]>;
  getName(): string;
}
