import { useState, useEffect } from 'react'
import useStopwatch from '@/common/hooks/useStopwatch'

// idle : 연습시작 |  open : 시작 | selected : 선택 | missed : 실패 | completed : 완료
type GameState = 'idle' | 'open' | 'selected' | 'missed' | 'completed'

export default function CancelTicketDrill() {
  //게임 상태 관리
  const [gameState, setGameState] = useState<GameState>('idle')

  //행
  const [row, setRow] = useState(0)

  //열
  const [column, setColumn] = useState(0)

  const { time, intervalRef, resetStopWatch, recordLap } = useStopwatch()

  //open할 좌석 index 저장
  const [openSeatIndex, setOpenSeatIndex] = useState<number | null>(null)

  // 실패 count
  const [failCount, setFailCount] = useState(0)

  // 클릭 count
  const [clickCount, setClickCount] = useState(0)
  const [startedAt, setStartedAt] = useState(0)
  const [failureMessage, setFailureMessage] = useState('')

  function failGame(message: string) {
    clearInterval(intervalRef.current)
    intervalRef.current = undefined
    setFailCount((prev) => prev + 1)
    setOpenSeatIndex(null)
    setFailureMessage(message)
    setGameState('missed')
  }

  function startGame() {
    setStartedAt(performance.now())
    setFailureMessage('')
    setOpenSeatIndex(Math.floor(Math.random() * 100))
    setGameState('open')
    resetStopWatch()
  }

  // 좌석 선택은 2초, 선택 완료는 시작 시점부터 총 4초로 제한
  useEffect(() => {
    if (gameState !== 'open' && gameState !== 'selected') return

    const limitMs = gameState === 'open' ? 2000 : 4000
    const timeoutId = window.setTimeout(
      () => {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
        setFailCount((prev) => prev + 1)
        setOpenSeatIndex(null)
        setGameState('missed')
        setFailureMessage(
          gameState === 'open'
            ? '좌석을 놓쳤어요. 새로고침을 눌러 다시 도전하세요.'
            : '이미 결제가 완료되었습니다. 새로고침 후 다시 도전하세요.',
        )
      },
      Math.max(0, startedAt + limitMs - performance.now()),
    )

    // 좌석 선택 또는 화면 이탈 시 실패 타이머 취소
    return () => window.clearTimeout(timeoutId)
  }, [gameState, startedAt, intervalRef])

  return (
    <section className="min-h-screen px-5 py-5">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            취소표 잡기
            <span className="text-purple-800 pl-4">연습</span>
          </h1>
          <p className="mt-3 text-gray-500 text-base sm:text-xl">
            취소표가 실시간으로 열리는 상황을 연습해보세요. 열린 좌석을 빠르게 클릭하여 예매에
            성공하세요.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-3 lg:flex-row">
          {/*미션정보*/}
          <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-purple-100 p-4 xl:p-6">
            <h2 className="mb-5 text-2xl font-extrabold">미션 정보</h2>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <p className="font-semibold text-slate-600">목표좌석</p>
                <p className=" border-purple-100 px-3 py-2 text-xl font-extrabold">
                  아무좌석이나 (취소표)
                </p>
                <p className="font-normal text-slate-600 px-3">
                  좌석은 2초 안에 선택하고, 총 4초 안에 선택을 완료하세요.
                </p>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <p className="font-semibold text-slate-600">선택 소요 시간</p>
                <p className="mt-3 text-3xl font-extrabold text-purple-600">
                  {(time / 1000).toFixed(3)}
                </p>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <p className="font-semibold text-slate-600">실패 횟수</p>
                <p className="mt-3 text-3xl font-extrabold text-slate-950">{failCount}회</p>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <p className="font-semibold text-slate-600">클릭 횟수</p>
                <p className="mt-3 text-3xl font-extrabold text-slate-950">{clickCount}회</p>
              </div>
            </div>
          </div>

          {/* 좌석도 */}
          <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-purple-100 p-4 xl:p-6 gap">
            <div className="flex items-start gap-2.5 text-xl xl:text-2xl">
              <h2 className="font-extrabold">좌석도</h2>
            </div>

            <div className="mt-3 shrink-0 rounded-xl bg-purple-50 p-4">
              {gameState !== 'idle' ? (
                <svg
                  viewBox="0 0 320 350"
                  className="block h-auto w-full"
                  role="group"
                  aria-label="공연 좌석도"
                >
                  {/* 무대 */}
                  <rect x="60" y="10" width="200" height="30" rx="6" fill="#e9d5ff" />
                  <text x="160" y="30" textAnchor="middle" fontSize="12">
                    STAGE
                  </text>

                  {/* 좌석 100개 */}
                  {Array.from({ length: 100 }, (_, index) => {
                    const row = Math.floor(index / 10)
                    const column = index % 10

                    return (
                      <circle
                        key={index}
                        cx={34 + column * 28}
                        cy={75 + row * 28}
                        r="9"
                        fill={index === openSeatIndex ? '#22c55e' : '#475569'}
                        className={
                          gameState === 'open' && index === openSeatIndex
                            ? 'cursor-pointer hover:opacity-70'
                            : 'cursor-default'
                        }
                        onClick={() => {
                          if (gameState !== 'open' && gameState !== 'selected') return

                          // 좌석 선택 후에도 선택 완료 전까지 모든 좌석 클릭을 집계
                          setClickCount((prev) => prev + 1)

                          if (
                            performance.now() - startedAt >=
                            (gameState === 'open' ? 2000 : 4000)
                          ) {
                            failGame('제한 시간이 지났어요. 새로고침 후 다시 도전하세요.')
                            return
                          }

                          if (gameState !== 'open' || index !== openSeatIndex) return

                          setRow(row)
                          setColumn(column)

                          setGameState('selected')
                        }}
                      >
                        <title>{`${row + 1}열 ${column + 1}번`}</title>
                      </circle>
                    )
                  })}
                </svg>
              ) : (
                <div className="flex aspect-[320/350] items-center justify-center text-sm text-slate-500">
                  연습시작 버튼을 눌러주세요.
                </div>
              )}
            </div>
            {gameState === 'missed' && (
              <p
                role="alert"
                className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600"
              >
                {failureMessage}
              </p>
            )}
            <div className="flex flex-row justify-center py-6 gap-2">
              <button
                className="flex-1  w-full rounded-xl bg-purple-600 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-purple-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-600"
                disabled={gameState !== 'missed'}
                onClick={() => {
                  startGame()
                }}
              >
                새로고침
              </button>
              <button
                className="flex-1  w-full rounded-xl bg-purple-600 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-purple-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-600"
                disabled={gameState !== 'idle' && gameState !== 'completed'}
                onClick={() => {
                  setFailCount(0)
                  setClickCount(0)
                  startGame()
                }}
              >
                연습시작
              </button>
            </div>
          </div>

          {/*선택한 좌석*/}
          <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-purple-100 p-4 xl:p-6">
            {gameState === 'completed' ? (
              <div className="flex flex-1 flex-col gap-5">
                <h2 className="text-2xl font-extrabold">연습 결과</h2>
                <div className="rounded-2xl bg-purple-50 p-5">
                  <h3 className="text-xl font-bold text-purple-700">예매 성공!</h3>
                  <dl className="mt-5 space-y-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">선택 좌석</dt>
                      <dd className="font-semibold">
                        {row + 1}열 {column + 1}번
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">예매 완료 시간</dt>
                      <dd className="font-semibold">{(time / 1000).toFixed(3)}초</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">실패 횟수</dt>
                      <dd className="font-semibold">{failCount}회</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-slate-500">좌석 클릭</dt>
                      <dd className="font-semibold">{clickCount}회</dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : (
              <div className="flex flex-1 flex-col gap-5">
                <h2 className="text-2xl font-extrabold">선택한 좌석</h2>

                <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                  <p className="text-sm font-semibold text-purple-600">선택 좌석</p>
                  <p className="mt-2 text-2xl font-extrabold text-purple-700">
                    {gameState === 'selected'
                      ? `${row + 1}열 ${column + 1}번`
                      : '좌석을 선택해주세요'}
                  </p>
                  <span className="mt-3 inline-block rounded-full bg-white px-3 py-1 text-sm font-bold text-purple-700">
                    R석
                  </span>
                </div>

                <div className="space-y-4 text-sm xl:text-base">
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="shrink-0 text-slate-500">관람일</p>
                    <p className="text-right font-semibold text-slate-800">2025.03.01 (토)</p>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="shrink-0 text-slate-500">회차</p>
                    <p className="text-right font-semibold text-slate-800">1회 18:00</p>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="shrink-0 text-slate-500">좌석 등급</p>
                    <p className="text-right font-semibold text-slate-800">R석</p>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="shrink-0 text-slate-500">구역</p>
                    <p className="text-right font-semibold text-slate-800">C구역 C3블록</p>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <p className="shrink-0 text-slate-500">좌석</p>
                    <p className="text-right font-semibold text-slate-800">
                      {gameState === 'selected'
                        ? `${row + 1}열 ${column + 1}번`
                        : '좌석을 선택해주세요'}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-purple-100 pt-5">
                    <p className="font-semibold text-slate-600">가격</p>
                    <p className="text-2xl font-extrabold text-purple-700">
                      154,000<span className="ml-1 text-sm font-semibold">원</span>
                    </p>
                  </div>
                </div>

                <div className="mt-auto pt-4">
                  <button
                    type="button"
                    className="w-full rounded-xl bg-purple-600 py-4 text-lg font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed"
                    disabled={gameState !== 'selected'}
                    onClick={() => {
                      if (performance.now() - startedAt >= 4000) {
                        failGame('이미 결제가 완료되었습니다. 새로고침 후 다시 도전하세요.')
                        return
                      }
                      clearInterval(intervalRef.current)
                      intervalRef.current = undefined
                      recordLap()
                      setGameState('completed')
                    }}
                  >
                    선택 완료
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
