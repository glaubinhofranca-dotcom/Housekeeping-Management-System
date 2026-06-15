import { useState } from 'react'
import { CheckCircle2, Star } from 'lucide-react'
import { Header } from '@/presentation/components/Header'
import { HousekeeperRoomCard } from '@/presentation/components/RoomCard'
import { useRoomStore, selectHousekeeperRooms } from '@/application/store/useRoomStore'
import { useAuthStore } from '@/application/store/useAuthStore'
import { useTranslation } from '@/application/i18n/LanguageContext'
import { STATUS_CONFIG, localizeStatus } from '@/domain/constants'
import type { Language, RoomStatus } from '@/domain/types'
import type { TranslationKey } from '@/application/i18n/translations'

const WORK_STATUSES = new Set<RoomStatus>(['checkout', 'checkin_pending', 'occupied_dirty', 'vacant_dirty', 'clean'])

export function HousekeeperPage() {
  const { t, language } = useTranslation()
  const { profile: currentUser } = useAuthStore()
  const store = useRoomStore()

  const [floorFilter, setFloorFilter] = useState<number | null>(null)

  if (!currentUser) return null

  const allRooms = selectHousekeeperRooms(store, currentUser.id)
  const floors = [...new Set(allRooms.map((r) => r.floor))].sort()

  const rooms = floorFilter !== null
    ? allRooms.filter((r) => r.floor === floorFilter)
    : allRooms

  const pendingRooms = rooms.filter((r) => WORK_STATUSES.has(r.status))
  const doneRooms = rooms.filter((r) => !WORK_STATUSES.has(r.status))

  const allDone = allRooms.length > 0 && pendingRooms.length === 0 && floorFilter === null

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <Header />

      {/* Welcome bar */}
      <div className="bg-white border-b border-slate-200 px-4 md:px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">{t('hk.myAssignments')}</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {currentUser.name} · {allRooms.length} rooms · {pendingRooms.length} pending
            </p>
          </div>

          {/* Progress ring */}
          <ProgressRing done={allRooms.length - pendingRooms.length} total={allRooms.length} />
        </div>

        {/* Floor filter */}
        {floors.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            <button
              onClick={() => setFloorFilter(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex-shrink-0
                ${floorFilter === null
                  ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                  : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                }`}
            >
              {t('filter.allFloors')}
            </button>
            {floors.map((f) => (
              <button
                key={f}
                onClick={() => setFloorFilter(f === floorFilter ? null : f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all flex-shrink-0
                  ${floorFilter === f
                    ? 'bg-[#1e3a5f] text-white border-[#1e3a5f]'
                    : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                  }`}
              >
                {t('hk.floor')} {f}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {allRooms.length === 0 ? (
          <EmptyAssignments t={t} />
        ) : allDone ? (
          <AllDoneScreen t={t} />
        ) : (
          <div className="px-4 md:px-6 py-4 space-y-6 max-w-2xl mx-auto w-full">
            {pendingRooms.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Pending · {pendingRooms.length}
                </h3>
                <div className="space-y-3">
                  {pendingRooms.map((room, idx) => (
                    <HousekeeperRoomCard
                      key={room.id}
                      room={room}
                      index={idx}
                      total={pendingRooms.length}
                    />
                  ))}
                </div>
              </section>
            )}

            {doneRooms.length > 0 && (
              <section>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Completed · {doneRooms.length}
                </h3>
                <div className="space-y-2 opacity-70">
                  {doneRooms.map((room) => (
                    <DoneRoomRow key={room.id} room={typeof room === 'object' ? room : room} language={language} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ProgressRing({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? (done / total) * 100 : 0
  const r = 20
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ

  return (
    <div className="relative w-14 h-14 flex-shrink-0">
      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={r} fill="none" stroke="#e2e8f0" strokeWidth="4" />
        <circle
          cx="24" cy="24" r={r} fill="none"
          stroke="#22c55e" strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-bold text-slate-700">{done}/{total}</span>
      </div>
    </div>
  )
}

function EmptyAssignments({ t }: { t: (k: TranslationKey) => string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center p-12">
      <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center">
        <Star size={28} className="text-slate-400" />
      </div>
      <div>
        <h3 className="font-semibold text-slate-700">{t('hk.noAssignments')}</h3>
        <p className="text-sm text-slate-500 mt-1">{t('hk.noAssignmentsDesc')}</p>
      </div>
    </div>
  )
}

function AllDoneScreen({ t }: { t: (k: TranslationKey) => string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 text-center p-12">
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle2 size={40} className="text-green-600" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-green-700">{t('hk.allDone')}</h3>
        <p className="text-sm text-slate-500 mt-1">{t('hk.allDoneDesc')}</p>
      </div>
    </div>
  )
}

function DoneRoomRow({ room, language }: { room: import('@/domain/types').Room; language: Language }) {
  const cfg = STATUS_CONFIG[room.status]
  const label = localizeStatus(cfg, language)
  return (
    <div className="flex items-center gap-3 bg-white rounded-xl border border-slate-200 px-4 py-3">
      <div className="w-9 h-9 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center flex-shrink-0">
        <span className="text-sm font-bold text-slate-500">{room.number}</span>
      </div>
      <div className="flex-1">
        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
          {label}
        </span>
      </div>
      <span className="text-xs text-slate-400">Floor {room.floor}</span>
    </div>
  )
}
