import { OCRProvider, LanguageCode } from '@peak-translation/core';

export class MockOCRProvider implements OCRProvider {
  async extractText(imageData: string): Promise<{
    text: string;
    confidence?: number;
    language?: LanguageCode;
  }> {
    // Mock OCR: return a fixed string or simulate text from image
    // In a real scenario, we would process the image data, but for mock we return a sample.
    return {
      text: 'This is a sample text extracted from an image via OCR.',
      confidence: 0.95,
      language: 'en' as LanguageCode
    };
  }
}
