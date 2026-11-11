/**
 * 닉네임으로 profiles 테이블의 id를 조회한 뒤 실전 연습 결과를 한 건 저장하고 기록 id를 반환합니다.
 * 닉네임이 비어있거나 DB 오류가 나면 null을 반환하고, DB 오류는 logError로 기록합니다.
 */

import type { RealPracticeResult } from '@/features/booking/utils/practiceResult'
import { supabase } from './supabaseClient'
import logError from './logError'

type SaveInput = {
  nickname: string
  startedAt: string
  result: RealPracticeResult
}

async function saveRealPracticeRecord({
  nickname,
  startedAt,
  result,
}: SaveInput): Promise<string | null> {
  if (nickname.trim() === '') return null

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('nickname', nickname)
    .single()

  if (profileError) {
    await logError({
      operation: 'saveRealPracticeRecord.profile',
      message: profileError.message,
      error_code: profileError.code,
    })
    return null
  }

  const { data, error } = await supabase
    .from('real_practice_records')
    .insert({
      user_id: profile.id,
      started_at: startedAt,
      ended_at: new Date().toISOString(),
      duration_ms: Math.round(result.durationMs),
      reaction_ms: Math.round(result.stages.reaction),
      schedule_selection_ms: Math.round(result.stages.schedule),
      captcha_ms: Math.round(result.stages.captcha),
      captcha_misses: result.captchaMisses,
      seat_selection_ms: Math.round(result.stages.seat),
      concert_id: result.concertId,
      schedule_id: result.scheduleId,
      seat_id: result.seatId,
      people_ahead: result.peopleAhead,
      taken_count: result.takenCount,
    })
    .select('id')
    .single()

  if (error) {
    await logError({
      operation: 'saveRealPracticeRecord.insert',
      message: error.message,
      error_code: error.code,
      user_id: profile.id,
    })
    return null
  }

  return data.id
}

export default saveRealPracticeRecord
