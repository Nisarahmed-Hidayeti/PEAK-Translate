# Peak Translation — Current State Audit

## 1. Project Architecture

Peak Translation is structured as a monorepo using npm workspaces:

- **packages/core** (@peak-translation/core): Shared TypeScript interfaces and types
- **packages/providers** (@peak-translation/providers): Mock implementations of translation, OCR, and TTS providers
- **apps/extension**: Firefox WebExtension (manifest v2)
- **apps/web**: Companion web dashboard (React + Vite)
- **server**: Placeholder for optional backend service
- **shared**: Empty directory for potential shared code

The project uses:
- TypeScript for type safety
- React with Vite for the web dashboard
- WebExtension APIs for the Firefox extension
- browser.storage.sync for extension state persistence
- localStorage for web dashboard persistence

## 2. Actually Implemented

### Core Packages
- Comprehensive TypeScript interfaces:
  - `LanguageCode` union type ('tr' | 'en' | 'es' | 'fr' | 'de')
  - `LanguageConfig` interface with native/learning languages
  - `SelectionClassification` type for text selection granularity
  - `VocabularyItem` interface with rich metadata (word, translations, definition, examples, pronunciation, context, source URL/title, timestamps)
  - Provider interfaces: `TranslationProvider`, `OCRProvider`, `TTSProvider`

### Firefox Extension
- **Manifest v2** with proper permissions (activeTab, storage, scripting)
- **Background script** (`src/background.js`):
  - Manages language settings via browser.storage.sync
  - Handles keyboard shortcuts: Ctrl+Shift+Y (translation), Ctrl+Shift+O (OCR - TODO)
  - Communicates with content script via message passing
  - Saves vocabulary with deduplication logic
  - Uses mock translation provider for demo functionality
- **Content script** (`src/content/contentScript.ts`):
  - Retrieves selected text from webpage
  - Displays responsive translation card UI near selection
  - Features: save button, audio button (placeholder), close functionality
  - Proper positioning and animation
- **Options page** (`src/options/`):
  - Language selection dropdowns
  - Vocabulary export/import as JSON
  - Real-time vocabulary count display
  - Status notifications for actions

### Web Dashboard
- **React + Vite application** (`apps/web/`):
  - **Vocabulary Context** (`src/context/VocabularyContext.tsx`):
    - Centralized state management with React Context
    - Persistence via localStorage
    - CRUD operations for vocabulary items
  - **Pages**:
    - Dashboard: Statistics overview and recent words
    - Vocabulary List: Searchable list with remove functionality
    - Vocabulary Detail: Full word details with pronunciation, examples, metadata
    - Privacy: Complete privacy policy page
  - **Styling**: Responsive CSS with mobile-first approach
  - **Routing**: React Router v6 for client-side navigation

## 3. Mocked / Placeholder

- **TTS Provider**: Interface defined in `@peak-translation/core` but no implementation in providers
- **OCR Provider**: Mock implementation returns fixed sample text (`"This is a sample text extracted from an image via OCR."`)
- **Translation Provider**: Mock implementation that formats text as `[TARGETLANG] text` with canned definitions/examples
- **Web Dashboard Settings**: Referenced in `App.tsx` routes but no `Settings.tsx` component implemented
- **Extension OCR Mode**: Keyboard command defined in manifest but only has `console.log` TODO in background.js
- **Audio Pronunciation**: Extension audio button shows alert but doesn't actually invoke TTS
- **Backend Service**: `server/` directory contains only package.json files, no actual server implementation
- **Shared Directory**: Completely empty (`/shared`)

## 4. Broken

- **CSS Syntax Error**: Fixed during audit - `.privacy-content li` had malformed margin-bottom property with nested braces
- No other broken functionality detected in core features

## 5. Missing

- Real translation backend (API integration)
- Actual OCR implementation (image-to-text processing)
- Real TTS implementation (speech synthesis)
- Web dashboard Settings page
- Web dashboard vocabulary export/import functionality
- Synchronization mechanism between extension and web dashboard vocabularies
- Build process for Firefox extension (currently just copies source to dist/)
- Unit tests (Jest configured but no test files)
- Linting configuration (ESLint in devDependencies but no config files)

## 6. Unused / Duplicate Files

- No completely unused files identified
- Some conceptual duplication: mock providers exist both in extension background.js and packages/providers/, though they serve different contexts (extension runtime vs. potential web usage)

## 7. Build Status

- **Packages**: Successfully build via `tsc` (`npm run build --workspace=packages/*`)
- **Web Dashboard**: Successfully builds via Vite (`npm run build --workspace=apps/web`) producing optimized assets in `dist/`
- **Firefox Extension**: No defined build process; extension files are copied directly to `apps/extension/dist/` during what appears to be a placeholder build step

## 8. Firefox Extension Status

**Functional Components**:
- Manifest validation passes
- Language settings persistence works
- Keyboard shortcuts registered (translation works, OCR has TODO)
- Content script correctly captures selected text
- Translation card UI displays properly with animations
- Vocabulary saving with deduplication works
- Options page fully functional (export/import, language settings)

**Missing/Incomplete Components**:
- Actual translation API integration (currently mock)
- OCR implementation (placeholder only)
- TTS implementation (audio button shows alert only)
- Proper build/minification process for production

## 9. Web Dashboard Status

**Functional Components**:
- React application loads and routes correctly
- Vocabulary CRUD operations work with localStorage persistence
- Dashboard displays statistics and recent words accurately
- Vocabulary list supports item removal
- Vocabulary detail shows all metadata fields
- Privacy page displays complete policy
- Responsive design works on mobile and desktop

**Missing Components**:
- Settings page (routes to non-existent component)
- Export/import functionality (only available in extension)
- Synchronization with extension vocabulary
- Advanced features like study modes, flashcards, etc.

## 10. V1 Readiness

For a minimal viable V1 release, the project requires:

### Essential Improvements:
1. **Real Translation**: Replace mock provider with free API (e.g., LibreTranslate)
2. **TTS Implementation**: Use Web Speech API for pronunciation in both extension and web
3. **Basic OCR**: Implement client-side OCR with Tesseract.js or similar
4. **Settings Page**: Create missing web dashboard Settings component
5. **Export/Import**: Add to web dashboard to match extension functionality
6. **Sync Mechanism**: Implement vocabulary synchronization between extension and web

### Quality Improvements:
7. **Extension Build Process**: Add proper build/minification for production
8. **Testing**: Implement basic unit tests for core logic
9. **Linting**: Add ESLint configuration
10. **Documentation**: Improve code comments and README specifics

## 11. Recommended Next Steps

**Immediate Priorities (Week 1)**:
1. Implement translation API integration (LibreTranslate or similar)
2. Add Web Speech API TTS to extension and web dashboard
3. Create Settings page in web dashboard
4. Add export/import to web dashboard vocabulary pages

**Medium Term (Week 2-3)**:
1. Implement basic OCR with Tesseract.js
2. Add vocabulary synchronization between extension and web
3. Create proper build process for Firefox extension
4. Add basic unit tests for providers and core types

**Long Term (Week 4+)**:
1. Add ESLint and Prettier configuration
2. Implement study modes and flashcards in web dashboard
3. Add analytics dashboard (opt-in, privacy-first)
4. Consider service worker for web dashboard offline capability
5. Explore optional backend for cloud sync (user-opt-in)

The core architecture is sound and provides an excellent foundation. Focus should be on replacing mock implementations with real functionality while maintaining the privacy-first, modular design that has been established.