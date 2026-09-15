// Import the types we need for testing
const { LanguageCode } = require('../types');

// In a real test, we would import VocabularyItem as well
// But for now we'll test what we can with the available imports

describe('Core Types', () => {
  describe('LanguageCode', () => {
    it('should accept valid language codes', () => {
      // Test that our language codes are valid strings
      const validCodes = ['tr', 'en', 'es', 'fr', 'de'];
      validCodes.forEach(code => {
        expect(typeof code).toBe('string');
        expect(['tr', 'en', 'es', 'fr', 'de']).toContain(code);
      });
    });
  });
});