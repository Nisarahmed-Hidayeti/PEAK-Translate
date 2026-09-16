export const SUPPORTED_LANGUAGES = ['tr', 'en', 'es', 'fr', 'de'];
export const LANGUAGE_INFO = {
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
export function getLanguageInfo(code) {
    return LANGUAGE_INFO[code];
}
export function isSupportedLanguage(code) {
    return SUPPORTED_LANGUAGES.includes(code);
}
//# sourceMappingURL=languages.js.map