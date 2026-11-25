import { lazy, Suspense, useEffect, useState } from 'react'
import type { RealPracticeData } from '@/lib/getRealPracticeRecords'
import ChartFallback from './chartFallback'

// Supabase 클라이언트(약 55KB)가 첫 렌더링을 막지 않도록 조회 모듈은 렌더 후에 불러옴
const getRealPracticeRecords = () => import('@/lib/getRealPracticeRecords').then((m) => m.default())

// recharts는 용량이 커서 첫 화면 렌더링을 막지 않도록 차트만 따로 불러옴
const StageChart = lazy(() =>
  import('./realPracticeCharts').then((m) => ({ default: m.StageChart })),
)
const TrendChart = lazy(() =>
  import('./realPracticeCharts').then((m) => ({ default: m.TrendChart })),
)
const CompareChart = lazy(() =>
  import('./realPracticeCharts').then((m) => ({ default: m.CompareChart })),
)

export default function RealPracticeReport() {
  const [data, setData] = useState<RealPracticeData | null>(null)
  const [loadError, setLoadError] = useState('')

  // 실전연습 기록 조회, 언마운트 후 응답은 무시
  useEffect(() => {
    let cancelled = false
    getRealPracticeRecords()
      .then((result) => !cancelled && setData(result))
      .catch(() => !cancelled && setLoadError('실전연습 기록을 불러오지 못했습니다.'))
    return () => {
      cancelled = true
    }
  }, [])

  const records = data?.mine ?? []
  // 조회 중: 로딩 문구, 실패: 오류 문구, 기록 없음: 시작 안내
  const emptyMessage =
    loadError || (data ? '실전연습을 시작해 보세요!' : '기록을 불러오는 중입니다.')
  const cards = [
    {
      title: '구간별 평균 기록',
      description: '각 구간별 평균 소요 시간을 비교해보세요.',
      chart: <StageChart records={records} />,
    },
    {
      title: '예매 속도 추이',
      description: '연습할수록 예매 시간이 어떻게 달라지는지 확인하세요.',
      chart: <TrendChart records={records} />,
    },
    {
      title: '전체 사용자와 비교',
      description: '실전연습 완료 기록의 내 평균 예매 시간과 전체 사용자 평균을 비교하세요.',
      chart: <CompareChart records={records} allDurations={data?.allDurations ?? []} />,
    },
  ]

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
      {cards.map((card) => (
        <div
          key={card.title}
          className="flex min-w-0 flex-col rounded-2xl border border-violet-100 bg-white/90 p-4 shadow-sm shadow-violet-100/40 sm:p-6"
        >
          <h3 className="text-xl font-extrabold text-slate-950">{card.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-slate-500 lg:min-h-10">
            {card.description}
          </p>

          <div className="mt-5 flex min-h-[clamp(180px,26vh,260px)] flex-1 items-center justify-center rounded-xl border border-dashed border-violet-200 bg-violet-50/60 p-2 text-center sm:p-5 text-sm text-slate-500">
            {records.length > 0 ? (
              <Suspense fallback={<ChartFallback />}>{card.chart}</Suspense>
            ) : (
              <p>{emptyMessage}</p>
            )}
          </div>
        </div>
      ))}
    </section>
  )
}
