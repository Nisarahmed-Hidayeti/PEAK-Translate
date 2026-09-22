// Provider manager for handling translation providers
import { LibreTranslateProvider } from "../../providers/libre-translate-provider";
import { MockTranslationProvider } from "../../providers/translation/mock-translation-provider";
export class ProviderManager {
    constructor() {
        this.providers = [];
        this.primaryProvider = null;
        // Initialize with LibreTranslate provider for production
        const libreTranslateProvider = new LibreTranslateProvider();
        this.providers.push(libreTranslateProvider);
        this.primaryProvider = libreTranslateProvider;
        // Also add mock provider as fallback
        const mockProvider = new MockTranslationProvider();
        this.providers.push(mockProvider);
    }
    addProvider(provider) {
        this.providers.push(provider);
        if (!this.primaryProvider) {
            this.primaryProvider = provider;
        }
    }
    setPrimaryProvider(provider) {
        this.primaryProvider = provider;
    }
    async translate(request) {
        if (!this.primaryProvider) {
            throw new Error("No translation provider available");
        }
        try {
            return await this.primaryProvider.translate(request);
        }
        catch (error) {
            // Try fallback providers
            for (const provider of this.providers) {
                if (provider !== this.primaryProvider) {
                    try {
                        return await provider.translate(request);
                    }
                    catch (fallbackError) {
                        // Continue to next provider
                        continue;
                    }
                }
            }
            // If all providers fail, throw the original error
            throw error;
        }
    }
    getAvailableProviders() {
        return [...this.providers];
    }
}
//# sourceMappingURL=provider-manager.js.map