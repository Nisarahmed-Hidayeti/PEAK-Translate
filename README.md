# Peak Translation

**Understand. Learn. Remember.**

Peak Translation is an open-source, privacy-conscious language-learning software whose primary client is a Firefox extension with a companion web dashboard.

## Features

- 🔤 Text translation with selection classification (word, phrase, sentence, paragraph)
- 📚 Vocabulary saving with context, pronunciation, and examples
- 🌐 Companion web dashboard to review and manage your vocabulary
- 👁️ OCR capabilities for text in images (coming soon)
- 🔊 Audio pronunciation for words
- ⌨️ Keyboard shortcuts for quick access
- 🛡️ Privacy-first design - no unnecessary data collection
- 🌍 Supports Turkish, English, Spanish, French, and German

## Architecture

Peak Translation follows a modular architecture:

### Core Packages
- `@peak-translation/core`: Shared types, interfaces, and utilities
- `@peak-translation/providers`: Mock and real translation/OCR/TTS providers

### Applications
- `apps/extension`: Firefox WebExtension
- `apps/web`: Companion web dashboard (React + Vite)
- `server`: Optional backend service (for future cloud features)

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- Firefox Developer Edition or regular Firefox

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Development

#### Firefox Extension
```bash
# Build the extension
npm run build

# Load in Firefox:
# 1. Open Firefox and navigate to about:debugging
# 2. Click "This Firefox" in the left sidebar
# 3. Click "Load Temporary Add-on"
# 4. Select any file in the apps/extension/dist directory
```

#### Web Dashboard
```bash
# Start the development server
cd apps/web
npm run dev

# Then visit http://localhost:3000
```

## Usage

1. Install the Firefox extension as described above
2. Set your native and learning languages in the extension options (right-click icon -> Options)
3. Select any text on a webpage and press `Ctrl+Shift+Y` (or Cmd+Shift+Y on Mac) to translate
4. For single words, you'll see translations, definitions, examples, and pronunciation
5. Click the save button to add words to your vocabulary
6. Visit the web dashboard at http://localhost:3000 to review your saved vocabulary

## Privacy

Peak Translation is designed with privacy as a core principle:
- No continuous webpage monitoring or history tracking
- Only processes text you explicitly select
- Vocabulary is stored locally in your browser
- No default analytics or telemetry
- Clear explanations of any external data flows

## License

MIT

## Acknowledgments

Inspired by the desire to make language learning a seamless part of web browsing.
