// Options script for Peak Translation extension

import { VocabularyStore } from "../storage/vocabulary-store";
import type { ExtensionSettings, VocabularyItem } from "../core/types";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("options-form") as HTMLFormElement;
  const nativeLanguageSelect = document.getElementById("native-language") as HTMLSelectElement;
  const learningLanguageSelect = document.getElementById("learning-language") as HTMLSelectElement;
  const audioEnabledCheckbox = document.getElementById("audio-enabled") as HTMLInputElement;
  const ocrLanguageSelect = document.getElementById("ocr-language") as HTMLSelectElement;
  const saveOptionsBtn = document.getElementById("save-options") as HTMLButtonElement;
  const clearVocabularyBtn = document.getElementById("clear-vocabulary") as HTMLButtonElement;
  const vocabularyList = document.getElementById("vocabulary-list") as HTMLUListElement;

  const vocabularyStore = VocabularyStore.getInstance();

  // Load current settings
  vocabularyStore.getSettings().then((settings: ExtensionSettings) => {
    nativeLanguageSelect.value = settings.nativeLanguage;
    learningLanguageSelect.value = settings.learningLanguage;
    audioEnabledCheckbox.checked = settings.audioEnabled;
    ocrLanguageSelect.value = settings.ocrLanguagePreference;
  });

  // Load vocabulary
  loadVocabulary();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const settings: ExtensionSettings = {
      nativeLanguage: nativeLanguageSelect.value,
      learningLanguage: learningLanguageSelect.value,
      audioEnabled: audioEnabledCheckbox.checked,
      ocrLanguagePreference: ocrLanguageSelect.value
    };

    await vocabularyStore.saveSettings(settings);
    alert("Options saved successfully!");
  });

  clearVocabularyBtn.addEventListener("click", async () => {
    if (confirm("Are you sure you want to clear all saved vocabulary?")) {
      await vocabularyStore.clearVocabulary();
      loadVocabulary();
      alert("Vocabulary cleared.");
    }
  });

  async function loadVocabulary() {
    vocabularyList.innerHTML = "";
    const vocabulary = await vocabularyStore.getVocabulary();
    if (vocabulary.length === 0) {
      vocabularyList.innerHTML = "<li>No vocabulary saved yet.</li>";
      return;
    }

    vocabulary.forEach(item => {
      const li = document.createElement("li");
      li.className = "vocabulary-item";
      
      // Create vocabulary item content
      let content = `<strong>${item.word}</strong> → <em>${item.translation}</em>`;
      
      // Add pronunciation if available
      if (item.pronunciation) {
        content += ` <span class="pronunciation">[${item.pronunciation}]</span>`;
      }
      
      // Add definitions if available
      if (item.definitions && item.definitions.length > 0) {
        content += "<div class=\"definitions\">";
        item.definitions.forEach(def => {
          content += `<div class="definition"> • ${def}</div>`;
        });
        content += "</div>";
      }
      
      // Add examples if available
      if (item.examples && item.examples.length > 0) {
        content += "<div class=\"examples\">";
        item.examples.forEach(example => {
          content += `<div class="example"> "${example}"</div>`;
        });
        content += "</div>";
      }
      
      // Add context if available
      if (item.context) {
        content += `<div class="context">"<em>${item.context}</em>"</div>`;
      }
      
      // Add timestamps
      const createdDate = new Date(item.createdAt).toLocaleString();
      const updatedDate = new Date(item.updatedAt).toLocaleString();
      content += `<div class="timestamps">Added: ${createdDate}`;
      if (item.updatedAt !== item.createdAt) {
        content += ` | Updated: ${updatedDate}`;
      }
      content += "</div>";
      
      // Add remove button
      content += `<button class="remove-btn" data-id="${item.id}">Remove</button>`;
      
      li.innerHTML = content;
      vocabularyList.appendChild(li);
    });

    // Add event listeners to remove buttons
    const removeButtons = document.querySelectorAll(".remove-btn");
    removeButtons.forEach(button => {
      button.addEventListener("click", async (e) => {
        const id = (e.target as HTMLButtonElement).dataset.id;
        if (id) {
          await vocabularyStore.removeVocabularyItem(id);
          loadVocabulary();
        }
      });
    });
  }
});
