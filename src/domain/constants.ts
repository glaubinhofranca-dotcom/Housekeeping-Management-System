import type { RoomStatus, RoomType, Staff, Room, StatusConfig, Language } from './types'

export const STATUS_CONFIG: Record<RoomStatus, StatusConfig> = {
  vacant_dirty: {
    label: 'Vacant Dirty',
    labelPt: 'Vago Sujo',
    labelEs: 'Vacante Sucio',
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    border: 'border-amber-300',
    dot: 'bg-amber-500',
  },
  checkout: {
    label: 'Checkout',
    labelPt: 'Checkout',
    labelEs: 'Checkout',
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-300',
    dot: 'bg-red-500',
  },
  checkin_pending: {
    label: 'Check-in Pending',
    labelPt: 'Check-in Pendente',
    labelEs: 'Check-in Pendiente',
    bg: 'bg-violet-100',
    text: 'text-violet-800',
    border: 'border-violet-300',
    dot: 'bg-violet-500',
  },
  occupied_dirty: {
    label: 'Occupied Dirty',
    labelPt: 'Ocupado Sujo',
    labelEs: 'Ocupado Sucio',
    bg: 'bg-orange-100',
    text: 'text-orange-800',
    border: 'border-orange-300',
    dot: 'bg-orange-500',
  },
  clean: {
    label: 'Clean',
    labelPt: 'Limpo',
    labelEs: 'Limpio',
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-300',
    dot: 'bg-green-500',
  },
  inspected: {
    label: 'Inspected',
    labelPt: 'Inspecionado',
    labelEs: 'Inspeccionado',
    bg: 'bg-teal-100',
    text: 'text-teal-800',
    border: 'border-teal-300',
    dot: 'bg-teal-500',
  },
  dnd: {
    label: 'Do Not Disturb',
    labelPt: 'Não Perturbe',
    labelEs: 'No Molestar',
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    border: 'border-gray-300',
    dot: 'bg-gray-400',
  },
  out_of_order: {
    label: 'Out of Order',
    labelPt: 'Fora de Serviço',
    labelEs: 'Fuera de Servicio',
    bg: 'bg-red-950',
    text: 'text-red-100',
    border: 'border-red-800',
    dot: 'bg-red-400',
  },
}

export const ROOM_TYPE_CONFIG: Record<
  RoomType,
  { label: string; labelPt: string; labelEs: string; beds: number }
> = {
  standard:     { label: 'Standard',     labelPt: 'Standard',     labelEs: 'Estándar',     beds: 1 },
  deluxe:       { label: 'Deluxe',       labelPt: 'Deluxe',       labelEs: 'Deluxe',       beds: 2 },
  suite:        { label: 'Suite',        labelPt: 'Suíte',        labelEs: 'Suite',        beds: 2 },
  presidential: { label: 'Presidential', labelPt: 'Presidencial', labelEs: 'Presidencial', beds: 3 },
}

export function localizeStatus(cfg: StatusConfig, lang: Language): string {
  if (lang === 'pt') return cfg.labelPt
  if (lang === 'es') return cfg.labelEs
  return cfg.label
}

export function localizeType(
  cfg: { label: string; labelPt: string; labelEs: string },
  lang: Language,
): string {
  if (lang === 'pt') return cfg.labelPt
  if (lang === 'es') return cfg.labelEs
  return cfg.label
}

export const DEFAULT_STAFF: Staff[] = [
  { id: 'sup-1', name: 'Maria Johnson', role: 'supervisor' },
  { id: 'sup-2', name: 'Robert Chen', role: 'supervisor' },
  { id: 'hk-1', name: 'Ana Silva', role: 'housekeeper' },
  { id: 'hk-2', name: 'Carmen López', role: 'housekeeper' },
  { id: 'hk-3', name: 'Fatima Oliveira', role: 'housekeeper' },
  { id: 'hk-4', name: 'Tatiana Pereira', role: 'housekeeper' },
  { id: 'hk-5', name: 'Lucia Santos', role: 'housekeeper' },
  { id: 'hk-6', name: 'Rosa Ferreira', role: 'housekeeper' },
]

const now = new Date().toISOString()

function makeRoom(
  id: string,
  number: string,
  floor: number,
  type: RoomType,
  status: RoomStatus,
  priority: number,
  assignedTo: string | null = null,
  beds = 1,
  notes = '',
  guestName: string | null = null,
  checkinTime: string | null = null,
): Room {
  return { id, number, floor, type, status, priority, assignedTo, beds, notes, guestName, checkinTime, lastUpdated: now }
}

export const DEFAULT_ROOMS: Room[] = [
  makeRoom('r101', '101', 1, 'standard', 'checkout', 1, 'hk-1', 1, '', 'James Walker'),
  makeRoom('r102', '102', 1, 'standard', 'checkin_pending', 2, 'hk-1', 1, '', null, '14:00'),
  makeRoom('r103', '103', 1, 'standard', 'clean', 3, 'hk-1'),
  makeRoom('r104', '104', 1, 'deluxe', 'dnd', 4, null, 2, '', 'Emily Davis'),
  makeRoom('r105', '105', 1, 'standard', 'vacant_dirty', 5, 'hk-2'),
  makeRoom('r106', '106', 1, 'standard', 'occupied_dirty', 6, 'hk-2', 1, '', 'Mark Brown'),
  makeRoom('r107', '107', 1, 'standard', 'inspected', 7, 'hk-2'),
  makeRoom('r108', '108', 1, 'standard', 'out_of_order', 8, null, 1, 'Plumbing repair'),
  makeRoom('r201', '201', 2, 'deluxe', 'checkout', 1, 'hk-3', 2, '', 'Sarah Connor'),
  makeRoom('r202', '202', 2, 'deluxe', 'checkin_pending', 2, 'hk-3', 2, '', null, '15:00'),
  makeRoom('r203', '203', 2, 'deluxe', 'occupied_dirty', 3, 'hk-3', 2, 'Extra towels requested', 'Tom Wilson'),
  makeRoom('r204', '204', 2, 'deluxe', 'vacant_dirty', 4, 'hk-4', 2),
  makeRoom('r205', '205', 2, 'deluxe', 'clean', 5, 'hk-4', 2),
  makeRoom('r206', '206', 2, 'deluxe', 'dnd', 6, null, 2, '', 'Alice Kim'),
  makeRoom('r207', '207', 2, 'suite', 'checkout', 1, 'hk-5', 2, 'VIP checkout — deep clean', 'John Smith'),
  makeRoom('r208', '208', 2, 'suite', 'inspected', 8, 'hk-5', 2),
  makeRoom('r301', '301', 3, 'suite', 'checkin_pending', 1, 'hk-5', 2, 'VIP arrival 2pm', null, '14:00'),
  makeRoom('r302', '302', 3, 'suite', 'occupied_dirty', 2, 'hk-6', 2, '', 'Dr. Peterson'),
  makeRoom('r303', '303', 3, 'suite', 'vacant_dirty', 3, 'hk-6', 2),
  makeRoom('r304', '304', 3, 'suite', 'clean', 4, 'hk-6', 2),
  makeRoom('r401', '401', 4, 'presidential', 'checkout', 1, 'hk-1', 3, 'VIP departure — white glove service', 'Senator Williams'),
  makeRoom('r402', '402', 4, 'presidential', 'checkin_pending', 2, 'hk-1', 3, 'Fresh flowers required', null, '16:00'),
  makeRoom('r403', '403', 4, 'presidential', 'inspected', 3, 'hk-2', 3),
  makeRoom('r404', '404', 4, 'presidential', 'dnd', 4, null, 3, '', 'CEO Martinez'),
]

export const PRIORITY_DEFAULTS: Record<RoomStatus, number> = {
  checkout: 10,
  checkin_pending: 20,
  occupied_dirty: 30,
  vacant_dirty: 40,
  clean: 60,
  inspected: 70,
  dnd: 80,
  out_of_order: 90,
}
