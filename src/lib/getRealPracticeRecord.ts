/**
 * 실전 연습 기록 한 건과 전체 사용자의 구간별 평균 시간을 조회합니다.
 * 기록이 없거나 결과 화면에 필요한 값이 빠진 이전 기록이면 null을 반환합니다.
 * DB 오류는 logError로 기록한 뒤 throw합니다.
 */

import type { RealPracticeResult, StageTimes } from '@/features/booking/utils/practiceResult'
import logError from './logError'
import { supabase } from './supabaseClient'

const STAGE_COLUMNS = 'reaction_ms, schedule_selection_ms, captcha_ms, seat_selection_ms'

type StageRow = {
  reaction_ms: number
  schedule_selection_ms: number
  captcha_ms: number | null
  seat_selection_ms: number
}

export type RealPracticeRecordDetail = {
  result: RealPracticeResult
  averages: StageTimes
}

const average = (values: number[]) =>
  values.length === 0 ? 0 : values.reduce((sum, value) => sum + value, 0) / values.length

// 보안문자 컬럼이 생기기 전 기록은 captcha 평균에서 뺀다
const getAverages = (rows: StageRow[]): StageTimes => ({
  reaction: average(rows.map((row) => row.reaction_ms)),
  schedule: average(rows.map((row) => row.schedule_selection_ms)),
  captcha: average(rows.flatMap((row) => (row.captcha_ms === null ? [] : [row.captcha_ms]))),
  seat: average(rows.map((row) => row.seat_selection_ms)),
})

async function getRealPracticeRecord(id: string): Promise<RealPracticeRecordDetail | null> {
  const [record, all] = await Promise.all([
    supabase
      .from('real_practice_records')
      .select(
        `${STAGE_COLUMNS}, duration_ms, captcha_misses, concert_id, schedule_id, seat_id, people_ahead, taken_count`,
      )
      .eq('id', id)
      .maybeSingle(),
    supabase.from('real_practice_records').select(STAGE_COLUMNS),
  ])
  const error = record.error ?? all.error

  if (error) {
    // id가 uuid 형식이 아니면 22P02, 없는 기록과 같게 처리
    if (error.code === '22P02') return null
    await logError({
      operation: 'getRealPracticeRecord.select',
      message: error.message,
      error_code: error.code,
    })
    throw error
  }

  const row = record.data
  if (!row?.concert_id || !row.schedule_id || !row.seat_id || row.captcha_ms === null) return null

  return {
    result: {
      concertId: row.concert_id,
      scheduleId: row.schedule_id,
      seatId: row.seat_id,
      peopleAhead: row.people_ahead ?? 0,
      takenCount: row.taken_count ?? 0,
      durationMs: row.duration_ms,
      captchaMisses: row.captcha_misses ?? 0,
      stages: {
        reaction: row.reaction_ms,
        schedule: row.schedule_selection_ms,
        captcha: row.captcha_ms,
        seat: row.seat_selection_ms,
      },
    },
    averages: getAverages(all.data ?? []),
  }
}

export default getRealPracticeRecord
