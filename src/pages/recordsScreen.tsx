/**
 * RecordsScreen
 * @description 내 연습기록 페이지 Screen 컴포넌트, 경로 '/records'
 */
import { useEffect, useState } from 'react'
import { ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { ChartContainer } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts'
import { resultData } from '@/features/record/utils/db'

type PracticeAvg = {
  practice_type: string
  average_seconds: number | null
}

const RecordsScreen = () => {
  const [avgData, setAvgData] = useState<PracticeAvg[]>([])
  const [loadError, setLoadError] = useState('')

  useEffect(() => {
    let cancelled = false
    async function loadRecords() {
      try {
        const data = await resultData.getPriacticeAvg()

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

  const reports = [
    {
      id: 'real-practice',
      title: '실전연습',
      description: '전체 예매 과정의 기록을 확인하세요.',
      stats: [
        { label: '평균 예매 시간', value: '42.3', unit: '초' },
        { label: '최고 기록', value: '25', unit: '초' },
        { label: '예매 성공률', value: '50', unit: '%' },
        { label: '총 연습 횟수', value: '**', unit: '회' },
      ],
      charts: [
        {
          title: '구간별 평균 기록',
          description: '각 구간별 평균 소요 시간을 비교해보세요.',
          emptyMessage: '구간별 평균 기록 그래프가 표시될 영역입니다.',
        },
        {
          title: '예매 속도 추이',
          description: '연습할수록 예매 시간이 어떻게 달라지는지 확인하세요.',
          emptyMessage: '예매 시간 추이 그래프가 표시될 영역입니다.',
        },
        {
          title: '전체 사용자와 비교',
          description: '실전연습 완료 기록의 내 평균 예매 시간과 전체 사용자 평균을 비교하세요.',
          emptyMessage: '내 평균과 전체 사용자 평균을 가로 막대그래프로 표시할 영역입니다.',
        },
      ],
    },
    {
      id: 'focused-practice',
      title: '집중연습',
      description: '연습 유형별 속도와 기록 변화를 확인하세요.',
      stats: [
        { label: '총 집중연습 횟수', value: '—', unit: '회' },
        { label: '가장 많이 연습한 유형', value: '—', unit: '' },
      ],
      charts: [
        {
          title: '유형별 평균 소요 시간',
          description: '보안문자·좌석 선택·취소표 등 유형별 평균 시간을 확인하세요.',
          emptyMessage: loadError || '집중 연습을 시작해 보세요!',
          chartType: 'bar',
          data: avgData,
        },
        {
          title: '연습 유형별 기록 추이',
          description: '같은 연습 유형의 회차별 소요 시간 변화를 확인하세요.',
          emptyMessage: '선택한 유형의 기록을 꺾은선그래프로 표시할 영역입니다.',
        },
        {
          title: '전체 사용자와 비교',
          description: '같은 연습 유형의 내 평균 소요 시간과 전체 사용자 평균을 비교하세요.',
          emptyMessage: '내 평균과 전체 사용자 평균을 가로 막대그래프로 표시할 영역입니다.',
        },
      ],
    },
  ]

  return (
    <section className="min-h-screen bg-purple-300 px-5 py-5">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-3xl font-bold sm:text-5xl">
            분석 <span className="pl-4 text-purple-800">리포트</span>
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-500 sm:text-lg">
            예매 연습 기록을 분석하여, 더 빠르고 정확한 예매를 위한 인사이트를 확인하세요.
          </p>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-4 lg:grid-cols-2 lg:grid-rows-[auto_auto_auto_auto]">
          {reports.map((report) => (
            <section
              key={report.id}
              aria-labelledby={report.id}
              className="grid min-w-0 gap-4 lg:row-span-4 lg:grid-rows-subgrid"
            >
              <div>
                <h2 id={report.id} className="text-2xl font-extrabold text-purple-950">
                  {report.title}
                </h2>
                <p className="mt-1 text-sm text-purple-950/70">{report.description}</p>
              </div>

              {report.charts.map((chart) => (
                <div
                  key={chart.title}
                  className="flex flex-col rounded-2xl border border-violet-100 bg-white/90 p-5 shadow-sm shadow-violet-100/40 sm:p-6"
                >
                  <h3 className="text-xl font-extrabold text-slate-950">{chart.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500 lg:min-h-10">
                    {chart.description}
                  </p>
                  <div className="mt-5 flex min-h-[clamp(180px,26vh,260px)] flex-1 items-center justify-center rounded-xl border border-dashed border-violet-200 bg-violet-50/60 p-5 text-center text-sm text-slate-500">
                    {chart.data?.length ? (
                      <ChartContainer
                        config={{
                          average_seconds: {
                            label: '평균 소요 시간(초)',
                            color: '#8b5cf6',
                          },
                        }}
                        className="h-[260px] w-full"
                      >
                        <BarChart data={chart.data} margin={{ top: 24, right: 12 }}>
                          {/* 배경 가로선 */}
                          <CartesianGrid vertical={false} />

                          {/* 가로축 : 연습 종류 */}
                          <XAxis
                            dataKey="practice_type"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={10}
                          />

                          {/* 세로축: 소요 시간 */}
                          <YAxis
                            tickFormatter={(value) => `${value}초`}
                            tickLine={false}
                            axisLine={false}
                            width={45}
                          />

                          <ChartTooltip content={<ChartTooltipContent />} />

                          <Bar
                            dataKey="average_seconds"
                            fill="var(--color-average_seconds)"
                            radius={4}
                          >
                            {/* 막대 위에 실제 시간 표시 */}
                            <LabelList
                              dataKey="average_seconds"
                              position="top"
                              formatter={(value) => `${value}초`}
                            />
                          </Bar>
                        </BarChart>
                      </ChartContainer>
                    ) : (
                      <p>{chart.emptyMessage}</p>
                    )}
                  </div>
                </div>
              ))}
            </section>
          ))}
        </div>
      </div>
    </section>
  )
}

export default RecordsScreen
