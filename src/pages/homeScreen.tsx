import { formatDate } from '@/common/utils/formatDate'
import { CONCERTS } from '@/data/concerts'
import ConcertInfo from '@/features/concert/components/concertInfo'
import { useState } from 'react'
import { Link } from 'react-router-dom'

/**
 * HomeScreen
 * @description 홈화면 Screen 컴포넌트, 경로 '/'
 */
const HomeScreen = () => {
  const [selectedId, setSelectedId] = useState(CONCERTS[0].id)
  const selected = CONCERTS.find((concert) => concert.id === selectedId) ?? CONCERTS[0]

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10 pb-16">
      <div className="flex items-end justify-between border-b-2 border-gray-900 pb-4">
        <div>
          <h1 className="text-[28px] font-extrabold tracking-tight">공연 선택</h1>
          <p className="mt-1.5 text-sm text-gray-500">연습할 공연을 선택하고 상세 정보를 확인해보세요.</p>
        </div>
        <span className="text-sm text-gray-500">
          전체 <b className="text-gray-900">{CONCERTS.length}</b>개
        </span>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[2fr_3fr]">
        <ul className="space-y-2">
          {CONCERTS.map((concert) => {
            const isSelected = concert.id === selectedId
            const first = concert.schedules[0]
            const last = concert.schedules[concert.schedules.length - 1]

            return (
              <li key={concert.id}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => setSelectedId(concert.id)}
                  className={`flex w-full cursor-pointer gap-4 border bg-white p-3 text-left ${
                    isSelected
                      ? 'border-primary ring-1 ring-primary'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  <img src={concert.poster} alt="" className="h-24 w-18 shrink-0 bg-gray-200 object-cover" />
                  <div className="min-w-0">
                    <span className="border border-primary px-1.5 py-px text-[11px] font-bold text-primary">
                      {concert.category}
                    </span>
                    <p className={`mt-2 truncate font-bold ${isSelected ? 'text-primary' : ''}`}>
                      {concert.title}
                    </p>
                    <p className="mt-1.5 text-[13px] text-gray-500">{concert.venue}</p>
                    <p className="text-[13px] text-gray-500">
                      {formatDate(first.date)} ~ {formatDate(last.date)}
                    </p>
                  </div>
                </button>
              </li>
            )
          })}
        </ul>

        <section className="border border-gray-300 bg-white p-6 lg:sticky lg:top-6 lg:self-start">
          <ConcertInfo concert={selected} />
          <Link
            to={`/practice?concertId=${selected.id}`}
            className="mt-6 flex h-15 items-center justify-center bg-primary text-lg font-bold text-white hover:bg-primary-hover"
          >
            이 공연으로 연습하기
          </Link>
        </section>
      </div>
    </div>
  )
}

export default HomeScreen
