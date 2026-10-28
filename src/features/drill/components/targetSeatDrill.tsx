export default function TargetSeatDrill() {
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
          {/*미션정보*/}
          <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-purple-100 p-4 xl:p-6">
            <h2 className="mb-5 text-2xl font-extrabold">미션 정보</h2>

            <div className="flex flex-col gap-4">
              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <p className="font-semibold text-slate-600">선택할 좌석</p>
                <p className="mt-3 rounded-xl border border-purple-100 px-3 py-2 text-xl font-extrabold text-purple-600">
                  C3구역 3열 12번
                </p>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <p className="font-semibold text-slate-600">선택 소요 시간</p>
                <p className="mt-3 text-3xl font-extrabold text-purple-600">00:25</p>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <p className="font-semibold text-slate-600">정답 여부</p>
                <p className="mt-3 text-3xl font-extrabold text-slate-950">-</p>
              </div>

              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <p className="font-semibold text-slate-600">클릭 횟수</p>
                <p className="mt-3 text-3xl font-extrabold text-slate-950">0회</p>
              </div>
            </div>
          </div>

          {/* 좌석도 */}
          <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-purple-100 p-4 xl:p-6">
            <div className="flex items-start gap-2.5 text-xl xl:text-2xl">
              <h2 className="font-extrabold">좌석도</h2>
            </div>

            <div className="mt-3 h-[clamp(140px,24vh,220px)] shrink-0 rounded-xl bg-purple-50">
              {/* 연습 미리보기 이미지 추가 예정 */}
            </div>
          </div>

          {/*선택한 좌석*/}
          <div className="flex min-w-0 flex-1 flex-col rounded-2xl bg-purple-100 p-4 xl:p-6">
            <div className="flex flex-1 flex-col gap-5">
              <h2 className="text-2xl font-extrabold">선택한 좌석</h2>

              <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                <p className="text-sm font-semibold text-purple-600">선택 좌석</p>
                <p className="mt-2 text-2xl font-extrabold text-purple-700">C3구역 3열 12번</p>
                <span className="mt-3 inline-block rounded-full bg-white px-3 py-1 text-sm font-bold text-purple-700">
                  R석
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
                  <p className="text-right font-semibold text-slate-800">R석</p>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="shrink-0 text-slate-500">구역</p>
                  <p className="text-right font-semibold text-slate-800">C구역 C3블록</p>
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="shrink-0 text-slate-500">좌석</p>
                  <p className="text-right font-semibold text-slate-800">3열 12번</p>
                </div>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-purple-100 pt-5">
                  <p className="font-semibold text-slate-600">가격</p>
                  <p className="text-2xl font-extrabold text-purple-700">
                    154,000<span className="ml-1 text-sm font-semibold">원</span>
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-4">
                <button
                  type="button"
                  className="w-full rounded-xl bg-purple-600 py-4 text-lg font-bold text-white shadow-sm transition-colors hover:bg-purple-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-purple-600"
                >
                  선택 완료
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
