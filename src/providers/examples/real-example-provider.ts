// Real example provider using DictionaryAPI.dev

import { ExampleProvider, ExampleResult } from "../../core/types";
import { MockExampleProvider } from "./mock-example-provider";

export class RealExampleProvider implements ExampleProvider {
  private mockProvider: MockExampleProvider;
  private apiUrl: string = "https://api.dictionaryapi.dev/api/v2/entries/en";

  constructor() {
    this.mockProvider = new MockExampleProvider();
  }

  async getExamples(word: string, language: string): Promise<ExampleResult> {
    // Only use real API for English words for now
    if (language !== "en") {
      // For non-English languages, use mock provider
      return await this.mockProvider.getExamples(word, language);
    }

    try {
      const response = await fetch(`${this.apiUrl}/${encodeURIComponent(word.toLowerCase())}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // Word not found, fall back to mock
          return await this.mockProvider.getExamples(word, language);
        }
        throw new Error(`Dictionary API error: ${response.status}`);
      }

      const data: any[] = await response.json();
      
      if (!data || data.length === 0) {
        return await this.mockProvider.getExamples(word, language);
      }

      // Extract examples from the API response
      const examples: string[] = [];

      // Process the first entry (most common)
      const entry = data[0];
      
      if (entry.meanings && entry.meanings.length > 0) {
        // Collect all examples from all meanings
        for (const meaning of entry.meanings) {
          if (meaning.definitions && meaning.definitions.length > 0) {
            for (const def of meaning.definitions) {
              if (def.example && typeof def.example === "string") {
                examples.push(def.example);
              }
            }
          }
        }
      }

      // If we didn't get any examples, fall back to mock
      if (examples.length === 0) {
        return await this.mockProvider.getExamples(word, language);
      }

      return {
        word,
        examples: examples.slice(0, 5), // Limit to 5 examples
        source: "DictionaryAPI.dev"
      };
    } catch (error) {
      console.error("Real example provider error:", error);
      // Fall back to mock provider on any error
      return await this.mockProvider.getExamples(word, language);
    }
  }

  async getSupportedLanguages(): Promise<string[]> {
    // For now, only English is supported by the real API
    // The mock provider supports all languages
    return ["en"];
  }

  getName(): string {
    return "Real Example Provider (DictionaryAPI.dev)";
  }
}
