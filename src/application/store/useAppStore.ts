import { create } from 'zustand'
import type { Staff, Language } from '@/domain/types'
import { persist, retrieve } from '@/infrastructure/persistence'

interface AppState {
  currentUser: Staff | null
  language: Language
  login: (user: Staff) => void
  logout: () => void
  setLanguage: (lang: Language) => void
}

const savedUser = retrieve<Staff>('current_user')
const savedLang = retrieve<Language>('language')

export const useAppStore = create<AppState>((set) => ({
  currentUser: savedUser,
  language: savedLang ?? 'en',

  login: (user) => {
    persist('current_user', user)
    set({ currentUser: user })
  },

  logout: () => {
    persist('current_user', null)
    set({ currentUser: null })
  },

  setLanguage: (language) => {
    persist('language', language)
    set({ language })
  },
}))
