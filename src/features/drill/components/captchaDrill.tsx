import { useState, useRef, useEffect } from 'react'
import GenerateCaptcha from '@/features/captcha/util/generateCaptcha'
import CaptchaBox from '@/features/captcha/components/captchaBox'
import useDrillStopwatch from '@/features/drill/hooks/useDrillStopwatch'
import { getStoredNickname } from '@/common/utils/nicknameStrorage'
import useDrillRecord from '@/features/drill/hooks/useDrillRecord'

export default function CaptchaDrill() {
  const { saveRecord, saveMessage } = useDrillRecord()
  //게임 상태 관리
  const [gameState, setGameState] = useState('stop')

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

  // 화면을 벗어나면 정답 안내 타이머도 정리
  useEffect(() => () => window.clearTimeout(messageTimer.current), [])

  //게임 시작 함수
  function startGame() {
    setAnswer(GenerateCaptcha())
    setUserInput('')
    setGameState('start')
  }

  //정답 확인하기
  const checkAnswer = () => {
    if (gameState !== 'start') return
    // 생성된 정답에도 소문자가 있어서 양쪽 다 대문자로 바꾼 뒤 비교
    if (answer.toUpperCase() === userInput.trim().toUpperCase()) {
      setResultMessage('정답이에요!')
      setIsCorrect(true)
      // 클릭한 시점의 시간을 화면 기록과 DB에 같이 사용
      const elapsed = recordLap()
      void saveRecord({
        nickname: getStoredNickname(),
        practice_type: 'captcha',
        status: 'completed',
        durationMS: elapsed,
      })

      if (laps.length + 1 >= 5) {
        stopStopWatch()
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

        {/* 상단 안내는 옅은 보라색, 기록 영역은 흰색 카드로 나눠서 표시 */}
        <div className="mt-5 rounded-2xl border border-purple-200 bg-purple-50 p-5 sm:p-6">
          <p className="text-sm font-bold text-purple-700">보안문자 5회 연습</p>
          <p className="mt-2 text-xl font-bold text-purple-950 sm:text-2xl">
            {gameState === 'start'
              ? `${laps.length + 1}번째 보안문자를 입력해주세요.`
              : laps.length === 5
                ? '5문제를 모두 완료했어요!'
                : '정확하게 입력하고, 조금씩 더 빠르게.'}
          </p>
          <p className="mt-3 text-base text-purple-950/70">
            {laps.length === 5 && gameState === 'stop'
              ? '오른쪽 기록을 확인해보세요. 연습시작을 누르면 새로운 5문제로 다시 시작해요.'
              : '대소문자를 구분하지 않아요. 입력 후 Enter 또는 정답 입력 버튼을 눌러주세요.'}
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-4 lg:flex-row">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-[2]">
            <div className="flex flex-1 rounded-2xl flex-col bg-purple-100">
              <div className="p-4 sm:p-6 flex flex-1 flex-col">
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

                <div className="flex flex-1 flex-col gap-4 border border-purple-200 bg-purple-50 rounded-xl mt-4 p-4 sm:p-5">
                  <div
                    className={`flex h-48 items-center justify-center overflow-hidden rounded-xl border border-dashed border-purple-300 bg-white/50 p-0 text-center text-purple-800 ${gameState === 'start' ? 'text-4xl sm:text-6xl' : 'px-4 text-xl font-bold sm:text-2xl'} `}
                  >
                    {gameState === 'start' ? (
                      <CaptchaBox text={answer} />
                    ) : laps.length === 5 ? (
                      '연습 완료! 기록을 확인해주세요.'
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
                    className="min-w-0 rounded-xl border border-purple-200 bg-white px-4 py-3 text-lg tracking-widest focus:border-purple-500 focus:outline-2 focus:outline-purple-300 disabled:cursor-not-allowed disabled:opacity-50"
                    value={userInput}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && !event.nativeEvent.isComposing) checkAnswer()
                    }}
                    onChange={(e) => {
                      setUserInput(e.target.value)
                    }}
                  />
                  <button
                    type="button"
                    className="rounded-xl bg-purple-700 py-4 text-lg font-bold text-white transition-colors hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-700"
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

          <aside className="min-w-0 rounded-2xl border border-purple-100 bg-white p-6 shadow-sm lg:flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">현재 기록</h2>
              <p className="text-3xl font-extrabold">
                <span className="text-purple-600 mr-2">{laps.length}</span>
                <span className="text-slate-900">/ 5</span>
              </p>
            </div>

            {/* 5문제 중 완료한 수만큼 진행 표시 */}
            <div
              role="progressbar"
              aria-label="보안문자 완료 진행"
              aria-valuemin={0}
              aria-valuemax={5}
              aria-valuenow={laps.length}
              className="mt-4 h-2 overflow-hidden rounded-full bg-purple-200"
            >
              <div
                className="h-full rounded-full bg-purple-600 transition-[width]"
                style={{ width: `${(laps.length / 5) * 100}%` }}
              />
            </div>

            <div className="mt-5 border-t border-purple-100 pt-5">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-purple-600">연습 기록</h3>
              </div>
              <ol className="space-y-1">
                {Array.from({ length: 5 }, (_, index) => (
                  <li
                    key={index}
                    className={`flex items-center justify-between rounded-xl border px-4 py-3 text-sm text-purple-950 ${laps[index] !== undefined ? 'border-purple-200 bg-purple-50' : gameState === 'start' && index === laps.length ? 'border-purple-400 bg-white font-semibold' : 'border-purple-200 bg-purple-50/50'}`}
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
              <p role="status" aria-live="polite" className="mt-4 text-sm text-purple-800">
                {saveMessage}
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
