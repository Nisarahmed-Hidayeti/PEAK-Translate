import { ExampleProvider, ExampleResult } from "../../core/types";

export class MockExampleProvider implements ExampleProvider {
  async getExamples(word: string, language: string): Promise<ExampleResult> {
    // Return mock examples based on language
    const examplesMap: Record<string, Record<string, string[]>> = {
      "en": {
        "hello": ["Hello, how are you?", "Say hello to your new neighbor."],
        "world": ["She traveled around the world.", "Think globally, act locally."],
        "test": ["We will test the new software tomorrow.", "This is just a test."]
      },
      "tr": {
        "merhaba": ["Merhaba, nasılsın?", "Yeni komşunu selamla."],
        "dünya": ["Dünya gezisi yaptırdı.", "Düşünya düşün, yerel olarak hareket et."],
        "test": ["Yarın yeni yazılımı test edeceğiz.", "Bu sadece bir test."]
      },
      "es": {
        "hola": ["Hola, ¿cómo estás?", "Di hola a tu nuevo vecino."],
        "mundo": ["Ella viajará alrededor del mundo.", "Piensa globalmente, actúa localmente."],
        "prueba": ["Mañana probaremos el nuevo software.", "Esto es solo una prueba."]
      },
      "fr": {
        "bonjour": ["Bonjour, comment ça va ?", "Dis bonjour à ton nouveau voisin."],
        "monde": ["Elle a voyagé autour du monde.", "Pense globalement, agis localement."],
        "test": ["Nous testerons le nouveau logiciel demain.", "C'est juste un test."]
      },
      "de": {
        "hallo": ["Hallo, wie geht's?", "Sage hallo zu deinem neuen Nachbarn."],
        "welt": ["Sie reiste um die Welt.", "Denke global, handle lokal."],
        "test": ["Wir testen morgen die neue Software.", "Dies ist nur ein Test."]
      }
    };

    const langMap = word.toLowerCase();
    const examples = examplesMap[language]?.[langMap] || [
      `Example sentence for "${word}" in ${language}.`,
      `Another example with "${word}".`
    ];

    return {
      word,
      examples,
      source: "Mock Example Provider"
    };
  }

  async getSupportedLanguages(): Promise<string[]> {
    return ["en", "tr", "es", "fr", "de"];
  }

  getName(): string {
    return "Mock Example Provider";
  }
}
