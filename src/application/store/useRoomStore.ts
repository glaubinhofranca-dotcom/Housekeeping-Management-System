import { create } from 'zustand'
import { nanoid } from '@/infrastructure/nanoid'
import type { Room, Staff, RoomStatus, RoomFilters, FloorConfig } from '@/domain/types'
import { DEFAULT_ROOMS, DEFAULT_STAFF, PRIORITY_DEFAULTS, ROOM_TYPE_CONFIG } from '@/domain/constants'
import { persist as storagePersist, retrieve } from '@/infrastructure/persistence'

interface RoomStore {
  rooms: Room[]
  staff: Staff[]
  filters: RoomFilters

  // Room mutations
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

  // Filter mutations
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

function load<T>(key: string, fallback: T): T {
  return retrieve<T>(key) ?? fallback
}

function save(rooms: Room[], staff: Staff[]) {
  storagePersist('rooms', rooms)
  storagePersist('staff', staff)
}

function ts() {
  return new Date().toISOString()
}

export const useRoomStore = create<RoomStore>((set, get) => ({
  rooms: load('rooms', DEFAULT_ROOMS),
  staff: load('staff', DEFAULT_STAFF),
  filters: DEFAULT_FILTERS,

  addRoom: (data) => {
    const room: Room = { ...data, lastUpdated: ts() }
    const rooms = [...get().rooms, room]
    save(rooms, get().staff)
    set({ rooms })
  },

  updateRoom: (id, updates) => {
    const rooms = get().rooms.map((r) =>
      r.id === id ? { ...r, ...updates, lastUpdated: ts() } : r,
    )
    save(rooms, get().staff)
    set({ rooms })
  },

  deleteRoom: (id) => {
    const rooms = get().rooms.filter((r) => r.id !== id)
    save(rooms, get().staff)
    set({ rooms })
  },

  updateRoomStatus: (id, status) => {
    const rooms = get().rooms.map((r) => {
      if (r.id !== id) return r
      return {
        ...r,
        status,
        priority: PRIORITY_DEFAULTS[status] + r.floor,
        lastUpdated: ts(),
      }
    })
    save(rooms, get().staff)
    set({ rooms })
  },

  assignRoom: (roomId, staffId) => {
    const rooms = get().rooms.map((r) =>
      r.id === roomId ? { ...r, assignedTo: staffId, lastUpdated: ts() } : r,
    )
    save(rooms, get().staff)
    set({ rooms })
  },

  movePriority: (id, direction) => {
    const { rooms } = get()
    const idx = rooms.findIndex((r) => r.id === id)
    if (idx < 0) return

    const sorted = [...rooms].sort((a, b) => a.priority - b.priority)
    const sortedIdx = sorted.findIndex((r) => r.id === id)

    const swapIdx = direction === 'up' ? sortedIdx - 1 : sortedIdx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    const tempPriority = sorted[sortedIdx].priority
    sorted[sortedIdx] = { ...sorted[sortedIdx], priority: sorted[swapIdx].priority }
    sorted[swapIdx] = { ...sorted[swapIdx], priority: tempPriority }

    // Rebuild the original array with updated priorities
    const priorityMap = new Map(sorted.map((r) => [r.id, r.priority]))
    const updated = rooms.map((r) => ({ ...r, priority: priorityMap.get(r.id) ?? r.priority }))

    save(updated, get().staff)
    set({ rooms: updated })
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
    save(rooms, get().staff)
    set({ rooms })
  },

  resetAllRooms: () => {
    const rooms = DEFAULT_ROOMS.map((r) => ({ ...r, lastUpdated: ts() }))
    save(rooms, get().staff)
    set({ rooms })
  },

  addStaff: (data) => {
    const staff = [...get().staff, { ...data, id: nanoid() }]
    save(get().rooms, staff)
    set({ staff })
  },

  updateStaff: (id, updates) => {
    const staff = get().staff.map((s) => (s.id === id ? { ...s, ...updates } : s))
    save(get().rooms, staff)
    set({ staff })
  },

  deleteStaff: (id) => {
    const staff = get().staff.filter((s) => s.id !== id)
    // Unassign all rooms that were assigned to this staff member
    const rooms = get().rooms.map((r) =>
      r.assignedTo === id ? { ...r, assignedTo: null, lastUpdated: ts() } : r,
    )
    save(rooms, staff)
    set({ staff, rooms })
  },

  setFilters: (partial) => {
    set({ filters: { ...get().filters, ...partial } })
  },

  clearFilters: () => {
    set({ filters: DEFAULT_FILTERS })
  },
}))

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
