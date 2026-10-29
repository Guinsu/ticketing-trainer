import { useEffect, useState } from 'react'

// delayMs 뒤를 오픈 시각으로 정하고 남은 시간을 100ms마다 갱신한다
// 반환: remaining(남은 ms, 0이면 오픈), openAt(오픈 시각, performance.now() 기준)
// 사용처: queueScreen 예매 오픈 게이트, countdownDrill 카운트다운 연습
export const useCountdown = (delayMs: number) => {
  // 처음 렌더할 때 한 번만 계산, 리렌더돼도 오픈 시각은 그대로
  const [openAt] = useState(() => performance.now() + delayMs)
  const [remaining, setRemaining] = useState(delayMs)

  useEffect(() => {
    // 남은 시간을 매번 openAt에서 다시 계산해서 interval이 밀려도 오차가 쌓이지 않는다
    const id = setInterval(() => {
      const next = Math.max(0, openAt - performance.now())
      setRemaining(next)
      if (next === 0) clearInterval(id)
    }, 100)

    // 카운트다운 중에 화면을 벗어나면 interval 정리
    return () => clearInterval(id)
  }, [openAt])

  // openAt은 예매하기 반응 시간(클릭 시각 - openAt) 측정에 사용
  // 버튼은 interval이 0을 발견한 시점(openAt 후 최대 100ms)에 켜지므로 그 지연도 반응 시간에 포함된다
  return { remaining, openAt }
}
