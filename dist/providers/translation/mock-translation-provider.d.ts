import { TranslationProvider, TranslationRequest, TranslationResult } from "./translation-provider";
export declare class MockTranslationProvider implements TranslationProvider {
    private mockTranslations;
    translate(request: TranslationRequest): Promise<TranslationResult>;
    getSupportedLanguages(): Promise<string[]>;
    getName(): string;
}
//# sourceMappingURL=mock-translation-provider.d.ts.map