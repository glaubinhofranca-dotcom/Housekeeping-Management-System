import { create } from 'zustand'
import { nanoid } from '@/infrastructure/nanoid'
import { supabase, rowToRoom, roomToRow, rowToStaff } from '@/infrastructure/supabase'
import type { RoomRow, StaffRow } from '@/infrastructure/supabase'
import type { Room, Staff, RoomStatus, RoomFilters, FloorConfig } from '@/domain/types'
import { DEFAULT_ROOMS, DEFAULT_STAFF, PRIORITY_DEFAULTS, ROOM_TYPE_CONFIG } from '@/domain/constants'

interface RoomStore {
  rooms: Room[]
  staff: Staff[]
  filters: RoomFilters
  initialized: boolean
  error: string | null

  // Lifecycle
  init: () => Promise<void>

  // Room mutations (optimistic update + background Supabase write)
  addRoom: (data: Omit<Room, 'lastUpdated'>) => void
  updateRoom: (id: string, updates: Partial<Omit<Room, 'id'>>) => void
  deleteRoom: (id: string) => void
  updateRoomStatus: (id: string, status: RoomStatus) => void
  assignRoom: (roomId: string, staffId: string | null) => void
  movePriority: (id: string, direction: 'up' | 'down') => void
  bulkGenerateRooms: (floors: FloorConfig[], replace: boolean) => void
  resetAllRooms: () => void

  // Staff mutations
  addStaff: (staff: Omit<Staff, 'id'>) => void
  updateStaff: (id: string, updates: Partial<Omit<Staff, 'id'>>) => void
  deleteStaff: (id: string) => void

  // Filter mutations (local only)
  setFilters: (partial: Partial<RoomFilters>) => void
  clearFilters: () => void
}

const DEFAULT_FILTERS: RoomFilters = {
  floor: null,
  status: null,
  type: null,
  assignedTo: null,
  search: '',
}

function ts() {
  return new Date().toISOString()
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: [],
  staff: [],
  filters: DEFAULT_FILTERS,
  initialized: false,
  error: null,

  // ── Initialization ─────────────────────────────────────────────────────────

  init: async () => {
    if (get().initialized) return

    try {
      // Load rooms
      const { data: roomRows, error: roomErr } = await supabase
        .from('rooms')
        .select('*')
        .order('priority')

      if (roomErr) throw roomErr

      let rooms: Room[]
      if (roomRows && roomRows.length > 0) {
        rooms = (roomRows as RoomRow[]).map(rowToRoom)
      } else {
        // Seed defaults on first use
        rooms = DEFAULT_ROOMS
        await supabase.from('rooms').upsert(rooms.map(roomToRow))
      }

      // Load staff
      const { data: staffRows, error: staffErr } = await supabase
        .from('staff')
        .select('*')

      if (staffErr) throw staffErr

      let staff: Staff[]
      if (staffRows && staffRows.length > 0) {
        staff = (staffRows as StaffRow[]).map(rowToStaff)
      } else {
        staff = DEFAULT_STAFF
        await supabase.from('staff').upsert(staff)
      }

      set({ rooms, staff, initialized: true, error: null })

      // ── Realtime subscriptions ─────────────────────────────────────────────

      supabase
        .channel('rooms-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'rooms' },
          (payload) => {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const updated = rowToRoom(payload.new as RoomRow)
              set((state) => {
                const exists = state.rooms.some((r) => r.id === updated.id)
                return {
                  rooms: exists
                    ? state.rooms.map((r) => (r.id === updated.id ? updated : r))
                    : [...state.rooms, updated],
                }
              })
            }
            if (payload.eventType === 'DELETE') {
              const id = (payload.old as RoomRow).id
              set((state) => ({ rooms: state.rooms.filter((r) => r.id !== id) }))
            }
          },
        )
        .subscribe()

      supabase
        .channel('staff-changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'staff' },
          (payload) => {
            if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
              const updated = rowToStaff(payload.new as StaffRow)
              set((state) => {
                const exists = state.staff.some((s) => s.id === updated.id)
                return {
                  staff: exists
                    ? state.staff.map((s) => (s.id === updated.id ? updated : s))
                    : [...state.staff, updated],
                }
              })
            }
            if (payload.eventType === 'DELETE') {
              const id = (payload.old as StaffRow).id
              set((state) => ({ staff: state.staff.filter((s) => s.id !== id) }))
            }
          },
        )
        .subscribe()

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to connect to database'
      set({ error: message, initialized: true })
    }
  },

  // ── Room mutations ─────────────────────────────────────────────────────────

  addRoom: (data) => {
    const room: Room = { ...data, lastUpdated: ts() }
    set((state) => ({ rooms: [...state.rooms, room] }))
    supabase.from('rooms').insert(roomToRow(room)).then(({ error }) => {
      if (error) console.error('addRoom:', error)
    })
  },

  updateRoom: (id, updates) => {
    const now = ts()
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r.id === id ? { ...r, ...updates, lastUpdated: now } : r,
      ),
    }))
    const room = get().rooms.find((r) => r.id === id)
    if (!room) return
    supabase.from('rooms').update(roomToRow(room)).eq('id', id).then(({ error }) => {
      if (error) console.error('updateRoom:', error)
    })
  },

  deleteRoom: (id) => {
    set((state) => ({ rooms: state.rooms.filter((r) => r.id !== id) }))
    supabase.from('rooms').delete().eq('id', id).then(({ error }) => {
      if (error) console.error('deleteRoom:', error)
    })
  },

  updateRoomStatus: (id, status) => {
    const now = ts()
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r.id === id
          ? { ...r, status, priority: PRIORITY_DEFAULTS[status] + r.floor, lastUpdated: now }
          : r,
      ),
    }))
    const room = get().rooms.find((r) => r.id === id)
    if (!room) return
    supabase
      .from('rooms')
      .update({ status, priority: room.priority, last_updated: now })
      .eq('id', id)
      .then(({ error }) => { if (error) console.error('updateRoomStatus:', error) })
  },

  assignRoom: (roomId, staffId) => {
    const now = ts()
    set((state) => ({
      rooms: state.rooms.map((r) =>
        r.id === roomId ? { ...r, assignedTo: staffId, lastUpdated: now } : r,
      ),
    }))
    supabase
      .from('rooms')
      .update({ assigned_to: staffId, last_updated: now })
      .eq('id', roomId)
      .then(({ error }) => { if (error) console.error('assignRoom:', error) })
  },

  movePriority: (id, direction) => {
    const { rooms } = get()
    const sorted = [...rooms].sort((a, b) => a.priority - b.priority)
    const sortedIdx = sorted.findIndex((r) => r.id === id)

    const swapIdx = direction === 'up' ? sortedIdx - 1 : sortedIdx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    const aId = sorted[sortedIdx].id
    const bId = sorted[swapIdx].id
    const aPriority = sorted[sortedIdx].priority
    const bPriority = sorted[swapIdx].priority

    set((state) => ({
      rooms: state.rooms.map((r) => {
        if (r.id === aId) return { ...r, priority: bPriority }
        if (r.id === bId) return { ...r, priority: aPriority }
        return r
      }),
    }))

    // Write both swapped priorities to Supabase
    Promise.all([
      supabase.from('rooms').update({ priority: bPriority }).eq('id', aId),
      supabase.from('rooms').update({ priority: aPriority }).eq('id', bId),
    ]).then(([a, b]) => {
      if (a.error) console.error('movePriority a:', a.error)
      if (b.error) console.error('movePriority b:', b.error)
    })
  },

  bulkGenerateRooms: (floors, replace) => {
    const generated: Room[] = []
    for (const floor of floors) {
      const beds = ROOM_TYPE_CONFIG[floor.type].beds
      for (let i = 0; i < floor.count; i++) {
        const roomNum = floor.startRoom + i
        const number = String(floor.floor * 100 + roomNum).padStart(3, '0')
        generated.push({
          id: nanoid(),
          number,
          floor: floor.floor,
          type: floor.type,
          status: floor.status,
          priority: PRIORITY_DEFAULTS[floor.status] + floor.floor,
          assignedTo: null,
          notes: '',
          guestName: null,
          checkinTime: null,
          beds,
          lastUpdated: ts(),
        })
      }
    }

    const existing = replace ? [] : get().rooms
    const rooms = [...existing, ...generated]
    set({ rooms })

    const upsertAll = async () => {
      if (replace) await supabase.from('rooms').delete().neq('id', '')
      await supabase.from('rooms').upsert(generated.map(roomToRow))
    }
    upsertAll().then(() => {}).catch((e) => console.error('bulkGenerate:', e))
  },

  resetAllRooms: () => {
    const rooms = DEFAULT_ROOMS.map((r) => ({ ...r, lastUpdated: ts() }))
    set({ rooms })
    supabase.from('rooms').upsert(rooms.map(roomToRow))
      .then(({ error }) => { if (error) console.error('resetAllRooms:', error) })
  },

  // ── Staff mutations ────────────────────────────────────────────────────────

  addStaff: (data) => {
    const member: Staff = { ...data, id: nanoid() }
    set((state) => ({ staff: [...state.staff, member] }))
    supabase.from('staff').insert(member).then(({ error }) => {
      if (error) console.error('addStaff:', error)
    })
  },

  updateStaff: (id, updates) => {
    set((state) => ({
      staff: state.staff.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    }))
    supabase.from('staff').update(updates).eq('id', id).then(({ error }) => {
      if (error) console.error('updateStaff:', error)
    })
  },

  deleteStaff: (id) => {
    set((state) => ({
      staff: state.staff.filter((s) => s.id !== id),
      rooms: state.rooms.map((r) =>
        r.assignedTo === id ? { ...r, assignedTo: null, lastUpdated: ts() } : r,
      ),
    }))
    // Unassign rooms in DB, then delete staff
    supabase
      .from('rooms')
      .update({ assigned_to: null })
      .eq('assigned_to', id)
      .then(() => supabase.from('staff').delete().eq('id', id))
      .then(({ error }) => { if (error) console.error('deleteStaff:', error) })
  },

  // ── Filters ────────────────────────────────────────────────────────────────

  setFilters: (partial) => set((state) => ({ filters: { ...state.filters, ...partial } })),
  clearFilters: () => set({ filters: DEFAULT_FILTERS }),
}))

// ── Selectors (pure, no Supabase) ─────────────────────────────────────────────

export function selectFilteredRooms(store: RoomStore): Room[] {
  const { rooms, filters } = store
  return rooms
    .filter((r) => {
      if (filters.floor !== null && r.floor !== filters.floor) return false
      if (filters.status !== null && r.status !== filters.status) return false
      if (filters.type !== null && r.type !== filters.type) return false
      if (filters.assignedTo !== null) {
        if (filters.assignedTo === '__unassigned__') {
          if (r.assignedTo !== null) return false
        } else {
          if (r.assignedTo !== filters.assignedTo) return false
        }
      }
      if (filters.search) {
        const q = filters.search.toLowerCase()
        if (!r.number.includes(q) && !(r.guestName?.toLowerCase().includes(q) ?? false)) return false
      }
      return true
    })
    .sort((a, b) => a.priority - b.priority || a.number.localeCompare(b.number))
}

export function selectHousekeeperRooms(store: RoomStore, staffId: string): Room[] {
  return store.rooms
    .filter((r) => r.assignedTo === staffId)
    .sort((a, b) => a.priority - b.priority)
}
