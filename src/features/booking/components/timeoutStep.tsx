import { Link } from 'react-router-dom'

interface TimeoutStepProps {
  concertId: string
}

/**
 * TimeoutStep
 * @description 좌석 선택 시간 초과, 예매 실패 안내
 */
const TimeoutStep = ({ concertId }: TimeoutStepProps) => {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-sm font-bold text-red-500">예매 실패</p>
      <h2 className="mt-2 text-[28px] font-extrabold tracking-tight">
        좌석 선택 시간이 초과되었어요
      </h2>
      <p className="mt-3 text-gray-600">
        실제 예매에서도 제한 시간이 지나면 처음부터 다시 시작해야 해요.
      </p>
      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <Link
          to={`/practice?concertId=${concertId}`}
          className="flex h-15 items-center justify-center bg-primary text-lg font-bold text-white hover:bg-primary-hover"
        >
          다시 연습하기
        </Link>
        <Link
          to="/"
          className="flex h-15 items-center justify-center border border-gray-300 text-lg font-bold hover:border-gray-900"
        >
          다른 공연 선택
        </Link>
      </div>
    </div>
  )
}

export default TimeoutStep
