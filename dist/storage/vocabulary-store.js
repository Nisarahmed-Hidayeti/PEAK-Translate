// Vocabulary storage service
const STORAGE_KEYS = {
    VOCABULARY: 'peak-translation-vocabulary',
    SETTINGS: 'peak-translation-settings',
    VERSION: 'peak-translation-version'
};
const CURRENT_VERSION = 1;
export class VocabularyStore {
    constructor() {
        this.initializeStorage();
    }
    static getInstance() {
        if (!VocabularyStore.instance) {
            VocabularyStore.instance = new VocabularyStore();
        }
        return VocabularyStore.instance;
    }
    initializeStorage() {
        // Initialize storage if needed
        if (!browser.storage.local.get(CURRENT_VERSION)) {
            browser.storage.local.set({ [STORAGE_KEYS.VERSION]: CURRENT_VERSION });
            // Initialize empty vocabulary and default settings
            browser.storage.local.set({
                [STORAGE_KEYS.VOCABULARY]: [],
                [STORAGE_KEYS.SETTINGS]: {
                    nativeLanguage: 'tr',
                    learningLanguage: 'en',
                    audioEnabled: true,
                    ocrLanguagePreference: 'auto'
                }
            });
        }
    }
    async getVocabulary() {
        const result = await browser.storage.local.get(STORAGE_KEYS.VOCABULARY);
        return result[STORAGE_KEYS.VOCABULARY] || [];
    }
    async saveVocabularyItem(item) {
        const vocabulary = await this.getVocabulary();
        // Check if item already exists (by normalized word and language pair)
        const existingIndex = vocabulary.findIndex(existing => existing.normalizedWord === item.normalizedWord &&
            existing.sourceLanguage === item.sourceLanguage &&
            existing.targetLanguage === item.targetLanguage);
        if (existingIndex >= 0) {
            // Update existing item
            vocabulary[existingIndex] = {
                ...vocabulary[existingIndex],
                ...item,
                updatedAt: Date.now()
            };
        }
        else {
            // Add new item
            vocabulary.push(item);
        }
        await browser.storage.local.set({ [STORAGE_KEYS.VOCABULARY]: vocabulary });
    }
    async removeVocabularyItem(id) {
        const vocabulary = await this.getVocabulary();
        const filtered = vocabulary.filter(item => item.id !== id);
        await browser.storage.local.set({ [STORAGE_KEYS.VOCABULARY]: filtered });
    }
    async clearVocabulary() {
        await browser.storage.local.set({ [STORAGE_KEYS.VOCABULARY]: [] });
    }
    async getSettings() {
        const result = await browser.storage.local.get(STORAGE_KEYS.SETTINGS);
        return result[STORAGE_KEYS.SETTINGS] || {
            nativeLanguage: 'tr',
            learningLanguage: 'en',
            audioEnabled: true,
            ocrLanguagePreference: 'auto'
        };
    }
    async saveSettings(settings) {
        await browser.storage.local.set({ [STORAGE_KEYS.SETTINGS]: settings });
    }
    async clearAllData() {
        await browser.storage.local.remove([
            STORAGE_KEYS.VOCABULARY,
            STORAGE_KEYS.SETTINGS,
            STORAGE_KEYS.VERSION
        ]);
        this.initializeStorage();
    }
}
//# sourceMappingURL=vocabulary-store.js.map