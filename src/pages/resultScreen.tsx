import LoadingMessage from '@/features/queue/components/loadingMessage'
import ResultReport, { ResultNotFound } from '@/features/booking/components/resultReport'
import getRealPracticeRecord, { type RealPracticeRecordDetail } from '@/lib/getRealPracticeRecord'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

type LoadState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'notFound' }
  | { status: 'loaded'; detail: RealPracticeRecordDetail }

/**
 * ResultScreen
 * @description 실전연습 결과 페이지 Screen 컴포넌트, 경로 '/result/:recordId'
 */
const ResultScreen = () => {
  const { recordId = '' } = useParams()
  const [state, setState] = useState<LoadState & { recordId: string }>({
    status: 'loading',
    recordId,
  })

  // 기록 조회, 언마운트나 id 변경 후 도착한 응답은 무시
  useEffect(() => {
    let cancelled = false
    getRealPracticeRecord(recordId)
      .then((detail) => {
        if (cancelled) return
        setState(detail ? { status: 'loaded', detail, recordId } : { status: 'notFound', recordId })
      })
      .catch(() => !cancelled && setState({ status: 'error', recordId }))
    return () => {
      cancelled = true
    }
  }, [recordId])

  // 다른 기록으로 이동하면 응답이 오기 전까지 이전 결과 대신 로딩을 보여준다
  if (state.recordId !== recordId || state.status === 'loading') {
    return <LoadingMessage title="결과를 불러오고 있어요" />
  }
  if (state.status === 'notFound') return <ResultNotFound />
  if (state.status === 'error') {
    return (
      <LoadingMessage title="결과를 불러오지 못했어요" subtitle="잠시 후 다시 시도해 주세요." />
    )
  }
  return <ResultReport result={state.detail.result} averages={state.detail.averages} />
}

export default ResultScreen
