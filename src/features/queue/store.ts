import type { QueueResult } from '@/types/simulation'
import { create } from 'zustand'

type QueueStore = {
  concertId: string | null
  result: QueueResult | null
  setResult: (concertId: string, result: QueueResult) => void
  reset: () => void
}

// 대기열을 통과한 결과, 예매창의 남은 좌석 계산에 사용
export const useQueueStore = create<QueueStore>((set) => ({
  concertId: null,
  result: null,
  setResult: (concertId, result) => set({ concertId, result }),
  reset: () => set({ concertId: null, result: null }),
}))
