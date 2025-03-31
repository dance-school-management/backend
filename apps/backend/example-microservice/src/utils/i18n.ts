import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import middleware from 'i18next-http-middleware';
import { InitOptions } from 'i18next';

const i18nConfig: InitOptions = {
    fallbackLng: 'en',
    supportedLngs: ['en', 'pl'],
    backend: {
      loadPath: './locales/{{lng}}/translation.json',
    },
    detection: {
      order: ['header'],
      lookupHeader: 'accept-language',
    },
  };
  
i18next
.use(Backend)
.use(middleware.LanguageDetector)
.init(i18nConfig)


export default i18next;
export const i18nMiddleware = middleware;