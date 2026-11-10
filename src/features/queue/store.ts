import type { QueueResult } from '@/types/simulation'
import { create } from 'zustand'

export type RealPracticeTiming = {
  startedAt: string
  activatedAtMs: number
}

type QueueStore = {
  concertId: string | null
  result: QueueResult | null
  timing: RealPracticeTiming | null
  setResult: (concertId: string, result: QueueResult, timing: RealPracticeTiming) => void
  reset: () => void
}

// 대기열을 통과한 결과, 예매창의 남은 좌석 계산에 사용
export const useQueueStore = create<QueueStore>((set) => ({
  concertId: null,
  result: null,
  timing: null,
  setResult: (concertId, result, timing) => set({ concertId, result, timing }),
  reset: () => set({ concertId: null, result: null, timing: null }),
}))
