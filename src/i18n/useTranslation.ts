import { useContext } from 'react'
import { I18nContext, SetLocaleContext, type Locale } from './contexts'
import type { Translations } from './types'

export function useTranslation(): Translations {
  return useContext(I18nContext)
}

export function useSetLocale(): (locale: Locale) => void {
  return useContext(SetLocaleContext)
}
