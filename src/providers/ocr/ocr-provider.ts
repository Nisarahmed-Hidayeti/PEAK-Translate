import { OCRProvider } from "../../core/types";
import { VocabularyStore } from "../../storage/vocabulary-store";

export class OCRProviderImpl implements OCRProvider {
  private worker: any = null;
  private Tesseract: any = null;

  private async getTesseract() {
    if (!this.Tesseract) {
      this.Tesseract = await import("tesseract.js");
    }
    return this.Tesseract;
  }

  private async getWorker() {
    if (!this.worker) {
      const Tesseract = await this.getTesseract();
      this.worker = await Tesseract.createWorker({
        logger: (m: any) => console.log(m)
      });
    }
    return this.worker;
  }

  async recognize(image: ImageBitmap | HTMLImageElement | HTMLVideoElement | HTMLCanvasElement | Blob, language?: string): Promise<string> {
    try {
      const workerInstance = await this.getWorker();
      
      // Get language from settings if not provided
      let lang = language;
      if (!lang) {
        const settings = await VocabularyStore.getInstance().getSettings();
        lang = settings.ocrLanguagePreference || "eng";
        // Convert our language codes to Tesseract language codes if needed
        const langMap: Record<string, string> = {
          "tr": "tur",
          "en": "eng",
          "es": "spa",
          "fr": "fra",
          "de": "deu"
        };
        lang = langMap[lang] || lang; // fallback to lang if not found
      }

      const { data } = await workerInstance.recognize(image, lang);
      return data.text.trim();
    } catch (error) {
      console.error("OCR error:", error);
      throw new Error(`OCR failed: ${error}`);
    }
  }

  getName(): string {
    return "Tesseract OCR Provider";
  }
}
