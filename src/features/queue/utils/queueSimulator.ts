import type { QueueResult } from '@/types/simulation'

// 대기열 시뮬레이션
// 1. 예매하기 클릭 시 createQueue(reactionMs)로 시작 순번·대기 인원·시드를 정한다
//    reactionMs = 클릭 시각 - 오픈 시각(useCountdown의 openAt), queueScreen에서 performance.now()로 측정
// 2. 대기 화면에서 QUEUE_TICK_MS마다 tickQueue로 순번을 줄이고, 0이 되면 예매창으로 이동
// 3. QueueResult는 예매창으로 넘어가 결과 분석·좌석 소진 계산에 쓰인다

export const QUEUE_TICK_MS = 500 // 순번이 줄어드는 주기

// 시작 순번
const BASE_PEOPLE_AHEAD = 50 // 바로 눌러도 앞에 있는 최소 인원
const PEOPLE_PER_MS = 1 // 버튼 활성화 후 1ms 늦을 때마다 앞에 끼어드는 인원 (1초 = 1,000명)
const PEOPLE_JITTER = 0.1 // 시작 순번 ±10% 랜덤

// 대기 시간
const BASE_WAIT_MS = 3000 // 바로 눌러도 기다리는 최소 시간
const WAIT_PER_REACTION_MS = 2 // 1ms 늦을 때마다 늘어나는 대기 시간 (1초 늦으면 2초 더)
export const MAX_WAIT_MS = 20_000 // 대기 시간 상한, 연습 흐름이 늘어지지 않게

// 순번 감소
const DRAIN_JITTER = 0.3 // 한 틱에 줄어드는 양 ±30% 랜덤, 실제 대기열처럼 들쭉날쭉하게
const ALMOST_RATIO = 0.1 // 남은 순번이 시작 순번의 10% 이하면 '곧 차례' 표시

export type QueueState = {
  tick: number // 지난 틱 수, 마지막 틱에 순번을 0으로 맞추는 데 사용
  position: number // 나의 대기순서
  total: number // 현재 대기인원 (내 뒤 인원 포함)
  progress: number // 0~100
  isAlmost: boolean
}

// 1을 기준으로 ±ratio 사이에서 흔든 배율
const jitter = (rand: () => number, ratio: number) => 1 + (rand() * 2 - 1) * ratio

// 늦게 누를수록 대기 시간이 길어지고, MAX_WAIT_MS를 넘지 않는다
export const getWaitMs = (reactionMs: number) =>
  Math.min(BASE_WAIT_MS + Math.max(0, reactionMs) * WAIT_PER_REACTION_MS, MAX_WAIT_MS)

// 클릭 반응 시간으로 시작 순번·대기 인원·시드를 정한다
// rand는 테스트에서 고정값을 넣기 위한 인자, 기본은 Math.random
export const createQueue = (reactionMs: number, rand: () => number = Math.random): QueueResult => {
  const safeReactionMs = Math.max(0, reactionMs)
  const peopleAhead = Math.round(
    (BASE_PEOPLE_AHEAD + safeReactionMs * PEOPLE_PER_MS) * jitter(rand, PEOPLE_JITTER),
  )

  return {
    reactionMs: safeReactionMs,
    peopleAhead,
    totalWaiting: Math.round(peopleAhead * (1.5 + rand() * 0.5)), // 내 뒤에 선 인원까지 1.5~2배
    seed: Math.floor(rand() * 2 ** 32), // 좌석 소진 계산용 고정 시드
  }
}

// 대기 화면 첫 상태, 아직 순번이 줄지 않은 상태
export const createQueueState = (result: QueueResult): QueueState => ({
  tick: 0,
  position: result.peopleAhead,
  total: result.totalWaiting,
  progress: 0,
  isAlmost: false,
})

// 한 틱마다 순번을 랜덤하게 줄인다
// 평균 감소량 = 시작 순번 ÷ 전체 틱 수, 마지막 틱에는 랜덤과 상관없이 0으로 끝나 대기 시간이 상한을 넘지 않는다
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
    total: Math.max(position, state.total - (state.position - position)), // 앞에서 빠진 만큼 같이 줄어듦
    progress: Math.round((1 - position / result.peopleAhead) * 100),
    isAlmost: position <= result.peopleAhead * ALMOST_RATIO,
  }
}
