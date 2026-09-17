// Core types for Peak Translation extension

export interface VocabularyItem {
  id: string;
  word: string;
  normalizedWord: string;
  sourceLanguage: string;
  targetLanguage: string;
  translation: string;
  examples?: string[];
  definitions?: string[];
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

export interface DefinitionResult {
  word: string;
  definitions: string[];
  partOfSpeech?: string;
  source: string;
}

export interface ExampleResult {
  word: string;
  examples: string[];
  source: string;
}

export interface TranslationProvider {
  translate(request: TranslationRequest): Promise<TranslationResult>;
  getSupportedLanguages(): Promise<string[]>;
  getName(): string;
}

export interface DefinitionProvider {
  getDefinitions(word: string, language: string): Promise<DefinitionResult>;
  getSupportedLanguages(): Promise<string[]>;
  getName(): string;
}

export interface ExampleProvider {
  getExamples(word: string, language: string): Promise<ExampleResult>;
  getSupportedLanguages(): Promise<string[]>;
  getName(): string;
}

export type SupportedLanguage = "tr" | "en" | "es" | "fr" | "de";

export interface LanguageInfo {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  ttsCode?: string;
}

export interface OCRProvider {
  recognize(image: ImageBitmap | HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | Blob, language?: string): Promise<string>;
  getName(): string;
}

export interface TTSProvider {
  speak(text: string, language: string): Promise<void>;
  getName(): string;
}
