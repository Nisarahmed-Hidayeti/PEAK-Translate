export type LanguageCode = 'tr' | 'en' | 'es' | 'fr' | 'de';

export interface LanguageConfig {
  native: LanguageCode;
  learning: LanguageCode;
}

export type SelectionClassification = 'WORD' | 'PHRASE' | 'SENTENCE' | 'PARAGRAPH';

export interface VocabularyItem {
  id: string;
  word: string;
  normalizedWord: string;
  sourceLanguage: LanguageCode;
  targetLanguage: LanguageCode;
  translations: string[];
  definition?: string;
  examples: string[];
  pronunciation?: {
    phonetic?: string;
    audioUrl?: string;
    provider?: string;
  };
  context?: string;
  sourceUrl?: string;
  sourceTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TranslationProvider {
  translateText(text: string, sourceLang: LanguageCode, targetLang: LanguageCode): Promise<{
    translatedText: string;
    // Optional: more detailed translation info
    details?: {
      definitions?: string[];
      examples?: string[];
      phonetic?: string;
    };
  }>;
  lookupWord(word: string, sourceLang: LanguageCode, targetLang: LanguageCode): Promise<{
    word: string;
    translations: string[];
    definition?: string;
    examples?: string[];
    phonetic?: string;
  } | null>;
}

export interface OCRProvider {
  extractText(imageData: string): Promise<{
    text: string;
    confidence?: number;
    language?: LanguageCode;
  }>;
}

export interface TTSProvider {
  speak(text: string, language: LanguageCode): Promise<void>;
  stop(): void;
}
