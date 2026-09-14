// Background script for Peak Translation Firefox Extension

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

const provider = new MockTranslationProvider();

// Default language settings
let languageConfig = {
  native: 'tr',
  learning: 'en'
};

// Vocabulary storage key
const VOCABULARY_STORAGE_KEY = 'peak-translation-vocabulary';

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
    // TODO: OCR mode
    console.log('OCR mode activated');
  }
});

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
        }).catch(error => {
          sendResponse({error: `Failed to save: ${error.message}`});
        });
      } else {
        sendResponse({status: 'duplicate', message: 'Word already exists in vocabulary'});
      }
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
        translationResult = await provider.translateText(
          selectedText.trim(),
          languageConfig.learning,
          languageConfig.native
        );
        // Convert to the format we expect for display
        translationResult = {
          word: selectedText.trim(),
          translation: translationResult.translatedText,
          definition: translationResult.details?.definitions?.[0],
          examples: translationResult.details?.examples,
          phonetic: translationResult.details?.phonetic
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
        phonetic: translationResponse.details?.phonetic
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

