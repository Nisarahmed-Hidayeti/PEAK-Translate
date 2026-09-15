import { LanguageCode, VocabularyItem } from '../types';

describe('Core Types', () => {
  describe('LanguageCode', () => {
    it('should accept valid language codes', () => {
      const validCodes: LanguageCode[] = ['tr', 'en', 'es', 'fr', 'de'];
      validCodes.forEach(code => {
        expect(code).toBeOneOf(['tr', 'en', 'es', 'fr', 'de']);
      });
    });
  });

  describe('VocabularyItem', () => {
    it('should create a valid vocabulary item', () => {
      const item: VocabularyItem = {
        id: 'test-id',
        word: 'test',
        normalizedWord: 'test',
        sourceLanguage: 'en',
        targetLanguage: 'tr',
        translations: ['test'],
        examples: ['This is a test.'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      expect(item.id).toBe('test-id');
      expect(item.word).toBe('test');
      expect(item.sourceLanguage).toBe('en');
      expect(item.targetLanguage).toBe('tr');
      expect(item.translations).toContain('test');
      expect(item.examples).toContain('This is a test.');
    });
  });
});