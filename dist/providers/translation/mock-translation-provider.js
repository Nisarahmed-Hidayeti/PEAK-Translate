// Mock translation provider for development
export class MockTranslationProvider {
    constructor() {
        this.mockTranslations = {
            en: {
                tr: {
                    hello: "merhaba",
                    world: "dünya",
                    test: "test",
                    polished: "ilgilendirici"
                }
            },
            tr: {
                en: {
                    merhaba: "hello",
                    dünya: "world",
                    test: "test",
                    polished: "polished"
                }
            }
        };
    }
    async translate(request) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        const { text, sourceLanguage, targetLanguage } = request;
        // Simple mock translation logic
        let translatedText = text;
        const sourceDict = this.mockTranslations[sourceLanguage];
        if (sourceDict) {
            const targetDict = sourceDict[targetLanguage];
            if (targetDict) {
                const translation = targetDict[text.toLowerCase()];
                if (translation) {
                    translatedText = translation;
                }
            }
        }
        // Fallback for common words if not in dictionary
        if (translatedText === text) { // No translation found yet
            if (text.toLowerCase() === "hello" && targetLanguage === "tr") {
                translatedText = "merhaba";
            }
            else if (text.toLowerCase() === "world" && targetLanguage === "tr") {
                translatedText = "dünya";
            }
            else if (text.toLowerCase() === "test" && targetLanguage === "tr") {
                translatedText = "test";
            }
            else if (text.toLowerCase() === "polished" && targetLanguage === "tr") {
                translatedText = "ilgilendirici";
            }
            else if (text.toLowerCase() === "hello" && targetLanguage === "en") {
                translatedText = "hello";
            }
            else if (text.toLowerCase() === "world" && targetLanguage === "en") {
                translatedText = "world";
            }
        }
        // If still no translation, mock it
        if (translatedText === text) {
            translatedText = `[Mock: ${text}]`;
        }
        return {
            text: translatedText,
            sourceLanguage,
            targetLanguage,
            pronunciation: undefined,
            examples: [],
            confidence: 0.95
        };
    }
    async getSupportedLanguages() {
        return ["en", "tr", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko", "ar"];
    }
    getName() {
        return "Mock Translation Provider";
    }
}
//# sourceMappingURL=mock-translation-provider.js.map