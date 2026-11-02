import type { QueueResult } from '@/types/simulation'

// 대기열 시뮬레이션
// 1. createQueue(reactionMs): 시작 순번·대기 인원·시드 결정
//    - reactionMs = 클릭 시각 - useCountdown의 openAt
// 2. tickQueue: QUEUE_TICK_MS마다 순번 감소, 0이면 종료
// 3. QueueResult: 예매창 결과 분석·매진 좌석 계산 입력

export const QUEUE_TICK_MS = 500 // 순번 감소 주기

// 시작 순번
const BASE_PEOPLE_AHEAD = 50 // reactionMs 0일 때 앞 인원
const PEOPLE_PER_MS = 50 // 1ms당 추가 앞 인원 (0.1초 = 5,000명)
// 시작 순번 ±30% 랜덤 배율
const PEOPLE_JITTER = 0.3

// 대기 시간
const BASE_WAIT_MS = 3000 // reactionMs 0일 때 대기 시간
const WAIT_PER_REACTION_MS = 2 // 1ms당 추가 대기 시간 (1초 → +2초)
export const MAX_WAIT_MS = 20_000 // 대기 시간 상한

// 순번 감소
const DRAIN_JITTER = 0.3 // 틱당 감소량 ±30% 랜덤 배율
const ALMOST_RATIO = 0.1 // 남은 순번 ≤ 시작 순번의 10%: isAlmost true

export type QueueState = {
  tick: number // 지난 틱 수, 마지막 틱 판정용
  position: number // 나의 대기순서
  total: number // 현재 대기인원 (내 뒤 인원 포함)
  progress: number // 0~100
  isAlmost: boolean
}

// 1 ± ratio 범위 랜덤 배율
const jitter = (rand: () => number, ratio: number) => 1 + (rand() * 2 - 1) * ratio

// 대기 시간 = BASE_WAIT_MS + reactionMs × WAIT_PER_REACTION_MS, 상한 MAX_WAIT_MS
export const getWaitMs = (reactionMs: number) =>
  Math.min(BASE_WAIT_MS + Math.max(0, reactionMs) * WAIT_PER_REACTION_MS, MAX_WAIT_MS)

// - 앞 인원 = (BASE_PEOPLE_AHEAD + reactionMs × PEOPLE_PER_MS) × 랜덤 배율
// - rand: 난수 함수, 기본 Math.random
export const createQueue = (reactionMs: number, rand: () => number = Math.random): QueueResult => {
  const safeReactionMs = Math.max(0, reactionMs)
  const peopleAhead = Math.round(
    (BASE_PEOPLE_AHEAD + safeReactionMs * PEOPLE_PER_MS) * jitter(rand, PEOPLE_JITTER),
  )

  return {
    reactionMs: safeReactionMs,
    peopleAhead,
    totalWaiting: Math.round(peopleAhead * (1.5 + rand() * 0.5)), // 앞 인원의 1.5~2배
    seed: Math.floor(rand() * 2 ** 32), // 매진 좌석 계산용 시드
  }
}

// 첫 상태, 순번 = 시작 순번
export const createQueueState = (result: QueueResult): QueueState => ({
  tick: 0,
  position: result.peopleAhead,
  total: result.totalWaiting,
  progress: 0,
  isAlmost: false,
})

// - 틱당 감소량 = 시작 순번 ÷ 전체 틱 수 × 랜덤 배율, 최소 1
// - 마지막 틱: 순번 0
export const tickQueue = (
  state: QueueState,
  result: QueueResult,
  rand: () => number = Math.random,
): QueueState => {
  if (state.position === 0) return state

  const tick = state.tick + 1
  const totalTicks = Math.ceil(getWaitMs(result.reactionMs) / QUEUE_TICK_MS)
  const drained = Math.max(
    1,
    Math.round((result.peopleAhead / totalTicks) * jitter(rand, DRAIN_JITTER)),
  )
  const position = tick >= totalTicks ? 0 : Math.max(0, state.position - drained)

  return {
    tick,
    position,
    total: Math.max(position, state.total - (state.position - position)), // 순번 감소량만큼 감소, 최소 position
    progress: Math.round((1 - position / result.peopleAhead) * 100),
    isAlmost: position <= result.peopleAhead * ALMOST_RATIO,
  }
}
