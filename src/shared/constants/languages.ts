// Language constants for Peak Translation

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = ['tr', 'en', 'es', 'fr', 'de'];

export const LANGUAGE_INFO: Record<SupportedLanguage, LanguageInfo> = {
  tr: {
    code: 'tr',
    name: 'Turkish',
    nativeName: 'Türkçe',
    ttsCode: 'tr'
  },
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    ttsCode: 'en'
  },
  es: {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    ttsCode: 'es'
  },
  fr: {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    ttsCode: 'fr'
  },
  de: {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    ttsCode: 'de'
  }
};

export function getLanguageInfo(code: SupportedLanguage): LanguageInfo {
  return LANGUAGE_INFO[code];
}

export function isSupportedLanguage(code: string): code is SupportedLanguage {
  return SUPPORTED_LANGUAGES.includes(code as SupportedLanguage);
}
