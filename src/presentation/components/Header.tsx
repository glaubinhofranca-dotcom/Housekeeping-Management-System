import { LogOut } from 'lucide-react'
import { useAppStore } from '@/application/store/useAppStore'
import { useTranslation } from '@/application/i18n/LanguageContext'
import { Button } from './ui/Button'
import type { Language } from '@/domain/types'

const LANGUAGES: Language[] = ['en', 'pt', 'es']

function LanguagePicker() {
  const { setLanguage } = useAppStore()
  const { language } = useTranslation()

  return (
    <div className="flex items-center gap-0.5 bg-white/10 rounded-lg p-0.5">
      {LANGUAGES.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-2.5 py-1 rounded-md text-xs font-bold transition-all uppercase tracking-wide
            ${language === lang
              ? 'bg-white text-[#1e3a5f] shadow-sm'
              : 'text-white/60 hover:text-white'
            }`}
        >
          {lang}
        </button>
      ))}
    </div>
  )
}

export function Header() {
  const { currentUser, logout } = useAppStore()
  const { t } = useTranslation()

  return (
    <header className="sticky top-0 z-30 bg-[#1e3a5f] shadow-lg">
      <div className="flex items-center justify-between px-4 md:px-6 h-14">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#c9a84c]/20">
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-[#c9a84c]" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path strokeLinecap="round" d="M3 21V10a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v11" />
              <path strokeLinecap="round" d="M1 21h22" />
              <rect x="9" y="14" width="6" height="7" rx="1" />
              <path strokeLinecap="round" d="M9 10V8a3 3 0 0 1 6 0v2" />
            </svg>
          </div>
          <div>
            <h1 className="text-white font-semibold text-base leading-tight">
              {t('app.title')}
            </h1>
            <p className="text-[#c9a84c] text-xs hidden sm:block">{t('app.tagline')}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser && (
            <span className="hidden md:flex items-center gap-2 text-white/80 text-sm mr-1">
              <span className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white">
                {currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
              </span>
              <span>{currentUser.name}</span>
            </span>
          )}

          <LanguagePicker />

          <Button
            size="sm"
            variant="ghost"
            onClick={logout}
            className="text-white hover:bg-white/10 border-white/20"
            icon={
              <LogOut size={14} />
            }
          >
            <span className="hidden sm:inline">{t('nav.logout')}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
