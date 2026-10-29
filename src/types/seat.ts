// TODO:구역(Zone), 좌석 정보(Seat: 구역·열·번호·SVG 좌표 등), 좌석 상태(SeatStatus: 매진, 선택가능, 선택됨 등, SeatStatusMap: 좌석 전체 상태) 정의

export type SeatGrade = 'VIP' | 'R' | 'S' | 'A'
export type ZoneLevel = 'floor' | '2F' | '3F'
export type ZoneBlock = 'A' | 'B' | 'C' | 'D'

export type SeatGradeInfo = {
  id: SeatGrade
  label: string // 'VIP석'
  price: number // 154000, 표시할 때 포맷
  bgClass: string // 등급 목록의 색 표시
  fillClass: string // 좌석맵 SVG 좌석 색
}

export type ZoneShape =
  | { type: 'rect'; x: number; y: number; width: number; height: number }
  | { type: 'arc'; startAngle: number; endAngle: number; innerRadius: number; outerRadius: number }

export type Zone = {
  id: string // 'FA', '8', '28'
  label: string // 'FLOOR A', '8구역'
  level: ZoneLevel
  block: ZoneBlock | null // 플로어는 null
  grade: SeatGrade
  rows: number
  seatsPerRow: number
  shape: ZoneShape
  isOnSale: boolean // A블록 무대 뒤쪽 구역은 false
  isObstructed: boolean // 무대 양옆 시야제한석
}

export type Venue = {
  id: string
  name: string
  stage: Extract<ZoneShape, { type: 'rect' }>
  grades: SeatGradeInfo[]
  zones: Zone[]
}

export type Seat = {
  id: string // `${zoneId}-${row}-${number}`
  zoneId: string
  row: number
  number: number
  grade: SeatGrade
}

export type SeatStatus = 'available' | 'sold' | 'selected'

// 좌석 id → 상태, 없는 좌석은 available로 본다
export type SeatStatusMap = Record<Seat['id'], Exclude<SeatStatus, 'available'>>
