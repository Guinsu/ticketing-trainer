import { useState, useEffect } from 'react'
import { useCountdown } from '@/common/hooks/useCountdown'
import useDrillStopwatch from '@/features/drill/hooks/useDrillStopwatch'
import { getStoredNickname } from '@/common/utils/nicknameStrorage'
import useDrillRecord from '@/features/drill/hooks/useDrillRecord'

// idle : 연습시작 | countdown : 카운트다운 | ready : 대기
type GameState = 'idle' | 'countdown' | 'ready'

const OPEN_DELAY_MS = 10_000

// 회차 새로 렌더링되어 카운트다운 다시 시작
function DrillCountdown({ onComplete }: { onComplete: () => void }) {
  // 카운트다운 남은 시간
  // [확인 필요] useCountdown 반환값이 number → { remaining, openAt }으로 바뀌어 구조 분해로 수정 (선웅, 대기열 반응 시간 측정용 openAt 추가)
  const { remaining } = useCountdown(OPEN_DELAY_MS)

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
  const { saveRecord, saveMessage } = useDrillRecord()
  //게임 상태 관리
  const [gameState, setGameState] = useState<GameState>('idle')

  //게임 시작 함수
  function startGame() {
    setGameState('countdown')
  }

  const {
    time,
    laps,
    setLaps,
    resetStopWatch,
    stopStopWatch,
    recordLap,
    bestRecord,
    averageRecord,
  } = useDrillStopwatch()

  // 카운트다운 종료 시 예매 버튼을 활성화하고 반응 시간 측정 시작
  function handleCountdownComplete() {
    setGameState('ready')
    resetStopWatch()
  }

  return (
    <section className="min-h-screen px-5 py-5">
      <div className="mx-auto max-w-7xl">
        <p role="status" aria-live="polite" className="min-h-6 text-sm text-purple-800">
          {saveMessage}
        </p>
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            카운트다운
            <span className="text-purple-800 pl-4">버튼 클릭 연습</span>
          </h1>
          <p className="mt-3 text-gray-500 text-base sm:text-xl">
            카운트다운이 끝나면 버튼을 클릭하는 연습을 통해 더 빠른 반응 속도를 만들어보세요.
          </p>
        </div>

        {/* 연습 영역은 연보라색, 기록은 흰색 카드로 구분 */}
        <div className="flex flex-col gap-4 mt-3 lg:flex-row">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-[2]">
            <div className="flex flex-1 rounded-2xl flex-col bg-purple-100">
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

                <div className="flex min-h-96 flex-1 flex-col gap-4 border border-purple-200 bg-purple-50 rounded-xl mt-3 p-5">
                  <img
                    src="/posters/1.jpg"
                    alt="공연 포스터"
                    className="mx-auto w-60 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    disabled={gameState === 'countdown'}
                    className="mx-auto rounded-xl bg-purple-700 py-4 text-lg font-bold text-white transition-colors hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-700 w-60"
                    onClick={() => {
                      if (gameState === 'idle') {
                        if (laps.length >= 5) {
                          setLaps([])
                          resetStopWatch()
                          stopStopWatch()
                        }
                        startGame()
                      } else if (gameState === 'ready') {
                        // 버튼이 활성화된 뒤 실제로 클릭한 시점까지 기록
                        const elapsed = recordLap()
                        stopStopWatch()
                        setGameState('idle')
                        void saveRecord({
                          nickname: getStoredNickname(),
                          practice_type: 'countdown',
                          status: 'completed',
                          durationMS: elapsed,
                        })
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

          <aside className="min-w-0 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm lg:flex-1">
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
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-purple-700">최고기록</p>
                  <p className="mt-2 text-2xl font-bold tabular-nums text-purple-900">
                    {laps.length > 0 ? (bestRecord() / 1000).toFixed(3) : '—'}
                    {laps.length > 0 && <span className="ml-1 text-sm font-medium">초</span>}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
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
