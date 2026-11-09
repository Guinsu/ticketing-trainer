import { supabase } from '@/lib/supabaseClient'
import logError from '@/lib/logError'
import { getStoredNickname } from '@/common/utils/nicknameStrorage'

export type FocusedRecord = {
  practice_type: string
  duration_ms: number
  ended_at: string
}

async function getPriacticeAvg() {
  const nickname = getStoredNickname()

  if (!nickname) {
    return []
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('nickname', nickname)
    .single()

  if (profileError) {
    throw profileError
  }

  const { data, error } = await supabase
    .from('focused_practice_averages')
    .select('*')
    .eq('사용자', profile.id)

  if (error) {
    await logError({
      operation: 'getPriacticeAvg.select',
      message: error.message,
      error_code: error.code,
    })
    throw error
  }

  return data
}

async function getPracticeRecords(): Promise<FocusedRecord[]> {
  const nickname = getStoredNickname()
  if (!nickname) return []

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('nickname', nickname)
    .single()
  if (profileError) throw profileError

  const rows: FocusedRecord[] = []
  for (let offset = 0; ;) {
    const { data, error } = await supabase
      .from('focused_practice_records')
      .select('practice_type, duration_ms, ended_at')
      .eq('user_id', profile.id)
      .eq('status', 'completed')
      .order('ended_at', { ascending: true })
      .order('id', { ascending: true })
      .range(offset, offset + 499)
    if (error) throw error
    if (!data?.length) break
    rows.push(...data)
    offset += data.length
  }
  return rows
}

export type PracticeRanking = {
  practice_type: string
  rank: number
  participants: number
  average_seconds: number
}

async function getPracticeRankings(): Promise<PracticeRanking[]> {
  const nickname = getStoredNickname()
  if (!nickname) return []
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('nickname', nickname)
    .single()
  if (profileError) throw profileError

  // 사용자별 평균 뷰를 모두 조회해야 API 행 제한으로 순위가 잘리지 않습니다.
  const rows: { user: string; type: string; seconds: number }[] = []
  for (let offset = 0; ;) {
    const { data, error } = await supabase
      .from('focused_practice_averages')
      .select('*')
      .order('사용자', { ascending: true })
      .order('연습종류', { ascending: true })
      .range(offset, offset + 499)
    if (error) throw error
    if (!data?.length) break
    for (const row of data) {
      const seconds = Number(row['평균 시간'])
      if (row['평균 시간'] != null && Number.isFinite(seconds) && seconds >= 0) {
        const types: Record<string, string> = {
          '보안문자 입력 연습': 'captcha',
          '지정 좌석 연습': 'target-seat',
          '취소표 잡기 연습': 'cancel-ticket',
          '카운트다운 연습': 'countdown',
        }
        rows.push({ user: row['사용자'], type: types[row['연습종류']] ?? row['연습종류'], seconds })
      }
    }
    offset += data.length
  }

  return rows
    .filter((row) => row.user === profile.id)
    .map((mine) => {
      const peers = rows.filter((row) => row.type === mine.type)
      return {
        practice_type: mine.type,
        average_seconds: mine.seconds,
        // 같은 평균이면 공동 순위: 1, 1, 3 방식입니다.
        rank: 1 + peers.filter((row) => row.seconds < mine.seconds).length,
        participants: peers.length,
      }
    })
}

export const resultData = { getPriacticeAvg, getPracticeRecords, getPracticeRankings }
