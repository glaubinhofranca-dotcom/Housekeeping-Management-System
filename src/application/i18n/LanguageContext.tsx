import { createContext, useContext, type ReactNode } from 'react'
import { translations, type TranslationKey } from './translations'
import type { Language } from '@/domain/types'

interface LanguageContextValue {
  language: Language
  t: (key: TranslationKey) => string
}

export const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  t: (key) => key,
})

interface LanguageProviderProps {
  language: Language
  children: ReactNode
}

export function LanguageProvider({ language, children }: LanguageProviderProps) {
  const t = (key: TranslationKey): string => translations[language][key] ?? key

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useTranslation() {
  return useContext(LanguageContext)
}
