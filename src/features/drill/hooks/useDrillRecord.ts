import { useEffect, useRef, useState } from 'react'
import savePracticeRecord from '@/lib/savePracticeRecord'

// 연습 결과와 저장 결과는 따로 표시. 저장이 안 됐는데 성공한 것처럼 보이지 않게 관리
export default function useDrillRecord() {
  const [saveMessage, setSaveMessage] = useState('')
  const pending = useRef(0)
  const failed = useRef(false)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  async function saveRecord(input: Parameters<typeof savePracticeRecord>[0]) {
    pending.current += 1
    if (mounted.current && !failed.current) setSaveMessage('기록 저장 중이에요.')
    try {
      const result = await savePracticeRecord(input)
      if (result !== 'saved') {
        failed.current = true
        if (mounted.current)
          setSaveMessage(
            result === 'skipped'
              ? '닉네임을 등록하면 다음 연습부터 기록이 저장돼요.'
              : '저장하지 못한 기록이 있어요. 연결 상태를 확인해주세요.',
          )
      }
    } catch {
      failed.current = true
      if (mounted.current) setSaveMessage('저장하지 못한 기록이 있어요. 연결 상태를 확인해주세요.')
    } finally {
      pending.current -= 1
      // 여러 회차를 빠르게 끝내도 앞 회차의 저장 실패 안내는 지우지 않음
      if (mounted.current && pending.current === 0 && !failed.current) {
        setSaveMessage('기록이 저장됐어요.')
      }
    }
  }

  return { saveRecord, saveMessage }
}
