# How to Use Peak Translation

## Getting Started

After installing the extension in Firefox:

1. **Pin the extension** to your toolbar for easy access (right-click the extension icon → "Pin to Toolbar")
2. **Configure your languages** by clicking the extension icon → "Options"

## Translating Text on Webpages

### Method 1: Context Menu
1. Select any text on a webpage with your mouse
2. Right-click to open the context menu
3. Choose "Translate Selection" from the Peak Translation submenu

### Method 2: Keyboard Shortcut
1. Select any text on a webpage
2. Press `Ctrl+Shift+Y` (default shortcut, configurable in options)
3. A translation card will appear near your selection

### Using the Popup
1. Click the Peak Translation icon in your toolbar
2. In the popup, enter or paste text in the input field
3. Select source and target languages
4. Click "Translate" button

## Understanding the Translation Card

When you translate text, a card appears showing:

- **Original Text**: The text you selected
- **Translation**: The translated text in your target language
- **Definitions**: Dictionary definitions of key words (when available)
- **Examples**: Example sentences showing usage (when available)
- **Pronunciation Button**: Click to hear the text spoken aloud (when audio is enabled)
- **Save Icon**: Click to save this translation to your vocabulary
- **Close Button**: Click the X to dismiss the card

## Saving Words to Vocabulary

1. After translating text, click the **save icon** (💾) on the translation card
2. The word/phrase will be saved with:
   - Original word and translation
   - Definitions and examples (if available)
   - Context from where you found it
   - Timestamp
   - Pronunciation availability

## Using OCR (Optical Character Recognition)

### Extracting Text from Images
1. Find an image on a webpage that contains text
2. Right-click on the image
3. Choose "Extract Text from Image" from the Peak Translation submenu
4. Wait for processing (may take a few seconds)
5. The extracted text will appear in a popup
6. From there, you can:
   - Translate the extracted text
   - Save it to your vocabulary
   - Copy it to clipboard

## Managing Your Vocabulary

1. Click the Peak Translation icon → "Options"
2. Go to the "Vocabulary" tab
3. You will see a list of all saved words/phrases
4. Each entry shows:
   - The original word/phrase
   - Translation
   - Definitions (if available)
   - Examples (if available)
   - Context/sentence where you found it
   - Date added
5. Actions available:
   - **Search**: Filter your vocabulary by typing in the search box
   - **Play**: Click the speaker icon to hear pronunciation
   - **Delete**: Click the trash icon to remove an entry
   - **Copy**: Click the copy icon to copy the translation

## Configuration Options

Access via extension icon → "Options":

### General Settings
- **Native Language**: Your primary language (for translations from webpages)
- **Learning Language**: The language you're learning (for translations to)
- **Audio Pronunciation**: Enable/disable text-to-speech

### Advanced Settings
- **OCR Language Preference**: 
  - "auto": Automatically detect language
  - Specific language code: Force OCR to use a particular language
- **Timeout Settings**: Adjust how long to wait for API responses

## Privacy Information

Peak Translation is designed with privacy as a core principle:

- **All Data Stored Locally**: Your vocabulary, settings, and history are stored only in your Firefox browser storage
- **No Accounts Required**: Never need to create an account or log in
- **No Tracking**: We don't collect any usage analytics or personal data
- **Client-Side Processing**: OCR and text-to-speech run entirely on your device
- **Selective API Calls**: Translation and dictionary APIs are only contacted when you actively use those features
- **No Data Leaks**: Your selected text and translations are never sent to third parties without your explicit action

## Troubleshooting

### Translation Not Working
1. Check your internet connection (translation APIs require connectivity)
2. Verify you have selected text before using the shortcut/context menu
3. Try the popup method as an alternative
4. Check options to ensure correct language settings

### OCR Not Working
1. OCR works best with clear, high-contrast text images
2. Try images with larger, clearer text
3. Some complex backgrounds or fonts may reduce accuracy
4. Very small text may not be recognized

### Audio Not Working
1. Ensure audio pronunciation is enabled in options
2. Some languages may not have available voices in your browser
3. Web Speech API support varies between browsers

### Vocabulary Not Saving
1. Check that you're clicking the save icon on translation cards
2. Verify your vocabulary isn't full (there's no practical limit, but extremely large collections might slow performance)
3. Try restarting Firefox if you suspect storage issues

## Keyboard Shortcuts

- `Ctrl+Shift+Y`: Translate selected text (default)
- `Ctrl+Shift+O`: Open options page
- `Esc`: Dismiss active translation card

Shortcuts can be customized in the extension options if needed.

## Support

For issues, questions, or contributions:
- Check the [GitHub repository](https://github.com/yourusername/peak-translation)
- Report issues through the issue tracker
- Contribute via pull requests

Remember: Peak Translation works completely offline for core features and only contacts external APIs when you actively use translation or dictionary features.