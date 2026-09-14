import { TranslationProvider, LanguageCode, VocabularyItem } from '@peak-translation/core';

export class MockTranslationProvider implements TranslationProvider {
  async translateText(text: string, sourceLang: LanguageCode, targetLang: LanguageCode): Promise<{
    translatedText: string;
    details?: {
      definitions?: string[];
      examples?: string[];
      phonetic?: string;
    };
  }> {
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

  async lookupWord(word: string, sourceLang: LanguageCode, targetLang: LanguageCode): Promise<{
    word: string;
    translations: string[];
    definition?: string;
    examples?: string[];
    phonetic?: string;
  } | null> {
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
