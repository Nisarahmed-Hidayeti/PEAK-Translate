// LibreTranslate translation provider

import { TranslationProvider, TranslationRequest, TranslationResult } from "./translation/translation-provider";

export class LibreTranslateProvider implements TranslationProvider {
  private apiUrl: string;
  private apiKey: string | null;

  constructor(apiUrl: string = "https://libretranslate.de/", apiKey: string | null = null) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async translate(request: TranslationRequest): Promise<TranslationResult> {
    const { text, sourceLanguage, targetLanguage } = request;
    
    // Prepare request body
    const body: any = {
      q: text,
      source: sourceLanguage,
      target: targetLanguage,
      format: "text"
    };
    
    // Add API key if available
    if (this.apiKey) {
      body.api_key = this.apiKey;
    }
    
    try {
      const response = await fetch(`${this.apiUrl}translate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      
      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      return {
        text: data.translatedText,
        sourceLanguage,
        targetLanguage,
        pronunciation: undefined, // LibreTranslate doesn't provide pronunciation in the basic response
        examples: [], // LibreTranslate doesn't provide examples in the basic response
        confidence: 0.9 // Default confidence score
      };
    } catch (error) {
      console.error("LibreTranslate API error:", error);
      // Fallback to mock translation if API fails
      return await this.fallbackTranslation(request);
    }
  }

  private async fallbackTranslation(request: TranslationRequest): Promise<TranslationResult> {
    // Simple fallback - just return the original text with a note
    return {
      text: `[Translation failed: ${request.text}]`,
      sourceLanguage: request.sourceLanguage,
      targetLanguage: request.targetLanguage,
      pronunciation: undefined,
      examples: [],
      confidence: 0.1
    };
  }

  async getSupportedLanguages(): Promise<string[]> {
    try {
      const response = await fetch(`${this.apiUrl}languages`);
      if (!response.ok) {
        throw new Error(`Languages API error: ${response.status}`);
      }
      
      const data: any[] = await response.json();
      return data.map(lang => lang.code);
    } catch (error) {
      console.error("LibreTranslate languages API error:", error);
      // Return common languages as fallback
      return ["en", "tr", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko", "ar"];
    }
  }

  getName(): string {
    return "LibreTranslate Provider";
  }
}
