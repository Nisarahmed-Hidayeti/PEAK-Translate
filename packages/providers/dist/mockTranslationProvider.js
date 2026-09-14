export class MockTranslationProvider {
    async translateText(text, sourceLang, targetLang) {
        // Mock translation: just reverse the string or append "(translated)"
        const translatedText = `[${targetLang.toUpperCase()}] ${text}`;
        return {
            translatedText,
            details: {
                definitions: [`Mock definition for ${text}`],
                examples: [
                    `Example 1: ${text} is useful.`,
                    `Example 2: Learning ${text} helps.`,
                    `Example 3: ${text} in context.`
                ],
                phonetic: `/ˈmɒk/`
            }
        };
    }
    async lookupWord(word, sourceLang, targetLang) {
        // Handle single word lookup
        if (word.trim().split(/\s+/).length === 1 && word.length > 0) {
            return {
                word,
                translations: [`[${targetLang.toUpperCase()}] ${word}`],
                definition: `Mock definition for ${word}`,
                examples: [
                    `Example sentence with ${word}.`,
                    `Another example using ${word}.`,
                    `Finally, ${word} in a different context.`
                ],
                phonetic: `/ˈwɜːrd/`
            };
        }
        return null;
    }
}
//# sourceMappingURL=mockTranslationProvider.js.map