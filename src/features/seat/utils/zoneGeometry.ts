import type { ZoneShape } from '@/types/seat'

const ZONE_GAP_DEG = 0.6 // 이웃 구역 사이 틈

// 12시 0도에서 시계 방향 각도와 반지름을 SVG 좌표로 바꾼다
const toPoint = (angle: number, radius: number) => {
  const rad = (angle * Math.PI) / 180
  return { x: radius * Math.sin(rad), y: -radius * Math.cos(rad) }
}

// 플로어는 사각형, 2·3층은 바깥 호 → 안쪽 호로 닫은 부채꼴
export const getZonePath = (shape: ZoneShape) => {
  if (shape.type === 'rect') {
    const { x, y, width, height } = shape
    return `M${x} ${y}h${width}v${height}h${-width}Z`
  }

  const start = shape.startAngle + ZONE_GAP_DEG
  const end = shape.endAngle - ZONE_GAP_DEG
  const outerStart = toPoint(start, shape.outerRadius)
  const outerEnd = toPoint(end, shape.outerRadius)
  const innerEnd = toPoint(end, shape.innerRadius)
  const innerStart = toPoint(start, shape.innerRadius)

  return [
    `M${outerStart.x} ${outerStart.y}`,
    `A${shape.outerRadius} ${shape.outerRadius} 0 0 1 ${outerEnd.x} ${outerEnd.y}`,
    `L${innerEnd.x} ${innerEnd.y}`,
    `A${shape.innerRadius} ${shape.innerRadius} 0 0 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ')
}

// 구역 번호를 쓸 가운데 좌표
export const getZoneCenter = (shape: ZoneShape) =>
  shape.type === 'rect'
    ? { x: shape.x + shape.width / 2, y: shape.y + shape.height / 2 }
    : toPoint((shape.startAngle + shape.endAngle) / 2, (shape.innerRadius + shape.outerRadius) / 2)
