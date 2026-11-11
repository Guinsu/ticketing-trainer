/**
 * 닉네임으로 profiles 테이블의 id를 조회한 뒤 연습 결과를 한 건씩 저장합니다.
 * 닉네임이 비어있으면 저장하지 않고 DB 오류는 logError로 기록합니다.
 */

import { supabase } from './supabaseClient'
import logError from './logError'

type PracticeRecordInput = {
  nickname: string
  practice_type: string
  status: string
  durationMS: number
  clickCount?: number
  errorCount?: number
}

async function savePracticeRecord({
  nickname,
  practice_type,
  status,
  durationMS,
  clickCount = 0,
  errorCount = 0,
}: PracticeRecordInput) {
  if (nickname.trim() === '') {
    return 'skipped' as const
  }

  //닉네임에 해당하는 ID 조회
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('nickname', nickname)
    .single()

  //ID 없으면 애러
  if (profileError) {
    await logError({
      operation: 'savePracticeRecord.profile',
      message: profileError.message,
      error_code: profileError.code,
      practice_type,
    })
    return 'failed' as const
  }

  //데이터 저장
  const { error } = await supabase.from('focused_practice_records').insert({
    user_id: profile.id,
    practice_type: practice_type,
    status: status,
    ended_at: new Date().toISOString(),
    duration_ms: Math.round(durationMS),
    is_success: true,
    click_count: clickCount,
    error_count: errorCount,
  })

  //애러 로그 추가
  if (error) {
    await logError({
      operation: 'savePracticeRecord.insert',
      message: error.message,
      error_code: error.code,
      practice_type,
      user_id: profile.id,
    })
    return 'failed' as const
  }
  return 'saved' as const
}

export default savePracticeRecord
