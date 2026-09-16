// Mock translation provider for development

import { TranslationProvider, TranslationRequest, TranslationResult } from './translation-provider';

export class MockTranslationProvider implements TranslationProvider {
  private mockTranslations: Record<string, Record<string, string>> = {
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

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const { text, sourceLanguage, targetLanguage } = request;
    
    // Simple mock translation logic
    let translatedText = text;
    if (this.mockTranslations[sourceLanguage]?.[targetLanguage]?.[text.toLowerCase()]) {
      translatedText = this.mockTranslations[sourceLanguage][targetLanguage][text.toLowerCase()];
    } else if (text.toLowerCase() === 'hello' && targetLanguage === 'tr') {
      translatedText = 'merhaba';
    } else if (text.toLowerCase() === 'world' && targetLanguage === 'tr') {
      translatedText = 'dünya';
    } else if (text.toLowerCase() === 'test' && targetLanguage === 'tr') {
      translatedText = 'test';
    } else if (text.toLowerCase() === 'polished' && targetLanguage === 'tr') {
      translatedText = 'ilgilendirici';
    } else {
      // Fallback: just return the text with a prefix indicating it's mocked
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

  async getSupportedLanguages(): Promise<string[]> {
    return ['en', 'tr', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar'];
  }

  getName(): string {
    return 'Mock Translation Provider';
  }
}
