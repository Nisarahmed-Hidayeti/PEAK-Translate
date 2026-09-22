import { TTSProvider } from "../../core/types";

export class TTSProviderImpl implements TTSProvider {
  private voices: SpeechSynthesisVoice[] = [];
  private voicesLoaded = false;

  private async loadVoices() {
    if (this.voicesLoaded) return;
    return new Promise<void>((resolve) => {
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          this.voices = window.speechSynthesis.getVoices();
          this.voicesLoaded = true;
          resolve();
        };
      } else {
        // Fallback if onvoiceschanged is not supported
        this.voices = window.speechSynthesis.getVoices();
        this.voicesLoaded = true;
        resolve();
      }
    });
  }

  async speak(text: string, language: string): Promise<void> {
    // Wait for voices to load
    await this.loadVoices();

    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Try to find a voice that matches the language
      const voice = this.voices.find(v => v.lang.startsWith(language));
      if (voice) {
        utterance.voice = voice;
      }
      
      utterance.onend = () => resolve();
      utterance.onerror = (event) => reject(new Error(`TTS error: ${event.error}`));
      
      window.speechSynthesis.speak(utterance);
    });
  }

  getName(): string {
    return "Web Speech API TTS Provider";
  }
}
