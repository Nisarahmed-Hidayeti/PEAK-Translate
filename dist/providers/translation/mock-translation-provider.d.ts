import type { TranslationProvider, TranslationRequest, TranslationResult } from './translation-provider';
import type { SupportedLanguage } from '../../core/types';
export declare class MockTranslationProvider implements TranslationProvider {
    private name;
    translate(request: TranslationRequest): Promise<TranslationResult>;
    supportedLanguages(): SupportedLanguage[];
    getName(): string;
}
//# sourceMappingURL=mock-translation-provider.d.ts.map