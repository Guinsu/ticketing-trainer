import { useState } from 'react'
import ZoneMinimap from '@/features/seat/components/zoneMinimap'
import { KSPO_DOME } from '@/data/kspoDome'
import SeatMap from '@/features/seat/components/seatMap'
import type { Seat, SeatStatusMap, Zone } from '@/types/seat'
import useStopwatch from '@/common/hooks/useStopwatch'

type GameState = 'stop' | 'start' | 'over'

export default function TargetSeatDrill() {
  //게임 상태 관리
  const [gameState, setGameState] = useState<GameState>('stop')
  const [zone, setZone] = useState<Zone | null>(null)
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  const zoneGrade = KSPO_DOME.grades.find((grade) => grade.id === zone?.grade)
  const statusMap: SeatStatusMap = selectedSeat ? { [selectedSeat.id]: 'selected' } : {}
  const { time, intervalRef, resetStopWatch } = useStopwatch()

  const handleSeatClick = (seat: Seat) =>
    setSelectedSeat((prev) => (prev?.id === seat.id ? null : seat))

  return (
    <section className="min-h-screen px-5 py-5">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            지정 좌석
            <span className="text-purple-800 pl-4">선택 연습</span>
          </h1>
          <p className="mt-3 text-gray-500 text-base sm:text-xl">
            지정된 좌석을 찾아 정확하게 선택해보세요. 실전과 동일한 환경에서 빠르거 정확한 클릭
            연습을 할 수 있습니다.
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-3 lg:flex-row">
          {/* 좌석도 */}
          <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-purple-100 p-4 xl:p-6">
            <div className="flex items-start gap-2.5 text-xl xl:text-2xl">
              <h2 className="font-extrabold">좌석도</h2>
            </div>

            <div className="mt-3 h-[600px] overflow-auto">
              {gameState === 'start' ? (
                zone && zoneGrade ? (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        setZone(null)
                        setSelectedSeat(null)
                      }}
                      className="cursor-pointer text-sm font-bold text-gray-600 hover:text-primary py-3"
                    >
                      ← 구역 다시 선택
                    </button>
                    <div className="w-full max-w-2xl">
                      <p className="mb-3 text-lg font-extrabold">{zone.label}</p>
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
                    <p className="text-sm font-bold text-gray-600">구역을 선택해주세요</p>
                    <ZoneMinimap venue={KSPO_DOME} soldOutZoneIds={[]} onZoneClick={setZone} />
                  </>
                )
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-slate-500">
                  {gameState === 'over' ? '연습이 완료되었습니다.' : '연습 시작 버튼을 눌러주세요.'}
                </div>
              )}
            </div>
          </div>

          {/*선택한 좌석*/}
          <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-purple-100 p-4 xl:p-6">
            <div className="flex flex-1 flex-col gap-5">
              {gameState === 'over' ? (
                ''
              ) : (
                <div className="flex items-center">
                  <h2 className="flex-1 text-2xl font-extrabold">선택한 좌석</h2>

                  {/*타이머 */}
                  <span className="shrink-0 rounded-xl bg-purple-50 px-3 py-2 font-bold tabular-nums text-purple-800 text-3xl">
                    {(time / 1000).toFixed(3)}
                    <span className="ml-1 text-sm font-medium">초</span>
                  </span>
                </div>
              )}

              {gameState === 'over' ? (
                <div className="flex flex-1 flex-col gap-5">
                  <h2 className="text-2xl font-extrabold">연습 결과</h2>
                  <div className="rounded-2xl flex-1 bg-purple-50 p-6">
                    <h3 className="text-3xl font-bold text-purple-700">예매 성공!</h3>
                    <div className="mt-8 flex flex-col gap-9 text-base">
                      <div className="flex justify-between text-2xl">
                        <div className="text-slate-500">선택 좌석</div>
                        <div className="font-semibold">
                          {selectedSeat !== null
                            ? `${selectedSeat?.row}열 ${selectedSeat?.number}번 `
                            : ''}
                        </div>
                      </div>
                      <div className="flex justify-between text-2xl">
                        <div className="text-slate-500">좌석 등급</div>
                        <div className="font-semibold">{selectedSeat?.grade}석</div>
                      </div>
                      <div className="flex justify-between text-2xl">
                        <div className="text-slate-500">선택 구역</div>
                        <div className="font-semibold">
                          {' '}
                          {selectedSeat !== null ? `${selectedSeat?.zoneId}구역 ` : ''}
                        </div>
                      </div>
                      <div className="flex justify-between text-2xl">
                        <div className="text-slate-500">선택 가격</div>
                        <div className="font-semibold">
                          {selectedSeat !== null ? zoneGrade?.price.toLocaleString('ko-KR') : '0'}원
                        </div>
                      </div>
                      <div className="flex justify-between text-2xl">
                        <div className="text-slate-500">예매 완료 시간</div>
                        <div className="font-semibold">{(time / 1000).toFixed(3)}초</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                    <p className="mt-2 text-2xl font-extrabold text-purple-700">
                      {selectedSeat !== null
                        ? `${selectedSeat?.zoneId}구역 ${selectedSeat?.row}열 ${selectedSeat?.number}번 `
                        : ''}
                    </p>
                    <span className="mt-3 inline-block rounded-full bg-white px-3 py-1 text-sm font-bold text-purple-700">
                      {selectedSeat?.grade}석
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
                      <p className="text-right font-semibold text-slate-800">
                        {selectedSeat?.grade}
                      </p>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="shrink-0 text-slate-500">구역</p>
                      <p className="text-right font-semibold text-slate-800">
                        {selectedSeat !== null ? `${selectedSeat?.zoneId}구역 ` : ''}
                      </p>
                    </div>
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="shrink-0 text-slate-500">좌석</p>
                      <p className="text-right font-semibold text-slate-800">
                        {selectedSeat !== null
                          ? `${selectedSeat?.row}열 ${selectedSeat?.number}번 `
                          : ''}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-purple-100 pt-5">
                      <p className="font-semibold text-slate-600">가격</p>
                      <p className="text-2xl font-extrabold text-purple-700">
                        {selectedSeat !== null ? zoneGrade?.price.toLocaleString('ko-KR') : '0'}
                        <span className="ml-1 text-sm font-semibold">원</span>
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-auto pt-4">
                <button
                  type="button"
                  className="w-full rounded-xl bg-purple-600 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-purple-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-600"

                  onClick={() => {
                    if (gameState === 'stop') {
                      resetStopWatch()
                      setGameState('start')
                    } else if (gameState === 'start' && selectedSeat !== null) {
                      clearInterval(intervalRef.current)
                      intervalRef.current = undefined
                      setGameState('over')
                    } else if (gameState === 'over') {
                      setZone(null)
                      setSelectedSeat(null)
                      setGameState('start')
                      resetStopWatch()
                    }
                  }}
                >
                  {gameState === 'start'
                    ? '선택 완료'
                    : gameState === 'over' && selectedSeat !== null
                      ? '다시 시작'
                      : '연습 시작'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
