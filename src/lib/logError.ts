/**
 
* 오류 정보를 테이블에 저장합니다.
* 로그 저장 실패 시 콘솔에 출력하고 종료합니다.

*/

import { supabase } from './supabaseClient'

type ErrorLogInput = {
  operation: string
  message: string
  error_code?: string
  practice_type?: string
  user_id?: string
}

async function logError(parms: ErrorLogInput) {
  const { error } = await supabase.from('error_logs').insert(parms)

  if (error) {
    console.error('오류 로그 저장 실패', error.message)
  }
}

export default logError
