// Background script for Peak Translation Firefox Extension

// Import translation providers
// In a real build setup, these would be bundled or imported properly
// For now, we'll use dynamic import or check availability

// Import OCR provider factory (would be available in a real bundled setup)
// For now, we'll define it here or import if available

// Mock provider (same as in providers, but simplified for extension)
class MockTranslationProvider {
  async translateText(text, sourceLang, targetLang) {
    const translatedText = `[${targetLang.toUpperCase()}] ${text}`;
    return {
      translatedText,
      details: {
        definitions: [`Mock definition for ${text}`],
        examples: [
          `Example 1: ${text} is useful.`,
          `Example 2: Learning ${text} helps.`,
          `Example 3: ${text} in context.`
        ],
        phonetic: `/ˈmɒk/`
      }
    };
  }

  async lookupWord(word, sourceLang, targetLang) {
    if (word.trim().split(/\s+/).length === 1 && word.length > 0) {
      return {
        word,
        translations: [`[${targetLang.toUpperCase()}] ${word}`],
        definition: `Mock definition for ${word}`,
        examples: [
          `Example sentence with ${word}.`,
          `Another example using ${word}.`,
          `Finally, ${word} in a different context.`
        ],
        phonetic: `/ˈwɜːrd/`
      };
    }
    return null;
  }
}

// Placeholder for real provider - will be replaced with actual implementation
class LibreTranslateProvider {
  constructor() {
    this.apiUrl = 'https://libretranslate.de/translate';
    this.languageMap = {
      tr: 'tr',
      en: 'en',
      es: 'es',
      fr: 'fr',
      de: 'de'
    };
  }

  async translateText(text, sourceLang, targetLang) {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          q: text,
          source: this.languageMap[sourceLang] || sourceLang,
          target: this.languageMap[targetLang] || targetLang,
          format: 'text'
        })
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.translatedText || '';

      return {
        translatedText,
        details: {
          definitions: [],
          examples: [],
          phonetic: undefined
        }
      };
    } catch (error) {
      console.error('LibreTranslate translation error:', error);
      throw error;
    }
  }

  async lookupWord(word, sourceLang, targetLang) {
    // For single word lookup, we can still use translateText
    if (word.trim().split(/\s+/).length === 1 && word.length > 0) {
      try {
        const result = await this.translateText(word, sourceLang, targetLang);
        return {
          word,
          translations: [result.translatedText],
          definition: undefined,
          examples: [],
          phonetic: undefined
        };
      } catch (error) {
        console.error('LibreTranslate lookup error:', error);
        return null;
      }
    }
    return null;
  }
}

// Factory function to create translation provider
function createTranslationProvider(useMock = false) {
  if (useMock) {
    return new MockTranslationProvider();
  }
  return new LibreTranslateProvider();
}

// Factory function to create OCR provider (lazy loaded to avoid bundling issues)
let ocrProviderInstance = null;
function createOCRProvider(useMock = false) {
  if (useMock) {
    return new MockOCRProvider();
  }

  if (!ocrProviderInstance) {
    // In a real implementation, we would dynamically import or load the TesseractOCRProvider
    // For now, we'll create a placeholder that indicates where the real implementation would go
    ocrProviderInstance = new (function() {
      async function extractText(imageData) {
        // This would be replaced with actual Tesseract.js implementation
        // For now, return a mock result to show the structure
        return {
          text: '[OCR functionality would be implemented here with Tesseract.js]',
          confidence: 0.8,
          language: 'en'
        };
      }

      return { extractText };
    })();
  }

  return ocrProviderInstance;
}

// Default language settings
let languageConfig = {
  native: 'tr',
  learning: 'en'
};

// Vocabulary storage key
const VOCABULARY_STORAGE_KEY = 'peak-translation-vocabulary';

// Configuration flag - in production, this would come from build config or storage
const USE_MOCK_PROVIDER = false; // Set to true for development/testing

// Initialize providers
const provider = createTranslationProvider(USE_MOCK_PROVIDER);
let ocrProvider = null;

// Initialize OCR provider on demand
async function getOCRProvider() {
  if (!ocrProvider) {
    ocrProvider = createOCRProvider(USE_MOCK_PROVIDER);
  }
  return ocrProvider;
}

// Load language settings from storage on startup
browser.storage.sync.get(['native', 'learning']).then(result => {
  if (result.native && result.learning) {
    languageConfig.native = result.native;
    languageConfig.learning = result.learning;
  }
  // Initialize vocabulary storage if not present
  browser.storage.sync.get([VOCABULARY_STORAGE_KEY]).then(vocabResult => {
    if (!vocabResult[VOCABULARY_STORAGE_KEY]) {
      browser.storage.sync.set({ [VOCABULARY_STORAGE_KEY]: [] });
    }
  });
});

// Listen for changes to language settings
browser.storage.onChanged.addListener((changes, area) => {
  if (area === 'sync') {
    if (changes.native) {
      languageConfig.native = changes.native.newValue;
    }
    if (changes.learning) {
      languageConfig.learning = changes.learning.newValue;
    }
  }
});

// Handle commands
browser.commands.onCommand.addListener((command) => {
  if (command === 'toggle-peak-translation') {
    handleTextTranslation();
  } else if (command === 'activate-ocr') {
    handleOCRMode();
  }
});

// Function to handle OCR mode
async function handleOCRMode() {
  showNotification('OCR mode activated. Please select an area of the screen to perform OCR.');

  // In a real implementation, we would:
  // 1. Use the scripting API to inject a script that allows area selection
  // 2. Capture the selected area as an image
  // 3. Send that image to the OCR provider
  // 4. Display the results

  // For now, we'll show a placeholder notification
  showNotification('OCR functionality would capture screen area and extract text here.');
}

// Handle messages from content script
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'GET_SELECTION') {
    // Ask the content script of the active tab to get the selection
    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      if (tabs.length === 0) {
        sendResponse({error: 'No active tab'});
        return;
      }
      browser.tabs.sendMessage(tabs[0].id, {type: 'GET_SELECTION'})
        .then(response => {
          sendResponse(response);
        })
        .catch(error => {
          sendResponse({error: error.message});
        });
    });
    return true; // Keep the message channel open for async response
  }

  if (message.type === 'SAVE_VOCABULARY') {
    // Save vocabulary item to storage
    const vocabItem = message.vocabulary;
    // Add timestamps if not present
    const now = new Date().toISOString();
    const itemToSave = {
      ...vocabItem,
      id: vocabItem.id || Math.random().toString(36).substr(2, 9),
      createdAt: vocabItem.createdAt || now,
      updatedAt: vocabItem.updatedAt || now
    };

    browser.storage.sync.get([VOCABULARY_STORAGE_KEY]).then(result => {
      const vocabulary = result[VOCABULARY_STORAGE_KEY] || [];
      // Check for duplicates (by word and language pair)
      const isDuplicate = vocabulary.some(item =>
        item.word.toLowerCase() === vocabItem.word.toLowerCase() &&
        item.sourceLanguage === vocabItem.sourceLanguage &&
        item.targetLanguage === vocabItem.targetLanguage
      );

      if (!isDuplicate) {
        vocabulary.push(itemToSave);
        browser.storage.sync.set({ [VOCABULARY_STORAGE_KEY]: vocabulary }).then(() => {
          sendResponse({status: 'saved'});
          // Broadcast vocabulary update to all tabs
          browser.tabs.query({}).then(tabs => {
            tabs.forEach(tab => {
              if (tab.url && !tab.url.startsWith('moz-extension://')) {
                browser.tabs.sendMessage(tab.id, {
                  type: 'VOCABULARY_UPDATED',
                  vocabulary: vocabulary
                }).catch(() => {
                  // Ignore errors if we can't send to a tab
                });
              }
            });
          });
        }).catch(error => {
          sendResponse({error: `Failed to save: ${error.message}`});
        });
      } else {
        sendResponse({status: 'duplicate', message: 'Word already exists in vocabulary'});
      }
    });

    return true; // Keep the message channel open for async response
  }

  if (message.type === 'OCR_IMAGE') {
    // Handle OCR request from content script
    getOCRProvider().then(provider => {
      provider.extractText(message.imageData)
        .then(result => {
          sendResponse({status: 'success', data: result});
        })
        .catch(error => {
          sendResponse({status: 'error', message: error.message});
        });
    }).catch(error => {
      sendResponse({status: 'error', message: `OCR provider initialization failed: ${error.message}`});
    });
    return true; // Keep the message channel open for async response
  }

  return false; // No response needed
});

// Function to handle text translation
async function handleTextTranslation() {
  try {
    // Get the selected text from the content script
    const response = await new Promise((resolve, reject) => {
      browser.runtime.sendMessage({type: 'GET_SELECTION'}, response => {
        if (browser.runtime.lastError) {
          reject(browser.runtime.lastError);
        } else {
          resolve(response);
        }
      });
    });

    if (response.error) {
      showNotification(`Error: ${response.error}`);
      return;
    }

    const selectedText = response.text;
    if (!selectedText || selectedText.trim() === '') {
      showNotification('No text selected');
      return;
    }

    // Determine if it's a single word or more
    const wordCount = selectedText.trim().split(/\s+/).length;
    let translationResult;

    if (wordCount === 1) {
      // Use lookupWord for single words
      translationResult = await provider.lookupWord(
        selectedText.trim(),
        languageConfig.learning, // source language (what we are learning from)
        languageConfig.native    // target language (what we want to translate to)
      );
      // If lookupWord returns null (e.g., not a single word), fall back to translateText
      if (!translationResult) {
        const translationResponse = await provider.translateText(
          selectedText.trim(),
          languageConfig.learning,
          languageConfig.native
        );
        // Convert to the format we expect for display
        translationResult = {
          word: selectedText.trim(),
          translation: translationResponse.translatedText,
          definition: translationResponse.details?.definitions?.[0],
          examples: translationResponse.details?.examples,
          phonetic: translationResponse.details?.phonetic,
          sourceLanguage: languageConfig.learning,
          targetLanguage: languageConfig.native
        };
      }
    } else {
      // Use translateText for phrases/sentences
      const translationResponse = await provider.translateText(
        selectedText.trim(),
        languageConfig.learning,
        languageConfig.native
      );
      translationResult = {
        word: selectedText.trim(),
        translation: translationResponse.translatedText,
        definition: translationResponse.details?.definitions?.[0],
        examples: translationResponse.details?.examples,
        phonetic: translationResponse.details?.phonetic,
        sourceLanguage: languageConfig.learning,
        targetLanguage: languageConfig.native
      };
    }

    // Show the translation in the content script
    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      if (tabs.length === 0) {
        showNotification('No active tab to show translation');
        return;
      }
      browser.tabs.sendMessage(tabs[0].id, {
        type: 'SHOW_TRANSLATION',
        translation: translationResult
      });
    });

  } catch (error) {
    console.error('Translation error:', error);
    showNotification(`Translation failed: ${error.message}`);
  }
}

// Show a simple notification (for now, using alert – later we can use a better UI)
function showNotification(message) {
  alert(`Peak Translation: ${message}`);
}