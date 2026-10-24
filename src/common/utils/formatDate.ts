const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export const formatDate = (date: string) => {
  const day = new Date(`${date}T00:00:00`).getDay()
  return `${date.replaceAll('-', '.')} (${WEEKDAYS[day]})`
}

export const formatTime = (time: string) => {
  const [hour, minute] = time.split(':').map(Number)
  const period = hour < 12 ? '오전' : '오후'
  return `${period} ${hour % 12 || 12}시${minute ? ` ${minute}분` : ''}`
}

export const formatRemaining = (ms: number) => {
  const seconds = Math.ceil(ms / 1000)
  const mm = String(Math.floor(seconds / 60)).padStart(2, '0')
  const ss = String(seconds % 60).padStart(2, '0')
  return `${mm}:${ss}`
}
