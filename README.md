# Peak Translation

A privacy-first Firefox extension for language learning that helps you understand and remember vocabulary directly from the web.

## Features

- 🔍 Select text on any webpage and get instant translation
- 📚 Rich word learning experience with definitions, examples, and pronunciation
- 💾 Save words to your personal vocabulary list
- 📸 OCR mode to extract text from images and screenshots
- 🛡️ Privacy-first design - your data stays on your device
- ⚡ Fast and lightweight - doesn't slow down your browsing

## Installation

### For Development

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Open Firefox and navigate to `about:debugging`
5. Click "This Firefox" > "Load Temporary Add-on"
6. Select the `manifest.json` file from the `dist` directory

## Usage

1. Select any text on a webpage
2. Right-click and choose "Translate with Peak Translation"
3. A translation card will appear with definition, examples, and save option
4. Click the star icon to save the word to your vocabulary
5. Use the extension toolbar button to access your saved words and settings

## Privacy

Peak Translation is designed with privacy as a core principle:
- No account required
- No telemetry or tracking
- Vocabulary stored locally in your browser
- OCR screenshots are temporary and discarded after processing
- Only selected text is sent to translation providers (when used)

## Development

See [HOW_TO_USE.md](HOW_TO_USE.md) for detailed development instructions.

## License

MIT License

## Roadmap

See [docs/FUTURE_ROADMAP.md](docs/FUTURE_ROADMAP.md) for planned features.
