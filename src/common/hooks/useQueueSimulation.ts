import {
  createQueueState,
  QUEUE_TICK_MS,
  tickQueue,
  type QueueState,
} from '@/features/queue/utils/queueSimulator'
import type { QueueResult } from '@/types/simulation'
import { useEffect, useState } from 'react'

// 대기열 결과가 들어오면 QUEUE_TICK_MS마다 순번을 줄이고, 0이 되면 멈춘다
// result가 null이면 아무것도 하지 않는다 (게이트 클릭 전·checking 단계에서 null 전달)
// 끝났는지는 반환값의 position === 0으로 화면(queueScreen)이 판단한다
export const useQueueSimulation = (result: QueueResult | null) => {
  // 첫 틱 전에는 null, 첫 틱에서 createQueueState로 시작해 tickQueue로 갱신
  const [state, setState] = useState<QueueState | null>(null)
  const isDone = state?.position === 0

  useEffect(() => {
    if (!result || isDone) return

    const id = setInterval(() => {
      setState((prev) => tickQueue(prev ?? createQueueState(result), result))
    }, QUEUE_TICK_MS)

    // 순번이 0이 되면 isDone이 바뀌어 interval 정리, 화면을 벗어날 때도 정리
    return () => clearInterval(id)
  }, [result, isDone])

  if (!result) return null
  // 첫 틱 전에도 시작 순번이 보이도록 렌더할 때 초기 상태를 계산 (effect 안 setState 회피)
  return state ?? createQueueState(result)
}
