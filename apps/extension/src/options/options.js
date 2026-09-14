// Options script for Peak Translation Firefox Extension

document.addEventListener('DOMContentLoaded', () => {
  const nativeSelect = document.getElementById('native-language');
  const learningSelect = document.getElementById('learning-language');
  const saveButton = document.getElementById('save-settings');
  const exportButton = document.getElementById('export-vocab');
  const importButton = document.getElementById('import-vocab');
  const statusDiv = document.getElementById('status');
  const vocabInfoDiv = document.getElementById('vocab-info');
  const vocabCountDiv = document.getElementById('vocab-count');

  // Load current settings
  browser.storage.sync.get(['native', 'learning'], (result) => {
    if (result.native) {
      nativeSelect.value = result.native;
    }
    if (result.learning) {
      learningSelect.value = result.learning;
    }
  });

  // Load vocabulary count
  const VOCABULARY_STORAGE_KEY = 'peak-translation-vocabulary';
  browser.storage.sync.get([VOCABULARY_STORAGE_KEY]).then(result => {
    const vocabulary = result[VOCABULARY_STORAGE_KEY] || [];
    vocabCountDiv.textContent = `${vocabulary.length} words saved`;
  });

  // Save settings
  saveButton.addEventListener('click', () => {
    const native = nativeSelect.value;
    const learning = learningSelect.value;

    browser.storage.sync.set({ native, learning }, () => {
      statusDiv.textContent = 'Settings saved!';
      statusDiv.className = 'status success';
      statusDiv.style.display = 'block';
      
      // Hide status after 2 seconds
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 2000);
    });
  });

  // Export vocabulary
  exportButton.addEventListener('click', () => {
    browser.storage.sync.get([VOCABULARY_STORAGE_KEY]).then(result => {
      const vocabulary = result[VOCABULARY_STORAGE_KEY] || [];
      if (vocabulary.length === 0) {
        statusDiv.textContent = 'No vocabulary to export';
        statusDiv.className = 'status error';
        statusDiv.style.display = 'block';
        setTimeout(() => {
          statusDiv.style.display = 'none';
        }, 2000);
        return;
      }
      
      const dataStr = JSON.stringify(vocabulary, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const exportFileDefaultName = 'peak-translation-vocabulary.json';
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', url);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      statusDiv.textContent = 'Vocabulary exported!';
      statusDiv.className = 'status success';
      statusDiv.style.display = 'block';
      setTimeout(() => {
        statusDiv.style.display = 'none';
      }, 2000);
    });
  });

  // Import vocabulary
  importButton.addEventListener('click', () => {
    // Create file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.style.display = 'none';
    
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedVocab = JSON.parse(e.target.result);
          if (!Array.isArray(importedVocab)) {
            throw new Error('Invalid vocabulary format');
          }
          
          browser.storage.sync.get([VOCABULARY_STORAGE_KEY]).then(result => {
            const currentVocab = result[VOCABULARY_STORAGE_KEY] || [];
            // Merge vocabularies, avoiding duplicates by word+language pair
            const merged = [...currentVocab];
            
            importedVocab.forEach(item => {
              const isDuplicate = merged.some(existing => 
                existing.word.toLowerCase() === item.word.toLowerCase() &&
                existing.sourceLanguage === item.sourceLanguage &&
                existing.targetLanguage === item.targetLanguage
              );
              
              if (!isDuplicate) {
                merged.push(item);
              }
            });
            
            browser.storage.sync.set({ [VOCABULARY_STORAGE_KEY]: merged }).then(() => {
              vocabCountDiv.textContent = `${merged.length} words saved`;
              statusDiv.textContent = `Imported ${importedVocab.length} words!`;
              statusDiv.className = 'status success';
              statusDiv.style.display = 'block';
              setTimeout(() => {
                statusDiv.style.display = 'none';
              }, 2000);
            });
          });
        } catch (error) {
          console.error('Import error:', error);
          statusDiv.textContent = 'Import failed: Invalid file format';
          statusDiv.className = 'status error';
          statusDiv.style.display = 'block';
          setTimeout(() => {
            statusDiv.style.display = 'none';
          }, 2000);
        }
      };
      reader.readAsText(file);
    });
    
    // Trigger file click
    document.body.appendChild(fileInput);
    fileInput.click();
    document.body.removeChild(fileInput);
  });
});
