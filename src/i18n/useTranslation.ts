import { useContext } from 'react'
import { I18nContext, SetLocaleContext } from './I18nContext'
import type { Translations } from './types'
import type { Locale } from './I18nContext'

export function useTranslation(): Translations {
  return useContext(I18nContext)
}

export function useSetLocale(): (locale: Locale) => void {
  return useContext(SetLocaleContext)
}
