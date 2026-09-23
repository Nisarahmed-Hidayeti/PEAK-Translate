// Peak Translation Content Script
// Handles double-click detection on English words and shows popup

let popup = null;
let isEnabled = false;

// Request initial enabled state from background
chrome.runtime.sendMessage({action: "getEnabledState"}, (response) => {
  isEnabled = response.enabled;
});

// Listen for enabled state updates from background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "updateEnabledState") {
    isEnabled = request.enabled;
  }
  return true;
});

// Function to check if text is English word (simplified check)
function isEnglishWord(text) {
  // Simple regex to check if it's primarily English letters
  return /^[a-zA-Z\-']+$/.test(text) && text.length > 1;
}

// Function to get word at position
function getWordAtPosition(element, offset) {
  if (!element) return null;

  let text = element.textContent;
  if (!text) return null;

  // Find word boundaries
  let start = offset;
  while (start > 0 && /[a-zA-Z\-']/.test(text[start - 1])) {
    start--;
  }

  let end = offset;
  while (end < text.length && /[a-zA-Z\-']/.test(text[end])) {
    end++;
  }

  const word = text.substring(start, end);
  return isEnglishWord(word) ? word : null;
}

// Function to create and show popup
function showPopup(word, x, y) {
  // Remove existing popup if any
  hidePopup();

  // Create popup container
  popup = document.createElement('div');
  popup.id = 'peak-translation-popup';
  popup.style.position = 'fixed';
  popup.style.left = `${x}px`;
  popup.style.top = `${y}px`;
  popup.style.zIndex = '999999';
  popup.style.backgroundColor = 'white';
  popup.style.border = '1px solid #ccc';
  popup.style.borderRadius = '4px';
  popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  popup.style.padding = '12px';
  popup.style.fontFamily = 'Arial, sans-serif';
  popup.style.width = '280px';
  popup.style.maxWidth = '90vw';
  popup.style.boxSizing = 'border-box';

  // Add loading state
  popup.innerHTML = `
    <div style="text-align: center; padding: 20px; color: #666;">
      Loading...
    </div>
  `;

  document.body.appendChild(popup);

  // Fetch data for the word
  fetchTranslationData(word);
}

// Function to hide popup
function hidePopup() {
  if (popup && popup.parentNode) {
    popup.parentNode.removeChild(popup);
    popup = null;
  }
}

// Function to fetch translation data (using free APIs)
async function fetchTranslationData(word) {
  if (!popup) return;

  try {
    // Fetch translation (using LibreTranslate API as example - free tier)
    const translationResponse = await fetch(`https://libretranslate.com/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        q: word,
        source: 'en',
        target: 'tr',
        format: 'text'
      })
    });

    const translationData = await translationResponse.json();
    const turkishTranslation = translationData.translatedText || "Translation unavailable";

    // Fetch dictionary definition (using DictionaryAPI.dev)
    const definitionResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    const definitionData = await definitionResponse.json();

    let definition = "Definition unavailable";
    let examples = [];

    if (definitionData && definitionData[0] && definitionData[0].meanings) {
      // Get first definition
      const firstMeaning = definitionData[0].meanings[0];
      if (firstMeaning.definitions && firstMeaning.definitions[0]) {
        definition = firstMeaning.definitions[0].definition || "Definition unavailable";

        // Get examples (up to 3)
        examples = firstMeaning.definitions
          .map(def => def.example)
          .filter(ex => ex !== undefined)
          .slice(0, 3);
      }
    }

    // If we don't have enough examples, try to get more from other meanings
    if (examples.length < 3 && definitionData && definitionData[0] && definitionData[0].meanings) {
      for (const meaning of definitionData[0].meanings) {
        for (const def of meaning.definitions) {
          if (def.example && examples.length < 3) {
            examples.push(def.example);
          }
          if (examples.length >= 3) break;
        }
        if (examples.length >= 3) break;
      }
    }

    // Update popup with fetched data
    updatePopupContent(word, turkishTranslation, definition, examples);

  } catch (error) {
    console.error('Error fetching translation data:', error);
    updatePopupContent(word, "Translation unavailable", "Unable to load definition", []);
  }
}

// Function to update popup content
function updatePopupContent(word, turkishTranslation, definition, examples) {
  if (!popup) return;

  popup.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 8px;">${word}</div>
    <div style="margin-bottom: 8px;"><strong>Turkish:</strong> ${turkishTranslation}</div>
    <div style="margin-bottom: 8px;"><strong>Definition:</strong> ${definition}</div>
    ${examples.length > 0 ? `
      <div style="margin-bottom: 8px;"><strong>Examples:</strong></div>
      <ul style="margin: 0 0 8px 20px; padding: 0;">
        ${examples.map(ex => `<li>${ex}</li>`).join('')}
      </ul>
    ` : ''}
    <div style="text-align: center; margin-top: 8px;">
      <button id="peak-pronounce-button" style="padding: 4px 8px; background: #007cba; color: white; border: none; border-radius: 3px; cursor: pointer;">
        🔊 Pronounce
      </button>
    </div>
  `;

  // Add pronunciation button functionality
  const pronounceButton = popup.querySelector('#peak-pronounce-button');
  if (pronounceButton) {
    pronounceButton.addEventListener('click', () => {
      speakWord(word, pronounceButton);
    });
  }

  // Add click outside to close
  document.addEventListener('click', function closePopupHandler(e) {
    if (popup && !popup.contains(e.target)) {
      hidePopup();
      document.removeEventListener('click', closePopupHandler);
    }
  });

  // Add escape key to close
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      hidePopup();
      document.removeEventListener('click', closePopupHandler);
      document.removeEventListener('keydown', escapeHandler);
    }
  };
  document.addEventListener('keydown', escapeHandler);

  // Cleanup when popup is removed
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.removedNodes && mutation.removedNodes.includes(popup)) {
        document.removeEventListener('click', closePopupHandler);
        document.removeEventListener('keydown', escapeHandler);
        observer.disconnect();
      }
    });
  });

  observer.observe(document.body, { childList: true });
}

// Function to speak word using Web Speech API
function speakWord(word, buttonElement = null) {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = 0.8; // Slightly slower for clarity

    // Handle speech events
    utterance.onstart = () => {
      // Disable button and change appearance while speaking
      if (buttonElement) {
        buttonElement.disabled = true;
        buttonElement.style.opacity = '0.7';
        buttonElement.textContent = '🔊 Speaking...';
      }
    };

    utterance.onend = () => {
      // Re-enable button when speech ends
      if (buttonElement) {
        buttonElement.disabled = false;
        buttonElement.style.opacity = '1';
        buttonElement.textContent = '🔊 Pronounce';
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      // Re-enable button on error
      if (buttonElement) {
        buttonElement.disabled = false;
        buttonElement.style.opacity = '1';
        buttonElement.textContent = '🔊 Pronounce';
      }
      alert('Speech synthesis error. Please try again.');
    };

    window.speechSynthesis.speak(utterance);
  } else {
    alert('Text-to-speech not supported in this browser');
  }
}

// Handle double-click events
document.addEventListener('dblclick', (e) => {
  // Only process if extension is enabled
  if (!isEnabled) return;

  // Get the clicked element
  const element = e.target;
  if (!element) return;

  // Get text range at click position
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const offset = range.startOffset;

  // Get word at position
  const word = getWordAtPosition(element, offset);
  if (!word) return;

  // Prevent default double-click behavior (text selection)
  e.preventDefault();

  // Show popup near the mouse position
  showPopup(word, e.clientX, e.clientY);
});

// Also handle double-click on text nodes directly
document.addEventListener('dblclick', (e) => {
  if (!isEnabled) return;

  // Handle case where we clicked on a text node
  if (e.target.nodeType === Node.TEXT_NODE) {
    const textNode = e.target;
    const offset = e.target instanceof CharacterData ?
      (e.target.getClientRects().length > 0 ?
        Math.round(e.offsetX / e.target.getClientRects()[0].width * textNode.textContent.length) :
        0) : 0;

    const word = getWordAtPosition(textNode, offset);
    if (!word) return;

    e.preventDefault();
    showPopup(word, e.clientX, e.clientY);
  }
}, true);

// Cleanup popup when page unloads or visibility changes
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') {
    hidePopup();
  }
});

// Handle scrolling - reposition popup if needed
let scrollTimeout;
window.addEventListener('scroll', () => {
  clearTimeout(scrollTimeout);
  scrollTimeout = setTimeout(() => {
    if (popup) {
      // Re-position popup based on stored position (simplified)
      // In a more advanced version, we'd store the original position and adjust
    }
  }, 100);
});