import { CONCERTS } from '@/data/concerts'
import ConcertInfo from '@/features/concert/components/concertInfo'
import { Link, Navigate, useSearchParams } from 'react-router-dom'

/**
 * ConcertScreen
 * @description 공연 상세 페이지 Screen 컴포넌트, 경로 '/practice'
 */
const ConcertScreen = () => {
  const [searchParams] = useSearchParams()
  const concert = CONCERTS.find((item) => item.id === searchParams.get('concertId'))

  if (!concert) return <Navigate to="/" replace />

  return (
    <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <ConcertInfo concert={concert} />

      <aside className="border border-gray-300 bg-white p-6 lg:sticky lg:top-6 lg:self-start">
        <h2 className="border-b-2 border-gray-900 pb-3 text-xl font-extrabold tracking-tight">오픈 예정</h2>
        <p className="mt-3 text-sm text-gray-600">공지된 일정에 맞춰 예매를 시작할 수 있어요.</p>
        <Link
          to={`/practice/queue?concertId=${concert.id}`}
          className="mt-6 flex h-15 items-center justify-center bg-primary text-lg font-bold text-white hover:bg-primary-hover"
        >
          예매하기
        </Link>
      </aside>
    </div>
  )
}

export default ConcertScreen
