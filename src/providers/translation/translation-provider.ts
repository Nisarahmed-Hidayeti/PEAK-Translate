// Translation provider interface

import { TranslationRequest, TranslationResult } from '../../core/types';

export interface TranslationProvider {
  translate(request: TranslationRequest): Promise<TranslationResult>;
  supportedLanguages(): SupportedLanguage[];
  getName(): string;
}
