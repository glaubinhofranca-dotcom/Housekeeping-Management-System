import { useState } from 'react'
import { Modal } from './ui/Modal'
import { useRoomStore } from '@/application/store/useRoomStore'
import { useTranslation } from '@/application/i18n/LanguageContext'
import type { UserRole } from '@/domain/types'

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

function StaffSection({ role }: { role: UserRole }) {
  const { staff, rooms } = useRoomStore()
  const { t } = useTranslation()

  const members = staff.filter((s) => s.role === role || (role === 'supervisor' && s.role === 'admin'))
  const emptyKey = role === 'housekeeper' ? 'staff.noHousekeepers' : 'staff.noSupervisors'

  const roomCount = (id: string) => rooms.filter((r) => r.assignedTo === id).length

  return (
    <div className="space-y-2">
      {members.length === 0 ? (
        <p className="text-center text-sm text-slate-400 py-6">{t(emptyKey)}</p>
      ) : (
        members.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-white"
          >
            <div className="w-9 h-9 rounded-full bg-[#1e3a5f]/10 flex items-center justify-center
              text-xs font-bold text-[#1e3a5f] flex-shrink-0">
              {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">{member.name}</p>
              {role === 'housekeeper' && (
                <p className="text-xs text-slate-400">
                  {roomCount(member.id)} {t('staff.roomsAssigned')}
                </p>
              )}
            </div>
          </div>
        ))
      )}

      <p className="text-xs text-slate-400 text-center pt-2">
        Manage users in Admin Panel
      </p>
    </div>
  )
}
