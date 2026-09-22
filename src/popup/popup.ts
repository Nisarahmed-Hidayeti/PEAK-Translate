// Popup script for Peak Translation extension

import { ProviderManager } from "../core/translation/provider-manager";
import { DefinitionProviderManager } from "../core/definitions/provider-manager";
import { ExampleProviderManager } from "../core/examples/provider-manager";
import { VocabularyStore } from "../storage/vocabulary-store";
import type { TranslationRequest, TranslationResult } from "../core/types";

document.addEventListener("DOMContentLoaded", () => {
  const sourceLangSelect = document.getElementById("source-lang") as HTMLSelectElement;
  const targetLangSelect = document.getElementById("target-lang") as HTMLSelectElement;
  const inputText = document.getElementById("input-text") as HTMLTextAreaElement;
  const translateBtn = document.getElementById("translate-btn") as HTMLButtonElement;
  const translatedText = document.getElementById("translated-text") as HTMLParagraphElement;
  const optionsBtn = document.getElementById("options-btn") as HTMLButtonElement;

  const providerManager = new ProviderManager();
  const definitionProviderManager = new DefinitionProviderManager();
  const exampleProviderManager = new ExampleProviderManager();
  const vocabularyStore = VocabularyStore.getInstance();

  translateBtn.addEventListener("click", async () => {
    const text = inputText.value.trim();
    if (!text) {
      translatedText.textContent = "Please enter some text to translate.";
      return;
    }

    translateBtn.disabled = true;
    translateBtn.textContent = "Translating...";

    try {
      const request: TranslationRequest = {
        text: text,
        sourceLanguage: sourceLangSelect.value,
        targetLanguage: targetLangSelect.value
      };

      const result: TranslationResult = await providerManager.translate(request);
      translatedText.textContent = result.text;

      // Get definitions and examples for the translated word
      let definitions: string[] = [];
      let examples: string[] = result.examples || [];

      try {
        const definitionResult = await definitionProviderManager.getDefinitions(
          result.text,
          result.targetLanguage
        );
        definitions = definitionResult.definitions || [];
      } catch (defError) {
        console.error("Definition error in popup:", defError);
      }

      try {
        const exampleResult = await exampleProviderManager.getExamples(
          result.text,
          result.targetLanguage
        );
        examples = exampleResult.examples || examples;
      } catch (exError) {
        console.error("Example error in popup:", exError);
      }

      // Save to vocabulary
      await vocabularyStore.saveVocabularyItem({
        id: Date.now().toString(),
        word: text,
        normalizedWord: text.toLowerCase(),
        sourceLanguage: result.sourceLanguage,
        targetLanguage: result.targetLanguage,
        translation: result.text,
        pronunciation: result.pronunciation,
        examples: examples,
        definitions: definitions,
        createdAt: Date.now(),
        updatedAt: Date.now()
      });
    } catch (error) {
      translatedText.textContent = "Translation failed: " + (error as Error).message;
    } finally {
      translateBtn.disabled = false;
      translateBtn.textContent = "Translate";
    }
  });

  optionsBtn.addEventListener("click", () => {
    // Open options page
    browser.runtime.openOptionsPage();
  });
});
