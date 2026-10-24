import { GRADES, ZONES } from '@/features/booking/zones'

/**
 * ZoneMap
 * @description 좌석 선택 첫 화면, 공연장 구역 배치도(등급 색상·매진 구역)
 */
const ZoneMap = () => {
  return (
    <div className="grid aspect-6/5 w-full max-w-xl grid-cols-6 grid-rows-[2.5rem_repeat(5,minmax(0,1fr))] gap-1.5">
      <div className="col-span-4 col-start-2 row-start-1 flex items-center justify-center bg-gray-800 text-sm font-bold tracking-[0.3em] text-white">
        STAGE
      </div>
      {ZONES.map((zone) => {
        const color = GRADES.find((grade) => grade.id === zone.grade)?.color

        return (
          <button
            key={zone.id}
            type="button"
            disabled={zone.soldOut}
            aria-label={`${zone.id}구역${zone.soldOut ? ' 매진' : ''}`}
            className={`${zone.area} flex items-center justify-center text-lg font-extrabold ${
              zone.soldOut
                ? 'bg-gray-200 text-gray-400'
                : `${color} cursor-pointer text-white hover:ring-2 hover:ring-gray-900 hover:ring-offset-2`
            }`}
          >
            {zone.id}
          </button>
        )
      })}
    </div>
  )
}

export default ZoneMap
