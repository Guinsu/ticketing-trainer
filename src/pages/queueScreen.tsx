import { useCountdown } from '@/common/hooks/useCountdown'
import { CONCERTS } from '@/data/concerts'
import LoadingMessage from '@/features/queue/components/loadingMessage'
import OpenGate from '@/features/queue/components/openGate'
import QueueStatus from '@/features/queue/components/queueStatus'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'

const OPEN_DELAY_MS = 10_000

type QueuePhase = 'checking' | 'waiting' | 'loading'

// TODO: simulation.ts로 이동, 대기 순번 감소 시뮬레이션 연결
const PHASE_DURATION_MS: Record<QueuePhase, number> = {
  checking: 1500,
  waiting: 3000,
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
  const remaining = useCountdown(OPEN_DELAY_MS)
  const [isEntered, setIsEntered] = useState(false)
  const [phase, setPhase] = useState<QueuePhase>('checking')
  const concertId = concert?.id

  // 입장 후 checking → waiting → loading → 예매창 순서로 자동 전환
  useEffect(() => {
    if (!isEntered || !concertId) return

    const id = setTimeout(() => {
      if (phase === 'checking') setPhase('waiting')
      else if (phase === 'waiting') setPhase('loading')
      else navigate(`/practice/window?concertId=${concertId}`, { replace: true })
    }, PHASE_DURATION_MS[phase])

    return () => clearTimeout(id)
  }, [isEntered, phase, concertId, navigate])

  if (!concert) return <Navigate to="/" replace />

  if (!isEntered) {
    return <OpenGate concert={concert} remaining={remaining} onEnter={() => setIsEntered(true)} />
  }

  if (phase === 'checking') {
    return <LoadingMessage title="대기 순서를 확인 중이에요." subtitle="잠시만 기다려 주세요." />
  }

  if (phase === 'loading') {
    return <LoadingMessage title="예매 화면을 불러오고 있어요" />
  }

  return (
    <QueueStatus concertTitle={concert.title} position={750} total={2429} progress={8} isAlmost={false} />
  )
}
export default QueueScreen
