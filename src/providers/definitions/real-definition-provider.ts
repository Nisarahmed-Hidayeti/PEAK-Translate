// Real definition provider using DictionaryAPI.dev

import { DefinitionProvider, DefinitionResult } from "../../core/types";
import { MockDefinitionProvider } from "./mock-definition-provider";

export class RealDefinitionProvider implements DefinitionProvider {
  private mockProvider: MockDefinitionProvider;
  private apiUrl: string = "https://api.dictionaryapi.dev/api/v2/entries/en";

  constructor() {
    this.mockProvider = new MockDefinitionProvider();
  }

  async getDefinitions(word: string, language: string): Promise<DefinitionResult> {
    // Only use real API for English words for now
    if (language !== "en") {
      // For non-English languages, use mock provider
      return await this.mockProvider.getDefinitions(word, language);
    }

    try {
      const response = await fetch(`${this.apiUrl}/${encodeURIComponent(word.toLowerCase())}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          // Word not found, fall back to mock
          return await this.mockProvider.getDefinitions(word, language);
        }
        throw new Error(`Dictionary API error: ${response.status}`);
      }

      const data: any[] = await response.json();
      
      if (!data || data.length === 0) {
        return await this.mockProvider.getDefinitions(word, language);
      }

      // Extract definitions from the API response
      const definitions: string[] = [];
      let partOfSpeech: string | undefined;

      // Process the first entry (most common)
      const entry = data[0];
      
      if (entry.meanings && entry.meanings.length > 0) {
        // Get part of speech from the first meaning
        partOfSpeech = entry.meanings[0].partOfSpeech;
        
        // Collect all definitions from all meanings
        for (const meaning of entry.meanings) {
          if (meaning.definitions && meaning.definitions.length > 0) {
            for (const def of meaning.definitions) {
              if (def.definition) {
                definitions.push(def.definition);
              }
            }
          }
        }
      }

      // If we didn't get any definitions, fall back to mock
      if (definitions.length === 0) {
        return await this.mockProvider.getDefinitions(word, language);
      }

      return {
        word,
        definitions: definitions.slice(0, 5), // Limit to 5 definitions
        partOfSpeech,
        source: "DictionaryAPI.dev"
      };
    } catch (error) {
      console.error("Real definition provider error:", error);
      // Fall back to mock provider on any error
      return await this.mockProvider.getDefinitions(word, language);
    }
  }

  async getSupportedLanguages(): Promise<string[]> {
    // For now, only English is supported by the real API
    // The mock provider supports all languages
    return ["en"];
  }

  getName(): string {
    return "Real Definition Provider (DictionaryAPI.dev)";
  }
}
