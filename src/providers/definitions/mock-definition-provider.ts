import { DefinitionProvider, DefinitionResult } from "../../core/types";

export class MockDefinitionProvider implements DefinitionProvider {
  async getDefinitions(word: string, language: string): Promise<DefinitionResult> {
    // Return mock definitions based on language
    const definitionsMap: Record<string, Record<string, string[]>> = {
      "en": {
        "hello": ["a greeting", "an expression of goodwill"],
        "world": ["the earth", "human society"],
        "test": ["a procedure to determine quality", "a set of questions"]
      },
      "tr": {
        "merhaba": ["bir selamlama", "iyi duygu ifadesi"],
        "dünya": ["yer", "insan toplumu"],
        "test": ["kaliteyi belirleyen prosedür", "bir soru seti"]
      },
      "es": {
        "hola": ["un saludo", "una expresión de buena voluntad"],
        "mundo": ["la tierra", "la sociedad humana"],
        "prueba": ["un procedimiento para determinar calidad", "un conjunto de preguntas"]
      },
      "fr": {
        "bonjour": ["un salut", "une expression de bonne volonté"],
        "monde": ["la terre", "la société humaine"],
        "test": ["une procédure pour déterminer la qualité", "un ensemble de questions"]
      },
      "de": {
        "hallo": ["eine Begrüßung", "ein Ausdruck von Wohlwollen"],
        "welt": ["die Erde", "die menschliche Gesellschaft"],
        "test": ["ein Verfahren zur Bestimmung der Qualität", "ein Frage-Set"]
      }
    };

    const langMap = word.toLowerCase();
    const definitions = definitionsMap[language]?.[langMap] || [
      `Definition for "${word}" in ${language}`,
      `Another definition for "${word}"`
    ];

    return {
      word,
      definitions,
      partOfSpeech: "unknown",
      source: "Mock Definition Provider"
    };
  }

  async getSupportedLanguages(): Promise<string[]> {
    return ["en", "tr", "es", "fr", "de"];
  }

  getName(): string {
    return "Mock Definition Provider";
  }
}
