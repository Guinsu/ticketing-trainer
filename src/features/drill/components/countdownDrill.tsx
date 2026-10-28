import { useState, useEffect } from 'react'
import { useCountdown } from '@/common/hooks/useCountdown'
import useStopwatch from '@/common/hooks/useStopwatch'

// idle : 연습시작 | countdown : 카운트다운 | ready : 대기
type GameState = 'idle' | 'countdown' | 'ready'

const OPEN_DELAY_MS = 10_000

// 회차 새로 렌더링되어 카운트다운 다시 시작
function DrillCountdown({ onComplete }: { onComplete: () => void }) {
  // 카운트다운 남은 시간
  const remaining = useCountdown(OPEN_DELAY_MS)

  const totalSeconds = Math.ceil(remaining / 1000)
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0')
  const seconds = String(totalSeconds % 60).padStart(2, '0')

  useEffect(() => {
    if (remaining === 0) {
      onComplete()
    }
  }, [remaining, onComplete])

  return <>{`남은시간 : ${minutes} : ${seconds} `}초</>
}

export default function CountdownDrill() {
  //게임 상태 관리
  const [gameState, setGameState] = useState<GameState>('idle')

  //게임 시작 함수
  function startGame() {
    setGameState('countdown')
  }

  const { time, laps, intervalRef, setLaps, resetStopWatch, recordLap, bestRecord, averageRecord } =
    useStopwatch()

  // 카운트다운 종료 시 예매 버튼을 활성화하고 반응 시간 측정 시작
  function handleCountdownComplete() {
    setGameState('ready')
    resetStopWatch()
  }

  return (
    <section className="min-h-screen px-5 py-5">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            카운트다운
            <span className="text-purple-800 pl-4">버튼 클릭 연습</span>
          </h1>
          <p className="mt-3 text-gray-500 text-base sm:text-xl">
            카운트다운이 끝나면 버튼을 클릭하는 연습을 통해 더 빠른 반응 속도를 만들어보세요.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-3 lg:flex-row">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-[2]">
            <div className="flex flex-1 rounded-xl flex-col border-white border-2 bg-purple-100">
              <div className="mx-3 my-3 flex flex-1 flex-col">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-2xl">
                    <p className="rounded-2xl bg-purple-800 px-3.5 text-white">01</p>
                    <h2 className="font-extrabold">카운트다운 버튼 클릭 연습</h2>
                  </div>
                  <span className="shrink-0 rounded-xl bg-purple-50 px-3 py-2 font-bold tabular-nums text-purple-800 text-3xl">
                    {(time / 1000).toFixed(3)}
                    <span className="ml-1 text-sm font-medium">초</span>
                  </span>
                </div>

                <div className="flex min-h-96 flex-1 flex-col gap-4 bg-gray-200 rounded-xl mt-3 p-5">
                  <img
                    src="/posters/1.jpg"
                    alt="공연 포스터"
                    className="mx-auto w-60 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    disabled={gameState === 'countdown'}
                    className="mx-auto rounded-xl bg-purple-600 py-4 text-lg font-bold text-white w-60"
                    onClick={() => {
                      if (gameState === 'idle') {
                        if (laps.length >= 5) {
                          setLaps([])
                          resetStopWatch()
                          clearInterval(intervalRef.current)
                          intervalRef.current = undefined
                        }
                        startGame()
                      } else if (gameState === 'ready') {
                        recordLap()
                        clearInterval(intervalRef.current)
                        intervalRef.current = undefined
                        setGameState('idle')
                      }
                    }}
                    // remaining={remaining}
                  >
                    {gameState === 'countdown' ? (
                      <DrillCountdown onComplete={handleCountdownComplete} />
                    ) : gameState === 'idle' ? (
                      '연습시작'
                    ) : (
                      '예매하기'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <aside className="min-w-0 border-white border bg-purple-100 rounded-xl p-6 lg:flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">현재기록</h2>
              <p className="text-3xl font-extrabold">
                <span className="text-purple-600 mr-2">{laps.length}</span>
                <span className="text-slate-900">/ 5</span>
              </p>
            </div>

            <div className="mt-5 border-t border-purple-100 pt-5">
              <h3 className="mb-3 font-bold text-purple-600">연습 기록</h3>

              <ol className="space-y-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between rounded-xl border border-purple-400 px-4 py-2 text-sm text-indigo-900"
                  >
                    <span>{index + 1}번</span>
                    <span>
                      {laps[index] !== undefined ? `${(laps[index] / 1000).toFixed(3)}초` : '-'}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">
                  <p className="text-sm font-medium text-purple-700">최고기록</p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-purple-900">
                    {laps.length > 0 ? (bestRecord() / 1000).toFixed(3) : '—'}
                    {laps.length > 0 && <span className="ml-1 text-sm font-medium">초</span>}
                  </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-600">평균기록</p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-slate-800">
                    {laps.length > 0 ? (averageRecord() / 1000).toFixed(3) : '—'}
                    {laps.length > 0 && <span className="ml-1 text-sm font-medium">초</span>}
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
