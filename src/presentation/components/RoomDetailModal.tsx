import { useState, useEffect } from 'react'
import { Trash2, Save } from 'lucide-react'
import { Modal } from './ui/Modal'
import { Button } from './ui/Button'
import { Textarea } from './ui/Input'
import { StatusBadge, TypeBadge } from './ui/Badge'
import { useRoomStore } from '@/application/store/useRoomStore'
import { useTranslation } from '@/application/i18n/LanguageContext'
import { STATUS_CONFIG, ROOM_TYPE_CONFIG, localizeStatus, localizeType } from '@/domain/constants'
import type { Room, RoomStatus, RoomType } from '@/domain/types'

const ALL_STATUSES: RoomStatus[] = [
  'checkout', 'checkin_pending', 'occupied_dirty', 'vacant_dirty',
  'clean', 'inspected', 'dnd', 'out_of_order',
]

const ALL_TYPES: RoomType[] = ['standard', 'deluxe', 'suite', 'presidential']

interface RoomDetailModalProps {
  room: Room | null
  onClose: () => void
}

export function RoomDetailModal({ room, onClose }: RoomDetailModalProps) {
  const { updateRoom, deleteRoom, staff } = useRoomStore()
  const { t, language } = useTranslation()

  const [status, setStatus] = useState<RoomStatus>('vacant_dirty')
  const [type, setType] = useState<RoomType>('standard')
  const [assignedTo, setAssignedTo] = useState<string>('')
  const [notes, setNotes] = useState('')
  const [guestName, setGuestName] = useState('')
  const [checkinTime, setCheckinTime] = useState('')

  useEffect(() => {
    if (!room) return
    setStatus(room.status)
    setType(room.type)
    setAssignedTo(room.assignedTo ?? '')
    setNotes(room.notes)
    setGuestName(room.guestName ?? '')
    setCheckinTime(room.checkinTime ?? '')
  }, [room])

  if (!room) return null

  const housekeepers = staff.filter((s) => s.role === 'housekeeper')

  function handleSave() {
    if (!room) return
    updateRoom(room.id, {
      status,
      type,
      assignedTo: assignedTo || null,
      notes,
      guestName: guestName || null,
      checkinTime: checkinTime || null,
      beds: ROOM_TYPE_CONFIG[type].beds,
    })
    onClose()
  }

  function handleDelete() {
    if (!room) return
    if (!confirm(`Delete room ${room.number}?`)) return
    deleteRoom(room.id)
    onClose()
  }

  const lastUpdated = new Date(room.lastUpdated).toLocaleString()

  return (
    <Modal
      open={!!room}
      onClose={onClose}
      title={`${t('room.details')} — ${room.number}`}
      size="md"
      footer={
        <div className="flex items-center justify-between w-full">
          <Button variant="danger" size="sm" icon={<Trash2 size={14} />} onClick={handleDelete}>
            {t('action.delete')}
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={onClose}>{t('action.cancel')}</Button>
            <Button variant="primary" icon={<Save size={14} />} onClick={handleSave}>{t('action.save')}</Button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Room info row */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
          <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center">
            <span className="text-lg font-bold text-slate-700">{room.number}</span>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <StatusBadge status={room.status} />
              <TypeBadge type={room.type} />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {t('room.floor')} {room.floor} · {t('room.lastUpdated')}: {lastUpdated}
            </p>
          </div>
        </div>

        {/* Status picker */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">{t('room.updateStatus')}</label>
          <div className="grid grid-cols-2 gap-2">
            {ALL_STATUSES.map((s) => {
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

        {/* Room type */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">{t('room.type')}</label>
          <div className="grid grid-cols-4 gap-2">
            {ALL_TYPES.map((tp) => {
              const cfg = ROOM_TYPE_CONFIG[tp]
              const label = localizeType(cfg, language)
              return (
                <button
                  key={tp}
                  onClick={() => setType(tp)}
                  className={`px-2 py-2 rounded-lg border text-xs font-medium transition-all text-center
                    ${type === tp
                      ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Assign housekeeper */}
        <div>
          <label className="text-sm font-medium text-slate-700 block mb-2">{t('room.assignHousekeeper')}</label>
          <select
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
              focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
          >
            <option value="">{t('room.unassigned')}</option>
            {housekeepers.map((hk) => (
              <option key={hk.id} value={hk.id}>{hk.name}</option>
            ))}
          </select>
        </div>

        {/* Guest info */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">{t('room.guestName')}</label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="e.g. John Smith"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
                focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1">{t('room.checkinTime')}</label>
            <input
              type="time"
              value={checkinTime}
              onChange={(e) => setCheckinTime(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm
                focus:border-[#1e3a5f] focus:outline-none focus:ring-2 focus:ring-[#1e3a5f]/20"
            />
          </div>
        </div>

        {/* Notes */}
        <Textarea
          label={t('room.notes')}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder={t('room.notesPlaceholder')}
        />
      </div>
    </Modal>
  )
}
