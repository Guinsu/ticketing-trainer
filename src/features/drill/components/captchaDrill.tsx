import { useState, useRef } from 'react'
import Modal from '@/common/components/modal'
import GenerateCaptcha from '@/features/captcha/util/generateCaptcha'
import CaptchaBox from '@/features/captcha/components/captchaBox'
import useStopwatch from '@/common/hooks/useStopwatch'

export default function CaptchaDrill() {
  //게임 상태 관리
  const [gameState, setGameState] = useState('stop')

  const { time, laps, intervalRef, setLaps, resetStopWatch, recordLap, bestRecord, averageRecord } =
    useStopwatch()

  //정답 확인 관리
  const [answer, setAnswer] = useState('')

  //정답 입력 관리
  const [userInput, setUserInput] = useState('')

  //정답 결과 관리
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  //정답 결과 메세지
  const [resultMessage, setResultMessage] = useState('')

  //메세지 타이머
  const messageTimer = useRef<number | undefined>(undefined)

  //게임 시작 함수
  function startGame() {
    setAnswer(GenerateCaptcha())
    setUserInput('')
    setGameState('start')
  }

  //정답 확인하기
  const checkAnswer = () => {
    if (answer === userInput) {
      setResultMessage('정답이에요!')
      setIsCorrect(true)
      recordLap()

      if (laps.length + 1 >= 5) {
        clearInterval(intervalRef.current)
        intervalRef.current = undefined
        setGameState('stop')
      } else {
        resetStopWatch()
        startGame()
      }
    } else {
      setResultMessage('틀렸어요!')
      setIsCorrect(false)
    }

    clearTimeout(messageTimer.current)
    messageTimer.current = window.setTimeout(() => {
      setResultMessage('')
      setIsCorrect(null)
    }, 2000)
  }

  return (
    <section className="min-h-screen px-5 py-5">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            보안문자
            <span className="text-purple-800 pl-4">연습</span>
          </h1>
          <p className="mt-3 text-gray-500 text-base sm:text-xl">
            실제 예매와 동일한 형태의 보안문자를 반복 연습하고, 속도와 정확도를 높여보세요.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-3 lg:flex-row">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-[2]">
            <div className="flex flex-1 rounded-xl flex-col border-white border-2 bg-purple-100">
              <div className="mx-3 my-3 flex flex-1 flex-col">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 text-2xl">
                    <p className="rounded-2xl bg-purple-800 px-3.5 text-white">01</p>
                    <h2 className="font-extrabold">보안문자 입력 연습</h2>
                  </div>
                  <span className="shrink-0 rounded-xl bg-purple-50 px-3 py-2 font-bold tabular-nums text-purple-800 text-3xl">
                    {(time / 1000).toFixed(3)}
                    <span className="ml-1 text-sm font-medium">초</span>
                  </span>
                </div>

                <div className="flex flex-1 flex-col gap-4 bg-gray-200 rounded-xl mt-3 p-5">
                  <div
                    className={`flex h-48 items-center justify-center rounded-xl bg-white text-purple-700 ${gameState === 'start' ? 'text-6xl' : 'text-3xl'} `}
                  >
                    {gameState === 'start' ? (
                      <CaptchaBox text={answer} />
                    ) : (
                      '연습 시작 버튼을 눌러주세요.'
                    )}
                  </div>

                  <input
                    type="text"
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={6}
                    placeholder="보안문자를 입력하세요."
                    aria-label="보안문자 입력"
                    disabled={gameState !== 'start'}
                    className="rounded-xl border border-purple-200 bg-white px-4 py-3 disabled:opacity-50"
                    value={userInput}
                    onChange={(e) => {
                      setUserInput(e.target.value)
                    }}
                  />
                  <button
                    type="button"
                    className="rounded-xl bg-purple-600 py-4 text-lg font-bold text-white"
                    onClick={() => {
                      if (gameState === 'start') {
                        checkAnswer()
                      } else {
                        setLaps([])
                        setResultMessage('')
                        setIsCorrect(null)
                        clearTimeout(messageTimer.current)
                        startGame()
                        resetStopWatch()
                      }
                    }}
                  >
                    {gameState === 'start' ? '정답 입력' : '연습시작'}
                  </button>
                  <p
                    role="status"
                    className={`mt-2 min-h-6 text-center text-base font-medium  ${
                      isCorrect === null ? '' : isCorrect ? 'text-purple-700' : 'text-rose-700'
                    }`}
                  >
                    {resultMessage}
                  </p>
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
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-purple-600">연습 기록</h3>
              </div>
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
