// Background script for Peak Translation extension

// Context menu creation
browser.runtime.onInstalled.addListener(() => {
  browser.contextMenus.create({
    id: "translate-selection",
    title: "Translate with Peak Translation",
    contexts: ["selection"]
  });
});

// Handle context menu clicks
browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate-selection" && info.selectionText) {
    // Send message to content script to show translation card
    browser.tabs.sendMessage(tab.id, {
      type: "SHOW_TRANSLATION_CARD",
      text: info.selectionText,
      sourceLanguage: "auto", // Will be detected
      targetLanguage: browser.i18n.getMessage("@ui_language") // Default to UI language
    });
  }
});

// Handle keyboard command
browser.commands.onCommand.addListener((command) => {
  if (command === "translate-selection") {
    browser.tabs.query({active: true, currentWindow: true}).then((tabs) => {
      if (tabs[0]) {
        // Send message to content script to get selection and show translation
        browser.tabs.sendMessage(tabs[0].id, {
          type: "GET_SELECTION_AND_TRANSLATE"
        });
      }
    });
  }
});

// Listen for messages from content script
browser.runtime.onMessage.addListener((message: any, sender: any, sendResponse: any) => {
  if (message.type === "GET_SETTINGS") {
    // Return default settings for now
    sendResponse({
      nativeLanguage: "tr",
      learningLanguage: "en",
      audioEnabled: true
    });
  }
  return true; // Indicates we want to send a response asynchronously
});
