import { create } from 'zustand'
import { supabase, adminClient } from '@/infrastructure/supabase'
import type { UserRole } from '@/domain/types'

export interface AuthProfile {
  id: string
  name: string
  role: UserRole
  email: string
}

interface AuthStore {
  profile: AuthProfile | null
  allProfiles: AuthProfile[]
  authLoading: boolean
  authError: string | null

  init: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  createUser: (name: string, email: string, password: string, role: UserRole) => Promise<void>
  updateProfile: (id: string, updates: Partial<Pick<AuthProfile, 'name' | 'role'>>) => Promise<void>
  deleteUser: (id: string) => Promise<void>
  loadAllProfiles: () => Promise<void>
}

async function fetchProfile(userId: string): Promise<AuthProfile | null> {
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (!data) return null
  return { id: data.id, name: data.name, role: data.role as UserRole, email: data.email }
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  profile: null,
  allProfiles: [],
  authLoading: true,
  authError: null,

  init: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        if (profile) {
          set({ profile, authLoading: false })
        } else {
          await supabase.auth.signOut()
          set({ profile: null, authLoading: false })
        }
      } else {
        set({ profile: null, authLoading: false })
      }
    } catch {
      set({ profile: null, authLoading: false })
    }
  },

  login: async (email, password) => {
    set({ authError: null })
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) { set({ authError: error.message }); return }
      if (!data.session?.user) { set({ authError: 'Login failed.' }); return }
      const profile = await fetchProfile(data.session.user.id)
      if (!profile) {
        await supabase.auth.signOut()
        set({ authError: 'Account not found. Contact your administrator.' })
        return
      }
      set({ profile, authError: null })
    } catch (e) {
      set({ authError: e instanceof Error ? e.message : 'Login failed.' })
    }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ profile: null })
  },

  createUser: async (name, email, password, role) => {
    const { data, error } = await adminClient.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    })
    if (error) throw error
    if (!data.user) throw new Error('User creation failed.')
    // Insert profile immediately (trigger is a backup)
    await supabase.from('profiles').upsert({ id: data.user.id, name, role, email })
    await get().loadAllProfiles()
  },

  updateProfile: async (id, updates) => {
    const { error } = await supabase.from('profiles').update(updates).eq('id', id)
    if (error) throw error
    set((state) => ({
      allProfiles: state.allProfiles.map((p) => (p.id === id ? { ...p, ...updates } : p)),
      profile: state.profile?.id === id ? { ...state.profile, ...updates } : state.profile,
    }))
  },

  deleteUser: async (id) => {
    const now = new Date().toISOString()
    await supabase.from('rooms').update({ assigned_to: null, last_updated: now }).eq('assigned_to', id)
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) throw error
    set((state) => ({ allProfiles: state.allProfiles.filter((p) => p.id !== id) }))
  },

  loadAllProfiles: async () => {
    const { data, error } = await supabase.from('profiles').select('*').order('name')
    if (error) throw error
    set({
      allProfiles: (data ?? []).map((p) => ({
        id: p.id,
        name: p.name,
        role: p.role as UserRole,
        email: p.email,
      })),
    })
  },
}))
