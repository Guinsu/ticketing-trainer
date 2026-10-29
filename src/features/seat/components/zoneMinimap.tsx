import { getZoneCenter, getZonePath } from '@/features/seat/utils/zoneGeometry'
import type { Venue, Zone } from '@/types/seat'

interface ZoneMinimapProps {
  venue: Venue
  soldOutZoneIds: string[]
  onZoneClick: (zone: Zone) => void
}

/**
 * ZoneMinimap
 * @description 공연장 전체 구역 배치도, 등급 색상·매진·미판매 구역 표시와 구역 클릭
 */
const ZoneMinimap = ({ venue, soldOutZoneIds, onZoneClick }: ZoneMinimapProps) => {
  const { stage } = venue

  return (
    <svg
      viewBox="-440 -440 880 880"
      className="block h-auto w-full max-w-xl"
      role="group"
      aria-label={`${venue.name} 구역 배치도`}
    >
      <rect x={stage.x} y={stage.y} width={stage.width} height={stage.height} className="fill-gray-800" />
      <text
        x={stage.x + stage.width / 2}
        y={stage.y + stage.height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        className="fill-white text-xl font-bold tracking-[0.3em]"
      >
        STAGE
      </text>

      {venue.zones.map((zone) => {
        const grade = venue.grades.find((item) => item.id === zone.grade)
        const isSoldOut = soldOutZoneIds.includes(zone.id)
        const isClickable = zone.isOnSale && !isSoldOut
        const center = getZoneCenter(zone.shape)
        const statusText = !zone.isOnSale ? ' 미판매' : isSoldOut ? ' 매진' : zone.isObstructed ? ' 시야제한' : ''

        return (
          <g
            key={zone.id}
            className={isClickable ? 'cursor-pointer hover:opacity-70' : ''}
            onClick={isClickable ? () => onZoneClick(zone) : undefined}
          >
            <title>{`${zone.label}${statusText}`}</title>
            <path
              d={getZonePath(zone.shape)}
              className={!zone.isOnSale ? 'fill-gray-100' : isSoldOut ? 'fill-gray-300' : grade?.fillClass}
            />
            <text
              x={center.x}
              y={center.y}
              textAnchor="middle"
              dominantBaseline="central"
              className={`pointer-events-none text-lg font-bold ${isClickable ? 'fill-white' : 'fill-gray-400'}`}
            >
              {zone.id}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

export default ZoneMinimap
