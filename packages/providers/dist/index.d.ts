import { MockTranslationProvider } from './mockTranslationProvider';
import { LibreTranslateProvider } from './libretranslateProvider';
export { MockTranslationProvider, LibreTranslateProvider };
import { MockOCRProvider } from './mockOCRProvider';
import { TesseractOCRProvider } from './tesseractOCRProvider';
export { MockOCRProvider, TesseractOCRProvider };
import { MockTTSProvider } from './mockTTSProvider';
import { WebSpeechTTSProvider } from './webSpeechTTSProvider';
export { MockTTSProvider, WebSpeechTTSProvider };
export declare function createTranslationProvider(useMock?: boolean): any;
export declare function createOCRProvider(useMock?: boolean): any;
export declare function createTTSProvider(useMock?: boolean): any;
//# sourceMappingURL=index.d.ts.map