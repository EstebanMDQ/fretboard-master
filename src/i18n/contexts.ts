import { createContext } from 'react'
import type { Translations } from './types'
import { en } from './en'

export type Locale = 'en' | 'es'

export const I18nContext = createContext<Translations>(en)
export const SetLocaleContext = createContext<(locale: Locale) => void>(() => {})
