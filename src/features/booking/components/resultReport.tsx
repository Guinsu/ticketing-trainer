import { formatDate, formatTime } from '@/common/utils/formatDate'
import { CONCERTS } from '@/data/concerts'
import { KSPO_DOME } from '@/data/kspoDome'
import {
  findSeat,
  getRecommendations,
  STAGES,
  type RealPracticeResult,
  type StageTimes,
} from '@/features/booking/utils/practiceResult'
import { Link } from 'react-router-dom'

interface ResultReportProps {
  result: RealPracticeResult
  averages: StageTimes | null // 저장하지 못한 결과는 비교 없이 보여준다
  notice?: string
}

const formatSeconds = (ms: number) => `${(ms / 1000).toFixed(2)}초`

/**
 * ResultReport
 * @description 실전연습 결과 분석, 구간별 기록·평균 비교·집중연습 추천·예매 정보
 */
const ResultReport = ({ result, averages, notice }: ResultReportProps) => {
  const concert = CONCERTS.find((item) => item.id === result.concertId)
  const schedule = concert?.schedules.find((item) => item.id === result.scheduleId)
  const seat = findSeat(KSPO_DOME, result.seatId)
  if (!concert || !schedule || !seat) return <ResultNotFound />

  const grade = KSPO_DOME.grades.find((item) => item.id === seat.grade)
  const zone = KSPO_DOME.zones.find((item) => item.id === seat.zoneId)
  const recommendations = averages ? getRecommendations(result, averages) : []
  const barMax = Math.max(
    1,
    ...STAGES.map((stage) => Math.max(result.stages[stage.key], averages?.[stage.key] ?? 0)),
  )

  const summary = [
    {
      label: '총 소요 시간',
      value: formatSeconds(result.durationMs),
      note: '예매하기 활성화부터 좌석 확정까지',
    },
    {
      label: '시작 대기 순번',
      value: `${result.peopleAhead.toLocaleString()}번`,
      note: '늦게 누를수록 뒤로 밀려요',
    },
    { label: '선점 실패', value: `${result.takenCount}회`, note: '이미 선택된 좌석을 고른 횟수' },
  ]

  const infos = [
    { label: '공연', value: concert.title },
    { label: '일시', value: `${formatDate(schedule.date)} ${formatTime(schedule.time)}` },
    { label: '좌석', value: `${zone?.label ?? seat.zoneId} ${seat.row}열 ${seat.number}번` },
    {
      label: '등급',
      value: grade ? `${grade.label} · ${grade.price.toLocaleString()}원` : seat.grade,
    },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-bold text-primary">연습 완료</p>
      <h2 className="mt-1 border-b-2 border-gray-900 pb-3 text-[28px] font-extrabold tracking-tight">
        예매 결과 분석
      </h2>

      {notice && (
        <p role="status" className="mt-6 bg-primary-light p-4 text-sm font-bold text-primary">
          {notice}
        </p>
      )}

      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        {summary.map((item) => (
          <div key={item.label} className="border border-gray-300 p-5">
            <dt className="text-sm font-bold text-gray-600">{item.label}</dt>
            <dd className="mt-2 text-3xl font-black tabular-nums">{item.value}</dd>
            <dd className="mt-1 text-xs text-gray-500">{item.note}</dd>
          </div>
        ))}
      </dl>

      <section className="mt-10">
        <div className="flex items-end justify-between border-b border-gray-900 pb-2">
          <h3 className="font-extrabold">구간별 기록</h3>
          {averages && (
            <p className="flex gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1">
                <span className="h-2.5 w-4 bg-primary" />내 기록
              </span>
              <span className="flex items-center gap-1">
                <span className="h-1.5 w-4 bg-gray-300" />
                전체 평균
              </span>
            </p>
          )}
        </div>
        <ul className="divide-y divide-gray-100">
          {STAGES.map((stage) => {
            const mine = result.stages[stage.key]
            const avg = averages?.[stage.key]
            return (
              <li
                key={stage.key}
                className="grid gap-2 py-3 sm:grid-cols-[10rem_1fr_7rem] sm:items-center"
              >
                <span className="font-bold text-gray-700">
                  {stage.label}
                  {stage.key === 'captcha' && (
                    <span className="ml-1 text-xs font-normal text-gray-500">
                      오답 {result.captchaMisses}회
                    </span>
                  )}
                </span>
                <div className="space-y-1">
                  <div className="h-3 bg-primary" style={{ width: `${(mine / barMax) * 100}%` }} />
                  {avg !== undefined && (
                    <div
                      className="h-1.5 bg-gray-300"
                      style={{ width: `${(avg / barMax) * 100}%` }}
                    />
                  )}
                </div>
                <span className="text-right tabular-nums">
                  <b>{formatSeconds(mine)}</b>
                  {avg !== undefined && (
                    <span className="block text-xs text-gray-500">평균 {formatSeconds(avg)}</span>
                  )}
                </span>
              </li>
            )
          })}
        </ul>
      </section>

      {averages && (
        <section className="mt-10">
          <h3 className="border-b border-gray-900 pb-2 font-extrabold">추천 집중연습</h3>
          {recommendations.length > 0 ? (
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {recommendations.map((rec) => (
                <li key={rec.drill.path} className="flex flex-col border border-primary p-5">
                  <p className="text-sm text-gray-600">{rec.reason}</p>
                  <Link
                    to={rec.drill.path}
                    className="mt-3 flex h-12 items-center justify-center bg-primary font-bold text-white hover:bg-primary-hover"
                  >
                    {rec.drill.label} 하러 가기
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-gray-600">
              모든 구간이 평균보다 빨라요. 다시 도전해서 기록을 줄여 보세요.
            </p>
          )}
        </section>
      )}

      <section className="mt-10">
        <h3 className="border-b border-gray-900 pb-2 font-extrabold">예매 정보</h3>
        <dl className="divide-y divide-gray-100 border-b border-gray-200">
          {infos.map((info) => (
            <div key={info.label} className="grid grid-cols-[5.5rem_1fr] py-2.5">
              <dt className="font-bold text-gray-600">{info.label}</dt>
              <dd>{info.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-10 grid gap-3 sm:grid-cols-2">
        <Link
          to={`/practice?concertId=${concert.id}`}
          className="flex h-15 items-center justify-center bg-primary text-lg font-bold text-white hover:bg-primary-hover"
        >
          다시 연습하기
        </Link>
        <Link
          to="/"
          className="flex h-15 items-center justify-center border border-gray-300 text-lg font-bold hover:border-gray-900"
        >
          다른 공연 선택
        </Link>
      </div>
    </div>
  )
}

export const ResultNotFound = () => (
  <div className="mx-auto max-w-xl px-4 py-24 text-center">
    <h2 className="text-[28px] font-extrabold tracking-tight">기록을 찾을 수 없어요</h2>
    <p className="mt-3 text-gray-600">주소가 잘못되었거나 이전 버전에서 저장된 기록이에요.</p>
    <Link
      to="/"
      className="mx-auto mt-10 flex h-15 max-w-xs items-center justify-center bg-primary text-lg font-bold text-white hover:bg-primary-hover"
    >
      홈으로
    </Link>
  </div>
)

export default ResultReport
