import { OCRProvider, LanguageCode } from '@peak-translation/core';
export declare class TesseractOCRProvider implements OCRProvider {
    constructor();
    extractText(imageData: string): Promise<{
        text: string;
        confidence?: number;
        language?: LanguageCode;
    }>;
}
//# sourceMappingURL=tesseractOCRProvider.d.ts.map