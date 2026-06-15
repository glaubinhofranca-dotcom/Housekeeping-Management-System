export type RoomStatus =
  | 'vacant_dirty'
  | 'checkout'
  | 'checkin_pending'
  | 'occupied_dirty'
  | 'clean'
  | 'inspected'
  | 'dnd'
  | 'out_of_order'

export type RoomType = 'standard' | 'deluxe' | 'suite' | 'presidential'

export type UserRole = 'admin' | 'supervisor' | 'housekeeper'

export type Language = 'en' | 'pt' | 'es'

export interface Room {
  id: string
  number: string
  floor: number
  type: RoomType
  status: RoomStatus
  priority: number
  assignedTo: string | null
  notes: string
  lastUpdated: string
  checkinTime: string | null
  guestName: string | null
  beds: number
}

export interface Staff {
  id: string
  name: string
  role: UserRole
}

export interface RoomFilters {
  floor: number | null
  status: RoomStatus | null
  type: RoomType | null
  assignedTo: string | null
  search: string
}

export interface BulkRoomConfig {
  floors: FloorConfig[]
}

export interface FloorConfig {
  floor: number
  startRoom: number
  count: number
  type: RoomType
  status: RoomStatus
}

export interface StatusConfig {
  label: string
  labelPt: string
  labelEs: string
  bg: string
  text: string
  border: string
  dot: string
}
