import { createSeats } from '@/features/seat/utils/createSeats'
import type { Seat, SeatGradeInfo, SeatStatusMap, Zone } from '@/types/seat'

const SEAT_GAP = 28
const SEAT_RADIUS = 9
const LABEL_WIDTH = 32
const STAGE_HEIGHT = 40

interface SeatMapProps {
  zone: Zone
  grade: SeatGradeInfo
  statusMap: SeatStatusMap
  onSeatClick: (seat: Seat) => void
}

/**
 * SeatMap
 * @description 구역 하나의 좌석 배치도, 매진·선택 상태 표시와 좌석 클릭
 */
const SeatMap = ({ zone, grade, statusMap, onSeatClick }: SeatMapProps) => {
  const width = LABEL_WIDTH + zone.seatsPerRow * SEAT_GAP
  const height = STAGE_HEIGHT + zone.rows * SEAT_GAP

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block h-auto w-full"
      role="group"
      aria-label={`${zone.label} 좌석도`}
    >
      <text x={width / 2} y={20} textAnchor="middle" className="fill-gray-500 text-xs font-bold">
        STAGE 방향
      </text>

      {Array.from({ length: zone.rows }, (_, i) => (
        <text
          key={i}
          x={LABEL_WIDTH / 2}
          y={STAGE_HEIGHT + (i + 0.5) * SEAT_GAP}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-gray-400 text-[10px]"
        >
          {i + 1}
        </text>
      ))}

      {createSeats(zone).map((seat) => {
        const status = statusMap[seat.id] ?? 'available'

        return (
          <circle
            key={seat.id}
            cx={LABEL_WIDTH + (seat.number - 0.5) * SEAT_GAP}
            cy={STAGE_HEIGHT + (seat.row - 0.5) * SEAT_GAP}
            r={SEAT_RADIUS}
            className={
              status === 'sold'
                ? 'fill-gray-200'
                : `cursor-pointer hover:opacity-70 ${status === 'selected' ? 'fill-gray-900' : grade.fillClass}`
            }
            onClick={status === 'sold' ? undefined : () => onSeatClick(seat)}
          >
            <title>{`${zone.label} ${seat.row}열 ${seat.number}번${status === 'sold' ? ' 매진' : ''}`}</title>
          </circle>
        )
      })}
    </svg>
  )
}

export default SeatMap
