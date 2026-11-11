import type { Seat, Venue } from '@/types/seat'

export type StageKey = 'reaction' | 'schedule' | 'captcha' | 'seat'
export type StageTimes = Record<StageKey, number>

// 실전연습 한 판의 결과, 저장·조회·결과 화면이 모두 이 모양을 주고받는다
export type RealPracticeResult = {
  concertId: string
  scheduleId: string
  seatId: string
  peopleAhead: number
  takenCount: number
  durationMs: number
  captchaMisses: number
  stages: StageTimes
}

type Drill = { label: string; path: string }

// 구간 순서대로, drill이 없는 구간은 추천하지 않는다
export const STAGES: { key: StageKey; label: string; drill: Drill | null }[] = [
  {
    key: 'reaction',
    label: '예매하기 반응',
    drill: { label: '카운트다운 클릭 연습', path: '/drill/countdown' },
  },
  { key: 'schedule', label: '일정 선택', drill: null },
  {
    key: 'captcha',
    label: '보안문자 입력',
    drill: { label: '보안문자 연습', path: '/drill/captchaDrill' },
  },
  {
    key: 'seat',
    label: '좌석 선택',
    drill: { label: '지정 좌석 선택 연습', path: '/drill/target-seat' },
  },
]

const CANCEL_TICKET_DRILL: Drill = { label: '취소표 잡기 연습', path: '/drill/cancel-ticket' }
const TAKEN_COUNT_TO_RECOMMEND = 2

export type Recommendation = { reason: string; drill: Drill }

// 평균 대비 가장 느린 구간 하나 + 선점 실패가 잦으면 취소표 연습
export const getRecommendations = (
  result: RealPracticeResult,
  averages: StageTimes,
): Recommendation[] => {
  const slowest = STAGES.filter((stage) => stage.drill && averages[stage.key] > 0)
    .map((stage) => ({ stage, ratio: result.stages[stage.key] / averages[stage.key] }))
    .filter(({ ratio }) => ratio > 1)
    .sort((a, b) => b.ratio - a.ratio)[0]

  const recommendations: Recommendation[] = []
  if (slowest?.stage.drill) {
    recommendations.push({
      reason: `${slowest.stage.label}이 평균보다 ${Math.round((slowest.ratio - 1) * 100)}% 느려요`,
      drill: slowest.stage.drill,
    })
  }
  if (result.takenCount >= TAKEN_COUNT_TO_RECOMMEND) {
    recommendations.push({
      reason: `이미 선택된 좌석을 ${result.takenCount}번 골랐어요`,
      drill: CANCEL_TICKET_DRILL,
    })
  }
  return recommendations
}

// seat id(`${zoneId}-${row}-${number}`) → 좌석, 없는 구역이면 null
export const findSeat = (venue: Venue, seatId: string): Seat | null => {
  const [zoneId, row, number] = seatId.split('-')
  const zone = venue.zones.find((item) => item.id === zoneId)
  if (!zone) return null
  return { id: seatId, zoneId, row: Number(row), number: Number(number), grade: zone.grade }
}
