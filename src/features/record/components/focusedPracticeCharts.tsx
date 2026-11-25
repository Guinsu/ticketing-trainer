import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { Bar, BarChart, CartesianGrid, LabelList, Line, LineChart, XAxis, YAxis } from 'recharts'

/**
 * AverageChart
 * @description 집중연습 유형별 평균 소요 시간 세로 막대그래프
 */
export const AverageChart = ({
  data,
}: {
  data: { practice_type: string; average_seconds: number | null }[]
}) => (
  <ChartContainer
    config={{ average_seconds: { label: '평균 소요 시간(초)', color: '#8b5cf6' } }}
    className="h-[260px] w-full"
  >
    <BarChart data={data} margin={{ top: 24, right: 12 }}>
      {/* 배경 가로선 */}
      <CartesianGrid vertical={false} />

      {/* 가로축 : 연습 종류 */}
      {/* 좁은 화면에서도 유형 이름 4개가 모두 보이게 */}
      <XAxis
        dataKey="practice_type"
        tickLine={false}
        axisLine={false}
        tickMargin={10}
        interval={0}
        fontSize={11}
      />

      {/* 세로축: 소요 시간 */}
      <YAxis tickFormatter={(value) => `${value}초`} tickLine={false} axisLine={false} width={45} />

      <ChartTooltip content={<ChartTooltipContent />} />

      <Bar
        dataKey="average_seconds"
        fill="var(--color-average_seconds)"
        radius={4}
        isAnimationActive={false}
      >
        {/* 막대 위에 실제 시간 표시 */}
        <LabelList
          dataKey="average_seconds"
          position="top"
          fontSize={11}
          formatter={(value) => `${value}초`}
        />
      </Bar>
    </BarChart>
  </ChartContainer>
)

/**
 * RecentTrendChart
 * @description 선택한 집중연습 유형의 최근 회차별 소요 시간 꺾은선그래프
 */
export const RecentTrendChart = ({ data }: { data: { attempt: number; seconds: number }[] }) => (
  <ChartContainer
    config={{ seconds: { label: '소요 시간(초)', color: '#8b5cf6' } }}
    className="h-[260px] w-full"
  >
    <LineChart data={data} margin={{ top: 24, right: 12 }}>
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="attempt"
        tickFormatter={(value) => `${value}회`}
        tickLine={false}
        axisLine={false}
        tickMargin={10}
        // 라벨이 겹칠 때 1회부터 같은 간격으로 건너뛰기 (기본값은 간격이 들쭉날쭉)
        interval="equidistantPreserveStart"
        fontSize={12}
      />
      <YAxis
        tickFormatter={(value) => `${value}초`}
        tickLine={false}
        axisLine={false}
        width={55}
        domain={[0, 'auto']}
      />
      <ChartTooltip content={<ChartTooltipContent labelFormatter={(value) => `${value}회차`} />} />
      <Line
        type="linear"
        dataKey="seconds"
        stroke="var(--color-seconds)"
        strokeWidth={2}
        dot={{ r: 4 }}
        activeDot={{ r: 6 }}
        isAnimationActive={false}
      />
    </LineChart>
  </ChartContainer>
)
