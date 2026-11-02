import { formatTime } from '@/common/utils/formatDate'
import type { Schedule } from '@/types/concert'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']
const pad = (n: number) => String(n).padStart(2, '0')

interface ScheduleStepProps {
  schedules: Schedule[]
  selectedId: string
  onSelect: (id: string) => void
  onNext: () => void
}

/**
 * ScheduleStep
 * @description 예매창 1단계, 관람일 달력과 회차 시간 선택
 */
const ScheduleStep = ({ schedules, selectedId, onSelect, onNext }: ScheduleStepProps) => {
  const selected = schedules.find((schedule) => schedule.id === selectedId) ?? schedules[0]
  const [year, month] = selected.date.split('-').map(Number)
  const firstDay = new Date(year, month - 1, 1).getDay()
  const lastDate = new Date(year, month, 0).getDate()
  const times = schedules.filter((schedule) => schedule.date === selected.date)

  return (
    <div className="mx-auto grid max-w-5xl gap-12 px-4 py-12 md:grid-cols-2">
      <section>
        <h2 className="border-b-2 border-gray-900 pb-3 text-lg font-extrabold tracking-tight">일정 선택</h2>
        <p className="mt-4 text-center text-2xl font-bold">
          {year}.{pad(month)}
        </p>
        <div className="mt-4 grid grid-cols-7 border-b border-gray-100 pb-2 text-center text-sm text-gray-500">
          {WEEKDAYS.map((weekday) => (
            <span key={weekday}>{weekday}</span>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 gap-y-3 text-center">
          {Array.from({ length: firstDay }, (_, i) => (
            <span key={`empty-${i}`} />
          ))}
          {Array.from({ length: lastDate }, (_, i) => {
            const day = i + 1
            const date = `${year}-${pad(month)}-${pad(day)}`
            const firstShowing = schedules.find((schedule) => schedule.date === date)
            const isSelected = date === selected.date
            const isSunday = (firstDay + i) % 7 === 0

            return (
              <button
                key={date}
                type="button"
                disabled={!firstShowing}
                onClick={() => firstShowing && onSelect(firstShowing.id)}
                className={`mx-auto size-11 rounded-full ${
                  isSelected
                    ? 'bg-primary font-bold text-white'
                    : firstShowing
                      ? `cursor-pointer font-bold hover:ring-1 hover:ring-primary ${isSunday ? 'text-red-500' : ''}`
                      : isSunday
                        ? 'text-red-200'
                        : 'text-gray-300'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        {times.map((schedule) => (
          <button
            key={schedule.id}
            type="button"
            aria-pressed={schedule.id === selected.id}
            onClick={() => onSelect(schedule.id)}
            className={`cursor-pointer px-6 py-5 text-left text-lg font-bold ${
              schedule.id === selected.id
                ? 'border-2 border-primary bg-white text-primary'
                : 'border border-gray-300 bg-white text-gray-800 hover:border-primary'
            }`}
          >
            {formatTime(schedule.time)}
          </button>
        ))}
        <button
          type="button"
          onClick={onNext}
          className="mt-6 cursor-pointer bg-primary py-4 text-lg font-bold text-white hover:bg-primary-hover md:mt-auto"
        >
          다음
        </button>
      </section>
    </div>
  )
}

export default ScheduleStep
