import { useState } from 'react'
import { Plus, Trash2, LayoutGrid } from 'lucide-react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { useRoomStore } from '@/application/store/useRoomStore'
import { useTranslation } from '@/application/i18n/LanguageContext'
import { STATUS_CONFIG, ROOM_TYPE_CONFIG, localizeStatus, localizeType } from '@/domain/constants'
import type { FloorConfig, RoomStatus, RoomType } from '@/domain/types'

interface LoadRoomsModalProps {
  open: boolean
  onClose: () => void
}

const DEFAULT_STATUS: RoomStatus = 'vacant_dirty'
const DEFAULT_TYPE: RoomType = 'standard'

const DIRTY_STATUSES: RoomStatus[] = ['vacant_dirty', 'checkout', 'checkin_pending', 'occupied_dirty', 'out_of_order']
const ALL_TYPES: RoomType[] = ['standard', 'deluxe', 'suite', 'presidential']

function newFloor(floor: number): FloorConfig {
  return { floor, startRoom: 1, count: 10, type: DEFAULT_TYPE, status: DEFAULT_STATUS }
}

export function LoadRoomsModal({ open, onClose }: LoadRoomsModalProps) {
  const { bulkGenerateRooms } = useRoomStore()
  const { t, language } = useTranslation()
  const [floors, setFloors] = useState<FloorConfig[]>([newFloor(1), newFloor(2), newFloor(3)])
  const [replaceMode, setReplaceMode] = useState(true)
  const [loading, setLoading] = useState(false)

  const totalRooms = floors.reduce((sum, f) => sum + f.count, 0)

  function updateFloor(idx: number, patch: Partial<FloorConfig>) {
    setFloors((prev) => prev.map((f, i) => (i === idx ? { ...f, ...patch } : f)))
  }

  function addFloor() {
    const nextFloor = (Math.max(...floors.map((f) => f.floor), 0) + 1)
    setFloors((prev) => [...prev, newFloor(nextFloor)])
  }

  function removeFloor(idx: number) {
    setFloors((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleGenerate() {
    if (replaceMode && !confirm(t('load.replaceWarning'))) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 300)) // brief UX delay
    bulkGenerateRooms(floors, replaceMode)
    setLoading(false)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={t('load.title')}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            {t('action.cancel')}
          </Button>
          <Button
            variant="primary"
            icon={<LayoutGrid size={15} />}
            onClick={handleGenerate}
            loading={loading}
            disabled={floors.length === 0}
          >
            {t('load.generate')} ({totalRooms})
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <p className="text-sm text-slate-500">{t('load.subtitle')}</p>

        {/* Mode selector */}
        <div className="flex gap-3">
          {[true, false].map((isReplace) => (
            <button
              key={String(isReplace)}
              onClick={() => setReplaceMode(isReplace)}
              className={`flex-1 rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all text-left
                ${replaceMode === isReplace
                  ? 'border-[#1e3a5f] bg-[#1e3a5f]/5 text-[#1e3a5f]'
                  : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
            >
              {isReplace ? t('load.replaceMode') : t('load.appendMode')}
              {isReplace && (
                <span className="block text-xs text-red-500 font-normal mt-0.5">
                  {t('load.replaceWarning')}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Floor configs */}
        <div className="space-y-3">
          {floors.map((floor, idx) => (
            <div key={idx} className="bg-slate-50 rounded-xl border border-slate-200 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-slate-700">
                  {t('load.floorNumber')} {floor.floor}
                </span>
                <button
                  onClick={() => removeFloor(idx)}
                  className="text-red-400 hover:text-red-600 transition-colors p-1"
                  title={t('load.removeFloor')}
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* Floor number */}
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">{t('load.floorNumber')}</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={floor.floor}
                    onChange={(e) => updateFloor(idx, { floor: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
                      focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                  />
                </div>

                {/* Start room */}
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">{t('load.startRoom')}</label>
                  <input
                    type="number"
                    min={1}
                    value={floor.startRoom}
                    onChange={(e) => updateFloor(idx, { startRoom: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
                      focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                  />
                </div>

                {/* Count */}
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">{t('load.roomCount')}</label>
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={floor.count}
                    onChange={(e) => updateFloor(idx, { count: Number(e.target.value) })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
                      focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                  />
                </div>

                {/* Type */}
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">{t('room.type')}</label>
                  <select
                    value={floor.type}
                    onChange={(e) => updateFloor(idx, { type: e.target.value as RoomType })}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
                      focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
                  >
                    {ALL_TYPES.map((tp) => (
                      <option key={tp} value={tp}>
                        {localizeType(ROOM_TYPE_CONFIG[tp], language)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-xs font-medium text-slate-600 block mb-2">{t('room.status')}</label>
                <div className="flex gap-2 flex-wrap">
                  {DIRTY_STATUSES.map((s) => {
                    const cfg = STATUS_CONFIG[s]
                    const label = localizeStatus(cfg, language)
                    return (
                      <button
                        key={s}
                        onClick={() => updateFloor(idx, { status: s })}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all
                          ${floor.status === s
                            ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-2 ring-offset-1 ring-[#1e3a5f]/30`
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                          }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Preview */}
              <p className="text-xs text-slate-400">
                {t('load.preview')}: {Array.from({ length: Math.min(floor.count, 5) }, (_, i) => {
                  const num = floor.floor * 100 + floor.startRoom + i
                  return String(num).padStart(3, '0')
                }).join(', ')}{floor.count > 5 ? ` ... +${floor.count - 5} more` : ''}
              </p>
            </div>
          ))}
        </div>

        <Button
          variant="secondary"
          icon={<Plus size={15} />}
          onClick={addFloor}
          className="w-full border-dashed"
        >
          {t('load.addFloor')}
        </Button>

        <div className="bg-slate-100 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-slate-600">{t('load.totalRooms')}</span>
          <span className="text-lg font-bold text-[#1e3a5f]">{totalRooms}</span>
        </div>
      </div>
    </Modal>
  )
}
