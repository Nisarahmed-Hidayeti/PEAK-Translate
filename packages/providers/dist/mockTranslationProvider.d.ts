import { TranslationProvider, LanguageCode } from '@peak-translation/core';
export declare class MockTranslationProvider implements TranslationProvider {
    translateText(text: string, sourceLang: LanguageCode, targetLang: LanguageCode): Promise<{
        translatedText: string;
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
//# sourceMappingURL=mockTranslationProvider.d.ts.map