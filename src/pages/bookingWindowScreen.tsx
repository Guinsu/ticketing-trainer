import { formatDate, formatTime } from '@/common/utils/formatDate'
import { getStoredNickname } from '@/common/utils/nicknameStrorage'
import { CONCERTS } from '@/data/concerts'
import BookingHeader from '@/features/booking/components/bookingHeader'
import ResultStep from '@/features/booking/components/resultStep'
import ScheduleStep from '@/features/booking/components/scheduleStep'
import SeatStep from '@/features/booking/components/seatStep'
import { useQueueStore } from '@/features/queue/store'
import saveRealPracticeRecord from '@/lib/saveRealPracticeRecord'
import type { Seat } from '@/types/seat'
import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

type WindowStep = 'schedule' | 'seat' | 'result'

type BookingOutcome = {
  seat: Seat
  elapsedMs: number
}

/**
 * BookingWindowScreen
 * @description 예매 창 페이지 Screen 컴포넌트, 경로 '/practice/window'
 */
const BookingWindowScreen = () => {
  const [searchParams] = useSearchParams()
  const concert = CONCERTS.find((item) => item.id === searchParams.get('concertId'))
  const [step, setStep] = useState<WindowStep>('schedule')
  const [enteredAt] = useState(() => performance.now())
  const [seatStartedAt, setSeatStartedAt] = useState(0)
  const [outcome, setOutcome] = useState<BookingOutcome | null>(null)
  const [scheduleId, setScheduleId] = useState<string | null>(null)
  // 현재 공연의 대기열 결과, 없으면 null
  const queueResult = useQueueStore((state) =>
    state.concertId === concert?.id ? state.result : null,
  )
  const queueTiming = useQueueStore((state) =>
    state.concertId === concert?.id ? state.timing : null,
  )

  if (!concert) return <Navigate to="/" replace />
  if (!queueResult || !queueTiming)
    return <Navigate to={`/practice?concertId=${concert.id}`} replace />
  const schedule = concert.schedules.find((s) => s.id === scheduleId) ?? concert.schedules[0]
  const scheduleText = `${formatDate(schedule.date)} ${formatTime(schedule.time)}`

  const handleScheduleComplete = () => {
    setSeatStartedAt(performance.now())
    setStep('seat')
  }

  // 결과 화면 전환, real_practice_records 저장(완료 대기 없음)
  const handleSeatComplete = (seat: Seat) => {
    const now = performance.now()
    setOutcome({ seat, elapsedMs: now - enteredAt })
    setStep('result')
    saveRealPracticeRecord({
      nickname: getStoredNickname(),
      startedAt: queueTiming.startedAt,
      durationMs: now - queueTiming.activatedAtMs,
      reactionMs: queueResult.reactionMs,
      scheduleSelectionMs: seatStartedAt - enteredAt,
      seatSelectionMs: now - seatStartedAt,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {step === 'seat' && (
        <BookingHeader
          concertTitle={concert.title}
          scheduleText={scheduleText}
          remainingText="10:00"
        />
      )}
      {step === 'schedule' && (
        <ScheduleStep
          schedules={concert.schedules}
          selectedId={schedule.id}
          onSelect={setScheduleId}
          onNext={handleScheduleComplete}
        />
      )}
      {step === 'seat' && <SeatStep queueResult={queueResult} onNext={handleSeatComplete} />}
      {step === 'result' && outcome && (
        <ResultStep
          concertId={concert.id}
          concertTitle={concert.title}
          scheduleText={scheduleText}
          queueResult={queueResult}
          seat={outcome.seat}
          elapsedMs={outcome.elapsedMs}
        />
      )}
    </div>
  )
}

export default BookingWindowScreen
