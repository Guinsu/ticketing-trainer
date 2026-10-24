import ZoneMap from '@/features/booking/components/zoneMap'
import { GRADES } from '@/features/booking/zones'

/**
 * SeatStep
 * @description 예매창 2단계, 구역 배치도와 좌석 등급·선택 좌석 패널
 */
const SeatStep = () => {
  return (
    <div className="grid min-h-[600px] lg:grid-cols-[1fr_360px]">
      <section className="relative flex items-center justify-center bg-gray-50 px-6 pt-16 pb-24">
        {/* TODO: 구역 클릭 시 인수 님 seatMap으로 전환, 보안문자 모달(captchaBox)은 이 영역 위에 overlay */}
        <p className="absolute top-6 left-6 text-sm font-bold text-gray-600">구역을 선택해주세요</p>
        <ZoneMap />
        <div className="absolute right-6 bottom-6 flex flex-col border border-gray-300 bg-white">
          <button type="button" className="size-11 cursor-pointer text-xl">
            +
          </button>
          <button type="button" className="size-11 cursor-pointer border-t border-gray-100 text-xl">
            −
          </button>
        </div>
      </section>

      <aside className="flex flex-col border-l border-gray-200 bg-white p-6">
        <h2 className="border-b-2 border-gray-900 pb-3 text-lg font-extrabold tracking-tight">좌석 등급</h2>
        <ul className="mt-3 space-y-2.5 text-sm">
          {GRADES.map((grade) => (
            <li key={grade.id} className="flex items-center gap-2">
              <span className={`size-3 shrink-0 ${grade.color}`} />
              <span className="font-bold">{grade.label}</span>
              <span className="text-gray-500">{grade.price}</span>
              <span className="ml-auto text-gray-600">
                잔여 <b className="text-primary tabular-nums">{grade.remain}</b>석
              </span>
            </li>
          ))}
        </ul>

        <h2 className="mt-8 border-b-2 border-gray-900 pb-3 text-lg font-extrabold tracking-tight">선택 좌석</h2>
        <p className="flex flex-1 items-center justify-center py-16 text-gray-400">선택한 좌석이 없습니다.</p>
        <button type="button" disabled className="bg-gray-100 py-4 text-lg font-bold text-gray-400">
          선택 완료
        </button>
      </aside>
    </div>
  )
}

export default SeatStep
