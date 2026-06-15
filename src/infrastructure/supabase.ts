import { createClient } from '@supabase/supabase-js'
import type { Room, Staff } from '@/domain/types'

// anon key is safe to expose in client-side code (protected by RLS)
export const supabase = createClient(
  'https://vlqjlxiaikifcoibozof.supabase.co',
  'sb_publishable_HD-MxNGXGRzX9uMiSARvIA_C21DWYU7',
)

// ── Row ↔ Domain mappers ─────────────────────────────────────────────────────

export interface RoomRow {
  id: string
  number: string
  floor: number
  type: string
  status: string
  priority: number
  assigned_to: string | null
  notes: string
  guest_name: string | null
  checkin_time: string | null
  beds: number
  last_updated: string
}

export interface StaffRow {
  id: string
  name: string
  role: string
}

export function rowToRoom(row: RoomRow): Room {
  return {
    id: row.id,
    number: row.number,
    floor: row.floor,
    type: row.type as Room['type'],
    status: row.status as Room['status'],
    priority: row.priority,
    assignedTo: row.assigned_to,
    notes: row.notes ?? '',
    guestName: row.guest_name,
    checkinTime: row.checkin_time,
    beds: row.beds,
    lastUpdated: row.last_updated,
  }
}

export function roomToRow(room: Room): RoomRow {
  return {
    id: room.id,
    number: room.number,
    floor: room.floor,
    type: room.type,
    status: room.status,
    priority: room.priority,
    assigned_to: room.assignedTo,
    notes: room.notes,
    guest_name: room.guestName,
    checkin_time: room.checkinTime,
    beds: room.beds,
    last_updated: room.lastUpdated,
  }
}

export function rowToStaff(row: StaffRow): Staff {
  return {
    id: row.id,
    name: row.name,
    role: row.role as Staff['role'],
  }
}
