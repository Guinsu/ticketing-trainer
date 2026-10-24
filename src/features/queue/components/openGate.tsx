import { formatRemaining } from '@/common/utils/formatDate'
import type { Concert } from '@/types/concert'

interface OpenGateProps {
  concert: Concert
  remaining: number
  onEnter: () => void
}

const OpenGate = ({ concert, remaining, onEnter }: OpenGateProps) => {
  const isOpen = remaining === 0

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 px-4 pt-20">
      <h1 className="text-2xl font-extrabold tracking-tight">예매는 오픈 시간부터 가능해요</h1>
      <img
        src={concert.poster}
        alt={`${concert.title} 포스터`}
        className="mt-10 aspect-3/4 w-48 border border-gray-200 bg-gray-200 object-cover"
      />
      <p className="mt-6 max-w-56 text-center text-sm font-bold text-gray-800">{concert.title}</p>
      <button
        type="button"
        disabled={!isOpen}
        onClick={onEnter}
        className="mt-10 h-15 w-full max-w-xl text-center text-lg font-bold tabular-nums enabled:cursor-pointer enabled:bg-primary enabled:text-white enabled:hover:bg-primary-hover disabled:bg-gray-100 disabled:text-gray-500"
      >
        {isOpen ? '예매하기' : `남은시간 ${formatRemaining(remaining)}`}
      </button>
    </div>
  )
}

export default OpenGate
