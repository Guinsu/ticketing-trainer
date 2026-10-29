import type { Seat, Zone } from '@/types/seat'

// 구역의 열 수 × 열당 좌석 수만큼 좌석을 만든다, 열·번호는 1부터
export const createSeats = (zone: Zone): Seat[] =>
  Array.from({ length: zone.rows * zone.seatsPerRow }, (_, i) => {
    const row = Math.floor(i / zone.seatsPerRow) + 1
    const number = (i % zone.seatsPerRow) + 1

    return { id: `${zone.id}-${row}-${number}`, zoneId: zone.id, row, number, grade: zone.grade }
  })
