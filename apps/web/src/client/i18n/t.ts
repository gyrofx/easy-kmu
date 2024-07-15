import { de } from '@/client/i18n/de'
import { en } from '@/client/i18n/en'

const locale: Locale = 'de'

export function t(): I18n {
  return locale === 'de' ? de : en
}

export type I18n = typeof de
export type Locale = 'de' | 'en'
