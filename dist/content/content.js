"use strict";
// Content script for Peak Translation extension
// Listen for messages from background script
browser.runtime.onMessage.addListener((message, sender) => {
    if (message.type === "SHOW_TRANSLATION_CARD") {
        showTranslationCard(message.text, message.sourceLanguage, message.targetLanguage);
        return true;
    }
    else if (message.type === "GET_SELECTION_AND_TRANSLATE") {
        // Get selected text and translate it
        const selectedText = window.getSelection().toString().trim();
        if (selectedText) {
            // For now, just show a simple translation - will be enhanced later
            showTranslationCard(selectedText, "auto", "en");
        }
        return true;
    }
});
// Function to create and show translation card
function showTranslationCard(text, sourceLang, targetLang) {
    // Remove any existing translation card
    removeExistingTranslationCard();
    // Create translation card container
    const card = document.createElement('div');
    card.className = 'peak-translation-card';
    card.innerHTML = `
    <div class="peak-translation-card-header">
      <div class="peak-translation-card-word">${text}</div>
      <button class="peak-translation-card-audio-button" aria-label="Play pronunciation">
        🔊
      </button>
    </div>
    <div class="peak-translation-card-body">
      <div class="peak-translation-card-translation">
        Loading...
      </div>
      <div class="peak-translation-card-examples">
        Examples will appear here
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
    const audioButton = card.querySelector('.peak-translation-card-audio-button');
    const saveButton = card.querySelector('.peak-translation-card-save-button');
    audioButton.addEventListener('click', () => {
        // TODO: Implement audio playback
        alert('Audio playback not implemented yet');
    });
    saveButton.addEventListener('click', () => {
        // TODO: Implement save functionality
        saveButton.textContent = '★ Saved';
        saveButton.setAttribute('aria-label', 'Saved');
        alert('Save functionality not implemented yet');
    });
}
// Function to remove existing translation card
function removeExistingTranslationCard() {
    const existingCard = document.querySelector('.peak-translation-card');
    if (existingCard) {
        existingCard.remove();
    }
}
// Function to position card near selection
function positionCardNearSelection(card) {
    const selection = window.getSelection();
    if (!selection.rangeCount) {
        // Fallback to center of viewport
        card.style.position = 'fixed';
        card.style.top = '50%';
        card.style.left = '50%';
        card.style.transform = 'translate(-50%, -50%)';
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
    card.style.position = 'fixed';
    card.style.top = `${top}px`;
    card.style.left = `${left}px`;
    card.style.zIndex = '999999';
}
// Initialize when content script loads
console.log('Peak Translation content script loaded');
//# sourceMappingURL=content.js.map