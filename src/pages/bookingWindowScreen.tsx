import { formatDate, formatTime } from '@/common/utils/formatDate'
import { getStoredNickname } from '@/common/utils/nicknameStrorage'
import { CONCERTS } from '@/data/concerts'
import type { CaptchaRecord } from '@/features/booking/components/captchaStep'
import BookingHeader from '@/features/booking/components/bookingHeader'
import ResultStep from '@/features/booking/components/resultStep'
import ScheduleStep from '@/features/booking/components/scheduleStep'
import SeatStep from '@/features/booking/components/seatStep'
import TimeoutStep from '@/features/booking/components/timeoutStep'
import { useQueueStore } from '@/features/queue/store'
import saveRealPracticeRecord from '@/lib/saveRealPracticeRecord'
import type { Seat } from '@/types/seat'
import { useState } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'

type WindowStep = 'schedule' | 'seat' | 'result' | 'timeout'

type BookingOutcome = {
  seat: Seat
  elapsedMs: number
  takenCount: number
}

const SEAT_TIME_LIMIT_MS = 10 * 60_000

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
  // 처음 좌석 단계에 들어간 시각부터 제한 시간, 일정변경으로 돌아가도 이어서 줄어든다
  const [seatDeadline, setSeatDeadline] = useState<number | null>(null)
  // 보안문자는 한 번만, 일정변경 후 다시 묻지 않는다
  const [captcha, setCaptcha] = useState<CaptchaRecord | null>(null)
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
    const now = performance.now()
    setSeatStartedAt(now)
    setSeatDeadline((prev) => prev ?? now + SEAT_TIME_LIMIT_MS)
    setStep('seat')
  }

  const handleCaptchaPass = (misses: number) =>
    setCaptcha({ ms: performance.now() - seatStartedAt, misses })

  const handleChangeSchedule = () => setStep('schedule')

  // 결과 화면 전환, real_practice_records 저장(완료 대기 없음)
  // 좌석은 보안문자를 통과해야 고를 수 있어 captcha가 항상 있다
  const handleSeatComplete = (seat: Seat, takenCount: number) => {
    if (!captcha) return
    const now = performance.now()
    setOutcome({ seat, elapsedMs: now - enteredAt, takenCount })
    setStep('result')
    saveRealPracticeRecord({
      nickname: getStoredNickname(),
      startedAt: queueTiming.startedAt,
      durationMs: now - queueTiming.activatedAtMs,
      reactionMs: queueResult.reactionMs,
      scheduleSelectionMs: seatStartedAt - enteredAt,
      captchaMs: captcha.ms,
      captchaMisses: captcha.misses,
      seatSelectionMs: now - seatStartedAt - captcha.ms,
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {step === 'seat' && seatDeadline !== null && (
        <BookingHeader
          concertTitle={concert.title}
          scheduleText={scheduleText}
          deadlineAt={seatDeadline}
          onTimeout={() => setStep('timeout')}
          onChangeSchedule={handleChangeSchedule}
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
      {step === 'seat' && (
        <SeatStep
          queueResult={queueResult}
          captchaPassed={captcha !== null}
          onCaptchaPass={handleCaptchaPass}
          onChangeSchedule={handleChangeSchedule}
          onNext={handleSeatComplete}
        />
      )}
      {step === 'timeout' && <TimeoutStep concertId={concert.id} />}
      {step === 'result' && outcome && captcha && (
        <ResultStep
          concertId={concert.id}
          concertTitle={concert.title}
          scheduleText={scheduleText}
          queueResult={queueResult}
          seat={outcome.seat}
          elapsedMs={outcome.elapsedMs}
          takenCount={outcome.takenCount}
          captcha={captcha}
        />
      )}
    </div>
  )
}

export default BookingWindowScreen
