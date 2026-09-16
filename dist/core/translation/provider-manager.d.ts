import { TranslationProvider } from '../providers/translation/translation-provider';
import { TranslationRequest, TranslationResult } from '../../core/types';
export declare class ProviderManager {
    private providers;
    private primaryProvider;
    constructor();
    addProvider(provider: TranslationProvider): void;
    setPrimaryProvider(provider: TranslationProvider): void;
    translate(request: TranslationRequest): Promise<TranslationResult>;
    getAvailableProviders(): TranslationProvider[];
}
//# sourceMappingURL=provider-manager.d.ts.map