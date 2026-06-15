import { create } from 'zustand'
import type { Language } from '@/domain/types'
import { persist, retrieve } from '@/infrastructure/persistence'

interface AppState {
  language: Language
  setLanguage: (lang: Language) => void
}

const savedLang = retrieve<Language>('language')

export const useAppStore = create<AppState>((set) => ({
  language: savedLang ?? 'en',
  setLanguage: (language) => {
    persist('language', language)
    set({ language })
  },
}))
