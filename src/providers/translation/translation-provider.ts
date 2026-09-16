// Translation provider interface
import type { TranslationRequest, TranslationResult } from '../../core/types';
import type { SupportedLanguage } from '../../core/types';

export interface TranslationProvider {
  translate(request: TranslationRequest): Promise<TranslationResult>;
  supportedLanguages(): SupportedLanguage[];
  getName(): string;
}
