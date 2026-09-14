import { OCRProvider, LanguageCode } from '@peak-translation/core';
export declare class MockOCRProvider implements OCRProvider {
    extractText(imageData: string): Promise<{
        text: string;
        confidence?: number;
        language?: LanguageCode;
    }>;
}
//# sourceMappingURL=mockOCRProvider.d.ts.map