import { supabase } from '@/lib/supabaseClient'
import logError from '@/lib/logError'
import { getStoredNickname } from '@/common/utils/nicknameStrorage'

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

export const resultData = { getPriacticeAvg }
