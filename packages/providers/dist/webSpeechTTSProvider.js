export class WebSpeechTTSProvider {
    constructor() {
        this.synth = null;
        this.voices = [];
        this.utterance = null;
        // Check if speech synthesis is available
        if (typeof window !== 'undefined' && ('speechSynthesis' in window)) {
            this.synth = window.speechSynthesis;
            this.loadVoices();
        }
    }
    loadVoices() {
        if (!this.synth)
            return;
        // Load voices when they change
        this.voices = this.synth.getVoices();
        // Some browsers load voices asynchronously
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = () => {
                if (this.synth) {
                    this.voices = this.synth.getVoices();
                }
            };
        }
    }
    getVoiceForLanguage(language) {
        if (!this.voices.length) {
            this.loadVoices();
        }
        // Try to find a voice matching the language
        const langCode = language === 'tr' ? 'tr-TR' :
            language === 'en' ? 'en-US' :
                language === 'es' ? 'es-ES' :
                    language === 'fr' ? 'fr-FR' :
                        language === 'de' ? 'de-DE' : language;
        return this.voices.find(voice => voice.lang.startsWith(langCode) ||
            voice.lang === langCode);
    }
    async speak(text, language) {
        return new Promise((resolve, reject) => {
            if (!this.synth) {
                reject(new Error('Speech synthesis not available in this browser'));
                return;
            }
            // Cancel any ongoing speech
            this.synth.cancel();
            // Create utterance
            this.utterance = new SpeechSynthesisUtterance(text);
            this.utterance.lang = language === 'tr' ? 'tr-TR' :
                language === 'en' ? 'en-US' :
                    language === 'es' ? 'es-ES' :
                        language === 'fr' ? 'fr-FR' :
                            language === 'de' ? 'de-DE' : language;
            // Try to get a voice for this language
            const voice = this.getVoiceForLanguage(language);
            if (voice) {
                this.utterance.voice = voice;
            }
            // Set reasonable defaults
            this.utterance.rate = 1.0; // Normal speed
            this.utterance.pitch = 1.0; // Normal pitch
            this.utterance.volume = 0.8; // Slightly quieter than max
            // Handle events
            if (this.utterance) {
                this.utterance.onend = () => {
                    resolve();
                };
                this.utterance.onerror = (event) => {
                    reject(new Error(`Speech synthesis error: ${event.error}`));
                };
            }
            // Speak
            try {
                this.synth.speak(this.utterance);
            }
            catch (error) {
                reject(error);
            }
        });
    }
    stop() {
        if (this.synth) {
            this.synth.cancel();
        }
        this.utterance = null;
    }
}
//# sourceMappingURL=webSpeechTTSProvider.js.map