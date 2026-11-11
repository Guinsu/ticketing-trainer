import { useEffect, useRef, useState } from 'react'

// 집중연습 시간 관리. 공용 타이머는 실전연습에서도 사용해서 따로 관리
export default function useDrillStopwatch() {
  const [time, setTime] = useState(0)
  const [laps, setLaps] = useState<number[]>([])
  const intervalRef = useRef<number | undefined>(undefined)
  const startedAt = useRef<number | null>(null)
  const stoppedTime = useRef(0)

  useEffect(() => () => window.clearInterval(intervalRef.current), [])

  // 화면에 표시된 시간이 아니라 실제로 클릭한 시점까지 계산
  function getElapsed() {
    return startedAt.current === null
      ? stoppedTime.current
      : Math.max(0, performance.now() - startedAt.current)
  }

  function resetStopWatch() {
    window.clearInterval(intervalRef.current)
    startedAt.current = performance.now()
    stoppedTime.current = 0
    setTime(0)
    intervalRef.current = window.setInterval(() => setTime(getElapsed()), 10)
  }

  function stopStopWatch() {
    const elapsed = getElapsed()
    window.clearInterval(intervalRef.current)
    intervalRef.current = undefined
    startedAt.current = null
    stoppedTime.current = elapsed
    setTime(elapsed)
    return elapsed
  }

  // 기록에 넣는 값과 DB에 저장하는 값을 같게 사용
  function recordLap() {
    const elapsed = getElapsed()
    setLaps((prev) => [...prev, elapsed])
    return elapsed
  }

  return {
    time,
    laps,
    setLaps,
    intervalRef,
    resetStopWatch,
    stopStopWatch,
    recordLap,
    getElapsed,
    bestRecord: () => Math.min(...laps),
    averageRecord: () => laps.reduce((sum, lap) => sum + lap, 0) / laps.length,
  }
}
