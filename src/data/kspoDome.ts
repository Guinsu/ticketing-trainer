import type { SeatGrade, SeatGradeInfo, Venue, Zone, ZoneBlock, ZoneLevel } from '@/types/seat'

// KSPO DOME을 연습용으로 줄인 배치, 구역 번호·블록은 실제 구조를 따르고 좌석 수만 줄였다
// A블록 쪽 무대(12시)를 바라볼 때 B블록이 오른쪽, C블록이 정면, D블록이 왼쪽

const GRADES: SeatGradeInfo[] = [
  { id: 'VIP', label: 'VIP석', price: 154000, bgClass: 'bg-primary', fillClass: 'fill-primary' },
  { id: 'R', label: 'R석', price: 132000, bgClass: 'bg-emerald-600', fillClass: 'fill-emerald-600' },
  { id: 'S', label: 'S석', price: 110000, bgClass: 'bg-sky-600', fillClass: 'fill-sky-600' },
  { id: 'A', label: 'A석', price: 88000, bgClass: 'bg-amber-500', fillClass: 'fill-amber-500' },
]

// 2층 1번 구역 시작 각도, A블록(16~22) 가운데인 19구역이 12시(0도)에 오도록 돌린 값
const START_ANGLE = 360 - 18.5 * (360 / 22)
const NOT_ON_SALE_DEG = 45 // 무대에서 이 각도 안쪽은 무대 뒤라 판매하지 않는다
const OBSTRUCTED_DEG = 65 // 이 각도 안쪽은 시야제한석

const getBlock = (zoneNumber: number): ZoneBlock =>
  zoneNumber <= 4 ? 'B' : zoneNumber <= 11 ? 'C' : zoneNumber <= 15 ? 'D' : 'A'

// 무대(0도)에서 떨어진 각도, 0~180
const getDistanceFromStage = (angle: number) => {
  const normalized = ((angle % 360) + 360) % 360
  return Math.min(normalized, 360 - normalized)
}

const FLOOR_ZONES: Zone[] = ['A', 'B', 'C', 'D', 'E', 'F'].map((name, i) => ({
  id: `F${name}`,
  label: `FLOOR ${name}`,
  level: 'floor',
  block: null,
  grade: 'VIP',
  rows: 10,
  seatsPerRow: 20,
  shape: {
    type: 'rect',
    x: -117 + (i % 3) * 79,
    y: -110 + Math.floor(i / 3) * 108,
    width: 76,
    height: 100,
  },
  isOnSale: true,
  isObstructed: false,
}))

type RingOptions = {
  level: Exclude<ZoneLevel, 'floor'>
  firstNumber: number
  count: number
  innerRadius: number
  outerRadius: number
  rows: number
  seatsPerRow: number
  grade: SeatGrade
  obstructedGrade: SeatGrade
}

// 2·3층 구역을 12시 기준 시계 방향으로 같은 각도씩 나눠 만든다
const createRingZones = ({
  level,
  firstNumber,
  count,
  innerRadius,
  outerRadius,
  rows,
  seatsPerRow,
  grade,
  obstructedGrade,
}: RingOptions): Zone[] =>
  Array.from({ length: count }, (_, i) => {
    const step = 360 / count
    const startAngle = START_ANGLE + i * step
    const distance = getDistanceFromStage(startAngle + step / 2)
    const isObstructed = distance >= NOT_ON_SALE_DEG && distance < OBSTRUCTED_DEG
    const zoneNumber = firstNumber + i

    return {
      id: String(zoneNumber),
      label: `${zoneNumber}구역`,
      level,
      block: level === '2F' ? getBlock(zoneNumber) : null,
      grade: isObstructed ? obstructedGrade : grade,
      rows,
      seatsPerRow,
      shape: { type: 'arc', startAngle, endAngle: startAngle + step, innerRadius, outerRadius },
      isOnSale: distance >= NOT_ON_SALE_DEG,
      isObstructed,
    }
  })

export const KSPO_DOME: Venue = {
  id: 'kspo-dome',
  name: 'KSPO DOME',
  stage: { type: 'rect', x: -110, y: -190, width: 220, height: 60 },
  grades: GRADES,
  zones: [
    ...FLOOR_ZONES,
    ...createRingZones({
      level: '2F',
      firstNumber: 1,
      count: 22,
      innerRadius: 230,
      outerRadius: 320,
      rows: 8,
      seatsPerRow: 16,
      grade: 'R',
      obstructedGrade: 'S',
    }),
    ...createRingZones({
      level: '3F',
      firstNumber: 23,
      count: 21,
      innerRadius: 330,
      outerRadius: 420,
      rows: 8,
      seatsPerRow: 14,
      grade: 'S',
      obstructedGrade: 'A',
    }),
  ],
}
