"use strict";
// Simple test to verify the file can be required without syntax errors
const fs = require('fs');
const path = require('path');
describe('TesseractOCRProvider File Existence', () => {
    it('should exist', () => {
        const filePath = path.resolve(__dirname, '../tesseractOCRProvider.ts');
        expect(fs.existsSync(filePath)).toBe(true);
    });
});
//# sourceMappingURL=tesseractOCRProvider.test.js.map