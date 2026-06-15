import { useState, useEffect } from 'react'
import { PlusCircle } from 'lucide-react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { useRoomStore } from '@/application/store/useRoomStore'
import { useTranslation } from '@/application/i18n/LanguageContext'
import { STATUS_CONFIG, ROOM_TYPE_CONFIG, localizeStatus, localizeType } from '@/domain/constants'
import { nanoid } from '@/infrastructure/nanoid'
import type { RoomStatus, RoomType } from '@/domain/types'

// Statuses valid at room-creation time
const CREATION_STATUSES: RoomStatus[] = [
  'vacant_dirty',
  'checkout',
  'checkin_pending',
  'occupied_dirty',
  'out_of_order',
]

const ALL_TYPES: RoomType[] = ['standard', 'deluxe', 'suite', 'presidential']

function floorFromNumber(num: string): number {
  const n = parseInt(num, 10)
  if (isNaN(n) || n < 100) return 1
  return Math.floor(n / 100)
}

interface AddRoomModalProps {
  open: boolean
  onClose: () => void
}

export function AddRoomModal({ open, onClose }: AddRoomModalProps) {
  const { addRoom, staff } = useRoomStore()
  const { t, language } = useTranslation()

  const [number, setNumber] = useState('')
  const [floor, setFloor] = useState(1)
  const [floorManual, setFloorManual] = useState(false)
  const [type, setType] = useState<RoomType>('standard')
  const [status, setStatus] = useState<RoomStatus>('vacant_dirty')
  const [assignedTo, setAssignedTo] = useState('')
  const [guestName, setGuestName] = useState('')
  const [checkinTime, setCheckinTime] = useState('')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  const housekeepers = staff.filter((s) => s.role === 'housekeeper')

  // Auto-calculate floor from room number
  useEffect(() => {
    if (!floorManual && number) {
      setFloor(floorFromNumber(number))
    }
  }, [number, floorManual])

  function reset() {
    setNumber('')
    setFloor(1)
    setFloorManual(false)
    setType('standard')
    setStatus('vacant_dirty')
    setAssignedTo('')
    setGuestName('')
    setCheckinTime('')
    setNotes('')
    setError('')
  }

  function handleClose() {
    reset()
    onClose()
  }

  function handleSave() {
    if (!number.trim()) {
      setError(t('room.number') + ' is required')
      return
    }
    addRoom({
      id: nanoid(),
      number: number.trim(),
      floor,
      type,
      status,
      priority: 50,
      assignedTo: assignedTo || null,
      beds: ROOM_TYPE_CONFIG[type].beds,
      notes,
      guestName: guestName || null,
      checkinTime: checkinTime || null,
    } as Parameters<typeof addRoom>[0])
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={t('room.addTitle')}
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={handleClose}>{t('action.cancel')}</Button>
          <Button variant="primary" icon={<PlusCircle size={15} />} onClick={handleSave}>
            {t('action.addRoom')}
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        {/* Room number + Floor */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t('room.number')} <span className="text-red-500">*</span>
            </label>
            <input
              autoFocus
              type="text"
              value={number}
              onChange={(e) => { setNumber(e.target.value); setError('') }}
              placeholder="e.g. 301"
              className={`w-full rounded-lg border px-3 py-2 text-sm bg-white text-slate-800
                placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20
                ${error ? 'border-red-400 focus:border-red-400' : 'border-slate-300 focus:border-[#1e3a5f]'}`}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t('room.floor')}
              {!floorManual && (
                <span className="text-xs text-slate-400 font-normal ml-1">
                  ({t('room.floorHint')})
                </span>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                min={1}
                max={99}
                value={floor}
                onChange={(e) => { setFloor(Number(e.target.value)); setFloorManual(true) }}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm bg-white text-slate-800
                  focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
              />
              {floorManual && (
                <button
                  onClick={() => { setFloorManual(false); setFloor(floorFromNumber(number)) }}
                  className="text-xs text-[#1e3a5f] hover:underline whitespace-nowrap"
                >
                  Auto
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Room type */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">{t('room.type')}</label>
          <div className="grid grid-cols-4 gap-2">
            {ALL_TYPES.map((tp) => (
              <button
                key={tp}
                onClick={() => setType(tp)}
                className={`py-2 rounded-lg border text-xs font-medium transition-all text-center
                  ${type === tp
                    ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
              >
                {localizeType(ROOM_TYPE_CONFIG[tp], language)}
                <span className="block text-[10px] opacity-70 mt-0.5">
                  {ROOM_TYPE_CONFIG[tp].beds} {ROOM_TYPE_CONFIG[tp].beds === 1 ? 'bed' : 'beds'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Initial status */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">{t('room.initialStatus')}</label>
          <div className="grid grid-cols-2 gap-2">
            {CREATION_STATUSES.map((s) => {
              const cfg = STATUS_CONFIG[s]
              const label = localizeStatus(cfg, language)
              return (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all
                    ${status === s
                      ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-2 ring-offset-1 ring-[#1e3a5f]/30`
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full ${cfg.dot} flex-shrink-0`} />
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Assign housekeeper */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">{t('room.assignHousekeeper')}</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
              focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
          >
            <option value="">{t('room.unassigned')}</option>
            {housekeepers.map((hk) => (
              <option key={hk.id} value={hk.id}>{hk.name}</option>
            ))}
          </select>
        </div>

        {/* Guest info (optional) */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t('room.guestName')}
              <span className="text-slate-400 font-normal ml-1 text-xs">(optional)</span>
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. John Smith"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                placeholder:text-slate-400 focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">
              {t('room.checkinTime')}
              <span className="text-slate-400 font-normal ml-1 text-xs">(optional)</span>
            </label>
            <input
              type="time"
              value={checkinTime}
              onChange={(e) => setCheckinTime(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
                focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-1">{t('room.notes')}</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder={t('room.notesPlaceholder')}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800
              placeholder:text-slate-400 focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20 resize-none"
          />
        </div>
      </div>
    </Modal>
  )
}
