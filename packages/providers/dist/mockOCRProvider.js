export class MockOCRProvider {
    async extractText(imageData) {
        // Mock OCR: return a fixed string or simulate text from image
        // In a real scenario, we would process the image data, but for mock we return a sample.
        return {
            text: 'This is a sample text extracted from an image via OCR.',
            confidence: 0.95,
            language: 'en'
        };
    }
}
//# sourceMappingURL=mockOCRProvider.js.map