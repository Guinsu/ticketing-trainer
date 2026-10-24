interface BookingHeaderProps {
  concertTitle: string
  scheduleText: string
  remainingText: string
}

/**
 * BookingHeader
 * @description 예매창 상단, 공연명·관람 일시·좌석 선택 남은 시간
 */
const BookingHeader = ({ concertTitle, scheduleText, remainingText }: BookingHeaderProps) => {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="font-extrabold tracking-tight">{concertTitle}</h1>
        <span className="h-4 w-px bg-gray-300" />
        <p className="font-bold">{scheduleText}</p>
        <button
          type="button"
          className="cursor-pointer border border-gray-300 bg-white px-3 py-1 text-sm font-semibold text-gray-600 hover:border-primary hover:text-primary"
        >
          일정변경
        </button>
      </div>
      <p className="font-bold">
        좌석 선택 시간 <span className="text-primary tabular-nums">{remainingText}</span>
      </p>
    </header>
  )
}

export default BookingHeader
