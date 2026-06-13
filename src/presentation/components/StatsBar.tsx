import { useRoomStore } from '@/application/store/useRoomStore'
import { STATUS_CONFIG } from '@/domain/constants'
import { useTranslation } from '@/application/i18n/LanguageContext'
import type { RoomStatus } from '@/domain/types'

interface StatCardProps {
  label: string
  count: number
  dot?: string
  bg?: string
  text?: string
  onClick?: () => void
  active?: boolean
}

function StatCard({ label, count, dot, bg, text, onClick, active }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center justify-center rounded-xl p-3 transition-all min-w-[72px]
        ${active ? 'ring-2 ring-[#1e3a5f] shadow-md' : 'hover:shadow-md'}
        ${bg ?? 'bg-white'} ${text ?? 'text-slate-700'} border border-slate-200/60`}
    >
      {dot && (
        <span className={`w-2 h-2 rounded-full ${dot} mb-1`} />
      )}
      <span className={`text-xl font-bold ${text ?? 'text-slate-800'}`}>{count}</span>
      <span className={`text-xs font-medium leading-tight text-center mt-0.5 ${text ? text.replace('800', '600').replace('700', '500') : 'text-slate-500'}`}>
        {label}
      </span>
    </button>
  )
}

interface StatsBarProps {
  activeStatus: RoomStatus | null
  onStatusFilter: (status: RoomStatus | null) => void
}

export function StatsBar({ activeStatus, onStatusFilter }: StatsBarProps) {
  const rooms = useRoomStore((s) => s.rooms)
  const { t } = useTranslation()

  const counts = rooms.reduce(
    (acc, r) => {
      acc[r.status] = (acc[r.status] ?? 0) + 1
      return acc
    },
    {} as Record<RoomStatus, number>,
  )

  const statusStats: { status: RoomStatus; labelKey: Parameters<typeof t>[0] }[] = [
    { status: 'checkout', labelKey: 'stats.checkout' },
    { status: 'checkin_pending', labelKey: 'stats.checkinPending' },
    { status: 'occupied_dirty', labelKey: 'stats.occupiedDirty' },
    { status: 'vacant_dirty', labelKey: 'stats.vacantDirty' },
    { status: 'clean', labelKey: 'stats.clean' },
    { status: 'inspected', labelKey: 'stats.inspected' },
    { status: 'dnd', labelKey: 'stats.dnd' },
    { status: 'out_of_order', labelKey: 'stats.outOfOrder' },
  ]

  return (
    <div className="px-4 md:px-6 py-4 bg-white border-b border-slate-200">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <StatCard
          label={t('stats.total')}
          count={rooms.length}
          bg="bg-[#1e3a5f]"
          text="text-white"
          active={activeStatus === null}
          onClick={() => onStatusFilter(null)}
        />
        {statusStats.map(({ status, labelKey }) => {
          const cfg = STATUS_CONFIG[status]
          return (
            <StatCard
              key={status}
              label={t(labelKey)}
              count={counts[status] ?? 0}
              dot={cfg.dot}
              bg={cfg.bg}
              text={cfg.text}
              active={activeStatus === status}
              onClick={() => onStatusFilter(activeStatus === status ? null : status)}
            />
          )
        })}
      </div>
    </div>
  )
}
