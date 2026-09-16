// Mock translation provider for development
export class MockTranslationProvider {
    constructor() {
        this.name = 'Mock Translator';
    }
    async translate(request) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        // Simple mock translations
        const mockTranslations = {
            tr: {
                en: {
                    polished: 'özenli · kusursuz',
                    hello: 'merhaba',
                    world: 'dünya',
                    test: 'test'
                }
            },
            en: {
                tr: {
                    polished: 'refined, sophisticated',
                    merhaba: 'hello',
                    dünya: 'world',
                    test: 'test'
                }
            }
        };
        const sourceLang = request.sourceLanguage !== 'auto' ? request.sourceLanguage : request.targetLanguage === 'en' ? 'tr' : 'en';
        const targetLang = request.targetLanguage;
        // Get translation or return original text if not found
        const translation = mockTranslations[sourceLang]?.[targetLang]?.[request.text.toLowerCase()] ||
            `${request.text} [translated to ${targetLang}]`;
        return {
            sourceText: request.text,
            sourceLanguage: sourceLang,
            targetLanguage: targetLang,
            translation: translation,
            confidence: 0.9
        };
    }
    supportedLanguages() {
        return ['tr', 'en', 'es', 'fr', 'de'];
    }
    getName() {
        return this.name;
    }
}
//# sourceMappingURL=mock-translation-provider.js.map