export class MockTTSProvider {
    async speak(text, language) {
        // Mock TTS: log what would be spoken
        console.log(`[TTS] Speaking "${text}" in ${language}`);
        // In a real implementation, this would use SpeechSynthesis API or a TTS service
        return new Promise(resolve => setTimeout(resolve, 100)); // Simulate async delay
    }
    stop() {
        console.log('[TTS] Stopped');
        // In a real implementation, this would stop speech synthesis
    }
}
//# sourceMappingURL=mockTTSProvider.js.map