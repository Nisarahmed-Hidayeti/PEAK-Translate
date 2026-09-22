# Peak Translation Architecture

## Overview
Peak Translation is a privacy-first Firefox extension for language learning that allows users to:
- Select text on webpages for instant translation
- Get definitions, examples, and pronunciation
- Save words to personal vocabulary
- Extract text from images using OCR
- All data stored locally, no accounts or subscriptions required

## Core Components

### 1. Background Script (`src/background/background.ts`)
- Manages extension lifecycle and context menus
- Handles keyboard commands
- Coordinates between content script and providers
- Manages provider managers (translation, definition, example, OCR)
- Handles messaging between components

### 2. Content Script (`src/content/content.ts`)
- Injects into web pages
- Displays translation cards near selected text
- Handles OCR result display
- Manages UI events (audio, save, translate)

### 3. Provider System
Abstract provider pattern allows for easy extension and fallback mechanisms.

#### Translation Providers
- LibreTranslateProvider (primary)
- MockTranslationProvider (fallback)

#### Definition Providers
- RealDefinitionProvider (primary for English)
- MockDefinitionProvider (fallback)

#### Example Providers
- RealExampleProvider (primary for English)
- MockExampleProvider (fallback)

#### OCR Provider
- OCRProviderImpl (uses Tesseract.js)

#### TTS Provider
- TTSProviderImpl (uses Web Speech API)

### 4. Storage (`src/storage/vocabulary-store.ts`)
- Singleton class managing browser.storage.local
- Vocabulary persistence with metadata
- Settings management
- Storage versioning and initialization

### 5. Popup (`src/popup/popup.html` + `src/popup/popup.ts`)
- Manual translation interface
- Language selection
- Manual text input and translation
- Direct access to options page

### 6. Options Page (`src/options/options.html` + `src/options/options.ts` + `src/options/options.css`)
- Extension settings configuration
- Vocabulary management
- Display of saved words with rich details

## Data Flow

1. Text Selection → Context Menu/Keyboard Command → Content Script
2. Content Script → Background Script (GET_SELECTION_AND_TRANSLATE)
3. Background Script → Provider Manager (translate)
4. Provider Manager → Translation Provider (LibreTranslate with Mock fallback)
5. Background Script → Definition Provider Manager (getDefinitions)
6. Background Script → Example Provider Manager (getExamples)
7. Background Script → Content Script (SHOW_TRANSLATION_CARD with all data)
8. Content Script → Display Translation Card
9. User Action (Save) → Content Script → Background Script (SAVE_VOCABULARY_ITEM)
10. Background Script → Vocabulary Store → browser.storage.local

## Privacy Features
- All data stored locally in browser.storage.local
- No external tracking or telemetry
- OCR processing done client-side with Tesseract.js
- No account system or server communication required
- API keys not stored or required for core functionality