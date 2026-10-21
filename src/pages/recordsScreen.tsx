/**
 * RecordsScreen
 * @description 내 연습기록 페이지 Screen 컴포넌트, 경로 '/records'
 */
const RecordsScreen = () => {
  return (
    <section className="bg-purple-300 min-h-screen px-5 py-5">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            분석 <span className="text-purple-800 pl-4">리포트</span>
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-500 sm:text-lg">
            예매 연습 기록을 분석하여, 더 빠르고 정확한 예매를 위한 인사이트를 확인하세요.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-4">
          {/* 분석 대상 공연 정보 */}
          <div className="rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm shadow-violet-100/40 sm:p-6">
            <p className="inline-block rounded-lg bg-violet-50 px-3 py-1 text-xs font-bold text-violet-600">
              콘서트
            </p>
            <h2 className="mt-3 text-xl font-extrabold text-slate-950 sm:text-2xl">
              아이유 콘서트 2025 IU WORLD TOUR
            </h2>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-500 sm:flex-row sm:flex-wrap sm:gap-x-8">
              <p>KSPO DOME(올림픽체조 경기장)</p>
              <p>2025.03.01(토) ~ 2025.03.02(일)</p>
            </div>
          </div>

          {/* 연습 기록 요약 */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm shadow-violet-100/40 sm:p-6">
              <p className="text-sm font-medium text-slate-500">평균 예매 시간</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">
                42.3<span className="ml-1 text-xl">초</span>
              </p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm shadow-violet-100/40 sm:p-6">
              <p className="text-sm font-medium text-slate-500">최고 기록</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-violet-600">
                25<span className="ml-1 text-xl">초</span>
              </p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm shadow-violet-100/40 sm:p-6">
              <p className="text-sm font-medium text-slate-500">예매 성공률</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">
                50<span className="ml-1 text-xl">%</span>
              </p>
            </div>
            <div className="rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm shadow-violet-100/40 sm:p-6">
              <p className="text-sm font-medium text-slate-500">총 연습 횟수</p>
              <p className="mt-3 text-4xl font-extrabold tracking-tight text-slate-950">
                **<span className="ml-1 text-xl">회</span>
              </p>
            </div>
          </div>

          {/* 구간별 기록과 속도 추이 */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="min-w-0 rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm shadow-violet-100/40 sm:p-6">
              <h2 className="text-xl font-extrabold text-slate-950">구간별 평균 기록</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                각 구간별 평균 소요 시간을 비교해보세요.
              </p>
              <div className="mt-5 h-[clamp(180px,26vh,260px)] rounded-xl border border-dashed border-violet-200 bg-violet-50/60">
                {/* 구간별 평균 기록 그래프 추가 예정 */}
              </div>
            </div>
            <div className="min-w-0 rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm shadow-violet-100/40 sm:p-6">
              <h2 className="text-xl font-extrabold text-slate-950">예매 속도 추이</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                연습할수록 점점 빨라지는 예매 속도를 확인하세요.
              </p>
              <div className="mt-5 h-[clamp(180px,26vh,260px)] rounded-xl border border-dashed border-violet-200 bg-violet-50/60">
                {/* 예매 속도 추이 그래프 추가 예정 */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecordsScreen
