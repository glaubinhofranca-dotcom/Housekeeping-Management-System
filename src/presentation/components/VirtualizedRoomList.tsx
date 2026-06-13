import { useRef, useEffect, useState } from 'react'
import { FixedSizeList, type ListChildComponentProps } from 'react-window'
import type { Room, Staff } from '@/domain/types'
import { SupervisorRoomCard } from './RoomCard'

const ITEM_HEIGHT = 92

interface VirtualizedRoomListProps {
  rooms: Room[]
  staff: Staff[]
  onRoomClick: (room: Room) => void
}

interface ItemData {
  rooms: Room[]
  staff: Staff[]
  onRoomClick: (room: Room) => void
}

function RoomRow({ index, style, data }: ListChildComponentProps<ItemData>) {
  const { rooms, staff, onRoomClick } = data
  const room = rooms[index]
  if (!room) return null
  return <SupervisorRoomCard room={room} staff={staff} onClick={onRoomClick} style={style} />
}

export function VirtualizedRoomList({ rooms, staff, onRoomClick }: VirtualizedRoomListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(600)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setHeight(entry.contentRect.height)
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const itemData: ItemData = { rooms, staff, onRoomClick }

  return (
    <div ref={containerRef} className="flex-1 overflow-hidden">
      <FixedSizeList
        height={height}
        width="100%"
        itemCount={rooms.length}
        itemSize={ITEM_HEIGHT}
        itemData={itemData}
        overscanCount={5}
      >
        {RoomRow}
      </FixedSizeList>
    </div>
  )
}

// Export height constant so parent can use it for calculations
export { ITEM_HEIGHT }
