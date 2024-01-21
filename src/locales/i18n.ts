'use client'

import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import resourcesToBackend from 'i18next-resources-to-backend'
import { initReactI18next } from 'react-i18next'
import { z } from 'zod'

import { localStorageGetItem } from '@utils/storage-available'

import { defaultLang } from './config-lang'
import { makeZodI18nMap } from './zodMap'

const lng = localStorageGetItem('i18nextLng', defaultLang.value)

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .use(resourcesToBackend((language: string, namespace: string) => import(`./langs/${language}/${namespace}.json`)))
  .init({
    lng,
    fallbackLng: lng,
    debug: false,
    ns: ['common', 'zod', 'error'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  })
  .then((res) => {
    z.setErrorMap(makeZodI18nMap({ ns: 'zod', t: res }))
  })

export default i18n
