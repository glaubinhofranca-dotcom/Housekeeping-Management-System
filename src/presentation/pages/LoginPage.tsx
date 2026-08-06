import { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { useAppStore } from '@/application/store/useAppStore'
import { useAuthStore } from '@/application/store/useAuthStore'
import { supabase } from '@/infrastructure/supabase'
import { useTranslation } from '@/application/i18n/LanguageContext'
import type { Language } from '@/domain/types'

const LANGUAGES: { code: Language; native: string }[] = [
  { code: 'en', native: 'EN' },
  { code: 'pt', native: 'PT' },
  { code: 'es', native: 'ES' },
]

type Mode = 'checking' | 'first-run' | 'login'

export function LoginPage() {
  const { setLanguage } = useAppStore()
  const { login, authError } = useAuthStore()
  const { t, language } = useTranslation()

  const [mode, setMode] = useState<Mode>('checking')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check whether any admin account exists
  useEffect(() => {
    async function check() {
      const { count, error } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      if (error) {
        // Table might not exist yet
        setError('Database not configured. Please run the setup SQL in Supabase first.')
        setMode('login')
        return
      }

      setMode(count === 0 ? 'first-run' : 'login')
    }
    check()
  }, [])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    await login(email, password)
    setLoading(false)
  }

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault()
    const cleanName = name.trim()
    const cleanEmail = email.trim().toLowerCase()
    if (!cleanName || !cleanEmail || !password.trim()) return

    if (password.length < 8 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must be at least 8 characters long and contain both letters and numbers.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      let userId: string

      // Try signing in first — handles the case where the auth user was already created
      // but the profile record is missing (e.g., previous attempt failed partway through)
      const { data: signInFirst } = await supabase.auth.signInWithPassword({ email, password })

      if (signInFirst.session?.user) {
        userId = signInFirst.session.user.id
      } else {
        // Auth user doesn't exist yet — create it
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name: name.trim(), role: 'admin' } },
        })
        if (signUpErr) {
          const msg = signUpErr.message.toLowerCase()
          throw new Error(
            msg.includes('registered')
              ? 'An account with this email already exists. Use the same password you created it with.'
              : signUpErr.message,
          )
        }
        if (!signUpData.user) throw new Error('Account creation failed.')
        userId = signUpData.user.id

        // If signUp didn't auto-create a session, sign in now
        if (!signUpData.session) {
          const { data: signInAfter, error: signInAfterErr } = await supabase.auth.signInWithPassword({ email, password })
          if (signInAfterErr) {
            const msg = signInAfterErr.message.toLowerCase()
            throw new Error(
              msg.includes('confirm')
                ? 'Disable "Email Confirmations" in Supabase → Authentication → Settings, then try again.'
                : signInAfterErr.message,
            )
          }
          if (!signInAfter.session) throw new Error('Login failed after account creation.')
        }
      }

      // Create (or repair) the admin profile row
      const { error: profileErr } = await supabase.from('profiles').upsert({
        id: userId,
        name: name.trim(),
        role: 'admin',
        email,
      })
      if (profileErr) {
        throw new Error(
          `Profile setup failed: ${profileErr.message}. ` +
          `Make sure you ran the Supabase SQL migration including the RLS policy.`,
        )
      }

      // Set profile directly so we bypass the sign-out race condition in init()
      useAuthStore.setState({
        profile: { id: userId, name: name.trim(), role: 'admin', email },
        authLoading: false,
        authError: null,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account.')
    }
    setLoading(false)
  }

  const displayError = error ?? authError

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#16304f] flex flex-col">
      {/* Language picker */}
      <div className="flex justify-end p-4">
        <div className="flex items-center gap-0.5 bg-white/10 rounded-lg p-0.5">
          {LANGUAGES.map(({ code, native }) => (
            <button
              key={code}
              onClick={() => setLanguage(code)}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all uppercase tracking-wide
                ${language === code
                  ? 'bg-white text-[#1e3a5f] shadow-sm'
                  : 'text-white/60 hover:text-white'
                }`}
            >
              {native}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 mb-5">
              <svg viewBox="0 0 48 48" className="w-12 h-12" fill="none">
                <rect x="4" y="20" width="40" height="24" rx="2" fill="#c9a84c" opacity="0.2"/>
                <path d="M6 44V24a2 2 0 0 1 2-2h32a2 2 0 0 1 2 2v20" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M2 44h44" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round"/>
                <rect x="18" y="30" width="12" height="14" rx="2" fill="#c9a84c" opacity="0.5"/>
                <path d="M18 30V26a6 6 0 0 1 12 0v4" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="24" cy="36" r="2" fill="#c9a84c"/>
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">{t('login.title')}</h1>
            <p className="text-[#c9a84c] mt-2 text-sm">{t('login.subtitle')}</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {mode === 'checking' ? (
              <div className="p-8 flex justify-center">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1e3a5f] animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-2 h-2 rounded-full bg-[#1e3a5f] animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-2 h-2 rounded-full bg-[#1e3a5f] animate-bounce" />
                </div>
              </div>
            ) : mode === 'first-run' ? (
              <form onSubmit={handleCreateAdmin} className="p-8 space-y-5">
                <div>
                  <p className="text-base font-semibold text-slate-800">{t('login.createAdmin')}</p>
                  <p className="text-sm text-slate-500 mt-1">{t('login.firstRun')}</p>
                </div>

                {displayError && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{displayError}</p>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{t('admin.name')}</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="Glauber Rocha"
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white
                        focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20
                        text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{t('login.email')}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="glauber@hotel.com"
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white
                        focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20
                        text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{t('login.password')}</label>
                    <div className="relative">
                      <input
                        type={showPwd ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                        className="w-full px-3 py-2.5 pr-10 text-sm rounded-xl border border-slate-300 bg-white
                          focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20
                          text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#1e3a5f] hover:bg-[#16304f] disabled:bg-slate-300
                    text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  {loading ? t('login.creating') : t('login.createAdmin')}
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="p-8 space-y-5">
                <p className="text-base font-semibold text-slate-800">{t('login.signIn')}</p>

                {displayError && (
                  <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{displayError}</p>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{t('login.email')}</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-300 bg-white
                        focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20
                        text-slate-800 placeholder:text-slate-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">{t('login.password')}</label>
                    <div className="relative">
                      <input
                        type={showPwd ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete="current-password"
                        className="w-full px-3 py-2.5 pr-10 text-sm rounded-xl border border-slate-300 bg-white
                          focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20
                          text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#1e3a5f] hover:bg-[#16304f] disabled:bg-slate-300
                    text-white font-semibold rounded-xl text-sm transition-colors"
                >
                  {loading ? t('login.signingIn') : t('login.signIn')}
                </button>
              </form>
            )}
          </div>

          <p className="text-center text-white/30 text-xs mt-8">
            © {new Date().getFullYear()} HouseKeeper Pro
          </p>
        </div>
      </div>
    </div>
  )
}

