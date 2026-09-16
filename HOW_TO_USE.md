# How to Use Peak Translation

## For Normal Users

### Installation from Source

1. Ensure you have Node.js installed (v16 or later recommended)
2. Clone this repository
3. Install dependencies: `npm install`
4. Build the extension: `npm run build`
5. Open Firefox
6. Navigate to `about:debugging#/runtime/this-firefox`
7. Click "Load Temporary Add-on"
8. Select the `manifest.json` file from the `dist` directory

### Using the Extension

1. Visit any website in Firefox
2. Select text you want to translate
3. Right-click and choose "Translate with Peak Translation"
4. A translation card will appear near your selection
5. Click the speaker icon to hear pronunciation (when available)
6. Click the star icon to save the word to your vocabulary
7. Click the extension toolbar button to view your saved words and adjust settings

## For Developers

### Project Structure

```
PEAK TRANSLATION/
├── src/
│   ├── background/          # Background scripts
│   ├── content/             # Content scripts
│   ├── popup/               # Extension popup
│   ├── options/             # Settings page
│   ├── core/                # Core logic and types
│   ├── providers/           # Translation provider implementations
│   ├── storage/             # Local storage management
│   └── shared/              # Shared constants and utilities
├── public/                  # Static assets (icons, etc.)
├── tests/                   # Test files
├── docs/                    # Documentation
└── dist/                    # Built extension (generated)
```

### Development Commands

- `npm run build` - Build the extension once
- `npm run dev` - Watch for changes and rebuild automatically
- `npm run lint` - Check code quality with ESLint
- `npm run typecheck` - Check TypeScript types without emitting files
- `npm test` - Run tests (not yet implemented)

### Adding New Features

1. Create new TypeScript files in the appropriate `src/` subdirectory
2. Update `tsconfig.json` if needed to include new paths
3. Implement functionality following the existing patterns
4. Add tests for new functionality
5. Update documentation as needed

### Building for Release

To create a production-ready build:

1. Run `npm run build`
2. The built extension will be in the `dist/` directory
3. Zip the contents of `dist/` for submission to Firefox Add-ons
4. Ensure all icons and assets are included in the build

### Debugging

- Use Firefox's built-in developer tools to inspect extension pages
- Check the Browser Console for background script errors
- Use `console.log()` in content/scripts for debugging
- Reload the temporary add-on after making changes

### Testing

Manual testing checklist:
- [ ] Translate single words
- [ ] Translate phrases and sentences
- [ ] Save words to vocabulary
- [ ] View saved words in popup
- [ ] Change language settings
- [ ] Test OCR functionality
- [ ] Test on various website types (news, blogs, etc.)
- [ ] Test on pages where extension might be restricted (about: pages)
- [ ] Test error handling and recovery
