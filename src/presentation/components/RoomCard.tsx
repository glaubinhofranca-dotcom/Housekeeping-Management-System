import { type CSSProperties } from 'react'
import {
  Clock, User, MessageSquare, BedDouble,
  ChevronUp, ChevronDown, CheckCircle2, BellOff, Lock,
} from 'lucide-react'
import { StatusBadge, TypeBadge } from './ui/Badge'
import { Button } from './ui/Button'
import type { Room, Staff, RoomStatus } from '@/domain/types'
import { useTranslation } from '@/application/i18n/LanguageContext'
import { useRoomStore } from '@/application/store/useRoomStore'

// ── Supervisor Card ──────────────────────────────────────────────────────────

interface SupervisorRoomCardProps {
  room: Room
  staff: Staff[]
  onClick: (room: Room) => void
  style?: CSSProperties
}

export function SupervisorRoomCard({ room, staff, onClick, style }: SupervisorRoomCardProps) {
  const { t } = useTranslation()
  const assignee = staff.find((s) => s.id === room.assignedTo)

  return (
    <div style={style} className="px-4 md:px-6 py-1.5">
      <button
        onClick={() => onClick(room)}
        className="w-full text-left bg-white rounded-xl border border-slate-200 hover:border-[#1e3a5f]/40
          hover:shadow-md transition-all duration-150 p-4 group"
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
            <span className="text-lg font-bold text-slate-700">{room.number}</span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={room.status} />
              <TypeBadge type={room.type} />
              <span className="text-xs text-slate-400">Floor {room.floor}</span>
            </div>

            <div className="mt-2 flex items-center gap-4 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1">
                <BedDouble size={12} />
                {room.beds} {room.beds === 1 ? 'bed' : 'beds'}
              </span>

              {assignee ? (
                <span className="flex items-center gap-1 text-blue-600">
                  <User size={12} />
                  {assignee.name}
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-500">
                  <User size={12} />
                  {t('room.unassigned')}
                </span>
              )}

              {room.guestName && (
                <span className="flex items-center gap-1 truncate max-w-[120px]">
                  <User size={12} className="flex-shrink-0" />
                  {room.guestName}
                </span>
              )}

              {room.checkinTime && (
                <span className="flex items-center gap-1 text-violet-600">
                  <Clock size={12} />
                  {room.checkinTime}
                </span>
              )}

              {room.notes && (
                <span className="flex items-center gap-1 text-slate-400 truncate max-w-[140px]">
                  <MessageSquare size={12} className="flex-shrink-0" />
                  {room.notes}
                </span>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 text-slate-300 group-hover:text-[#1e3a5f] transition-colors">
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
            </svg>
          </div>
        </div>
      </button>
    </div>
  )
}

// ── Housekeeper Card ─────────────────────────────────────────────────────────

// Statuses where the housekeeper has pending work
const PENDING_STATUSES = new Set<RoomStatus>([
  'checkout', 'checkin_pending', 'occupied_dirty', 'vacant_dirty',
])

// DND is only meaningful when a guest is present
const DND_ELIGIBLE = new Set<RoomStatus>(['occupied_dirty'])

interface HousekeeperRoomCardProps {
  room: Room
  index: number
  total: number
}

export function HousekeeperRoomCard({ room, index, total }: HousekeeperRoomCardProps) {
  const { t } = useTranslation()
  const { updateRoomStatus, movePriority } = useRoomStore()

  const isPending = PENDING_STATUSES.has(room.status)
  const isDndEligible = DND_ELIGIBLE.has(room.status)

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-center gap-3 p-4 border-b border-slate-100">
        <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
          <span className="text-lg font-bold text-slate-700">{room.number}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={room.status} />
            <TypeBadge type={room.type} />
          </div>
          <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
            <span>{t('hk.floor')} {room.floor}</span>
            <span className="flex items-center gap-1"><BedDouble size={11} /> {room.beds}</span>
            {room.checkinTime && (
              <span className="flex items-center gap-1 text-violet-600">
                <Clock size={11} /> {room.checkinTime}
              </span>
            )}
          </div>
        </div>

        {/* Priority controls — only on pending rooms */}
        {isPending && (
          <div className="flex flex-col gap-0.5 flex-shrink-0">
            <button
              disabled={index === 0}
              onClick={() => movePriority(room.id, 'up')}
              className="p-1 rounded text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100
                disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title={t('action.priorityUp')}
            >
              <ChevronUp size={16} />
            </button>
            <button
              disabled={index === total - 1}
              onClick={() => movePriority(room.id, 'down')}
              className="p-1 rounded text-slate-400 hover:text-[#1e3a5f] hover:bg-slate-100
                disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              title={t('action.priorityDown')}
            >
              <ChevronDown size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Guest name / notes */}
      {(room.guestName || room.notes) && (
        <div className="px-4 py-2 bg-slate-50/60 text-xs text-slate-500 flex flex-col gap-0.5 border-b border-slate-100">
          {room.guestName && (
            <span className="flex items-center gap-1.5">
              <User size={11} />
              {room.guestName}
            </span>
          )}
          {room.notes && (
            <span className="flex items-center gap-1.5">
              <MessageSquare size={11} />
              {room.notes}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="p-3">
        {isPending ? (
          <div className="flex gap-2">
            {/* PRIMARY: Ready for Inspection — always available for pending rooms */}
            <Button
              size="sm"
              variant="success"
              icon={<CheckCircle2 size={14} />}
              onClick={() => updateRoomStatus(room.id, 'clean')}
              className="flex-1"
            >
              {t('action.markClean')}
            </Button>

            {/* DND — only when guest is present */}
            {isDndEligible && (
              <Button
                size="sm"
                variant="ghost"
                icon={<BellOff size={14} />}
                onClick={() => updateRoomStatus(room.id, 'dnd')}
                className="border border-slate-200 text-slate-600"
              >
                {t('action.markDnd')}
              </Button>
            )}
          </div>
        ) : (
          /* Supervisor-only notice for non-pending statuses */
          <div className="flex items-center gap-2 py-1 text-xs text-slate-400">
            <Lock size={12} className="flex-shrink-0" />
            <span>{t('action.supervisorOnly')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
