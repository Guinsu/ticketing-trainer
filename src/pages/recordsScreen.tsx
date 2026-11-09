import RealPracticeReport from '@/features/record/components/RealPracticeReport'
import FocusedPracticeReport from '@/features/record/components/FocusedPracticeReport'

export default function RecordsScreen() {
  return (
    <section className="min-h-screen bg-white px-5 py-5">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            분석 <span className="pl-4 text-purple-800">리포트</span>
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-500 sm:text-lg">
            예매 연습 기록을 분석하여, 더 빠르고 정확한 예매를 위한 인사이트를 확인하세요.
          </p>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:grid-rows-[auto_auto_auto_auto]">
          <RealPracticeReport />
          <FocusedPracticeReport />
        </div>
      </div>
    </section>
  )
}
