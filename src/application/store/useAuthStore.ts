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

async function fetchProfile(
  userId: string,
  userEmail?: string,
  userMeta?: Record<string, any>,
): Promise<AuthProfile | null> {
  // 1. Try finding by ID
  const { data: byId } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle()
  if (byId) {
    return { id: byId.id, name: byId.name, role: byId.role as UserRole, email: byId.email }
  }

  // 2. Fallback: try finding by Email if ID mismatched
  if (userEmail) {
    const { data: byEmail } = await supabase.from('profiles').select('*').eq('email', userEmail).maybeSingle()
    if (byEmail) {
      // Auto-repair the profile ID to match auth.users ID
      await supabase.from('profiles').update({ id: userId }).eq('email', userEmail)
      return { id: userId, name: byEmail.name, role: byEmail.role as UserRole, email: userEmail }
    }
  }

  // 3. Fallback: Auto-create profile from Auth Metadata if missing
  if (userEmail) {
    const name = userMeta?.name || userEmail.split('@')[0]
    const role = (userMeta?.role as UserRole) || 'housekeeper'
    const { data: created } = await supabase
      .from('profiles')
      .upsert({ id: userId, name, role, email: userEmail })
      .select('*')
      .maybeSingle()

    if (created) {
      return { id: created.id, name: created.name, role: created.role as UserRole, email: created.email }
    }
  }

  return null
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
        const profile = await fetchProfile(
          session.user.id,
          session.user.email,
          session.user.user_metadata,
        )
        if (profile) {
          set({ profile, authLoading: false })
        } else {
          await supabase.auth.signOut()
          set({ profile: null, authLoading: false, authError: null })
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
      const cleanEmail = email.trim().toLowerCase()
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password })
      if (error) { set({ authError: error.message }); return }
      if (!data.session?.user) { set({ authError: 'Login failed.' }); return }
      const profile = await fetchProfile(
        data.session.user.id,
        data.session.user.email,
        data.session.user.user_metadata,
      )
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
    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      throw new Error('Password must be at least 8 characters long and contain both letters and numbers.')
    }
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    const { data, error } = await adminClient.auth.signUp({
      email: cleanEmail,
      password,
      options: { data: { name: cleanName, role } },
    })
    if (error) throw error
    if (!data.user) throw new Error('User creation failed.')
    // Insert profile immediately (trigger is a backup)
    await supabase.from('profiles').upsert({ id: data.user.id, name: cleanName, role, email: cleanEmail })
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
