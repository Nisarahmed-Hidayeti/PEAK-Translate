// Language code mapping for LibreTranslate (some codes might differ)
const LANGUAGE_MAP = {
    tr: 'tr',
    en: 'en',
    es: 'es',
    fr: 'fr',
    de: 'de'
};
export class LibreTranslateProvider {
    constructor(apiUrl = 'https://libretranslate.de/translate') {
        this.apiUrl = apiUrl;
    }
    async translateText(text, sourceLang, targetLang) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: text,
                    source: LANGUAGE_MAP[sourceLang] || sourceLang,
                    target: LANGUAGE_MAP[targetLang] || targetLang,
                    format: 'text'
                })
            });
            if (!response.ok) {
                throw new Error(`Translation API error: ${response.status}`);
            }
            const data = await response.json();
            const translatedText = data.translatedText || '';
            return {
                translatedText,
                details: {
                    // LibreTranslate doesn't provide definitions/examples/phonetic by default
                    // We could enhance this with a dictionary API if needed
                    definitions: [],
                    examples: [],
                    phonetic: undefined
                }
            };
        }
        catch (error) {
            console.error('LibreTranslate translation error:', error);
            throw error;
        }
    }
    async lookupWord(word, sourceLang, targetLang) {
        // For single word lookup, we can still use translateText
        // In a more advanced implementation, we could use a dictionary API
        if (word.trim().split(/\s+/).length === 1 && word.length > 0) {
            try {
                const result = await this.translateText(word, sourceLang, targetLang);
                return {
                    word,
                    translations: [result.translatedText],
                    definition: undefined, // Could be enhanced with dictionary API
                    examples: [], // Could be enhanced with dictionary API
                    phonetic: undefined // Could be enhanced with dictionary API
                };
            }
            catch (error) {
                console.error('LibreTranslate lookup error:', error);
                return null;
            }
        }
        return null;
    }
}
//# sourceMappingURL=libretranslateProvider.js.map