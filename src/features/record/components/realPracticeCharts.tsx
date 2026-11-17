import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import type { RealPracticeRecord } from '@/lib/getRealPracticeRecords'
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from 'recharts'

const config = { seconds: { label: '소요 시간(초)', color: '#8b5cf6' } } satisfies ChartConfig

const toSeconds = (ms: number) => Math.round(ms / 10) / 100
const average = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length
const formatSeconds = (value: unknown) => `${value}초`

// 보안문자 컬럼 추가 전 기록은 captcha_ms가 null, 그 시간은 대기열에 포함된다
const captchaMs = (r: RealPracticeRecord) => r.captcha_ms ?? 0

// 예매 시간 = 예매하기 반응 + 대기열 + 일정 선택 + 보안문자 + 좌석 선택
// 모바일 폭에서도 x축에 5개가 다 들어가도록 이름은 짧게 쓴다
const STAGES: { label: string; ms: (record: RealPracticeRecord) => number }[] = [
  { label: '반응', ms: (r) => r.reaction_ms },
  {
    label: '대기열',
    ms: (r) =>
      r.duration_ms - r.reaction_ms - r.schedule_selection_ms - captchaMs(r) - r.seat_selection_ms,
  },
  { label: '일정', ms: (r) => r.schedule_selection_ms },
  { label: '보안문자', ms: captchaMs },
  { label: '좌석', ms: (r) => r.seat_selection_ms },
]

/**
 * StageChart
 * @description 구간별 평균 소요 시간 세로 막대그래프
 */
export const StageChart = ({ records }: { records: RealPracticeRecord[] }) => (
  <ChartContainer config={config} className="h-[260px] w-full min-w-0">
    <BarChart
      data={STAGES.map((stage) => ({
        stage: stage.label,
        seconds: toSeconds(average(records.map(stage.ms))),
      }))}
      margin={{ top: 24, right: 12 }}
    >
      <CartesianGrid vertical={false} />
      {/* 좁은 화면에서도 구간 이름 5개를 모두 보이게 한다 */}
      <XAxis
        dataKey="stage"
        tickLine={false}
        axisLine={false}
        tickMargin={10}
        interval={0}
        tick={{ fontSize: 11 }}
      />
      <YAxis tickFormatter={formatSeconds} tickLine={false} axisLine={false} width={45} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Bar dataKey="seconds" fill="var(--color-seconds)" radius={4}>
        <LabelList dataKey="seconds" position="top" formatter={formatSeconds} />
      </Bar>
    </BarChart>
  </ChartContainer>
)

/**
 * TrendChart
 * @description 회차별 예매 시간 꺾은선그래프
 */
export const TrendChart = ({ records }: { records: RealPracticeRecord[] }) => (
  <ChartContainer config={config} className="h-[260px] w-full min-w-0">
    <LineChart
      data={records.map((record, index) => ({
        round: `${index + 1}회`,
        seconds: toSeconds(record.duration_ms),
      }))}
      margin={{ top: 24, right: 12 }}
    >
      <CartesianGrid vertical={false} />
      <XAxis dataKey="round" tickLine={false} axisLine={false} tickMargin={10} />
      <YAxis tickFormatter={formatSeconds} tickLine={false} axisLine={false} width={45} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Line dataKey="seconds" stroke="var(--color-seconds)" strokeWidth={2} />
    </LineChart>
  </ChartContainer>
)

/**
 * CompareChart
 * @description 내 평균 예매 시간과 전체 사용자 평균 가로 막대그래프
 */
export const CompareChart = ({
  records,
  allDurations,
}: {
  records: RealPracticeRecord[]
  allDurations: number[]
}) => (
  <ChartContainer config={config} className="h-[260px] w-full min-w-0">
    <BarChart
      layout="vertical"
      data={[
        { who: '나', seconds: toSeconds(average(records.map((r) => r.duration_ms))) },
        { who: '전체 사용자', seconds: toSeconds(average(allDurations)) },
      ]}
      margin={{ right: 48 }}
    >
      <CartesianGrid horizontal={false} />
      <XAxis type="number" tickFormatter={formatSeconds} tickLine={false} axisLine={false} />
      <YAxis type="category" dataKey="who" tickLine={false} axisLine={false} width={80} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Bar dataKey="seconds" fill="var(--color-seconds)" radius={4}>
        <LabelList dataKey="seconds" position="right" formatter={formatSeconds} />
      </Bar>
    </BarChart>
  </ChartContainer>
)
