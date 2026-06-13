import { useAppStore } from '@/application/store/useAppStore'
import { LanguageProvider } from '@/application/i18n/LanguageContext'
import { LoginPage } from '@/presentation/pages/LoginPage'
import { SupervisorDashboard } from '@/presentation/pages/SupervisorDashboard'
import { HousekeeperPage } from '@/presentation/pages/HousekeeperPage'

export default function App() {
  const { currentUser, language } = useAppStore()

  return (
    <LanguageProvider language={language}>
      {!currentUser ? (
        <LoginPage />
      ) : currentUser.role === 'supervisor' ? (
        <SupervisorDashboard />
      ) : (
        <HousekeeperPage />
      )}
    </LanguageProvider>
  )
}
