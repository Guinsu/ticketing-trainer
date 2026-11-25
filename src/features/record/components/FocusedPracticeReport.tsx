import { lazy, Suspense, useEffect, useState } from 'react'
import ChartFallback from './chartFallback'
import type { FocusedRecord, PracticeRanking } from '@/features/record/utils/db'

// Supabase 클라이언트(약 55KB)가 첫 렌더링을 막지 않도록 조회 모듈은 렌더 후에 불러옴
const loadResultData = () => import('@/features/record/utils/db').then((m) => m.resultData)

// recharts는 용량이 커서 첫 화면 렌더링을 막지 않도록 차트만 따로 불러옴
const AverageChart = lazy(() =>
  import('./focusedPracticeCharts').then((m) => ({ default: m.AverageChart })),
)
const RecentTrendChart = lazy(() =>
  import('./focusedPracticeCharts').then((m) => ({ default: m.RecentTrendChart })),
)

const practiceTypes = [
  { value: 'captcha', label: '보안문자' },
  { value: 'target-seat', label: '좌석 선택' },
  { value: 'cancel-ticket', label: '취소표' },
  { value: 'countdown', label: '카운트다운' },
]

type PracticeAvg = {
  practice_type: string
  average_seconds: number | null
}

export default function FocusedPracticeReport() {
  const [avgData, setAvgData] = useState<PracticeAvg[]>([])
  const [loadError, setLoadError] = useState('')
  const [records, setRecords] = useState<FocusedRecord[]>([])
  const [selectedType, setSelectedType] = useState('captcha')
  const [trendError, setTrendError] = useState('')
  const [trendLoading, setTrendLoading] = useState(true)
  const [rankings, setRankings] = useState<PracticeRanking[]>([])
  const [rankingType, setRankingType] = useState('captcha')
  const [rankingLoading, setRankingLoading] = useState(true)
  const [rankingError, setRankingError] = useState('')
  const rankingLabel = practiceTypes.find((type) => type.value === rankingType)?.label
  const ranking = rankings.find(
    (row) => row.practice_type === rankingType || row.practice_type === rankingLabel,
  )

  useEffect(() => {
    let cancelled = false
    async function loadRankings() {
      try {
        const data = await (await loadResultData()).getPracticeRankings()
        if (!cancelled) setRankings(data)
      } catch {
        if (!cancelled) setRankingError('순위를 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.')
      } finally {
        if (!cancelled) setRankingLoading(false)
      }
    }
    void loadRankings()
    return () => {
      cancelled = true
    }
  }, [])

  const trendData = records
    .filter((record) => record.practice_type === selectedType && record.duration_ms != null)
    .map((record, index) => ({
      attempt: index + 1,
      seconds: record.duration_ms / 1000,
    }))
    .slice(-20)

  useEffect(() => {
    let cancelled = false
    async function loadTrend() {
      try {
        const data = await (await loadResultData()).getPracticeRecords()
        if (!cancelled) setRecords(data)
      } catch {
        if (!cancelled) setTrendError('연습 기록을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setTrendLoading(false)
      }
    }
    void loadTrend()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    async function loadRecords() {
      try {
        const data = await (await loadResultData()).getPriacticeAvg()

        if (!cancelled) {
          setAvgData(
            (data ?? []).map((row) => ({
              practice_type: row['연습종류'],
              average_seconds: row['평균 시간'] == null ? null : Number(row['평균 시간']),
            })),
          )
        }
      } catch {
        if (!cancelled) {
          setLoadError('연습 기록을 불러오지 못했습니다.')
        }
      }
    }

    loadRecords()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <section
      aria-labelledby="focused-practice"
      className="grid min-w-0 gap-4 rounded-2xl bg-purple-100 p-4 xl:p-6 lg:row-span-4 lg:grid-rows-subgrid"
    >
      <div>
        <h2 id="focused-practice" className="text-2xl font-extrabold text-purple-950">
          집중연습
        </h2>
        <p className="mt-1 text-sm text-purple-950/70">
          연습 유형별 속도와 기록 변화를 확인하세요.
        </p>
        <p className="mt-2 text-xs text-purple-950/60">
          이전 버전의 좌석·취소표 기록은 측정 기준이 달라 비교에 주의해주세요.
        </p>
        {/* 자세한 기준은 필요할 때 펼쳐보기. 기존 기록 주의사항은 접어도 계속 표시 */}
        <details className="mt-3 rounded-xl border border-purple-200 bg-white/50 text-sm text-purple-950/80">
          <summary className="cursor-pointer rounded-xl px-4 py-3 font-semibold focus-visible:outline-2 focus-visible:outline-purple-700">
            기록은 어떻게 측정하나요?
          </summary>
          <div className="space-y-2 px-4 pb-4 leading-6">
            <p>보안문자: 한 문제를 정확하게 입력하는 데 걸린 시간이에요.</p>
            <p>좌석 선택: 목표 구역과 좌석을 찾아 선택을 완료하는 데 걸린 시간이에요.</p>
            <p>카운트다운: 버튼이 활성화된 뒤 클릭할 때까지의 반응 시간이에요.</p>
            <p>취소표: 실패한 시도 시간을 포함해요. 재시도 대기 시간은 제외해요.</p>
          </div>
        </details>
      </div>
      <div className="flex flex-col rounded-2xl border border-violet-100 bg-white/90 p-4 shadow-sm shadow-violet-100/40 sm:p-6">
        <h3 className="text-xl font-extrabold text-slate-950">유형별 평균 소요 시간</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 lg:min-h-10">
          보안문자·좌석 선택·취소표 등 유형별 평균 시간을 확인하세요.
        </p>

        <div className="mt-5 flex min-h-[clamp(180px,26vh,260px)] flex-1 items-center justify-center rounded-xl border border-dashed border-violet-200 bg-violet-50/60 p-2 text-center sm:p-5 text-sm text-slate-500">
          {avgData.length ? (
            <Suspense fallback={<ChartFallback />}>
              <AverageChart data={avgData} />
            </Suspense>
          ) : (
            <p>{loadError || '집중 연습을 시작해 보세요!'}</p>
          )}
        </div>
      </div>
      <div className="flex flex-col rounded-2xl border border-violet-100 bg-white/90 p-4 shadow-sm shadow-violet-100/40 sm:p-6">
        <h3 className="text-xl font-extrabold text-slate-950">최근 20회 기록 추이</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 lg:min-h-10">
          선택한 연습 유형의 최근 20회 소요 시간 변화를 확인하세요.
        </p>
        <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          연습 유형
          <select
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            className="rounded-md border border-violet-200 bg-white px-3 py-2 text-base sm:text-sm"
          >
            {practiceTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>

        <div className="mt-5 flex min-h-[clamp(180px,26vh,260px)] flex-1 items-center justify-center rounded-xl border border-dashed border-violet-200 bg-violet-50/60 p-2 text-center sm:p-5 text-sm text-slate-500">
          {trendData.length ? (
            <Suspense fallback={<ChartFallback />}>
              <RecentTrendChart data={trendData} />
            </Suspense>
          ) : (
            <p>
              {trendLoading
                ? '기록을 불러오는 중입니다.'
                : trendError || '선택한 유형의 완료 기록이 없습니다.'}
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col rounded-2xl border border-violet-100 bg-white/90 p-4 shadow-sm shadow-violet-100/40 sm:p-6">
        <h3 className="text-xl font-extrabold text-slate-950">전체 사용자와 비교</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-500 lg:min-h-10">
          유형별 평균 시간이 짧은 순으로 내 순위를 확인하세요. 같은 평균은 공동 순위입니다.
        </p>
        <label className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          연습 유형
          <select
            value={rankingType}
            onChange={(event) => setRankingType(event.target.value)}
            className="rounded-md border border-violet-200 bg-white px-3 py-2 text-base sm:text-sm"
          >
            {practiceTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <div className="mt-5 flex min-h-[clamp(180px,26vh,260px)] flex-1 items-center justify-center rounded-xl border border-dashed border-violet-200 bg-violet-50/60 p-2 text-center sm:p-5 text-sm text-slate-500">
          <div role="status" aria-live="polite">
            {rankingLoading ? (
              <p>순위를 불러오는 중입니다.</p>
            ) : rankingError ? (
              <p>{rankingError}</p>
            ) : ranking ? (
              <>
                <p>
                  {rankingLabel} · 기록이 있는 사용자 {ranking.participants.toLocaleString()}명 중
                </p>
                <p className="mt-3 text-4xl font-extrabold text-purple-800">
                  {ranking.rank.toLocaleString()}등
                </p>
                <p className="mt-2 font-semibold text-purple-700">
                  상위 {Math.ceil((ranking.rank / ranking.participants) * 1000) / 10}%
                </p>
                <p className="mt-4">
                  내 평균 {ranking.average_seconds.toFixed(3)}초
                  {rankingType === 'countdown' ? ' (반응 시간)' : ''}
                </p>
              </>
            ) : (
              <p>선택한 유형의 기록이 없습니다. 연습을 완료하면 순위가 표시됩니다.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
