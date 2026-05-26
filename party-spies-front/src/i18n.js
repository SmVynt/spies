import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Importing translations
import en from './locales/en.json';
import ru from './locales/ru.json';
import de from './locales/de.json';
import es from './locales/es.json';

i18n
    .use(LanguageDetector) // using Browser language
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            ru: { translation: ru },
            de: { translation: de },
            es: { translation: es },
        },
        fallbackLng: 'en', // Standard langiage
        interpolation: { escapeValue: false },
    });

export default i18n;
