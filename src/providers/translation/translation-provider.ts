// Translation provider interface

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
