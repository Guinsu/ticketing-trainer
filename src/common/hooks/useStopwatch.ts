import { useEffect, useRef, useState } from 'react'

/**
 * 경과 시간과 연습 기록을 관리하는 스톱워치 훅.
 * 시간 단위는 밀리초(ms)이며 호출할 때마다 독립된 상태를 갖습니다.
 *
 * @example
 * const {
 *   time, laps, resetStopWatch, recordLap,
 *   bestRecord, averageRecord, setLaps, intervalRef,
 * } = useStopwatch()
 *
 * resetStopWatch() // 시간을 0으로 초기화하고 즉시 측정 시작
 * recordLap()     // 현재 시간을 기록에 추가 (타이머는 계속 실행)
 * bestRecord()    // 최단 기록 반환
 * averageRecord() // 평균 기록 반환
 * setLaps([])     // 기록 목록 초기화
 *
 * //측정 정지
 * clearInterval(intervalRef.current)
 * intervalRef.current = undefined
 *
 * //초 단위로 화면에 표시
 * (time / 1000).toFixed(3)
 *
 * @remarks
 * 기록이 없을 때 bestRecord()는 Infinity,
 * averageRecord()는 NaN을 반환하므로 laps.length 확인 후 사용하세요.
 * 사용하는 컴포넌트가 사라지면 타이머는 자동 정리됩니다.
 */

function useStopwatch() {
  //실시간으로 측정되고 있는 시간
  const [time, setTime] = useState<number>(0)

  // 시간 기록 관리
  const [laps, setLaps] = useState<number[]>([])

  //timer를 실시관으로 관리하는 변수
  const intervalRef = useRef<number | undefined>(undefined)

  // 타이머 사용도 중 다른 페이지로 이동할 때 타이머 정리
  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current)
    }
  }, [])

  // 정답 시 stopwatch를 리셋하는 함수
  function resetStopWatch() {
    clearInterval(intervalRef.current)
    setTime(0)

    const startedAt = performance.now()

    intervalRef.current = window.setInterval(() => {
      setTime(performance.now() - startedAt)
    }, 10)
  }

  //해당 시간을 기록에 추가
  const recordLap = () => {
    setLaps((prev) => [...prev, time])
  }

  //최고기록 계산하기
  function bestRecord() {
    return Math.min(...laps)
  }

  //평균 값 계산하기
  function averageRecord() {
    const result = laps.reduce((prev, curr) => {
      return prev + curr
    }, 0)

    return result / laps.length
  }

  return { time, laps, intervalRef, setLaps, resetStopWatch, recordLap, bestRecord, averageRecord }
}

export default useStopwatch
