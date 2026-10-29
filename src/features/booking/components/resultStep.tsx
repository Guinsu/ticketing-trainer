import { KSPO_DOME } from '@/data/kspoDome'
import type { Seat } from '@/types/seat'
import type { QueueResult } from '@/types/simulation'
import { Link } from 'react-router-dom'

interface ResultStepProps {
  concertId: string
  concertTitle: string
  scheduleText: string
  queueResult: QueueResult
  seat: Seat
  elapsedMs: number
}

const formatSeconds = (ms: number) => `${(ms / 1000).toFixed(3)}초`

/**
 * ResultStep
 * @description 예매창 마지막 단계, 실전 연습 결과 임시 분석
 */
// TODO: 기록 저장(IndexedDB) 연결 후 /result/:recordId 결과 화면으로 이동
const ResultStep = ({ concertId, concertTitle, scheduleText, queueResult, seat, elapsedMs }: ResultStepProps) => {
  const grade = KSPO_DOME.grades.find((item) => item.id === seat.grade)
  const zone = KSPO_DOME.zones.find((item) => item.id === seat.zoneId)

  const metrics = [
    { label: '예매하기 반응 시간', value: formatSeconds(queueResult.reactionMs), note: '버튼 활성화 후 클릭까지' },
    { label: '시작 대기 순번', value: `${queueResult.peopleAhead.toLocaleString()}번`, note: '늦게 누를수록 뒤로 밀려요' },
    { label: '예매창 소요 시간', value: formatSeconds(elapsedMs), note: '일정 선택부터 좌석 선택 완료까지' },
  ]

  const infos = [
    { label: '공연', value: concertTitle },
    { label: '일시', value: scheduleText },
    { label: '좌석', value: `${zone?.label ?? seat.zoneId} ${seat.row}열 ${seat.number}번` },
    { label: '등급', value: grade ? `${grade.label} · ${grade.price.toLocaleString()}원` : seat.grade },
  ]

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <p className="text-sm font-bold text-primary">연습 완료</p>
      <h2 className="mt-1 border-b-2 border-gray-900 pb-3 text-[28px] font-extrabold tracking-tight">
        예매 결과 분석
      </h2>

      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        {metrics.map((metric) => (
          <div key={metric.label} className="border border-gray-300 p-5">
            <dt className="text-sm font-bold text-gray-600">{metric.label}</dt>
            <dd className="mt-2 text-3xl font-black tabular-nums">{metric.value}</dd>
            <dd className="mt-1 text-xs text-gray-500">{metric.note}</dd>
          </div>
        ))}
      </dl>

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
          to={`/practice?concertId=${concertId}`}
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

export default ResultStep
