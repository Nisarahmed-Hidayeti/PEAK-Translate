// Content script for Peak Translation Firefox Extension

// Declare the browser variable for TypeScript
declare const browser: any;

// Language code type
type LanguageCode = 'tr' | 'en' | 'es' | 'fr' | 'de';

// Text-to-speech function using Web Speech API
function speakText(text: string, language: LanguageCode): void {
  if (!('speechSynthesis' in window)) {
    alert('Speech synthesis not supported in this browser');
    return;
  }

  const synth = window.speechSynthesis;
  if (synth.speaking) {
    synth.cancel(); // Cancel any ongoing speech
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'tr' ? 'tr-TR' :
                   language === 'en' ? 'en-US' :
                   language === 'es' ? 'es-ES' :
                   language === 'fr' ? 'fr-FR' :
                   language === 'de' ? 'de-DE' : language;
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 0.8;

  synth.speak(utterance);
}

// Listen for messages from background script
browser.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  if (message.type === 'GET_SELECTION') {
    // Get the selected text
    const selection = window.getSelection();
    const selectedText = selection ? selection.toString().trim() : '';
    sendResponse({text: selectedText});
    return true; // Indicates we want to send a response asynchronously
  }

  if (message.type === 'SHOW_TRANSLATION') {
    // Show the translation UI
    showTranslationCard(message.translation);
    sendResponse({status: 'shown'});
    return true;
  }

  if (message.type === 'VOCABULARY_UPDATED') {
    // Vocabulary has been updated, we could refresh the UI if needed
    // For now, we just log it - the web dashboard will pick up changes via storage events
    console.log('Vocabulary updated via extension:', message.vocabulary.length, 'items');
    return true;
  }

  return false; // No response needed
});

// Function to create and show the translation floating card
function showTranslationCard(translation: any) {
  // Remove any existing card first
  const existingCard = document.getElementById('peak-translation-card');
  if (existingCard) {
    existingCard.remove();
  }
  
  // Create the card container
  const card = document.createElement('div');
  card.id = 'peak-translation-card';
  card.style.position = 'fixed';
  card.style.zIndex = '999999';
  card.style.borderRadius = '8px';
  card.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  card.style.padding = '16px';
  card.style.maxWidth = '300px';
  card.style.width = '100%';
  card.style.backgroundColor = 'white';
  card.style.color = '#333';
  card.style.fontFamily = 'system-ui, sans-serif';
  card.style.border = '1px solid #eee';
  card.style.opacity = '0';
  card.style.transform = 'translateY(-10px)';
  card.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  
  // Animate in
  requestAnimationFrame(() => {
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
  });
  
  // Position the card near the selection
  positionCardNearSelection(card);
  
  // Create card content
  let content = '';
  
  if (translation.word) {
    content += `<div style="font-size: 1.5rem; font-weight: 600; margin-bottom: 8px;">${escapeHtml(translation.word)}</div>`;
  }
  
  if (translation.translation) {
    content += `<div style="font-size: 1.25rem; color: #0066cc; margin-bottom: 12px;">${escapeHtml(translation.translation)}</div>`;
  }
  
  if (translation.definition) {
    content += `<div style="font-size: 0.95rem; color: #666; margin-bottom: 12px;"><strong>Definition:</strong> ${escapeHtml(translation.definition)}</div>`;
  }
  
  if (translation.examples && translation.examples.length > 0) {
    content += `<div style="margin-bottom: 12px;"><strong>Examples:</strong></div>`;
    content += `<ul style="margin: 0 0 12px 16px; padding: 0; font-size: 0.9rem; color: #555;">`;
    for (let i = 0; i < Math.min(3, translation.examples.length); i++) {
      content += `<li style="margin-bottom: 4px;">${escapeHtml(translation.examples[i])}</li>`;
    }
    content += `</ul>`;
  }
  
  // Audio button
  if (translation.word || translation.translation) {
    content += `<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 12px;">`;
    content += `<span style="font-size: 0.9rem; color: #666;">Pronunciation:</span>`;
    content += `<button id="peak-translation-audio" style="`;
    content += `background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; `;
    content += `padding: 6px 10px; cursor: pointer; font-size: 0.9rem;">`;
    content += `🔊 Play</button>`;
    content += `</div>`;
  }
  
  // Save button
  content += `<div style="text-align: center;">`;
  content += `<button id="peak-translation-save" style="`;
  content += `background: #0066cc; color: white; border: none; border-radius: 4px; `;
  content += `padding: 8px 16px; cursor: pointer; font-size: 0.95rem; font-weight: 500;">`;
  content += `💾 Save</button>`;
  content += `</div>`;
  
  card.innerHTML = content;
  
  // Add event listeners
  const audioBtn = card.querySelector('#peak-translation-audio');
  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      // Implement actual TTS using browser speech synthesis
      const textToSpeak = translation.word || translation.translation;
      if (textToSpeak) {
        // Use source language for word pronunciation, target language for translation
        const language = translation.word ? translation.sourceLanguage : translation.targetLanguage;
        speakText(textToSpeak, language);
      }
    });
  }
  
  const saveBtn = card.querySelector('#peak-translation-save');
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      // Save to vocabulary (through background script)
      try {
        await browser.runtime.sendMessage({
          type: 'SAVE_VOCABULARY',
          vocabulary: {
            word: translation.word || '',
            translations: [translation.translation || ''],
            definition: translation.definition || '',
            examples: translation.examples || [],
            phonetic: translation.phonetic,
            context: '', // TODO: Get context from page
            sourceUrl: window.location.href,
            sourceTitle: document.title,
            sourceLanguage: 'en', // TODO: Get from language settings
            targetLanguage: 'tr'  // TODO: Get from language settings
          }
        });
        
        // Update UI to show saved state
        const saveButtonEl = card.querySelector('#peak-translation-save');
        if (saveButtonEl) {
          (saveButtonEl as HTMLButtonElement).textContent = '✅ Saved';
          (saveButtonEl as HTMLButtonElement).style.background = '#00cc66';
          (saveButtonEl as HTMLButtonElement).disabled = true;
        }
        
        // Show temporary notification
        showToast('Word saved to vocabulary!');
      } catch (error) {
        console.error('Failed to save vocabulary:', error);
        showToast('Failed to save word');
      }
    });
  }
  
  // Close button
  content += `<div style="text-align: right; margin-top: 12px;">`;
  content += `<button id="peak-translation-close" style="`;
  content += `background: transparent; border: none; font-size: 1rem; `;
  content += `color: #999; cursor: pointer; padding: 4px;">`;
  content += `✕</button>`;
  content += `</div>`;
  
  // Actually add the close button listener after setting innerHTML
  card.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const closeBtn = card.querySelector('#peak-translation-close');
    if (target === closeBtn) {
      card.remove();
    }
  });
  
  // Add card to document
  document.body.appendChild(card);
  
  // Click outside to close
  document.addEventListener('click', function outsideClickListener(e: MouseEvent) {
    if (!card.contains(e.target as Node)) {
      card.remove();
      document.removeEventListener('click', outsideClickListener);
    }
  });
  
  // Escape key to close
  document.addEventListener('keydown', function escapeListener(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      card.remove();
      document.removeEventListener('keydown', escapeListener);
    }
  });
}

// Position the card near the selected text
function positionCardNearSelection(card: HTMLElement) {
  const selection = window.getSelection();
  if (!selection?.rangeCount) {
    // Fallback to center of viewport
    card.style.top = '50%';
    card.style.left = '50%';
    card.style.transform = 'translate(-50%, -50%)';
    return;
  }
  
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  // Position above the selection if possible, otherwise below
  let top = rect.top - card.offsetHeight - 8; // 8px gap
  let left = rect.left + (rect.width - card.offsetWidth) / 2;
  
  // Adjust if card would go off screen
  if (top < 0) {
    top = rect.bottom + 8; // Show below selection
  }
  
  if (left < 0) {
    left = 8; // Margin from left
  } else if (left + card.offsetWidth > window.innerWidth) {
    left = window.innerWidth - card.offsetWidth - 8; // Margin from right
  }
  
  card.style.top = `${top}px`;
  card.style.left = `${left}px`;
  // Don't use transform for positioning since we're setting top/left directly
}

// Simple toast notification
function showToast(message: string) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '20px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.backgroundColor = '#333';
  toast.style.color = 'white';
  toast.style.padding = '8px 16px';
  toast.style.borderRadius = '4px';
  toast.style.zIndex = '999999';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.2s ease';
  
  document.body.appendChild(toast);
  
  requestAnimationFrame(() => {
    toast.style.opacity = '0.9';
  });
  
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      toast.remove();
    }, 200);
  }, 1500);
}

// Escape HTML to prevent XSS
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;'
  };
  
  return text.replace(/[&<>"']/g, (m: string) => map[m]);
}

console.log('Peak Translation content script loaded');
