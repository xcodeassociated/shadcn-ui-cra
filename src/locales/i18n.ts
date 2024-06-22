import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import translationEnglish from './lang/en_US.json'
import translationPolish from './lang/pl_PL.json'

const resources = {
  en: {
    main: translationEnglish,
  },
  pl: {
    main: translationPolish,
  },
}

i18next.use(initReactI18next).init({
  resources,
  debug: false,
  lng: 'en',
  react: {
    bindI18n: 'loaded languageChanged',
    bindI18nStore: 'added',
    useSuspense: true,
  },
  interpolation: {
    escapeValue: false,
  },
})

export default i18next
