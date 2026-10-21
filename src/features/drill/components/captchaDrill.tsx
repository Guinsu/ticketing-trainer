import { useEffect, useState, useRef } from 'react'
import { generateCaptcha } from '@/features/captcha/utils/generateCaptcha'
import CaptchaBox from '@/features/captcha/components/captchaBox'

export default function CaptchaDrill() {
  //전체 라운드
  const totalRounds = 5

  // 화면에 표시할 보안문자 또는 정답으로 연습시작과 다음 문제 전환 시 새로 생성
  const [captcha, setCaptcha] = useState('')

  // 입력창의 값이다. 입력할 때마다 갱신한다. 정답 확인 시 captcha와 비교
  const [answer, setAnswer] = useState('')

  // 연습 진행 여부 확인 / 타이머 실행, 입력창 활성화, 버튼 동작을 결정
  const [isRunning, setIsRunning] = useState(false)

  // 현재 문제의 경과 시간(ms)으로 타이머로 갱신하고 다음 문제에서 0으로 초기화한다.
  const [elapsedMs, setElapsedMs] = useState(0)

  // 정답을 맞힌 순서대로 각 문제의 소요 시간(ms)을 저장해 기록 목록과 통계에 사용한다.
  const [records, setRecords] = useState<number[]>([])

  // 입력 요청, 오답, 정답, 연습 완료 등의 안내 문구를 화면에 표시한다.
  const [message, setMessage] = useState('')

  // 오답 여부에 따라 안내 문구를 빨간색으로 표시한다. 정답을 맞히거나 재시작하면 해제한다.
  const [hasError, setHasError] = useState(false)

  // 문제 시작 시간을 저장하고 현재 시각과의 차이로 소요 시간을 계산
  // 고정밀 타이머(performance.now())를 사용하여 정확한 소요 시간을 측정  / Date.now()와 달리 시스템 시계 변경에 영향을 받지 않는다.
  const startedAt = useRef(0)

  // 실제 입력창에 접근해 포커스를 주거나 오답 입력 내용을 전체 선택하는 데 사용한다.
  const inputRef = useRef<HTMLInputElement>(null)

  // 저장된 기록이 전체 문제 수에 도달하면 완료 안내와 최단·평균 기록을 표시한다.
  const isFinished = records.length === totalRounds

  // 완료한 문제 수에 1을 더해 현재 문제 번호를 구하고 완료 후에도 전체 문제 수를 넘지 않게 한다.
  const currentRound = Math.min(records.length + 1, totalRounds)

  // 현재 문제의 경과 시간을 분:초.백분의 초 형식으로 표시한다.
  const elapsedTime =
    String(Math.floor(elapsedMs / 60000)).padStart(2, '0') +
    ':' +
    String(Math.floor(elapsedMs / 1000) % 60).padStart(2, '0') +
    '.' +
    String(Math.floor((elapsedMs % 1000) / 10)).padStart(2, '0')

  // 연습 중에는 입력창에 포커스를 주고 시간을 갱신 후 종료 시 타이머를 정리한다.
  useEffect(() => {
    if (!isRunning) return

    inputRef.current?.focus()

    const timer = window.setInterval(() => {
      setElapsedMs(performance.now() - startedAt.current)
    }, 30)

    return () => window.clearInterval(timer)
  }, [isRunning])

  // 이전 기록과 안내를 초기화하고 첫 문제의 시간 측정을 시작한다.
  function startPractice() {
    setCaptcha(generateCaptcha())
    setAnswer('')
    setRecords([])
    setElapsedMs(0)
    setMessage('')
    startedAt.current = performance.now()
    setIsRunning(true)
    setHasError(false)
  }

  // 앞뒤 공백을 제거한 답을 대소문자까지 비교하고 정답일 때만 기록을 저장한다.
  function checkAnswer() {
    if (!answer.trim()) {
      setMessage('보안문자를 입력해 주세요.')
      inputRef.current?.focus()
      return
    }

    if (answer.trim() !== captcha) {
      setHasError(true)
      setMessage('일치하지 않습니다. 다시 입력해 주세요.')
      inputRef.current?.select()
      return
    }

    setHasError(false)

    // 오답을 다시 입력하는 데 걸린 시간도 해당 문제의 기록에 포함한다.
    const durationMs = performance.now() - startedAt.current
    const nextRecords = [...records, durationMs]

    setRecords(nextRecords)
    setAnswer('')

    // 마지막 문제를 맞히면 타이머를 멈추고 최종 결과를 표시한다.
    if (nextRecords.length === totalRounds) {
      setElapsedMs(durationMs)
      setIsRunning(false)
      setMessage(`${totalRounds} 문제를 모두 완료했습니다.`)
      return
    }

    // 다음 문제는 시작 시간을 0 시작하고 문제별 소요 시간을 따로 측정한다.
    setCaptcha(generateCaptcha())
    startedAt.current = performance.now()
    setElapsedMs(0)
    setMessage('정답입니다. 다음 문제를 입력해 주세요.')
    inputRef.current?.focus()
  }

  // 완료한 문제들의 최단 시간과 평균 시간을 계산한다. 기록이 없으면 0
  const bestMs = records.length > 0 ? Math.min(...records) : 0

  const averageMs =
    records.length > 0 ? records.reduce((sum, time) => sum + time, 0) / records.length : 0

  return (
    <section className="bg-purple-300 min-h-screen px-5 py-5">
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
            <div className="flex flex-1 rounded-xl flex-col border-white border-2 bg-white">
              <div className="mx-3 my-3 flex flex-1 flex-col">
                <div className="flex gap-2.5 text-2xl">
                  <p className="px-3.5 bg-purple-800 rounded-2xl text-white">01</p>
                  <h2 className="font-extrabold">보안문자 입력 연습</h2>
                </div>

                <div className="flex flex-1 flex-col gap-4 bg-gray-200 rounded-xl mt-3 p-5">
                  {isRunning ? (
                    <CaptchaBox value={captcha} />
                  ) : (
                    <div className="flex h-48 items-center justify-center rounded-xl bg-white text-purple-700">
                      {isFinished ? '연습을 완료했습니다.' : '연습 시작 버튼을 눌러주세요.'}
                    </div>
                  )}

                  <input
                    ref={inputRef}
                    type="text"
                    value={answer}
                    onChange={(event) => setAnswer(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' && isRunning) {
                        event.preventDefault()
                        checkAnswer()
                      }
                    }}
                    disabled={!isRunning}
                    autoComplete="off"
                    spellCheck={false}
                    maxLength={6}
                    placeholder="보안문자를 입력하세요."
                    aria-label="보안문자 입력"
                    aria-describedby="captcha-message"
                    className="rounded-xl border border-purple-200 bg-white px-4 py-3 disabled:opacity-50"
                  />
                  <button
                    type="button"
                    onClick={isRunning ? checkAnswer : startPractice}
                    className="rounded-xl bg-purple-600 py-4 text-lg font-bold text-white"
                  >
                    {isRunning
                      ? `확인 · ${elapsedTime}`
                      : isFinished
                        ? '다시 연습하기'
                        : '연습 시작'}
                  </button>

                  <p
                    id="captcha-message"
                    role="status"
                    className={`min-h-7 text-center text-lg font-semibold ${
                      hasError ? 'text-red-600' : 'text-purple-800'
                    }`}
                  >
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="min-w-0 border-white border bg-white rounded-xl p-6 lg:flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold">현재기록</h2>
              <p className="text-3xl font-extrabold">
                <span className="text-purple-600 mr-2">{currentRound}</span>
                <span className="text-slate-900">/ {totalRounds}</span>
              </p>
            </div>

            <div className="mt-5 border-t border-purple-100 pt-5">
              <h3 className="mb-3 font-bold text-purple-600">연습 기록</h3>

              <ol className="space-y-1">
                {Array.from({ length: totalRounds }, (_, index) => (
                  <li
                    key={index}
                    className={`flex items-center justify-between rounded-xl border px-4 py-2 text-sm ${
                      index + 1 === currentRound && isRunning
                        ? 'border-purple-200 bg-purple-50 font-bold text-purple-700'
                        : 'border-purple-100 text-indigo-900'
                    }`}
                  >
                    <span>{index + 1}번</span>
                    <span>
                      {records[index] !== undefined
                        ? `${(records[index] / 1000).toFixed(2)}초`
                        : index + 1 === currentRound && isRunning
                          ? '진행 중'
                          : '00:00'}
                    </span>
                  </li>
                ))}
              </ol>
              {isFinished && (
                <div className="mt-6 grid grid-cols-2 gap-3 border-t border-purple-100 pt-5">
                  <div className="rounded-xl bg-purple-50 p-4 text-center">
                    <h3 className="text-sm font-semibold text-purple-700">최고 기록</h3>
                    <p className="mt-2 text-2xl font-extrabold text-purple-600">
                      {(bestMs / 1000).toFixed(2)}
                      <span className="ml-1 text-sm">초</span>
                    </p>
                  </div>

                  <div className="rounded-xl bg-indigo-50 p-4 text-center">
                    <h3 className="text-sm font-semibold text-indigo-700">평균 기록</h3>
                    <p className="mt-2 text-2xl font-extrabold text-indigo-600">
                      {(averageMs / 1000).toFixed(2)}
                      <span className="ml-1 text-sm">초</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
