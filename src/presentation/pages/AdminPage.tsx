import { useState, useEffect } from 'react'
import { ArrowLeft, UserPlus, Trash2, Pencil, Check, X, Shield, User, Sparkles } from 'lucide-react'
import { useAuthStore } from '@/application/store/useAuthStore'
import { useTranslation } from '@/application/i18n/LanguageContext'
import type { UserRole } from '@/domain/types'
import type { AuthProfile } from '@/application/store/useAuthStore'

interface AdminPageProps {
  onBack: () => void
}

const ROLE_ICONS: Record<UserRole, React.ReactNode> = {
  admin: <Shield size={14} className="text-purple-500" />,
  supervisor: <User size={14} className="text-[#1e3a5f]" />,
  housekeeper: <Sparkles size={14} className="text-[#c9a84c]" />,
}

const ROLE_COLORS: Record<UserRole, string> = {
  admin: 'bg-purple-100 text-purple-700',
  supervisor: 'bg-blue-100 text-blue-700',
  housekeeper: 'bg-amber-100 text-amber-700',
}

export function AdminPage({ onBack }: AdminPageProps) {
  const { t } = useTranslation()
  const { allProfiles, loadAllProfiles, createUser, updateProfile, deleteUser, profile: currentProfile } = useAuthStore()

  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Create form state
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newRole, setNewRole] = useState<UserRole>('housekeeper')

  // Edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editRole, setEditRole] = useState<UserRole>('housekeeper')

  useEffect(() => {
    loadAllProfiles().catch(() => {})
  }, [loadAllProfiles])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim() || !newEmail.trim() || !newPassword.trim()) return
    setLoading(true)
    setError(null)
    try {
      await createUser(newName.trim(), newEmail.trim(), newPassword, newRole)
      setNewName('')
      setNewEmail('')
      setNewPassword('')
      setNewRole('housekeeper')
      setShowCreate(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user.')
    }
    setLoading(false)
  }

  async function handleRoleChange(id: string) {
    try {
      await updateProfile(id, { role: editRole })
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role.')
    }
  }

  async function handleDelete(user: AuthProfile) {
    if (user.id === currentProfile?.id) {
      alert('You cannot delete your own account.')
      return
    }
    if (!confirm(`${t('admin.deleteConfirm')}\n\n${t('admin.deleteWarning')}`)) return
    try {
      await deleteUser(user.id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#1e3a5f] shadow-lg">
        <div className="flex items-center gap-3 px-4 md:px-6 h-14">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm"
          >
            <ArrowLeft size={18} />
            <span>{t('admin.back')}</span>
          </button>
          <div className="w-px h-5 bg-white/20" />
          <h1 className="text-white font-semibold">{t('admin.title')}</h1>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 flex items-center justify-between">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-3">
              <X size={14} />
            </button>
          </div>
        )}

        {/* User list */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800">
              {t('admin.users')} <span className="text-slate-400 font-normal text-sm ml-1">({allProfiles.length})</span>
            </h2>
            <button
              onClick={() => setShowCreate((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e3a5f] hover:bg-[#16304f]
                text-white text-sm font-medium rounded-lg transition-colors"
            >
              <UserPlus size={14} />
              {t('admin.createUser')}
            </button>
          </div>

          {/* Create user form */}
          {showCreate && (
            <form onSubmit={handleCreate} className="px-5 py-4 bg-slate-50 border-b border-slate-100 space-y-3">
              <p className="text-sm font-medium text-slate-700">{t('admin.createUser')}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('admin.name')}</label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg
                      focus:border-[#1e3a5f] focus:outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('admin.email')}</label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg
                      focus:border-[#1e3a5f] focus:outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('admin.password')}</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg
                      focus:border-[#1e3a5f] focus:outline-none text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">{t('admin.role')}</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg
                      focus:border-[#1e3a5f] focus:outline-none text-slate-800 bg-white"
                  >
                    <option value="housekeeper">Housekeeper</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 bg-[#1e3a5f] hover:bg-[#16304f] disabled:bg-slate-300
                    text-white text-sm font-medium rounded-lg transition-colors"
                >
                  {loading ? '...' : t('admin.createBtn')}
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-1.5 text-slate-600 hover:text-slate-800 text-sm transition-colors"
                >
                  {t('action.cancel')}
                </button>
              </div>
            </form>
          )}

          {allProfiles.length === 0 ? (
            <p className="text-center text-slate-400 text-sm py-10">{t('admin.noUsers')}</p>
          ) : (
            <div className="divide-y divide-slate-100">
              {allProfiles.map((user) => (
                <div key={user.id} className="flex items-center gap-3 px-5 py-3 group">
                  {/* Avatar */}
                  <div className="w-9 h-9 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center
                    text-xs font-bold text-[#1e3a5f] flex-shrink-0">
                    {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800 truncate">{user.name}</p>
                      {user.id === currentProfile?.id && (
                        <span className="text-xs text-slate-400">(you)</span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                  </div>

                  {/* Role */}
                  {editingId === user.id ? (
                    <div className="flex items-center gap-1.5">
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value as UserRole)}
                        className="text-xs border border-slate-300 rounded-lg px-2 py-1 bg-white text-slate-700 focus:outline-none"
                      >
                        <option value="housekeeper">Housekeeper</option>
                        <option value="supervisor">Supervisor</option>
                        <option value="admin">Admin</option>
                      </select>
                      <button
                        onClick={() => handleRoleChange(user.id)}
                        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${ROLE_COLORS[user.role]}`}>
                      {ROLE_ICONS[user.role]}
                      {user.role}
                    </span>
                  )}

                  {/* Actions */}
                  {editingId !== user.id && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <button
                        onClick={() => { setEditingId(user.id); setEditRole(user.role) }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100 transition-colors"
                        title={t('admin.editRole')}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title={t('action.delete')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
