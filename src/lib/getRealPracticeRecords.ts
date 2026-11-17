/**
 * 닉네임의 실전연습 기록(시작 순)과 전체 사용자 예매 시간 목록을 조회합니다.
 * 닉네임이 비어있으면 빈 결과를 반환하고 DB 오류는 logError로 기록한 뒤 throw합니다.
 */

import { getStoredNickname } from '@/common/utils/nicknameStrorage'
import logError from './logError'
import { supabase } from './supabaseClient'

export type RealPracticeRecord = {
  started_at: string
  duration_ms: number
  reaction_ms: number
  schedule_selection_ms: number
  captcha_ms: number | null
  seat_selection_ms: number
}

export type RealPracticeData = {
  mine: RealPracticeRecord[]
  allDurations: number[]
}

async function getRealPracticeRecords(): Promise<RealPracticeData> {
  const nickname = getStoredNickname()
  if (!nickname) return { mine: [], allDurations: [] }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('nickname', nickname)
    .single()

  if (profileError) throw profileError

  const [mine, all] = await Promise.all([
    supabase
      .from('real_practice_records')
      .select(
        'started_at, duration_ms, reaction_ms, schedule_selection_ms, captcha_ms, seat_selection_ms',
      )
      .eq('user_id', profile.id)
      .order('started_at'),
    supabase.from('real_practice_records').select('duration_ms'),
  ])
  const error = mine.error ?? all.error

  if (error) {
    await logError({
      operation: 'getRealPracticeRecords.select',
      message: error.message,
      error_code: error.code,
      user_id: profile.id,
    })
    throw error
  }

  return { mine: mine.data ?? [], allDurations: (all.data ?? []).map((row) => row.duration_ms) }
}

export default getRealPracticeRecords
