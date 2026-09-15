// Translation providers
import { MockTranslationProvider } from './mockTranslationProvider';
import { LibreTranslateProvider } from './libretranslateProvider';
export { MockTranslationProvider, LibreTranslateProvider };

// OCR providers
import { MockOCRProvider } from './mockOCRProvider';
import { TesseractOCRProvider } from './tesseractOCRProvider';
export { MockOCRProvider, TesseractOCRProvider };

// TTS providers
import { MockTTSProvider } from './mockTTSProvider';
import { WebSpeechTTSProvider } from './webSpeechTTSProvider';
export { MockTTSProvider, WebSpeechTTSProvider };

// Factory function to create translation provider
export function createTranslationProvider(useMock = false): any {
  if (useMock) {
    return new MockTranslationProvider();
  }
  return new LibreTranslateProvider();
}

// Factory function to create OCR provider
export function createOCRProvider(useMock = false): any {
  if (useMock) {
    return new MockOCRProvider();
  }
  return new TesseractOCRProvider();
}

// Factory function to create TTS provider
export function createTTSProvider(useMock = false): any {
  if (useMock) {
    return new MockTTSProvider();
  }
  return new WebSpeechTTSProvider();
}