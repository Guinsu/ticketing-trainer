type Grade = 'VIP' | 'R' | 'S'

// TODO: 인수 님 좌석 데이터(data/kspoDome.ts)로 교체
export const GRADES: { id: Grade; label: string; price: string; remain: number; color: string }[] = [
  { id: 'VIP', label: 'VIP석', price: '154,000원', remain: 12, color: 'bg-primary' },
  { id: 'R', label: 'R석', price: '132,000원', remain: 340, color: 'bg-emerald-600' },
  { id: 'S', label: 'S석', price: '110,000원', remain: 128, color: 'bg-sky-600' },
]

export const ZONES: { id: string; grade: Grade; soldOut: boolean; area: string }[] = [
  { id: 'F1', grade: 'VIP', soldOut: false, area: 'col-span-2 col-start-2 row-span-2 row-start-2' },
  { id: 'F2', grade: 'VIP', soldOut: true, area: 'col-span-2 col-start-4 row-span-2 row-start-2' },
  { id: 'F3', grade: 'VIP', soldOut: false, area: 'col-span-2 col-start-2 row-span-2 row-start-4' },
  { id: 'F4', grade: 'VIP', soldOut: false, area: 'col-span-2 col-start-4 row-span-2 row-start-4' },
  { id: 'H', grade: 'R', soldOut: true, area: 'col-start-1 row-start-2' },
  { id: 'J', grade: 'R', soldOut: false, area: 'col-start-1 row-start-3' },
  { id: 'K', grade: 'R', soldOut: false, area: 'col-start-1 row-start-4' },
  { id: 'L', grade: 'R', soldOut: false, area: 'col-start-1 row-start-5' },
  { id: 'C', grade: 'R', soldOut: true, area: 'col-start-6 row-start-2' },
  { id: 'D', grade: 'R', soldOut: false, area: 'col-start-6 row-start-3' },
  { id: 'E', grade: 'R', soldOut: false, area: 'col-start-6 row-start-4' },
  { id: 'G', grade: 'R', soldOut: false, area: 'col-start-6 row-start-5' },
  { id: 'M', grade: 'S', soldOut: false, area: 'col-start-2 row-start-6' },
  { id: 'N', grade: 'S', soldOut: false, area: 'col-start-3 row-start-6' },
  { id: 'A', grade: 'S', soldOut: false, area: 'col-start-4 row-start-6' },
  { id: 'B', grade: 'S', soldOut: false, area: 'col-start-5 row-start-6' },
]
