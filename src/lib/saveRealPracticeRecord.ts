/**
 * 닉네임으로 profiles 테이블의 id를 조회한 뒤 실전 연습 결과를 한 건 저장합니다.
 * 닉네임이 비어있으면 저장하지 않고 DB 오류는 logError로 기록합니다.
 */

import { supabase } from './supabaseClient'
import logError from './logError'

type RealPracticeRecordInput = {
  nickname: string
  startedAt: string
  durationMs: number
  reactionMs: number
  scheduleSelectionMs: number
  seatSelectionMs: number
}

async function saveRealPracticeRecord({
  nickname,
  startedAt,
  durationMs,
  reactionMs,
  scheduleSelectionMs,
  seatSelectionMs,
}: RealPracticeRecordInput) {
  if (nickname.trim() === '') return

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
    return
  }

  const { error } = await supabase.from('real_practice_records').insert({
    user_id: profile.id,
    started_at: startedAt,
    ended_at: new Date().toISOString(),
    duration_ms: Math.round(durationMs),
    reaction_ms: Math.round(reactionMs),
    schedule_selection_ms: Math.round(scheduleSelectionMs),
    seat_selection_ms: Math.round(seatSelectionMs),
  })

  if (error) {
    await logError({
      operation: 'saveRealPracticeRecord.insert',
      message: error.message,
      error_code: error.code,
      user_id: profile.id,
    })
  }
}

export default saveRealPracticeRecord
