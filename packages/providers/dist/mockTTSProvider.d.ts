import { TTSProvider, LanguageCode } from '@peak-translation/core';
export declare class MockTTSProvider implements TTSProvider {
    speak(text: string, language: LanguageCode): Promise<void>;
    stop(): void;
}
//# sourceMappingURL=mockTTSProvider.d.ts.map