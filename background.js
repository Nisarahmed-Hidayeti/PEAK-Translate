// Peak Translation Background Script
// Manages extension activation state and communication

// Store activation state
let isEnabled = false;

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleEnabled") {
    isEnabled = request.enabled;
    // Notify content scripts about state change
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "updateEnabledState",
          enabled: isEnabled
        });
      }
    });
    sendResponse({success: true});
    return true; // Keep message channel open for async response
  }

  if (request.action === "getEnabledState") {
    sendResponse({enabled: isEnabled});
    return true;
  }
});

// Initialize state from storage on startup
chrome.storage.local.get("enabled", (data) => {
  isEnabled = data.enabled !== undefined ? data.enabled : false;
});

// Save state when it changes
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.enabled) {
    isEnabled = changes.enabled.newValue;
  }
});

// Handle extension icon click - toggle enabled state
chrome.action.onClicked.addListener((tab) => {
  isEnabled = !isEnabled;
  chrome.storage.local.set({enabled: isEnabled});

  // Update icon to reflect state
  chrome.action.setIcon({
    tabId: tab.id,
    path: {
      "48": isEnabled ? "icons/icon48-active.png" : "icons/icon48.png",
      "96": isEnabled ? "icons/icon96-active.png" : "icons/icon96.png"
    }
  });

  // Notify content script
  chrome.tabs.sendMessage(tab.id, {
    action: "updateEnabledState",
    enabled: isEnabled
  });
});

// Set initial icon based on stored state
chrome.storage.local.get("enabled", (data) => {
  const enabled = data.enabled !== undefined ? data.enabled : false;
  chrome.action.setIcon({
    path: {
      "48": enabled ? "icons/icon48-active.png" : "icons/icon48.png",
      "96": enabled ? "icons/icon96-active.png" : "icons/icon96.png"
    }
  });
});