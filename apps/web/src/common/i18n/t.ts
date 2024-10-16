import { de } from '@/common/i18n/de'
import { en } from '@/common/i18n/en'

const locale: Locale = 'de'

export function t(): I18n {
  return locale === 'de' ? de : en
}

export type I18n = typeof de
export type Locale = 'de' | 'en'
