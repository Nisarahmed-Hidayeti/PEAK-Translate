import { VocabularyItem, ExtensionSettings } from '../../core/types';
export declare class VocabularyStore {
    private static instance;
    private constructor();
    static getInstance(): VocabularyStore;
    private initializeStorage;
    getVocabulary(): Promise<VocabularyItem[]>;
    saveVocabularyItem(item: VocabularyItem): Promise<void>;
    removeVocabularyItem(id: string): Promise<void>;
    clearVocabulary(): Promise<void>;
    getSettings(): Promise<ExtensionSettings>;
    saveSettings(settings: ExtensionSettings): Promise<void>;
    clearAllData(): Promise<void>;
}
//# sourceMappingURL=vocabulary-store.d.ts.map