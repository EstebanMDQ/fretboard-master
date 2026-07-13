import { createContext, useState, type ReactNode } from 'react'
import type { Translations } from './types'
import { en } from './en'
import { es } from './es'

export type Locale = 'en' | 'es'

function detectLocale(): Locale {
  const stored = localStorage.getItem('locale')
  if (stored === 'en' || stored === 'es') return stored
  const langs = navigator.languages ?? [navigator.language]
  for (const lang of langs) {
    if (lang.startsWith('es')) return 'es'
  }
  return 'en'
}

function localeToTranslations(locale: Locale): Translations {
  return locale === 'es' ? es : en
}

export const I18nContext = createContext<Translations>(en)
export const SetLocaleContext = createContext<(locale: Locale) => void>(() => {})

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  function setLocale(next: Locale) {
    localStorage.setItem('locale', next)
    setLocaleState(next)
  }

  return (
    <SetLocaleContext.Provider value={setLocale}>
      <I18nContext.Provider value={localeToTranslations(locale)}>
        {children}
      </I18nContext.Provider>
    </SetLocaleContext.Provider>
  )
}
