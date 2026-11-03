import { createSeats } from '@/features/seat/utils/createSeats'
import type { SeatGrade, SeatStatusMap, Venue } from '@/types/seat'

// 대기열 결과 → 예매창 입장 전 매진 좌석
// 1. getSoldCount: 앞 인원 → 매진 좌석 수
// 2. getSoldSeats: 등급·열 가중치로 좌석 랜덤 순위, 상위 N석 매진
//    - 같은 seed: 같은 순위, N 증가 시 기존 매진 좌석 유지
// 3. summarizeSeats: 구역·등급별 잔여석, 매진 구역

const MAX_SOLD_RATIO = 0.95 // 매진율 상한
// 앞 인원이 이 값일 때 상한의 63% 매진
const SELL_OUT_SCALE = 37_500
const GRADE_WEIGHT: Record<SeatGrade, number> = { VIP: 8, R: 4, S: 2, A: 1 } // 클수록 상위 순위 확률 증가
const FRONT_ROW_WEIGHT = 6 // 1열 가중치

// 열 가중치, 1열 FRONT_ROW_WEIGHT → 마지막 열 1, 열마다 같은 비율로 감소
const getRowWeight = (row: number, rows: number) =>
  rows === 1 ? FRONT_ROW_WEIGHT : FRONT_ROW_WEIGHT ** ((rows - row) / (rows - 1))

// mulberry32 난수 생성기, seed별 고정된 0~1 난수열
const createRandom = (seed: number) => {
  let state = seed >>> 0

  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let t = state
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// 판매 구역 전체 좌석 수
export const getTotalSeats = (venue: Venue) =>
  venue.zones
    .filter((zone) => zone.isOnSale)
    .reduce((sum, zone) => sum + zone.rows * zone.seatsPerRow, 0)

// - 매진 좌석 수 = 전체 × MAX_SOLD_RATIO × (1 - e^(-앞 인원 / SELL_OUT_SCALE))
// - 0.1초 12%, 0.5초 46%, 1초 70%, 2초 88%
export const getSoldCount = (peopleAhead: number, totalSeats: number) =>
  Math.round(
    totalSeats * MAX_SOLD_RATIO * (1 - Math.exp(-Math.max(0, peopleAhead) / SELL_OUT_SCALE)),
  )

// 점수 = rand^(1/가중치), 점수 상위 soldCount석 매진
export const getSoldSeats = (venue: Venue, soldCount: number, seed: number): SeatStatusMap => {
  const rand = createRandom(seed)
  const ranked = venue.zones
    .filter((zone) => zone.isOnSale)
    .flatMap((zone) =>
      createSeats(zone).map((seat) => {
        const weight = GRADE_WEIGHT[seat.grade] * getRowWeight(seat.row, zone.rows)
        return { id: seat.id, score: rand() ** (1 / weight) }
      }),
    )
    .sort((a, b) => b.score - a.score)

  return Object.fromEntries(ranked.slice(0, soldCount).map((seat) => [seat.id, 'sold']))
}

// 앞 인원·seed → 매진 맵
export const createSoldSeats = (venue: Venue, peopleAhead: number, seed: number) =>
  getSoldSeats(venue, getSoldCount(peopleAhead, getTotalSeats(venue)), seed)

// 매진 맵 → 구역·등급별 잔여석, 잔여 0 구역 목록
export const summarizeSeats = (venue: Venue, soldMap: SeatStatusMap) => {
  const remainByZone: Record<string, number> = {}
  const remainByGrade: Record<SeatGrade, number> = { VIP: 0, R: 0, S: 0, A: 0 }

  venue.zones
    .filter((zone) => zone.isOnSale)
    .forEach((zone) => {
      const remain = createSeats(zone).filter((seat) => soldMap[seat.id] !== 'sold').length
      remainByZone[zone.id] = remain
      remainByGrade[zone.grade] += remain
    })

  const soldOutZoneIds = Object.keys(remainByZone).filter((id) => remainByZone[id] === 0)

  return { remainByZone, remainByGrade, soldOutZoneIds }
}
