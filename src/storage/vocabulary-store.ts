// Vocabulary storage service

import type { VocabularyItem, ExtensionSettings } from "../core/types";

const STORAGE_KEYS = {
  VOCABULARY: "peak-translation-vocabulary",
  SETTINGS: "peak-translation-settings",
  VERSION: "peak-translation-version"
};

const CURRENT_VERSION = 1;

export class VocabularyStore {
  private static instance: VocabularyStore;

  private constructor() {
    this.initializeStorage();
  }

  public static getInstance(): VocabularyStore {
    if (!VocabularyStore.instance) {
      VocabularyStore.instance = new VocabularyStore();
    }
    return VocabularyStore.instance;
  }

  private initializeStorage(): void {
    // Initialize storage if needed
    // Note: In content scripts, we need to check if we're in a context where browser.storage is available
    if (typeof browser !== "undefined" && typeof browser.storage !== "undefined") {
      browser.storage.local.get(STORAGE_KEYS.VERSION).then((result: { [key: string]: number }) => {
        const version = result[STORAGE_KEYS.VERSION];
        if (version === undefined) {
          browser.storage.local.set({ [STORAGE_KEYS.VERSION]: CURRENT_VERSION });
          
          // Initialize empty vocabulary and default settings
          browser.storage.local.set({
            [STORAGE_KEYS.VOCABULARY]: [],
            [STORAGE_KEYS.SETTINGS]: {
              nativeLanguage: "tr",
              learningLanguage: "en",
              audioEnabled: true,
              ocrLanguagePreference: "auto"
            }
          });
        }
      });
      
      // Also initialize default settings if they don't exist
      browser.storage.local.get(STORAGE_KEYS.SETTINGS).then((result: { [key: string]: ExtensionSettings }) => {
        const settings = result[STORAGE_KEYS.SETTINGS];
        if (settings === undefined) {
          browser.storage.local.set({
            [STORAGE_KEYS.SETTINGS]: {
              nativeLanguage: "tr",
              learningLanguage: "en",
              audioEnabled: true,
              ocrLanguagePreference: "auto"
            }
          });
        }
      });
    }
  }

  async getVocabulary(): Promise<VocabularyItem[]> {
    if (typeof browser !== "undefined" && typeof browser.storage !== "undefined") {
      const result = await browser.storage.local.get(STORAGE_KEYS.VOCABULARY);
      const vocabulary = result[STORAGE_KEYS.VOCABULARY] as VocabularyItem[] | undefined;
      return vocabulary || [];
    }
    return [];
  }

  async saveVocabularyItem(item: VocabularyItem): Promise<void> {
    if (typeof browser !== "undefined" && typeof browser.storage !== "undefined") {
      const vocabulary = await this.getVocabulary();
      
      // Check if item already exists (by normalized word and language pair)
      const existingIndex = vocabulary.findIndex(
        existing => existing.normalizedWord === item.normalizedWord &&
                    existing.sourceLanguage === item.sourceLanguage &&
                    existing.targetLanguage === item.targetLanguage
      );
      
      if (existingIndex >= 0) {
        // Update existing item
        vocabulary[existingIndex] = {
          ...vocabulary[existingIndex],
          ...item,
          updatedAt: Date.now()
        };
      } else {
        // Add new item
        vocabulary.push(item);
      }
      
      await browser.storage.local.set({ [STORAGE_KEYS.VOCABULARY]: vocabulary });
    }
  }

  async removeVocabularyItem(id: string): Promise<void> {
    if (typeof browser !== "undefined" && typeof browser.storage !== "undefined") {
      const vocabulary = await this.getVocabulary();
      const filtered = vocabulary.filter(item => item.id !== id);
      await browser.storage.local.set({ [STORAGE_KEYS.VOCABULARY]: filtered });
    }
  }

  async clearVocabulary(): Promise<void> {
    if (typeof browser !== "undefined" && typeof browser.storage !== "undefined") {
      await browser.storage.local.set({ [STORAGE_KEYS.VOCABULARY]: [] });
    }
  }

  async getSettings(): Promise<ExtensionSettings> {
    if (typeof browser !== "undefined" && typeof browser.storage !== "undefined") {
      const result = await browser.storage.local.get(STORAGE_KEYS.SETTINGS);
      const settings = result[STORAGE_KEYS.SETTINGS] as ExtensionSettings | undefined;
      return settings || {
        nativeLanguage: "tr",
        learningLanguage: "en",
        audioEnabled: true,
        ocrLanguagePreference: "auto"
      };
    }
    return {
      nativeLanguage: "tr",
      learningLanguage: "en",
      audioEnabled: true,
      ocrLanguagePreference: "auto"
    };
  }

  async saveSettings(settings: ExtensionSettings): Promise<void> {
    if (typeof browser !== "undefined" && typeof browser.storage !== "undefined") {
      await browser.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings });
    }
  }

  async clearAllData(): Promise<void> {
    if (typeof browser !== "undefined" && typeof browser.storage !== "undefined") {
      await browser.storage.local.remove([
        STORAGE_KEYS.VOCABULARY,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.VERSION
      ]);
      this.initializeStorage();
    }
  }
}
