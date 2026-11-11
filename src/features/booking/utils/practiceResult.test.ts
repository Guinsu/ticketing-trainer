import { describe, expect, it } from 'vitest'
import { KSPO_DOME } from '@/data/kspoDome'
import {
  findSeat,
  getRecommendations,
  type RealPracticeResult,
} from '@/features/booking/utils/practiceResult'

const result = (stages: RealPracticeResult['stages'], takenCount = 0): RealPracticeResult => ({
  concertId: 'c',
  scheduleId: 's',
  seatId: 'FA-1-1',
  peopleAhead: 100,
  takenCount,
  durationMs: 10_000,
  captchaMisses: 0,
  stages,
})

const averages = { reaction: 500, schedule: 2000, captcha: 4000, seat: 3000 }

describe('getRecommendations', () => {
  it('평균보다 가장 많이 느린 구간의 연습을 추천한다', () => {
    const recs = getRecommendations(
      result({ reaction: 600, schedule: 9000, captcha: 8000, seat: 3000 }),
      averages,
    )
    expect(recs.map((rec) => rec.drill.path)).toEqual(['/drill/captchaDrill'])
    expect(recs[0].reason).toBe('보안문자 입력이 평균보다 100% 느려요')
  })

  it('일정 선택은 연습이 없어서 추천하지 않는다', () => {
    const recs = getRecommendations(
      result({ reaction: 400, schedule: 9000, captcha: 3000, seat: 2000 }),
      averages,
    )
    expect(recs).toEqual([])
  })

  it('선점 실패가 2번 이상이면 취소표 연습을 함께 추천한다', () => {
    const recs = getRecommendations(
      result({ reaction: 1000, schedule: 0, captcha: 0, seat: 0 }, 2),
      averages,
    )
    expect(recs.map((rec) => rec.drill.path)).toEqual(['/drill/countdown', '/drill/cancel-ticket'])
  })
})

describe('findSeat', () => {
  it('seat id로 좌석과 등급을 되찾는다', () => {
    const zone = KSPO_DOME.zones[0]
    expect(findSeat(KSPO_DOME, `${zone.id}-3-7`)).toEqual({
      id: `${zone.id}-3-7`,
      zoneId: zone.id,
      row: 3,
      number: 7,
      grade: zone.grade,
    })
    expect(findSeat(KSPO_DOME, 'NOPE-1-1')).toBeNull()
  })
})
