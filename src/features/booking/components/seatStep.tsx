import { KSPO_DOME } from '@/data/kspoDome'
import SeatMap from '@/features/seat/components/seatMap'
import ZoneMinimap from '@/features/seat/components/zoneMinimap'
import type { Seat, SeatStatusMap, Zone } from '@/types/seat'
import { useState } from 'react'

interface SeatStepProps {
  onNext: (seat: Seat) => void
}

/**
 * SeatStep
 * @description 예매창 2단계, 구역 배치도 → 구역 좌석맵 선택과 좌석 등급·선택 좌석 패널
 */
const SeatStep = ({ onNext }: SeatStepProps) => {
  const [zone, setZone] = useState<Zone | null>(null)
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null)
  // TODO: seatSimulator 결과(대기열 peopleAhead·seed 기반 매진 좌석)와 합치기
  const statusMap: SeatStatusMap = selectedSeat ? { [selectedSeat.id]: 'selected' } : {}
  const zoneGrade = KSPO_DOME.grades.find((grade) => grade.id === zone?.grade)
  const selectedGrade = KSPO_DOME.grades.find((grade) => grade.id === selectedSeat?.grade)

  // 같은 좌석을 다시 누르면 선택 취소, 다른 좌석을 누르면 바꾼다
  const handleSeatClick = (seat: Seat) =>
    setSelectedSeat((prev) => (prev?.id === seat.id ? null : seat))

  return (
    <div className="grid min-h-[600px] lg:grid-cols-[1fr_360px]">
      <section className="relative flex items-center justify-center bg-gray-50 px-6 pt-16 pb-24">
        {/* TODO: 보안문자 모달(captchaBox)은 이 영역 위에 overlay */}
        {zone && zoneGrade ? (
          <>
            <button
              type="button"
              onClick={() => setZone(null)}
              className="absolute top-5 left-6 cursor-pointer text-sm font-bold text-gray-600 hover:text-primary"
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
            <p className="absolute top-6 left-6 text-sm font-bold text-gray-600">
              구역을 선택해주세요
            </p>
            <ZoneMinimap venue={KSPO_DOME} soldOutZoneIds={[]} onZoneClick={setZone} />
          </>
        )}
      </section>

      <aside className="flex flex-col border-l border-gray-200 bg-white p-6">
        <h2 className="border-b-2 border-gray-900 pb-3 text-lg font-extrabold tracking-tight">
          좌석 등급
        </h2>
        <ul className="mt-3 space-y-2.5 text-sm">
          {KSPO_DOME.grades.map((grade) => (
            <li key={grade.id} className="flex items-center gap-2">
              <span className={`size-3 shrink-0 ${grade.bgClass}`} />
              <span className="font-bold">{grade.label}</span>
              <span className="text-gray-500">{grade.price.toLocaleString()}원</span>
            </li>
          ))}
        </ul>

        <h2 className="mt-8 border-b-2 border-gray-900 pb-3 text-lg font-extrabold tracking-tight">
          선택 좌석
        </h2>
        {selectedSeat && selectedGrade ? (
          <div className="flex-1 py-6">
            <p className="text-lg font-bold">
              {selectedSeat.zoneId}구역 {selectedSeat.row}열 {selectedSeat.number}번
            </p>
            <p className="mt-1 text-gray-600">
              {selectedGrade.label} · {selectedGrade.price.toLocaleString()}원
            </p>
          </div>
        ) : (
          <p className="flex flex-1 items-center justify-center py-16 text-gray-400">
            선택한 좌석이 없습니다.
          </p>
        )}
        <button
          type="button"
          disabled={!selectedSeat}
          onClick={() => selectedSeat && onNext(selectedSeat)}
          className="py-4 text-lg font-bold enabled:cursor-pointer enabled:bg-primary enabled:text-white enabled:hover:bg-primary-hover disabled:bg-gray-100 disabled:text-gray-400"
        >
          선택 완료
        </button>
      </aside>
    </div>
  )
}

export default SeatStep
