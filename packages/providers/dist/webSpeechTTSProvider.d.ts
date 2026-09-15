import { TTSProvider, LanguageCode } from '@peak-translation/core';
export declare class WebSpeechTTSProvider implements TTSProvider {
    private synth;
    private voices;
    private utterance;
    constructor();
    private loadVoices;
    private getVoiceForLanguage;
    speak(text: string, language: LanguageCode): Promise<void>;
    stop(): void;
}
//# sourceMappingURL=webSpeechTTSProvider.d.ts.map