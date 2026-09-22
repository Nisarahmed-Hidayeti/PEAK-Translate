// Provider manager for handling definition providers

import type { DefinitionProvider } from "../../core/types";
import { DictionaryAPIProvider } from "../../providers/definitions/dictionary-api-provider";
import { MockDefinitionProvider } from "../../providers/definitions/mock-definition-provider";

export class DefinitionProviderManager {
  private providers: DefinitionProvider[] = [];
  private primaryProvider: DefinitionProvider | null = null;

  constructor() {
    // Initialize with dictionary API provider for production
    const dictionaryAPIProvider = new DictionaryAPIProvider();
    this.providers.push(dictionaryAPIProvider);
    this.primaryProvider = dictionaryAPIProvider;

    // Also add mock provider as fallback
    const mockProvider = new MockDefinitionProvider();
    this.providers.push(mockProvider);
  }

  addProvider(provider: DefinitionProvider): void {
    this.providers.push(provider);
    if (!this.primaryProvider) {
      this.primaryProvider = provider;
    }
  }

  setPrimaryProvider(provider: DefinitionProvider): void {
    this.primaryProvider = provider;
  }

  async getDefinitions(word: string, language: string): Promise<any> {
    if (!this.primaryProvider) {
      throw new Error("No definition provider available");
    }

    try {
      return await this.primaryProvider.getDefinitions(word, language);
    } catch (error) {
      // Try fallback providers
      for (const provider of this.providers) {
        if (provider !== this.primaryProvider) {
          try {
            return await provider.getDefinitions(word, language);
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

  getAvailableProviders(): DefinitionProvider[] {
    return [...this.providers];
  }
}