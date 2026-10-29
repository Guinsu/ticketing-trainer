import { describe, expect, it } from 'vitest'
import {
  createQueue,
  createQueueState,
  getWaitMs,
  MAX_WAIT_MS,
  QUEUE_TICK_MS,
  tickQueue,
} from '@/features/queue/utils/queueSimulator'

const noJitter = () => 0.5

describe('createQueue', () => {
  it('늦게 누를수록 시작 순번이 커진다', () => {
    expect(createQueue(300, noJitter).peopleAhead).toBe(350)
    expect(createQueue(5000, noJitter).peopleAhead).toBe(5050)
  })

  it('음수 반응 시간은 0으로 처리한다', () => {
    expect(createQueue(-100, noJitter).reactionMs).toBe(0)
  })

  it('대기 인원은 시작 순번보다 크다', () => {
    const result = createQueue(2000)
    expect(result.totalWaiting).toBeGreaterThan(result.peopleAhead)
  })
})

describe('getWaitMs', () => {
  it('늦게 누를수록 길어지고 상한을 넘지 않는다', () => {
    expect(getWaitMs(300)).toBe(3600)
    expect(getWaitMs(100_000)).toBe(MAX_WAIT_MS)
  })
})

describe('tickQueue', () => {
  it('순번이 줄어들기만 하고 대기 시간 안에 0이 된다', () => {
    const result = createQueue(8000)
    let state = createQueueState(result)
    const positions = [state.position]

    while (state.position > 0) {
      state = tickQueue(state, result)
      positions.push(state.position)
    }

    positions.slice(1).forEach((position, i) => expect(position).toBeLessThanOrEqual(positions[i]))
    expect(state.tick).toBeLessThanOrEqual(MAX_WAIT_MS / QUEUE_TICK_MS)
    expect(state.progress).toBe(100)
    expect(state.isAlmost).toBe(true)
  })

  it('0이 된 뒤에는 상태가 바뀌지 않는다', () => {
    const result = createQueue(0, noJitter)
    const done = { ...createQueueState(result), position: 0 }
    expect(tickQueue(done, result)).toBe(done)
  })
})
