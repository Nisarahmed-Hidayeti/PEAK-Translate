import { TranslationProvider, TranslationRequest, TranslationResult } from './translation-provider';
import { SupportedLanguage } from '../../core/types';
export declare class MockTranslationProvider implements TranslationProvider {
    private name;
    translate(request: TranslationRequest): Promise<TranslationResult>;
    supportedLanguages(): SupportedLanguage[];
    getName(): string;
}
//# sourceMappingURL=mock-translation-provider.d.ts.map