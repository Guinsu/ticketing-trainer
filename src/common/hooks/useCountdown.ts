import { useEffect, useState } from 'react'

export const useCountdown = (delayMs: number) => {
  const [openAt] = useState(() => performance.now() + delayMs)
  const [remaining, setRemaining] = useState(delayMs)

  useEffect(() => {
    const id = setInterval(() => {
      const next = Math.max(0, openAt - performance.now())
      setRemaining(next)
      if (next === 0) clearInterval(id)
    }, 100)
  }, [openAt])

  return remaining
}
