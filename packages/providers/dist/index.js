// Translation providers
import { MockTranslationProvider } from './mockTranslationProvider';
import { LibreTranslateProvider } from './libretranslateProvider';
export { MockTranslationProvider, LibreTranslateProvider };
// OCR providers
import { MockOCRProvider } from './mockOCRProvider';
export { MockOCRProvider };
// TTS providers
import { MockTTSProvider } from './mockTTSProvider';
import { WebSpeechTTSProvider } from './webSpeechTTSProvider';
export { MockTTSProvider, WebSpeechTTSProvider };
// Factory function to create translation provider
export function createTranslationProvider(useMock = false) {
    if (useMock) {
        return new MockTranslationProvider();
    }
    return new LibreTranslateProvider();
}
// Factory function to create TTS provider
export function createTTSProvider(useMock = false) {
    if (useMock) {
        return new MockTTSProvider();
    }
    return new WebSpeechTTSProvider();
}
//# sourceMappingURL=index.js.map