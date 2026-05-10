import { createI18n } from 'vue-i18n'
import en from './locale/en.json'
import es from './locale/es.json'
import fr from './locale/fr.json'
import zh from './locale/zh.json'

const messages = { en, es, fr, zh }
const SUPPORTED_LANGS = Object.keys(messages)
const STORAGE_KEY = 'nx-locale'

/**
 * Gets the initial locale.
 * Priority: 1. localStorage, 2. Browser language, 3. Default ('en')
 */
function getInitialLocale(): string {
  // 1. Check localStorage
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved

  // 2. Check Browser Language
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.split('-')[0]
    if (SUPPORTED_LANGS.includes(browserLang)) return browserLang
  }

  // 3. Fallback
  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: 'en',
  messages
})

// Persistence Helper
export function setLocale(newLocale: string) {
  if (SUPPORTED_LANGS.includes(newLocale)) {
    i18n.global.locale.value = newLocale as any
    localStorage.setItem(STORAGE_KEY, newLocale)
  }
}
