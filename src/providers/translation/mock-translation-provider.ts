// Mock translation provider for development

import type { TranslationProvider, TranslationRequest, TranslationResult } from './translation-provider';
import type { SupportedLanguage } from '../../core/types';

export class MockTranslationProvider implements TranslationProvider {
  private name = 'Mock Translator';

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simple mock translations
    const mockTranslations: Record<string, Record<string, string>> = {
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

  supportedLanguages(): SupportedLanguage[] {
    return ['tr', 'en', 'es', 'fr', 'de'];
  }

  getName(): string {
    return this.name;
  }
}
