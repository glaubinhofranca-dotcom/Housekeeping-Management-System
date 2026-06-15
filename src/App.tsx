import { useEffect, useState } from 'react'
import { useAuthStore } from '@/application/store/useAuthStore'
import { useRoomStore } from '@/application/store/useRoomStore'
import { useAppStore } from '@/application/store/useAppStore'
import { LanguageProvider } from '@/application/i18n/LanguageContext'
import { LoginPage } from '@/presentation/pages/LoginPage'
import { SupervisorDashboard } from '@/presentation/pages/SupervisorDashboard'
import { HousekeeperPage } from '@/presentation/pages/HousekeeperPage'
import { AdminPage } from '@/presentation/pages/AdminPage'

export default function App() {
  const { language } = useAppStore()
  const { profile, authLoading, init: authInit } = useAuthStore()
  const { initialized, error, init: roomInit } = useRoomStore()
  const [adminMode, setAdminMode] = useState(false)

  useEffect(() => {
    authInit().then(() => {
      if (useAuthStore.getState().profile) {
        roomInit()
      }
    })
  }, [authInit, roomInit])

  // Auth loading spinner (checking session)
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#1e3a5f] flex flex-col items-center justify-center gap-6">
        <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10">
          <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
            <path d="M6 44V24a2 2 0 0 1 2-2h32a2 2 0 0 1 2 2v20" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M2 44h44" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round"/>
            <rect x="18" y="30" width="12" height="14" rx="2" fill="#c9a84c" opacity="0.5"/>
            <path d="M18 30V26a6 6 0 0 1 12 0v4" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce [animation-delay:-0.3s]" />
          <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce [animation-delay:-0.15s]" />
          <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce" />
        </div>
      </div>
    )
  }

  // Not authenticated → show login
  if (!profile) {
    return (
      <LanguageProvider language={language}>
        <LoginPage />
      </LanguageProvider>
    )
  }

  // Admin panel (admin only)
  if (adminMode && profile.role === 'admin') {
    return (
      <LanguageProvider language={language}>
        <AdminPage onBack={() => setAdminMode(false)} />
      </LanguageProvider>
    )
  }

  // Room data still loading
  if (!initialized) {
    return (
      <div className="min-h-screen bg-[#1e3a5f] flex flex-col items-center justify-center gap-6">
        {error ? (
          <div className="text-center space-y-3 px-6">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mx-auto">
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
              </svg>
            </div>
            <p className="text-white font-semibold">Connection error</p>
            <p className="text-white/50 text-sm max-w-xs">{error}</p>
            <button
              onClick={() => useRoomStore.setState({ initialized: false, error: null })}
              className="mt-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10">
              <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
                <path d="M6 44V24a2 2 0 0 1 2-2h32a2 2 0 0 1 2 2v20" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M2 44h44" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round"/>
                <rect x="18" y="30" width="12" height="14" rx="2" fill="#c9a84c" opacity="0.5"/>
                <path d="M18 30V26a6 6 0 0 1 12 0v4" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce [animation-delay:-0.3s]" />
              <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce [animation-delay:-0.15s]" />
              <span className="w-2 h-2 rounded-full bg-[#c9a84c] animate-bounce" />
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <LanguageProvider language={language}>
      {profile.role === 'housekeeper' ? (
        <HousekeeperPage />
      ) : (
        <SupervisorDashboard onAdminClick={profile.role === 'admin' ? () => setAdminMode(true) : undefined} />
      )}
    </LanguageProvider>
  )
}
