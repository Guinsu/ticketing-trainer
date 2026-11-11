import { formatRemaining } from '@/common/utils/formatDate'
import { useEffect, useEffectEvent, useState } from 'react'

interface BookingHeaderProps {
  concertTitle: string
  scheduleText: string
  deadlineAt: number // performance.now() 기준 좌석 선택 마감 시각
  onTimeout: () => void
  onChangeSchedule: () => void
}

/**
 * BookingHeader
 * @description 예매창 상단, 공연명·관람 일시·좌석 선택 남은 시간
 */
const BookingHeader = ({
  concertTitle,
  scheduleText,
  deadlineAt,
  onTimeout,
  onChangeSchedule,
}: BookingHeaderProps) => {
  const [remaining, setRemaining] = useState(() => Math.max(0, deadlineAt - performance.now()))
  const handleTimeout = useEffectEvent(onTimeout)

  useEffect(() => {
    const id = setInterval(() => {
      const next = Math.max(0, deadlineAt - performance.now())
      setRemaining(next)
      if (next === 0) {
        clearInterval(id)
        handleTimeout()
      }
    }, 250)

    return () => clearInterval(id)
  }, [deadlineAt])

  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-extrabold tracking-tight">{concertTitle}</h1>
        <span className="h-4 w-px bg-gray-300" />
        <p className="font-bold">{scheduleText}</p>
        <button
          type="button"
          onClick={onChangeSchedule}
          className="cursor-pointer border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-600 hover:border-primary hover:text-primary"
        >
          일정변경
        </button>
      </div>
      <p className="font-bold">
        좌석 선택 시간{' '}
        <span className={`tabular-nums ${remaining < 60_000 ? 'text-red-500' : 'text-primary'}`}>
          {formatRemaining(remaining)}
        </span>
      </p>
    </header>
  )
}

export default BookingHeader
