// Provider manager for handling translation providers

import type { TranslationProvider } from '../providers/translation/translation-provider';
import { MockTranslationProvider } from '../providers/translation/mock-translation-provider';
import type { TranslationRequest, TranslationResult } from '../../core/types';

export class ProviderManager {
  private providers: TranslationProvider[] = [];
  private primaryProvider: TranslationProvider | null = null;

  constructor() {
    // Initialize with mock provider for development
    const mockProvider = new MockTranslationProvider();
    this.providers.push(mockProvider);
    this.primaryProvider = mockProvider;
  }

  addProvider(provider: TranslationProvider): void {
    this.providers.push(provider);
    if (!this.primaryProvider) {
      this.primaryProvider = provider;
    }
  }

  setPrimaryProvider(provider: TranslationProvider): void {
    this.primaryProvider = provider;
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    if (!this.primaryProvider) {
      throw new Error('No translation provider available');
    }

    try {
      return await this.primaryProvider.translate(request);
    } catch (error) {
      // Try fallback providers
      for (const provider of this.providers) {
        if (provider !== this.primaryProvider) {
          try {
            return await provider.translate(request);
          } catch (fallbackError) {
            // Continue to next provider
            continue;
          }
        }
      }
      
      // If all providers fail, throw the original error
      throw error;
    }
  }

  getAvailableProviders(): TranslationProvider[] {
    return [...this.providers];
  }
}
