interface QueueStatusProps {
  concertTitle: string
  position: number
  total: number
  progress: number // 0~100
  isAlmost: boolean
}

/**
 * QueueStatus
 * @description 대기열 화면, 나의 대기순서·진행 막대·현재 대기인원
 */
const QueueStatus = ({ concertTitle, position, total, progress, isAlmost }: QueueStatusProps) => {
  return (
    <div className="mx-auto max-w-xl px-4 pt-16 pb-10">
      <h1 className="text-2xl font-extrabold tracking-tight">
        {isAlmost ? '곧 고객님의 순서가 다가옵니다.' : '접속 인원이 많아 대기 중입니다.'}
      </h1>
      <p className={`text-2xl font-extrabold tracking-tight ${isAlmost ? 'text-red-500' : 'text-primary'}`}>
        {isAlmost ? '예매를 준비해주세요.' : '조금만 기다려주세요.'}
      </p>
      <p className="mt-3 text-gray-500">{concertTitle}</p>

      <section className="mt-8 border border-gray-300 bg-white p-6">
        <p className="text-center text-sm font-semibold">나의 대기순서</p>
        <p className="text-center text-6xl font-black tabular-nums">{position.toLocaleString()}</p>
        <div className="mt-4 h-8 bg-gray-100 p-1">
          <div
            className={`h-full min-w-6 ${isAlmost ? 'bg-red-500' : 'bg-primary'}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 flex justify-between border-t border-gray-100 pt-4">
          <span className="text-gray-500">현재 대기인원</span>
          <span className="font-bold tabular-nums">{total.toLocaleString()}</span>
        </div>
      </section>

      <p className="mt-4 bg-orange-50 px-4 py-3 text-sm font-semibold text-orange-700">
        ⓘ 예매 화면 이동 후 10분 이내에 좌석 선택을 완료하지 않으면 예매가 자동으로 종료됩니다.
      </p>
      <ul className="mt-4 list-inside list-disc space-y-1 text-sm text-gray-600">
        <li>잠시만 기다려주시면, 예매하기 페이지로 연결됩니다.</li>
        <li>새로고침 하거나 재접속 하시면 대기순서가 초기화 되어 대기시간이 더 길어집니다.</li>
      </ul>
    </div>
  )
}

export default QueueStatus
