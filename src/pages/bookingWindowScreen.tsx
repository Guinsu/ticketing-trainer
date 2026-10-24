import { formatDate, formatTime } from '@/common/utils/formatDate'
import { CONCERTS } from '@/data/concerts'
import BookingHeader from '@/features/booking/components/bookingHeader'
import PaymentStep from '@/features/booking/components/paymentStep'
import ScheduleStep from '@/features/booking/components/scheduleStep'
import SeatStep from '@/features/booking/components/seatStep'
import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

type WindowStep = 'schedule' | 'seat' | 'payment'

/**
 * BookingWindowScreen
 * @description 예매 창 페이지 Screen 컴포넌트, 경로 '/practice/window'
 */
const BookingWindowScreen = () => {
  const [searchParams] = useSearchParams()
  const concert = CONCERTS.find((item) => item.id === searchParams.get('concertId'))
  const [step, setStep] = useState<WindowStep>('schedule')

  if (!concert) return <Navigate to="/" replace />

  // TODO: 선택 회차 상태 연결
  const schedule = concert.schedules[0]
  const scheduleText = `${formatDate(schedule.date)} ${formatTime(schedule.time)}`

  return (
    <div className="min-h-screen bg-white">
      {step !== 'schedule' && (
        <BookingHeader concertTitle={concert.title} scheduleText={scheduleText} remainingText="10:00" />
      )}
      {step === 'schedule' && <ScheduleStep schedules={concert.schedules} onNext={() => setStep('seat')} />}
      {step === 'seat' && <SeatStep />}
      {step === 'payment' && <PaymentStep concertTitle={concert.title} scheduleText={scheduleText} />}
    </div>
  )
}

export default BookingWindowScreen
