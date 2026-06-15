import { useState } from 'react'
import { Pencil, Trash2, Check, X, UserPlus } from 'lucide-react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { useRoomStore } from '@/application/store/useRoomStore'
import { useTranslation } from '@/application/i18n/LanguageContext'
import type { Staff, UserRole } from '@/domain/types'

interface StaffModalProps {
  open: boolean
  onClose: () => void
}

type ActiveTab = 'supervisor' | 'housekeeper'

export function StaffModal({ open, onClose }: StaffModalProps) {
  const { t } = useTranslation()
  const [tab, setTab] = useState<ActiveTab>('housekeeper')

  return (
    <Modal open={open} onClose={onClose} title={t('staff.title')} size="md">
      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-5">
        {(['housekeeper', 'supervisor'] as ActiveTab[]).map((role) => (
          <button
            key={role}
            onClick={() => setTab(role)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all
              ${tab === role
                ? 'bg-white text-[#1e3a5f] shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
              }`}
          >
            {role === 'housekeeper' ? t('staff.housekeepers') : t('staff.supervisors')}
          </button>
        ))}
      </div>

      <StaffSection role={tab} />
    </Modal>
  )
}

// ── Section per role ──────────────────────────────────────────────────────────

function StaffSection({ role }: { role: UserRole }) {
  const { staff, addStaff, updateStaff, deleteStaff, rooms } = useRoomStore()
  const { t } = useTranslation()

  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')

  const members = staff.filter((s) => s.role === role)
  const emptyKey = role === 'housekeeper' ? 'staff.noHousekeepers' : 'staff.noSupervisors'
  const addLabel = role === 'housekeeper' ? t('staff.addHousekeeper') : t('staff.addSupervisor')

  function handleAdd() {
    const name = newName.trim()
    if (!name) return
    addStaff({ name, role })
    setNewName('')
  }

  function startEdit(member: Staff) {
    setEditingId(member.id)
    setEditingName(member.name)
  }

  function saveEdit() {
    if (!editingId) return
    const name = editingName.trim()
    if (name) updateStaff(editingId, { name })
    setEditingId(null)
    setEditingName('')
  }

  function cancelEdit() {
    setEditingId(null)
    setEditingName('')
  }

  function handleDelete(member: Staff) {
    const assignedCount = rooms.filter((r) => r.assignedTo === member.id).length
    const warning = assignedCount > 0
      ? `\n\n${t('staff.deleteWarning')}`
      : ''
    if (confirm(`${t('staff.deleteConfirm')}${warning}`)) {
      deleteStaff(member.id)
    }
  }

  const roomCount = (id: string) => rooms.filter((r) => r.assignedTo === id).length

  return (
    <div className="space-y-3">
      {/* Member list */}
      {members.length === 0 ? (
        <p className="text-center text-sm text-slate-400 py-6">{t(emptyKey)}</p>
      ) : (
        <div className="space-y-2">
          {members.map((member) => (
            <div
              key={member.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white group"
            >
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center
                text-xs font-bold text-[#1e3a5f] flex-shrink-0">
                {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>

              {/* Name / edit field */}
              <div className="flex-1 min-w-0">
                {editingId === member.id ? (
                  <input
                    autoFocus
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEdit()
                      if (e.key === 'Escape') cancelEdit()
                    }}
                    className="w-full text-sm border-b border-[#1e3a5f] outline-none py-0.5 bg-transparent text-slate-800"
                  />
                ) : (
                  <div>
                    <p className="text-sm font-semibold text-slate-800 truncate">{member.name}</p>
                    {role === 'housekeeper' && (
                      <p className="text-xs text-slate-400">
                        {roomCount(member.id)} {t('staff.roomsAssigned')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 flex-shrink-0">
                {editingId === member.id ? (
                  <>
                    <button
                      onClick={saveEdit}
                      className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                      title={t('staff.saveName')}
                    >
                      <Check size={15} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
                    >
                      <X size={15} />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => startEdit(member)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-[#1e3a5f] hover:bg-slate-100
                        opacity-0 group-hover:opacity-100 transition-all"
                      title={t('staff.editName')}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(member)}
                      className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50
                        opacity-0 group-hover:opacity-100 transition-all"
                      title={t('action.delete')}
                    >
                      <Trash2 size={14} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add new member form */}
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <div className="flex-1 relative">
          <UserPlus size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
            placeholder={addLabel}
            className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white
              focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20
              placeholder:text-slate-400 text-slate-800"
          />
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleAdd}
          disabled={!newName.trim()}
          icon={<UserPlus size={14} />}
        >
          {t('staff.addBtn')}
        </Button>
      </div>
    </div>
  )
}
