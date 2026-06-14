import { Search, X } from 'lucide-react'
import { useRoomStore } from '@/application/store/useRoomStore'
import { useTranslation } from '@/application/i18n/LanguageContext'
import { STATUS_CONFIG, ROOM_TYPE_CONFIG, localizeStatus, localizeType } from '@/domain/constants'
import { Button } from './ui/Button'
import type { RoomStatus, RoomType } from '@/domain/types'

const STATUS_OPTIONS: RoomStatus[] = [
  'checkout', 'checkin_pending', 'occupied_dirty', 'vacant_dirty',
  'clean', 'inspected', 'dnd', 'out_of_order',
]

const TYPE_OPTIONS: RoomType[] = ['standard', 'deluxe', 'suite', 'presidential']

export function RoomFilters() {
  const { filters, setFilters, clearFilters, rooms, staff } = useRoomStore()
  const { t, language } = useTranslation()

  const floors = [...new Set(rooms.map((r) => r.floor))].sort((a, b) => a - b)
  const housekeepers = staff.filter((s) => s.role === 'housekeeper')

  const hasActiveFilter =
    filters.floor !== null ||
    filters.status !== null ||
    filters.type !== null ||
    filters.assignedTo !== null ||
    filters.search !== ''

  return (
    <div className="px-4 md:px-6 py-3 bg-white border-b border-slate-200 flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="relative flex-1 min-w-[180px]">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder={t('filter.search')}
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-300 bg-white
            focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 text-slate-800"
        />
      </div>

      {/* Floor */}
      <select
        value={filters.floor ?? ''}
        onChange={(e) => setFilters({ floor: e.target.value === '' ? null : Number(e.target.value) })}
        className="py-2 px-3 text-sm rounded-lg border border-slate-300 bg-white text-slate-700
          focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
      >
        <option value="">{t('filter.allFloors')}</option>
        {floors.map((f) => (
          <option key={f} value={f}>
            {t('filter.floor')} {f}
          </option>
        ))}
      </select>

      {/* Status */}
      <select
        value={filters.status ?? ''}
        onChange={(e) => setFilters({ status: (e.target.value || null) as RoomStatus | null })}
        className="py-2 px-3 text-sm rounded-lg border border-slate-300 bg-white text-slate-700
          focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
      >
        <option value="">{t('filter.allStatuses')}</option>
        {STATUS_OPTIONS.map((s) => (
          <option key={s} value={s}>
            {localizeStatus(STATUS_CONFIG[s], language)}
          </option>
        ))}
      </select>

      {/* Type */}
      <select
        value={filters.type ?? ''}
        onChange={(e) => setFilters({ type: (e.target.value || null) as RoomType | null })}
        className="py-2 px-3 text-sm rounded-lg border border-slate-300 bg-white text-slate-700
          focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
      >
        <option value="">{t('filter.allTypes')}</option>
        {TYPE_OPTIONS.map((tp) => (
          <option key={tp} value={tp}>
            {localizeType(ROOM_TYPE_CONFIG[tp], language)}
          </option>
        ))}
      </select>

      {/* Housekeeper */}
      <select
        value={filters.assignedTo ?? ''}
        onChange={(e) => setFilters({ assignedTo: e.target.value || null })}
        className="py-2 px-3 text-sm rounded-lg border border-slate-300 bg-white text-slate-700
          focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
      >
        <option value="">{t('filter.allHousekeepers')}</option>
        <option value="__unassigned__">{t('room.unassigned')}</option>
        {housekeepers.map((hk) => (
          <option key={hk.id} value={hk.id}>
            {hk.name}
          </option>
        ))}
      </select>

      {/* Clear */}
      {hasActiveFilter && (
        <Button size="sm" variant="ghost" icon={<X size={14} />} onClick={clearFilters}>
          {t('filter.clearFilters')}
        </Button>
      )}
    </div>
  )
}
