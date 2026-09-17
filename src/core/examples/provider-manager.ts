// Provider manager for handling example providers

import type { ExampleProvider } from "../../core/types";
import { DictionaryAPIExampleProvider } from "../../providers/examples/dictionary-api-provider";
import { MockExampleProvider } from "../../providers/examples/mock-example-provider";

export class ExampleProviderManager {
  private providers: ExampleProvider[] = [];
  private primaryProvider: ExampleProvider | null = null;

  constructor() {
    // Initialize with dictionary API example provider for production
    const dictionaryAPIExampleProvider = new DictionaryAPIExampleProvider();
    this.providers.push(dictionaryAPIExampleProvider);
    this.primaryProvider = dictionaryAPIExampleProvider;

    // Also add mock provider as fallback
    const mockProvider = new MockExampleProvider();
    this.providers.push(mockProvider);
  }

  addProvider(provider: ExampleProvider): void {
    this.providers.push(provider);
    if (!this.primaryProvider) {
      this.primaryProvider = provider;
    }
  }

  setPrimaryProvider(provider: ExampleProvider): void {
    this.primaryProvider = provider;
  }

  async getExamples(word: string, language: string): Promise<any> {
    if (!this.primaryProvider) {
      throw new Error("No example provider available");
    }

    try {
      return await this.primaryProvider.getExamples(word, language);
    } catch (error) {
      // Try fallback providers
      for (const provider of this.providers) {
        if (provider !== this.primaryProvider) {
          try {
            return await provider.getExamples(word, language);
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

  getAvailableProviders(): ExampleProvider[] {
    return [...this.providers];
  }
}