import { formatDate, formatTime } from '@/common/utils/formatDate'
import { CONCERTS } from '@/data/concerts'
import BookingHeader from '@/features/booking/components/bookingHeader'
import ResultStep from '@/features/booking/components/resultStep'
import ScheduleStep from '@/features/booking/components/scheduleStep'
import SeatStep from '@/features/booking/components/seatStep'
import { useQueueStore } from '@/features/queue/store'
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
  const [outcome, setOutcome] = useState<BookingOutcome | null>(null)
  // TODO: 좌석 소진 함수 연결 시 queueResult(peopleAhead, seed)를 SeatStep에 전달
  const queueResult = useQueueStore((state) => (state.concertId === concert?.id ? state.result : null))

  if (!concert) return <Navigate to="/" replace />
  if (!queueResult) return <Navigate to={`/practice?concertId=${concert.id}`} replace />
  // TODO: 선택 회차 상태 연결
  const schedule = concert.schedules[0]
  const scheduleText = `${formatDate(schedule.date)} ${formatTime(schedule.time)}`

  const handleSeatComplete = (seat: Seat) => {
    setOutcome({ seat, elapsedMs: performance.now() - enteredAt })
    setStep('result')
  }

  return (
    <div className="min-h-screen bg-white">
      {step === 'seat' && (
        <BookingHeader concertTitle={concert.title} scheduleText={scheduleText} remainingText="10:00" />
      )}
      {step === 'schedule' && <ScheduleStep schedules={concert.schedules} onNext={() => setStep('seat')} />}
      {step === 'seat' && <SeatStep onNext={handleSeatComplete} />}
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
