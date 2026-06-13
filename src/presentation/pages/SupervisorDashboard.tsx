import { useState } from 'react'
import { LayoutGrid, Plus } from 'lucide-react'
import { Header } from '@/presentation/components/Header'
import { StatsBar } from '@/presentation/components/StatsBar'
import { RoomFilters } from '@/presentation/components/RoomFilters'
import { VirtualizedRoomList } from '@/presentation/components/VirtualizedRoomList'
import { LoadRoomsModal } from '@/presentation/components/LoadRoomsModal'
import { RoomDetailModal } from '@/presentation/components/RoomDetailModal'
import { Button } from '@/presentation/components/ui/Button'
import { useRoomStore, selectFilteredRooms } from '@/application/store/useRoomStore'
import { useTranslation } from '@/application/i18n/LanguageContext'
import { nanoid } from '@/infrastructure/nanoid'
import type { Room, RoomStatus } from '@/domain/types'
import type { TranslationKey } from '@/application/i18n/translations'

export function SupervisorDashboard() {
  const { t } = useTranslation()
  const store = useRoomStore()
  const filteredRooms = selectFilteredRooms(store)

  const [showLoadModal, setShowLoadModal] = useState(false)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)

  function handleStatusFilter(status: RoomStatus | null) {
    store.setFilters({ status })
  }

  function handleAddRoom() {
    const newRoom: Room = {
      id: nanoid(),
      number: String(Math.floor(Math.random() * 900) + 100),
      floor: 1,
      type: 'standard',
      status: 'vacant_dirty',
      priority: 50,
      assignedTo: null,
      notes: '',
      guestName: null,
      checkinTime: null,
      beds: 1,
      lastUpdated: new Date().toISOString(),
    }
    setSelectedRoom(newRoom)
  }

  return (
    <div className="flex flex-col h-screen bg-slate-100">
      <Header />

      {/* Stats bar */}
      <StatsBar
        activeStatus={store.filters.status}
        onStatusFilter={handleStatusFilter}
      />

      {/* Action bar */}
      <div className="px-4 md:px-6 py-3 bg-white border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm text-slate-500">
            <span className="font-semibold text-slate-800">{filteredRooms.length}</span>{' '}
            {filteredRooms.length === 1 ? 'room' : 'rooms'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="secondary"
            icon={<Plus size={14} />}
            onClick={handleAddRoom}
          >
            <span className="hidden sm:inline">{t('action.addRoom')}</span>
          </Button>
          <Button
            size="sm"
            variant="primary"
            icon={<LayoutGrid size={14} />}
            onClick={() => setShowLoadModal(true)}
          >
            {t('action.loadRooms')}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <RoomFilters />

      {/* Room list */}
      {filteredRooms.length === 0 ? (
        <EmptyState onLoad={() => setShowLoadModal(true)} t={t} total={store.rooms.length} />
      ) : (
        <VirtualizedRoomList
          rooms={filteredRooms}
          staff={store.staff}
          onRoomClick={setSelectedRoom}
        />
      )}

      {/* Modals */}
      <LoadRoomsModal open={showLoadModal} onClose={() => setShowLoadModal(false)} />
      <RoomDetailModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
    </div>
  )
}

interface EmptyStateProps {
  onLoad: () => void
  t: (k: TranslationKey) => string
  total: number
}

function EmptyState({ onLoad, t, total }: EmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center p-8">
      <div className="w-20 h-20 rounded-2xl bg-slate-200 flex items-center justify-center">
        <LayoutGrid size={36} className="text-slate-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-700">
          {total === 0 ? t('msg.noRooms') : t('msg.noRooms')}
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-xs">
          {total === 0 ? t('msg.noRoomsDesc') : 'Try adjusting your filters.'}
        </p>
      </div>
      {total === 0 && (
        <Button variant="primary" icon={<LayoutGrid size={15} />} onClick={onLoad}>
          {t('action.loadRooms')}
        </Button>
      )}
    </div>
  )
}
