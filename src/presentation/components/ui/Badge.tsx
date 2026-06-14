import { STATUS_CONFIG, ROOM_TYPE_CONFIG, localizeStatus, localizeType } from '@/domain/constants'
import type { RoomStatus, RoomType } from '@/domain/types'
import { useTranslation } from '@/application/i18n/LanguageContext'

interface StatusBadgeProps {
  status: RoomStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const { language } = useTranslation()
  const cfg = STATUS_CONFIG[status]
  const label = localizeStatus(cfg, language)
  const px = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium'

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border ${cfg.bg} ${cfg.text} ${cfg.border} ${px}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} flex-shrink-0`} />
      {label}
    </span>
  )
}

interface TypeBadgeProps {
  type: RoomType
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const { language } = useTranslation()
  const cfg = ROOM_TYPE_CONFIG[type]
  const label = localizeType(cfg, language)

  const colors: Record<RoomType, string> = {
    standard: 'bg-slate-100 text-slate-600 border-slate-200',
    deluxe: 'bg-blue-50 text-blue-700 border-blue-200',
    suite: 'bg-purple-50 text-purple-700 border-purple-200',
    presidential: 'bg-amber-50 text-amber-700 border-amber-200',
  }

  return (
    <span className={`inline-flex items-center rounded border px-2 py-0.5 text-xs font-medium ${colors[type]}`}>
      {label}
    </span>
  )
}
