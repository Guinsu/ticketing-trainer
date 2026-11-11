import { useState } from 'react'
import ZoneMinimap from '@/features/seat/components/zoneMinimap'
import { KSPO_DOME } from '@/data/kspoDome'
import SeatMap from '@/features/seat/components/seatMap'
import type { Seat, SeatStatusMap, Zone } from '@/types/seat'
import useDrillStopwatch from '@/features/drill/hooks/useDrillStopwatch'
import { getStoredNickname } from '@/common/utils/nicknameStrorage'
import useDrillRecord from '@/features/drill/hooks/useDrillRecord'

type GameState = 'stop' | 'start' | 'over'

export default function TargetSeatDrill() {
  const { saveRecord, saveMessage } = useDrillRecord()
  //게임 상태 관리
  const [gameState, setGameState] = useState<GameState>('stop')
  const [zone, setZone] = useState<Zone | null>(null)
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const zoneGrade = KSPO_DOME.grades.find((grade) => grade.id === zone?.grade)
  const statusMap: SeatStatusMap = selectedSeat ? { [selectedSeat.id]: 'selected' } : {}
  const { time, resetStopWatch, stopStopWatch } = useDrillStopwatch()
  const [target, setTarget] = useState<Seat | null>(null)
  const [errorCount, setErrorCount] = useState(0)
  const [clickCount, setClickCount] = useState(0)
  const [feedback, setFeedback] = useState('')
  // 이번 화면에서 완료한 기록만 비교. 새로고침하거나 나가면 초기화
  const [sessionRecords, setSessionRecords] = useState<number[]>([])
  const targetZone = KSPO_DOME.zones.find((item) => item.id === target?.zoneId)
  const previousRecord =
    sessionRecords.length > 1 ? sessionRecords[sessionRecords.length - 2] : null
  const difference = previousRecord === null ? null : previousRecord - time

  function finishGame() {
    if (gameState !== 'start' || selectedSeat === null) return
    // 목표가 아닌 좌석은 계속 연습할 수 있게 안내만 표시
    if (selectedSeat.id !== target?.id) {
      setErrorCount((prev) => prev + 1)
      setFeedback('목표 좌석과 달라요. 구역, 열, 번호를 다시 확인해주세요.')
      return
    }
    const elapsed = stopStopWatch()
    setSessionRecords((prev) => [...prev, elapsed])
    setFeedback('')
    setGameState('over')
    void saveRecord({
      nickname: getStoredNickname(),
      practice_type: 'target-seat',
      status: 'completed',
      durationMS: elapsed,
      clickCount,
      errorCount,
    })
  }

  // 판매 중인 구역에서 목표 좌석 생성. 다시 시작할 때만 새 목표로 변경
  function startGame() {
    const zones = KSPO_DOME.zones.filter((item) => item.isOnSale)
    const nextZone = zones[Math.floor(Math.random() * zones.length)]
    const row = Math.floor(Math.random() * nextZone.rows) + 1
    const number = Math.floor(Math.random() * nextZone.seatsPerRow) + 1
    setTarget({
      id: `${nextZone.id}-${row}-${number}`,
      zoneId: nextZone.id,
      row,
      number,
      grade: nextZone.grade,
    })
    setZone(null)
    setSelectedSeat(null)
    setErrorCount(0)
    setClickCount(0)
    setFeedback('')
    setGameState('start')
    resetStopWatch()
  }

  function handleSeatClick(seat: Seat) {
    if (gameState !== 'start') return
    setClickCount((prev) => prev + 1)
    setFeedback('')
    setSelectedSeat((prev) => (prev?.id === seat.id ? null : seat))
  }

  return (
    <section className="min-h-screen px-5 py-5">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold sm:text-5xl">
          지정 좌석 <span className="text-purple-800">선택 연습</span>
        </h1>
        <p className="mt-3 text-base text-slate-500 sm:text-lg">
          목표 구역과 좌석을 찾아보세요. 정확하게 고른 뒤 선택을 완료하면 기록이 남아요.
        </p>

        {/* 목표는 구역, 열, 번호로 나눠서 연습 중에도 바로 찾을 수 있게 표시 */}
        <div className="mt-5 rounded-2xl border border-purple-200 bg-purple-50 p-5 sm:p-6">
          <p className="text-sm font-bold text-purple-700">
            {gameState === 'over' ? '완료한 목표 좌석' : '이번 목표 좌석'}
          </p>
          {target ? (
            <p className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-2xl font-extrabold text-purple-950 sm:text-3xl">
              <span>{targetZone?.label}</span>
              <span aria-hidden="true" className="text-purple-300">
                ·
              </span>
              <span>{target.row}열</span>
              <span aria-hidden="true" className="text-purple-300">
                ·
              </span>
              <span>{target.number}번</span>
            </p>
          ) : (
            <p className="mt-2 text-xl font-bold text-purple-950 sm:text-2xl">
              준비되셨나요? 목표 좌석을 찾아보세요.
            </p>
          )}
          <p className="mt-3 text-base text-purple-950/70">
            {gameState === 'stop'
              ? '연습 시작을 누르면 목표가 나타나고 시간 측정이 시작돼요.'
              : gameState === 'over'
                ? '목표 좌석을 정확하게 찾았어요. 결과를 확인하고 다시 도전해보세요.'
                : '구역 선택 → 좌석 선택 → 선택 완료 순서로 진행해주세요.'}
          </p>
        </div>

        <div className="mt-4 grid items-start gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(300px,1fr)]">
          {/* 공용 좌석도는 그대로 사용하고 집중연습 화면의 공간만 넓혀서 배치 */}
          <div className="min-w-0 rounded-2xl bg-purple-100 p-4 sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-extrabold">
                {zone && gameState === 'start' ? zone.label : '좌석도'}
              </h2>
              {gameState === 'start' && (
                <span className="rounded-full bg-white px-3 py-1 text-sm font-semibold text-purple-700">
                  {zone ? '02 좌석 선택' : '01 구역 선택'}
                </span>
              )}
            </div>
            <div className="mt-4">
              {gameState === 'start' ? (
                zone && zoneGrade ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setZone(null)
                        setSelectedSeat(null)
                        setFeedback('')
                      }}
                      className="mb-3 rounded-lg px-2 py-2 text-sm font-bold text-purple-700 hover:bg-purple-200 focus-visible:outline-2 focus-visible:outline-purple-700"
                    >
                      ← 구역 다시 선택
                    </button>
                    <div className="max-h-[65vh] overflow-auto rounded-xl bg-white/60 p-2 sm:p-4">
                      <SeatMap
                        zone={zone}
                        grade={zoneGrade}
                        statusMap={statusMap}
                        onSeatClick={handleSeatClick}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mb-2 text-sm text-slate-600">
                      위에 표시된 목표 구역을 선택해주세요.
                    </p>
                    <div className="flex justify-center rounded-xl bg-white/60 p-2">
                      <ZoneMinimap venue={KSPO_DOME} soldOutZoneIds={[]} onZoneClick={setZone} />
                    </div>
                  </>
                )
              ) : (
                <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-dashed border-purple-300 bg-white/50 px-5 py-10 text-center sm:min-h-80">
                  <span
                    aria-hidden="true"
                    className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-700"
                  >
                    {gameState === 'over' ? '✓' : '01'}
                  </span>
                  <p className="text-xl font-bold text-purple-950">
                    {gameState === 'over' ? '목표 좌석 선택 완료!' : '구역부터 차근차근 찾아보세요'}
                  </p>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    {gameState === 'over'
                      ? '새로운 목표 좌석으로 한 번 더 연습할 수 있어요.'
                      : '시작하면 공연장 구역도가 나타나요. 목표 구역을 고른 다음 열과 번호를 확인해주세요.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="min-w-0 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-extrabold">
                {gameState === 'over' ? '이번 연습 결과' : '선택한 좌석'}
              </h2>
              {gameState === 'start' && (
                <span className="text-2xl font-extrabold tabular-nums text-purple-700">
                  {(time / 1000).toFixed(3)}
                  <span className="ml-1 text-sm font-medium">초</span>
                </span>
              )}
            </div>

            {gameState === 'over' ? (
              <div className="mt-5">
                <p className="text-sm font-semibold text-purple-700">목표 좌석 찾는 데 걸린 시간</p>
                <p className="mt-2 text-4xl font-extrabold tabular-nums text-purple-950">
                  {(time / 1000).toFixed(3)}
                  <span className="ml-1 text-base font-medium">초</span>
                </p>
                {/* 이전 기록 비교는 이번 방문에서 완료한 연습끼리만 계산 */}
                <div className="mt-4 rounded-xl bg-purple-50 p-4">
                  <p className="font-bold text-purple-800">
                    {difference === null
                      ? '첫 기록을 만들었어요!'
                      : Math.abs(difference) < 0.5
                        ? '직전 연습과 같은 기록이에요.'
                        : difference > 0
                          ? `직전보다 ${(difference / 1000).toFixed(3)}초 빨라졌어요!`
                          : `직전보다 ${(Math.abs(difference) / 1000).toFixed(3)}초 더 걸렸어요.`}
                  </p>
                  <p className="mt-2 text-sm leading-6 text-purple-950/65">
                    {difference === null
                      ? '한 번 더 연습하면 직전 기록과 비교할 수 있어요.'
                      : '구역과 목표 좌석은 매번 달라요. 변화는 참고용으로 확인해주세요.'}
                  </p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">이번 방문 최고</p>
                    <p className="mt-1 font-bold tabular-nums">
                      {(Math.min(...sessionRecords) / 1000).toFixed(3)}초
                    </p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">잘못된 좌석 확인</p>
                    <p className="mt-1 font-bold">{errorCount}회</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-slate-600">
                  {targetZone?.label} · {selectedSeat?.row}열 {selectedSeat?.number}번 · 클릭{' '}
                  {clickCount}회
                </p>
              </div>
            ) : selectedSeat ? (
              <div className="mt-5 rounded-xl bg-purple-50 p-5">
                <p className="text-sm font-semibold text-purple-700">{zone?.label}</p>
                <p className="mt-2 text-2xl font-extrabold text-purple-950">
                  {selectedSeat.row}열 {selectedSeat.number}번
                </p>
                <div className="mt-4 flex items-center justify-between gap-3 border-t border-purple-200 pt-4 text-sm">
                  <span className="rounded-full bg-white px-3 py-1 font-bold text-purple-700">
                    {selectedSeat.grade}석
                  </span>
                  <span className="font-semibold text-slate-600">
                    {zoneGrade?.price.toLocaleString('ko-KR')}원
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">
                  목표의 구역, 열, 번호와 같은지 확인한 뒤 선택을 완료해주세요.
                </p>
              </div>
            ) : (
              <div className="mt-5 rounded-xl bg-slate-50 p-5">
                <p className="font-bold text-slate-700">
                  {gameState === 'stop'
                    ? '아직 선택한 좌석이 없어요'
                    : zone
                      ? '목표 열과 번호를 찾아주세요'
                      : '먼저 목표 구역을 선택해주세요'}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {gameState === 'stop'
                    ? '연습을 시작하고 좌석을 고르면 이곳에 선택 정보가 표시돼요.'
                    : '좌석을 클릭하면 선택 정보가 표시돼요. 같은 좌석을 다시 누르면 선택이 해제됩니다.'}
                </p>
              </div>
            )}

            <p
              role="status"
              aria-live="polite"
              className="mt-4 min-h-6 text-sm font-medium text-rose-700"
            >
              {feedback}
            </p>
            <button
              type="button"
              disabled={gameState === 'start' && selectedSeat === null}
              onClick={gameState === 'start' ? finishGame : startGame}
              className="mt-3 w-full rounded-xl bg-purple-700 px-4 py-4 text-lg font-bold text-white transition-colors hover:bg-purple-800 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              {gameState === 'start'
                ? '선택 완료'
                : gameState === 'over'
                  ? '다시 시작'
                  : '연습 시작'}
            </button>
            <p role="status" aria-live="polite" className="mt-3 text-sm text-slate-500">
              {saveMessage}
            </p>
            <p className="mt-3 text-xs leading-5 text-slate-400">
              {gameState === 'over'
                ? '이번 방문 기록은 이 화면을 벗어나거나 새로고침하면 초기화돼요.'
                : '좌석 선택 완료까지의 시간을 측정해요.'}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
