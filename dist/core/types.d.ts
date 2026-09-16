export type SupportedLanguage = 'tr' | 'en' | 'es' | 'fr' | 'de';
export interface LanguageInfo {
    code: SupportedLanguage;
    name: string;
    nativeName: string;
    ttsCode: string;
}
export interface TranslationRequest {
    text: string;
    sourceLanguage: SupportedLanguage | 'auto';
    targetLanguage: SupportedLanguage;
}
export interface TranslationResult {
    sourceText: string;
    sourceLanguage: SupportedLanguage;
    targetLanguage: SupportedLanguage;
    translation: string;
    confidence?: number;
}
export interface Definition {
    text: string;
    partOfSpeech?: string;
}
export interface ExampleSentence {
    original: string;
    translation?: string;
}
export interface PronunciationData {
    available: boolean;
    audioUrl?: string;
    language: SupportedLanguage;
}
export interface VocabularyItem {
    id: string;
    word: string;
    normalizedWord: string;
    sourceLanguage: SupportedLanguage;
    targetLanguage: SupportedLanguage;
    translation?: string;
    definitions?: Definition[];
    examples?: ExampleSentence[];
    context?: string;
    sourceUrl?: string;
    sourceTitle?: string;
    pronunciation?: PronunciationData;
    createdAt: number;
    updatedAt: number;
}
export interface ExtensionSettings {
    nativeLanguage: SupportedLanguage;
    learningLanguage: SupportedLanguage;
    audioEnabled: boolean;
    ocrLanguagePreference: SupportedLanguage | 'auto';
}
//# sourceMappingURL=types.d.ts.map