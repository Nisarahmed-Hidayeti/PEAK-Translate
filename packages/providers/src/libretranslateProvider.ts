import { TranslationProvider, LanguageCode } from '@peak-translation/core';

// Language code mapping for LibreTranslate (some codes might differ)
const LANGUAGE_MAP: Record<LanguageCode, string> = {
  tr: 'tr',
  en: 'en',
  es: 'es',
  fr: 'fr',
  de: 'de'
};

export class LibreTranslateProvider implements TranslationProvider {
  private apiUrl: string;

  constructor(apiUrl = 'https://libretranslate.de/translate') {
    this.apiUrl = apiUrl;
  }

  async translateText(text: string, sourceLang: LanguageCode, targetLang: LanguageCode): Promise<{
    translatedText: string;
    details?: {
      definitions?: string[];
      examples?: string[];
      phonetic?: string;
    };
  }> {
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
    } catch (error) {
      console.error('LibreTranslate translation error:', error);
      throw error;
    }
  }

  async lookupWord(word: string, sourceLang: LanguageCode, targetLang: LanguageCode): Promise<{
    word: string;
    translations: string[];
    definition?: string;
    examples?: string[];
    phonetic?: string;
  } | null> {
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
      } catch (error) {
        console.error('LibreTranslate lookup error:', error);
        return null;
      }
    }
    return null;
  }
}