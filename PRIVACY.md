# Privacy Policy for Peak Translation

Last updated: September 17, 2026

## Introduction
Peak Translation ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how our Firefox extension handles your information.

## Information We Do Not Collect
Peak Translation is designed to minimize personal data collection. We do not:
- Collect or store any personal identifiable information beyond what you voluntarily save to your vocabulary
- Track your browsing history or web activity
- Monitor the text you select or translate unless you explicitly use the translation feature
- Record your vocabulary learning progress beyond what you save
- Collect device information or usage analytics
- Use cookies or similar tracking technologies
- Require account creation or login

## Information Processing
Peak Translation processes information as follows:

### Text Translation
When you select text for translation:
1. The selected text is sent to the translation API (LibreTranslate) for processing
2. The translation result is returned to your browser
3. We do not store, log, or retain the original text or translation beyond what you voluntarily save to your vocabulary
4. The text exists only in memory during the translation process and is not retained after processing

### Dictionary Features
When you view definitions or examples:
1. Word lookups are sent to the dictionary API (DictionaryAPI.dev) for processing
2. Results are returned to your browser for display
3. We do not store, log, or retain the queried words or results beyond what you voluntarily save to your vocabulary
4. Dictionary queries exist only in memory during the lookup process and are not retained after processing

### OCR Processing
When you extract text from images:
1. The image processing happens entirely client-side using Tesseract.js
2. No image data or extracted text leaves your device
3. All OCR computation occurs in your browser's memory
4. Original images are not stored or transmitted

### Text-to-Speech
When you use pronunciation features:
1. Speech synthesis uses the Web Speech API built into your browser
2. No audio data is recorded, stored, or transmitted
3. Speech generation happens entirely on your device

## Vocabulary Storage
The only persistent data we store is your personal vocabulary:
- Is stored exclusively in your Firefox browser's local storage
- Never leaves your device or is transmitted to any server
- Contains only the words/phrases you explicitly choose to save
- Includes the translation, definitions, examples, and context you viewed when saving
- Can be completely deleted at any time through the options page
- Is not accessible to us, other websites, or third parties

## Data Sharing and Transfer
Peak Translation shares data only with the following external services when you explicitly use those features:
- **LibreTranslate** (https://libretranslate.de/): Receives only the text you select for translation
- **DictionaryAPI.dev** (https://api.dictionaryapi.dev/): Receives only the words you look up for definitions or examples

We do not share, sell, transfer, or disclose any information to other third parties.
All data processing and storage remains strictly on your personal device except for the specific API calls mentioned above.

## Changes to This Policy
We may update this Privacy Policy from time to time. When we do, we will revise the "Last updated" date at the top of this policy.

## Contact Information
If you have any questions about this Privacy Policy, please contact us through the GitHub repository issues page.

## Commitment to Privacy
Peak Translation was built with the principle that language learning tools should respect user privacy. We believe you should be able to learn new languages while maintaining control over your personal data. The extension only sends data to external services when you actively use translation or dictionary features, and no data is retained by those services beyond what is necessary to provide the requested functionality.