// TODO: 공연정보(Concert: 공연명·포스터·장소·가격·예매 시작 시각 등)와 관람일·회차(Schedule) 정의

export type Schedule = {
  id: string
  date: string
  time: string
}
export type Concert = {
  id: string
  category: string
  title: string
  description: string
  poster: string
  venue: string
  address: string
  ageLimit: string
  organizer: string
  schedules: Schedule[]
}
