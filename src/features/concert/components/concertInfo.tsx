import { formatDate, formatTime } from '@/common/utils/formatDate'
import type { CONCERTS } from '@/data/concerts'

// TODO: types/concert.ts의 Concert로 교체
type Concert = (typeof CONCERTS)[number]

interface ConcertInfoProps {
  concert: Concert
}

/**
 * ConcertInfo
 * @description 공연 포스터와 상세 정보
 */
const ConcertInfo = ({ concert }: ConcertInfoProps) => {
  const first = concert.schedules[0]
  const last = concert.schedules[concert.schedules.length - 1]

  return (
    <div className="flex flex-col gap-6 sm:flex-row">
      <img
        src={concert.poster}
        alt={`${concert.title} 포스터`}
        className="aspect-3/4 w-full bg-gray-200 object-cover sm:w-56"
      />
      <div className="min-w-0 flex-1">
        <span className="border border-primary px-1.5 py-px text-[11px] font-bold text-primary">
          {concert.category}
        </span>
        <h2 className="mt-2.5 text-2xl font-extrabold tracking-tight">{concert.title}</h2>
        <p className="mt-1.5 text-sm text-gray-500">{concert.description}</p>

        <dl className="mt-5 divide-y divide-gray-100 border-y border-gray-200 border-t-gray-900 text-sm">
          <div className="grid grid-cols-[5.5rem_1fr] py-2.5">
            <dt className="font-bold text-gray-600">공연장</dt>
            <dd>
              {concert.venue}
              <p className="text-xs text-gray-500">{concert.address}</p>
            </dd>
          </div>
          <div className="grid grid-cols-[5.5rem_1fr] py-2.5">
            <dt className="font-bold text-gray-600">공연 기간</dt>
            <dd>
              {formatDate(first.date)} ~ {formatDate(last.date)}
            </dd>
          </div>
          <div className="grid grid-cols-[5.5rem_1fr] py-2.5">
            <dt className="font-bold text-gray-600">공연 시간</dt>
            <dd>
              {concert.schedules.map((schedule) => (
                <p key={schedule.id}>
                  {formatDate(schedule.date)} {formatTime(schedule.time)}
                </p>
              ))}
            </dd>
          </div>
          <div className="grid grid-cols-[5.5rem_1fr] py-2.5">
            <dt className="font-bold text-gray-600">관람 연령</dt>
            <dd>{concert.ageLimit}</dd>
          </div>
          <div className="grid grid-cols-[5.5rem_1fr] py-2.5">
            <dt className="font-bold text-gray-600">주최 / 주관</dt>
            <dd>{concert.organizer}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

export default ConcertInfo
