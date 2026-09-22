// Content script for Peak Translation extension

// Listen for messages from background script
browser.runtime.onMessage.addListener((message: any, sender: any) => {
  if (message.type === "SHOW_TRANSLATION_CARD") {
    showTranslationCard(message.text, message.sourceLanguage, message.targetLanguage, message.translation, message.examples, message.definition, message.pronunciation);
    return true;
  } else if (message.type === "SHOW_OCR_RESULT") {
    showOCRResult(message.text, message.sourceLanguage, message.targetLanguage);
    return true;
  } else if (message.type === "GET_SELECTION_AND_TRANSLATE") {
    // Get selected text and translate it
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : "";
    if (selectedText) {
      // Send message to background script to get translation
      browser.runtime.sendMessage({
        type: "TRANSLATE_TEXT",
        text: selectedText,
        sourceLanguage: "auto",
        targetLanguage: browser.i18n?.getMessage("@ui_language") || "en"
      });
    }
    return true;
  } else if (message.type === "GET_ACTUAL_SELECTION") {
    // Return the actual selected text
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : "";
    browser.runtime.sendMessage({
      type: "ACTUAL_SELECTION",
      text: selectedText
    });
    return true;
  } else if (message.type === "TRANSLATE_OCR_TEXT") {
    // Translate the OCR text and show translation card
    browser.runtime.sendMessage({
      type: "TRANSLATE_TEXT",
      text: message.text,
      sourceLanguage: message.sourceLanguage,
      targetLanguage: message.targetLanguage
    });
    return true;
  }
  // Return false to indicate we don't want to send a response (or true if we do)
  return false;
});

// Function to create and show translation card
function showTranslationCard(text: any, sourceLang: any, targetLang: any, translation: any, examples: any[] = [], definitions: any[] = [], pronunciation: any) {
  // Remove any existing translation card
  removeExistingTranslationCard();

  // Create translation card container
  const card = document.createElement("div");
  card.className = "peak-translation-card";
  card.innerHTML = `
    <div class="peak-translation-card-header">
      <div class="peak-translation-card-word">${text}</div>
      <button class="peak-translation-card-audio-button" aria-label="Play pronunciation">
        ${pronunciation ? "🔊" : "🔇"}
      </button>
    </div>
    <div class="peak-translation-card-body">
      <div class="peak-translation-card-translation">
        ${translation}
      </div>
      <div class="peak-translation-card-definitions">
        ${definitions.length > 0 ? definitions.map(def => `<div class="definition-item"> • ${def}</div>`).join("") : "No definitions available"}
      </div>
      <div class="peak-translation-card-examples">
        ${examples.length > 0 ? examples.map(example => `<div class="example-item"> "${example}"</div>`).join("") : "No examples available"}
      </div>
      <button class="peak-translation-card-save-button" aria-label="Save word">
        ☆ Save
      </button>
    </div>
  `;

  // Position the card near the selection
  positionCardNearSelection(card);

  // Add card to document
  document.body.appendChild(card);

  // Add event listeners
  const audioButton = card.querySelector(".peak-translation-card-audio-button") as HTMLButtonElement | null;
  const saveButton = card.querySelector(".peak-translation-card-save-button") as HTMLButtonElement | null;

  // Audio button click handler
  audioButton?.addEventListener("click", () => {
    if (pronunciation) {
      // TODO: Implement actual audio playback using Web Speech API
      alert(`Audio playback: ${pronunciation}`);
    } else {
      alert("Audio pronunciation not available for this word");
    }
  });

  // Save button click handler
  saveButton?.addEventListener("click", async () => {
    // Send message to background script to save vocabulary item
    try {
      await browser.runtime.sendMessage({
        type: "SAVE_VOCABULARY_ITEM",
        item: {
          id: Date.now().toString(), // Simple ID generation
          word: text,
          normalizedWord: text.toLowerCase().replace(/[^\w]/g, ""),
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          translation: translation,
          pronunciation: pronunciation,
          examples: examples,
          definitions: definitions,
          createdAt: Date.now(),
          updatedAt: Date.now()
        }
      });

      // Update UI to show saved state
      if (saveButton) {
        saveButton.textContent = "★ Saved";
        saveButton.setAttribute("aria-label", "Saved");
        saveButton.disabled = true;

        // Show temporary success message
        const originalText = saveButton.textContent;
        saveButton.textContent = "✓ Saved!";
        setTimeout(() => {
          saveButton.textContent = originalText;
          saveButton.disabled = false;
        }, 2000);
      }
    } catch (error) {
      console.error("Failed to save vocabulary item:", error);
      alert("Failed to save vocabulary item. Please try again.");
    }
  });
}

// Function to create and show OCR result card
function showOCRResult(text: any, sourceLang: any, targetLang: any) {
  // Remove any existing translation card
  removeExistingTranslationCard();

  // Create OCR result card container
  const card = document.createElement("div");
  card.className = "peak-translation-card";
  card.innerHTML = `
    <div class="peak-translation-card-header">
      <div class="peak-translation-card-word">OCR Result</div>
      <button class="peak-translation-card-translate-button" aria-label="Translate OCR text">
        🌐 Translate
      </button>
    </div>
    <div class="peak-translation-card-body">
      <div class="peak-translation-card-translation">
        ${text}
      </div>
      <div class="peak-translation-card-examples">
        <!-- No examples for OCR result -->
      </div>
    </div>
  `;

  // Position the card near the selection (or center if no selection)
  positionCardNearSelection(card);

  // Add card to document
  document.body.appendChild(card);

  // Add event listeners
  const translateButton = card.querySelector(".peak-translation-card-translate-button") as HTMLButtonElement | null;

  // Translate button click handler
  translateButton?.addEventListener("click", () => {
    // Send message to background script to translate the OCR text
    browser.runtime.sendMessage({
      type: "TRANSLATE_OCR_TEXT",
      text: text,
      sourceLanguage: sourceLang,
      targetLanguage: targetLang
    });

    // Change button to show translating state
    if (translateButton) {
      translateButton.textContent = "Translating...";
      translateButton.disabled = true;
    }
  });
}

// Function to remove existing translation card
function removeExistingTranslationCard() {
  const existingCard = document.querySelector(".peak-translation-card");
  if (existingCard) {
    existingCard.remove();
  }
}

// Function to position card near selection
function positionCardNearSelection(card: any) {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) {
    // Fallback to center of viewport
    card.style.position = "fixed";
    card.style.top = "50%";
    card.style.left = "50%";
    card.style.transform = "translate(-50%, -50%)";
    return;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  // Position above selection if possible, otherwise below
  let top = rect.top - 10; // 10px above selection
  let left = rect.left;

  // Check if card would be above viewport
  if (top < 0) {
    top = rect.bottom + 10; // Position below selection
  }

  // Check if card would exceed viewport width
  const cardWidth = 300; // Approximate card width
  if (left + cardWidth > window.innerWidth) {
    left = window.innerWidth - cardWidth - 10; // 10px from right edge
  }

  // Ensure card doesn't go below 0 on left
  if (left < 0) {
    left = 10;
  }

  card.style.position = "fixed";
  card.style.top = `${top}px`;
  card.style.left = `${left}px`;
  card.style.zIndex = "999999";
}

// Initialize when content script loads
console.log("Peak Translation content script loaded");
