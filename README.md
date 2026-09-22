# Peak Translation V1

A Firefox extension that allows users to double-click English words to see:
- Turkish translation
- English definition
- 3 example sentences
- Pronunciation button

## Features

- Double-click any English word to see a popup with translation, definition, examples, and pronunciation
- Toggle extension on/off via toolbar button
- Popup appears near the clicked word
- Close popup with Escape key or by clicking outside
- Uses free APIs (LibreTranslate for translation, DictionaryAPI.dev for definitions/examples)
- Web Speech API for pronunciation
- Cleanup of event listeners to prevent memory leaks
- Manifest V3 compatible

## Installation

### For Development/Testing

1. Download or clone this repository
2. Open Firefox
3. Go to `about:debugging#/runtime/this-firefox`
4. Click "Load Temporary Add-on..."
5. Select the `manifest.json` file from this directory

### For Production

1. Package the extension files into a ZIP archive
2. Submit to [Firefox Add-ons Developer Hub](https://addons.mozilla.org/developers/)
3. Follow the review and publishing process

## Usage

1. Click the Peak Translation extension toolbar button to enable it
   - The icon will change to indicate the extension is active
2. Navigate to any webpage with English text
3. Double-click on any English word
4. A popup will appear showing:
   - Turkish translation
   - English definition
   - 3 example sentences
   - Pronunciation button (click to hear the word)
5. Press Escape or click outside the popup to close it
6. To disable the extension, click the toolbar button again

## Files

- `manifest.json` - Extension manifest (Manifest V3)
- `background.js` - Background service worker for state management
- `contentScript.js` - Content script for word detection and popup handling
- `popup.html` - Popup HTML structure
- `popup.css` - Popup styling
- `popup.js` - Popup initialization script
- `icons/` - Extension icons (active and inactive states)
- `test.html` - Test page for development verification

## APIs Used

- **Translation**: LibreTranslate API (https://libretranslate.com/)
- **Dictionary**: DictionaryAPI.dev (https://api.dictionaryapi.dev/)
- **Pronunciation**: Web Speech API (built-in browser API)

## Development Notes

- The extension uses chrome.storage.local to persist the enabled/disabled state
- Background script communicates with content script via chrome.runtime messaging
- Content script handles double-click detection on both regular elements and text nodes
- Proper cleanup of event listeners and MutationObservers to prevent memory leaks
- Popup is positioned near the mouse click position
- Escape key handling for popup closure
- Visibilitychange event handling to hide popup when tab becomes hidden
- Scroll event handling with timeout for potential repositioning

## Testing

1. Load the extension using "Load Temporary Add-on..." in Firefox
2. Open the provided `test.html` file in Firefox
3. Click the toolbar button to enable the extension
4. Double-click on any English word in the test page
5. Verify the popup shows correct Turkish translation, definition, examples, and has a working pronunciation button
6. Press Escape to close the popup
7. Test on other websites to ensure cross-site compatibility

## Troubleshooting

- If the popup doesn't appear, make sure the extension is enabled (toolbar button clicked)
- Check the browser console for any error messages
- Ensure you're double-clicking on English words (the extension validates word format)
- If pronunciation doesn't work, verify your browser supports the Web Speech API
- For API-related issues, the extension provides fallback messages

## License

MIT
