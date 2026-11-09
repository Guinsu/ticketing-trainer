export default function RealPracticeReport() {
  return (
    <section
      aria-labelledby="real-practice"
      className="grid min-w-0 gap-4 rounded-2xl bg-purple-100 p-4 xl:p-6 lg:row-span-4 lg:grid-rows-subgrid"
    >
      <div>
        <h2 id="real-practice" className="text-2xl font-extrabold text-purple-950">
          실전연습
        </h2>
        <p className="mt-1 text-sm text-purple-950/70">전체 예매 과정의 기록을 확인하세요.</p>
      </div>
      <div className="flex flex-col rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm shadow-violet-100/40 sm:p-6">
        <h3 className="text-xl font-extrabold text-slate-950">구간별 평균 기록</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 lg:min-h-10">
          각 구간별 평균 소요 시간을 비교해보세요.
        </p>

        <div className="mt-5 flex min-h-[clamp(180px,26vh,260px)] flex-1 items-center justify-center rounded-xl border border-dashed border-violet-200 bg-violet-50/60 p-5 text-center text-sm text-slate-500">
          <p>구간별 평균 기록 그래프가 표시될 영역입니다.</p>
        </div>
      </div>
      <div className="flex flex-col rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm shadow-violet-100/40 sm:p-6">
        <h3 className="text-xl font-extrabold text-slate-950">예매 속도 추이</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 lg:min-h-10">
          연습할수록 예매 시간이 어떻게 달라지는지 확인하세요.
        </p>

        <div className="mt-5 flex min-h-[clamp(180px,26vh,260px)] flex-1 items-center justify-center rounded-xl border border-dashed border-violet-200 bg-violet-50/60 p-5 text-center text-sm text-slate-500">
          <p>예매 시간 추이 그래프가 표시될 영역입니다.</p>
        </div>
      </div>
      <div className="flex flex-col rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm shadow-violet-100/40 sm:p-6">
        <h3 className="text-xl font-extrabold text-slate-950">전체 사용자와 비교</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 lg:min-h-10">
          실전연습 완료 기록의 내 평균 예매 시간과 전체 사용자 평균을 비교하세요.
        </p>

        <div className="mt-5 flex min-h-[clamp(180px,26vh,260px)] flex-1 items-center justify-center rounded-xl border border-dashed border-violet-200 bg-violet-50/60 p-5 text-center text-sm text-slate-500">
          <p>내 평균과 전체 사용자 평균을 가로 막대그래프로 표시할 영역입니다.</p>
        </div>
      </div>
    </section>
  )
}
