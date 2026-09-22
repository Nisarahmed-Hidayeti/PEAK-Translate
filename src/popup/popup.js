// Peak Translation Popup Script
// Handles activation of selection mode when Translate button is clicked

document.addEventListener('DOMContentLoaded', () => {
  const translateBtn = document.getElementById('translate-btn');

  if (translateBtn) {
    translateBtn.addEventListener('click', async () => {
      // Add visual feedback
      translateBtn.textContent = 'Selecting...';
      translateBtn.disabled = true;

      try {
        // Send message to background/service worker to activate selection mode
        await chrome.runtime.sendMessage({
          action: 'activateSelectionMode'
        });

        // Close popup after sending message
        window.close();
      } catch (error) {
        console.error('Failed to activate selection mode:', error);
        translateBtn.textContent = 'Translate';
        translateBtn.disabled = false;
        // Show error to user
        alert('Failed to activate selection mode. Please try again.');
      }
    });
  }
});

// Also handle closing popup via ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    window.close();
  }
});