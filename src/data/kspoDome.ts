import type { SeatGrade, SeatGradeInfo, Venue, Zone, ZoneBlock, ZoneLevel } from '@/types/seat'

// - KSPO DOME 배치: 플로어 FA~FF, 2층 1~22구역, 3층 23~43구역
// - 무대: A블록 쪽 12시, B블록 오른쪽, C블록 정면, D블록 왼쪽
// - 좌표: 중심 (0, 0), 각도는 12시 0도부터 시계 방향

const GRADES: SeatGradeInfo[] = [
  { id: 'VIP', label: 'VIP석', price: 154000, bgClass: 'bg-primary', fillClass: 'fill-primary' },
  { id: 'R', label: 'R석', price: 132000, bgClass: 'bg-emerald-600', fillClass: 'fill-emerald-600' },
  { id: 'S', label: 'S석', price: 110000, bgClass: 'bg-sky-600', fillClass: 'fill-sky-600' },
  { id: 'A', label: 'A석', price: 88000, bgClass: 'bg-amber-500', fillClass: 'fill-amber-500' },
]

// 2층 1구역 시작 각도, 19구역 중심이 0도에 위치
const START_ANGLE = 360 - 18.5 * (360 / 22)
const NOT_ON_SALE_DEG = 45 // 무대 기준 45도 미만 구역: 미판매
const OBSTRUCTED_DEG = 65 // 45~65도 구역: 시야제한, 한 단계 낮은 등급

const getBlock = (zoneNumber: number): ZoneBlock =>
  zoneNumber <= 4 ? 'B' : zoneNumber <= 11 ? 'C' : zoneNumber <= 15 ? 'D' : 'A'

// 무대(0도)와의 각도 차, 0~180
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
  rows: 20,
  seatsPerRow: 25,
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

// 2·3층 구역 생성, START_ANGLE부터 시계 방향으로 360/count도씩 분할
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
      rows: 14,
      seatsPerRow: 21,
      grade: 'R',
      obstructedGrade: 'S',
    }),
    ...createRingZones({
      level: '3F',
      firstNumber: 23,
      count: 21,
      innerRadius: 330,
      outerRadius: 420,
      rows: 16,
      seatsPerRow: 20,
      grade: 'S',
      obstructedGrade: 'A',
    }),
  ],
}
