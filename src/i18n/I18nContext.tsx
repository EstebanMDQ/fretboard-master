import { useState, type ReactNode } from 'react'
import { en } from './en'
import { es } from './es'
import { I18nContext, SetLocaleContext, type Locale } from './contexts'

function detectLocale(): Locale {
  const stored = localStorage.getItem('locale')
  if (stored === 'en' || stored === 'es') return stored
  const langs = navigator.languages ?? [navigator.language]
  for (const lang of langs) {
    if (lang.startsWith('es')) return 'es'
  }
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  function setLocale(next: Locale) {
    localStorage.setItem('locale', next)
    setLocaleState(next)
  }

  return (
    <SetLocaleContext.Provider value={setLocale}>
      <I18nContext.Provider value={locale === 'es' ? es : en}>
        {children}
      </I18nContext.Provider>
    </SetLocaleContext.Provider>
  )
}
