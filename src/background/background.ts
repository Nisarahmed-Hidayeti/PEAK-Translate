// Background script for Peak Translation extension

import { ProviderManager } from "../core/translation/provider-manager.js";
import { OCRProviderImpl } from "../providers/ocr/ocr-provider.js";
import { DefinitionProviderManager } from "../core/definitions/provider-manager.js";
import { ExampleProviderManager } from "../core/examples/provider-manager.js";

// Initialize provider managers
const providerManager = new ProviderManager();
const ocrProvider = new OCRProviderImpl();
const definitionProviderManager = new DefinitionProviderManager();
const exampleProviderManager = new ExampleProviderManager();

// Context menu item IDs
const CONTEXT_MENU_ITEM_ID = "translate-selection";
const OCR_CONTEXT_MENU_ITEM_ID = "ocr-extract-text";

// Create context menu when extension is installed or updated
browser.runtime.onInstalled.addListener(() => {
  // Context menu for translating selected text
  browser.contextMenus.create({
    id: CONTEXT_MENU_ITEM_ID,
    title: browser.i18n.getMessage("contextMenuTranslateSelection"),
    contexts: ["selection"]
  });

  // Context menu for extracting text from images
  browser.contextMenus.create({
    id: OCR_CONTEXT_MENU_ITEM_ID,
    title: browser.i18n.getMessage("contextMenuOCRExtractText"),
    contexts: ["image"]
  });
});

// Handle context menu clicks
browser.contextMenus.onClicked.addListener(async (info) => {
  if (!info.menuItemId) return;

  // Get the active tab to send messages to content script
  const tabs = await browser.tabs.query({active: true, currentWindow: true});
  const tab = tabs[0];
  if (!tab) return;

  if (info.menuItemId === CONTEXT_MENU_ITEM_ID && info.selectionText) {
    // Get translation for the selected text
    await getTranslationAndShowCard(info.selectionText, "auto", browser.i18n.getMessage("@ui_language") || "en", tab.id);
  } else if (info.menuItemId === OCR_CONTEXT_MENU_ITEM_ID && info.srcUrl) {
    // Extract text from image using OCR
    try {
      // Fetch the image as a blob
      const response = await fetch(info.srcUrl);
      const blob = await response.blob();

      // Run OCR
      const ocrText = await ocrProvider.recognize(blob);

      // Show OCR result in a card (we'll treat it as a translation result with no translation yet)
      // We'll send a message to content script to show the OCR text
      browser.tabs.sendMessage(tab.id, {
        type: "SHOW_OCR_RESULT",
        text: ocrText,
        sourceLanguage: "auto", // We don't know the source language yet
        targetLanguage: browser.i18n.getMessage("@ui_language") || "en"
      });
    } catch (error) {
      console.error("OCR error:", error);
      browser.tabs.sendMessage(tab.id, {
        type: "SHOW_OCR_RESULT",
        text: `OCR failed: ${error}`,
        sourceLanguage: "auto",
        targetLanguage: browser.i18n.getMessage("@ui_language") || "en"
      });
    }
  }
});

// Handle keyboard command
browser.commands.onCommand.addListener(async (command) => {
  if (command === "translate-selection") {
    // Get active tab and ask content script for selected text
    const tabs = await browser.tabs.query({active: true, currentWindow: true});
    if (tabs[0]) {
      // Get selected text from content script
      browser.tabs.sendMessage(tabs[0].id, {
        type: "GET_SELECTION_AND_TRANSLATE"
      });
    }
  }
});

// Listen for messages from content script
browser.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  // Get the tab ID from sender
  const tabId = sender.tab?.id;
  if (!tabId) return false;

  if (message.type === "GET_SELECTION_AND_TRANSLATE") {
    // Get selected text from content script and translate it
    try {
      // We'll ask the content script to get the actual selection
      browser.tabs.sendMessage(tabId, {
        type: "GET_ACTUAL_SELECTION"
      });

      // We'll wait for the response with the actual selection
      // But we need to handle this differently - let's modify our approach

      // For now, we'll just return true to indicate we'll handle this asynchronously
      // and send a separate message back
      return true;
    } catch (error) {
      console.error("Error in GET_SELECTION_AND_TRANSLATE:", error);
      return true;
    }
  } else if (message.type === "ACTUAL_SELECTION") {
    // Now we have the actual selection from the content script
    try {
      const selectedText = message.text;
      if (selectedText && selectedText.trim()) {
        await getTranslationAndShowCard(selectedText.trim(), "auto", browser.i18n.getMessage("@ui_language") || "en", tabId);
      }
    } catch (error) {
      console.error("Error processing actual selection:", error);
    }
    return true;
  } else if (message.type === "TRANSLATE_TEXT") {
    // Translate text and send back to content script
    try {
      const translationResult = await providerManager.translate({
        text: message.text,
        sourceLanguage: message.sourceLanguage,
        targetLanguage: message.targetLanguage
      });

      // Get definitions and examples for the translated word
      let definitionResult = null;
      let exampleResult = null;

      try {
        // Get definitions for the translated word in the target language
        definitionResult = await definitionProviderManager.getDefinitions(
          translationResult.text,
          message.targetLanguage
        );
      } catch (defError) {
        console.error("Definition error:", defError);
        // Continue without definitions
      }

      try {
        // Get examples for the translated word in the target language
        exampleResult = await exampleProviderManager.getExamples(
          translationResult.text,
          message.targetLanguage
        );
      } catch (exError) {
        console.error("Example error:", exError);
        // Continue without examples
      }

      sendResponse({
        type: "SHOW_TRANSLATION_CARD",
        text: message.text,
        sourceLanguage: message.sourceLanguage,
        targetLanguage: message.targetLanguage,
        translation: translationResult.text,
        definition: definitionResult?.definitions || [],
        examples: exampleResult?.examples || (translationResult.examples || []),
        pronunciation: translationResult.pronunciation
      });
    } catch (error) {
      console.error("Translation error:", error);
      sendResponse({
        type: "SHOW_TRANSLATION_CARD",
        text: message.text,
        sourceLanguage: message.sourceLanguage,
        targetLanguage: message.targetLanguage,
        translation: `[Translation failed: ${message.text}]`,
        definition: [],
        examples: [],
        pronunciation: undefined
      });
    }
    return true; // Indicates we will respond asynchronously
  } else if (message.type === "SAVE_VOCABULARY_ITEM") {
    // Save vocabulary item to storage
    try {
      const { VocabularyStore } = await import("../storage/vocabulary-store.js");
      await VocabularyStore.getInstance().saveVocabularyItem(message.item);
      sendResponse({ success: true });
    } catch (error) {
      console.error("Failed to save vocabulary item:", error);
      sendResponse({ success: false, error: error instanceof Error ? error.message : String(error) });
    }
    return true; // Indicates we will respond asynchronously
  } else if (message.type === "TRANSLATE_OCR_TEXT") {
    // Translate the OCR text (when user clicks translate on OCR result)
    try {
      const translationResult = await providerManager.translate({
        text: message.text,
        sourceLanguage: message.sourceLanguage,
        targetLanguage: message.targetLanguage
      });

      // Get definitions and examples for the translated word
      let definitionResult = null;
      let exampleResult = null;

      try {
        // Get definitions for the translated word in the target language
        definitionResult = await definitionProviderManager.getDefinitions(
          translationResult.text,
          message.targetLanguage
        );
      } catch (defError) {
        console.error("Definition error:", defError);
        // Continue without definitions
      }

      try {
        // Get examples for the translated word in the target language
        exampleResult = await exampleProviderManager.getExamples(
          translationResult.text,
          message.targetLanguage
        );
      } catch (exError) {
        console.error("Example error:", exError);
        // Continue without examples
      }

      sendResponse({
        type: "SHOW_TRANSLATION_CARD",
        text: message.text,
        sourceLanguage: message.sourceLanguage,
        targetLanguage: message.targetLanguage,
        translation: translationResult.text,
        definition: definitionResult?.definitions || [],
        examples: exampleResult?.examples || (translationResult.examples || []),
        pronunciation: translationResult.pronunciation
      });
    } catch (error) {
      console.error("Translation error:", error);
      sendResponse({
        type: "SHOW_TRANSLATION_CARD",
        text: message.text,
        sourceLanguage: message.sourceLanguage,
        targetLanguage: message.targetLanguage,
        translation: `[Translation failed: ${message.text}]`,
        definition: [],
        examples: [],
        pronunciation: undefined
      });
    }
    return true;
  }

  return false; // Indicates we do not want to send a response (except for the cases above)
});

// Function to get translation and show card
async function getTranslationAndShowCard(text, sourceLanguage, targetLanguage, tabId) {
  try {
    const translationResult = await providerManager.translate({
      text,
      sourceLanguage,
      targetLanguage
    });

    // Get definitions and examples for the translated word
    let definitionResult = null;
    let exampleResult = null;

    try {
      // Get definitions for the translated word in the target language
      definitionResult = await definitionProviderManager.getDefinitions(
        translationResult.text,
        targetLanguage
      );
    } catch (defError) {
      console.error("Definition error:", defError);
      // Continue without definitions
    }

    try {
      // Get examples for the translated word in the target language
      exampleResult = await exampleProviderManager.getExamples(
        translationResult.text,
        targetLanguage
      );
    } catch (exError) {
      console.error("Example error:", exError);
      // Continue without examples
    }

    // Send message to content script to show translation card
    browser.tabs.sendMessage(tabId, {
      type: "SHOW_TRANSLATION_CARD",
      text,
      sourceLanguage,
      targetLanguage,
      translation: translationResult.text,
      definition: definitionResult?.definitions || [],
      examples: exampleResult?.examples || (translationResult.examples || []),
      pronunciation: translationResult.pronunciation
    });
  } catch (error) {
    console.error("Translation error:", error);
    // Send error message to content script
    browser.tabs.sendMessage(tabId, {
      type: "SHOW_TRANSLATION_CARD",
      text,
      sourceLanguage,
      targetLanguage,
      translation: `[Translation failed: ${text}]`,
      definition: [],
      examples: [],
      pronunciation: undefined
    });
  }
}