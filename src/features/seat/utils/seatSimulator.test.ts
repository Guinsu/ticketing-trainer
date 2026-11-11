import { describe, expect, it } from 'vitest'
import { getTakenChance } from '@/features/seat/utils/seatSimulator'

describe('getTakenChance', () => {
  it('바로 누르면 선점 실패가 없다', () => {
    expect(getTakenChance(0)).toBe(0)
    expect(getTakenChance(-10)).toBe(0)
  })

  it('늦게 누를수록 커지고 60%를 넘지 않는다', () => {
    const chances = [5_050, 25_050, 50_050, 1_000_000].map(getTakenChance)
    chances.slice(1).forEach((chance, i) => expect(chance).toBeGreaterThan(chances[i]))
    expect(chances.at(-1)).toBeLessThanOrEqual(0.6)
  })
})
