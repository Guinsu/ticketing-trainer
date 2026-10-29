import { useCountdown } from '@/common/hooks/useCountdown'
import { useQueueSimulation } from '@/common/hooks/useQueueSimulation'
import { CONCERTS } from '@/data/concerts'
import LoadingMessage from '@/features/queue/components/loadingMessage'
import OpenGate from '@/features/queue/components/openGate'
import QueueStatus from '@/features/queue/components/queueStatus'
import { useQueueStore } from '@/features/queue/store'
import { createQueue } from '@/features/queue/utils/queueSimulator'
import type { QueueResult } from '@/types/simulation'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'

const OPEN_DELAY_MS = 10_000

type QueuePhase = 'checking' | 'waiting' | 'loading'

const PHASE_DURATION_MS = {
  checking: 1500,
  loading: 1500,
}

/**
 * QueueScreen
 * @description 대기 페이지 Screen 컴포넌트, 경로 '/practice/queue'
 */
const QueueScreen = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const concert = CONCERTS.find((item) => item.id === searchParams.get('concertId'))
  const { remaining, openAt } = useCountdown(OPEN_DELAY_MS)
  const [result, setResult] = useState<QueueResult | null>(null)
  const [phase, setPhase] = useState<Exclude<QueuePhase, 'loading'>>('checking')
  const queue = useQueueSimulation(phase === 'waiting' ? result : null)
  const saveQueueResult = useQueueStore((state) => state.setResult)
  const concertId = concert?.id
  // 대기 순번이 0이 되면 loading 단계
  const currentPhase: QueuePhase = queue?.position === 0 ? 'loading' : phase

  // checking → waiting, loading → 예매창은 시간으로 전환하고 waiting은 순번이 0이 될 때까지 유지
  useEffect(() => {
    if (!result || !concertId || currentPhase === 'waiting') return

    const id = setTimeout(() => {
      if (currentPhase === 'checking') {
        setPhase('waiting')
      } else {
        saveQueueResult(concertId, result)
        navigate(`/practice/window?concertId=${concertId}`, { replace: true })
      }
    }, PHASE_DURATION_MS[currentPhase])

    return () => clearTimeout(id)
  }, [result, currentPhase, concertId, navigate, saveQueueResult])

  // 버튼 활성화 후 늦게 누를수록 대기열이 길어진다
  const handleEnter = () => setResult(createQueue(performance.now() - openAt))

  if (!concert) return <Navigate to="/" replace />

  if (!result) {
    return <OpenGate concert={concert} remaining={remaining} onEnter={handleEnter} />
  }

  if (currentPhase === 'checking') {
    return <LoadingMessage title="대기 순서를 확인 중이에요." subtitle="잠시만 기다려 주세요." />
  }

  if (currentPhase === 'loading' || !queue) {
    return <LoadingMessage title="예매 화면을 불러오고 있어요" />
  }

  return (
    <QueueStatus
      concertTitle={concert.title}
      position={queue.position}
      total={queue.total}
      progress={queue.progress}
      isAlmost={queue.isAlmost}
    />
  )
}
export default QueueScreen
