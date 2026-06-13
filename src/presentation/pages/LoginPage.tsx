import { useState } from 'react'
import { UserCog, Sparkles, Globe, ChevronLeft } from 'lucide-react'
import { useAppStore } from '@/application/store/useAppStore'
import { useRoomStore } from '@/application/store/useRoomStore'
import { useTranslation } from '@/application/i18n/LanguageContext'
import type { Staff, UserRole } from '@/domain/types'

type Step = 'role' | 'person'

export function LoginPage() {
  const { login, setLanguage } = useAppStore()
  const { staff } = useRoomStore()
  const { t, language } = useTranslation()

  const [step, setStep] = useState<Step>('role')
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)

  function selectRole(role: UserRole) {
    setSelectedRole(role)
    setStep('person')
  }

  const filteredStaff: Staff[] = selectedRole
    ? staff.filter((s) => s.role === selectedRole)
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1e3a5f] via-[#1e3a5f] to-[#16304f] flex flex-col">
      {/* Language toggle */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setLanguage(language === 'en' ? 'pt' : 'en')}
          className="flex items-center gap-2 text-white/70 hover:text-white text-sm font-medium transition-colors px-3 py-1.5 rounded-lg hover:bg-white/10"
        >
          <Globe size={14} />
          {language === 'en' ? 'PT' : 'EN'}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
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
            {step === 'role' ? (
              <div className="p-8">
                <p className="text-center text-slate-500 text-sm mb-6">{t('login.selectRole')}</p>

                <div className="space-y-3">
                  <RoleButton
                    icon={
                      <UserCog size={28} className="text-[#1e3a5f]" />
                    }
                    title={t('login.supervisor')}
                    description={t('login.supervisorDesc')}
                    onClick={() => selectRole('supervisor')}
                    accent="border-[#1e3a5f]"
                    bg="hover:bg-[#1e3a5f]/5"
                  />
                  <RoleButton
                    icon={
                      <Sparkles size={28} className="text-[#c9a84c]" />
                    }
                    title={t('login.housekeeper')}
                    description={t('login.housekeeperDesc')}
                    onClick={() => selectRole('housekeeper')}
                    accent="border-[#c9a84c]"
                    bg="hover:bg-amber-50"
                  />
                </div>
              </div>
            ) : (
              <div className="p-8">
                <button
                  onClick={() => setStep('role')}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 text-sm mb-5 transition-colors"
                >
                  <ChevronLeft size={16} />
                  {t('login.back')}
                </button>

                <p className="text-slate-600 font-medium mb-4">{t('login.selectPerson')}</p>

                <div className="space-y-2">
                  {filteredStaff.map((person) => (
                    <button
                      key={person.id}
                      onClick={() => login(person)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl border border-slate-200
                        hover:border-[#1e3a5f] hover:bg-[#1e3a5f]/5 transition-all text-left group"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-[#1e3a5f]/10
                        flex items-center justify-center text-sm font-bold text-slate-600 group-hover:text-[#1e3a5f] flex-shrink-0">
                        {person.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{person.name}</p>
                        <p className="text-xs text-slate-400 capitalize">{person.role}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
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

interface RoleButtonProps {
  icon: React.ReactNode
  title: string
  description: string
  onClick: () => void
  accent: string
  bg: string
}

function RoleButton({ icon, title, description, onClick, accent, bg }: RoleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 border-transparent
        ${bg} hover:${accent} hover:shadow-sm transition-all text-left group`}
      style={{ borderColor: 'transparent' }}
      onMouseEnter={(e) => {
        const el = e.currentTarget
        el.style.borderColor = accent.replace('border-', '')
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'transparent'
      }}
    >
      <div className="p-3 rounded-xl bg-slate-100 flex-shrink-0 group-hover:bg-white transition-colors">
        {icon}
      </div>
      <div>
        <p className="font-semibold text-slate-800">{title}</p>
        <p className="text-sm text-slate-500 mt-0.5">{description}</p>
      </div>
    </button>
  )
}
