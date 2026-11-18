import type { Concert } from '@/types/concert'

export const CONCERTS: Concert[] = [
  {
    id: 'luminous-bloom-2026',
    category: '콘서트',
    title: '2026 WORLD TOUR <THE NEXT CHAPTER> IN SEOUL',
    description: '다시 꿈꾸는 다음 장, 월드투어의 서울 공연을 만나보세요.',
    poster: '/posters/1.jpg',
    venue: 'KSPO DOME (올림픽체조경기장)',
    address: '서울특별시 송파구 올림픽로 424',
    ageLimit: '만 7세 이상',
    organizer: '스텔라엔터테인먼트',
    schedules: [
      { id: 'luminous-1', date: '2026-11-14', time: '18:00' },
      { id: 'luminous-2', date: '2026-11-15', time: '17:00' },
    ],
  },
  {
    id: 'nova-right-now-2026',
    category: '페스티벌',
    title: '2026 SEOUL ROCK FESTIVAL',
    description: '음악과 사람이 함께하는 사흘간의 여름밤 록 페스티벌.',
    poster: '/posters/2.jpg',
    venue: '서울올림픽공원',
    address: '서울특별시 송파구 올림픽로 424',
    ageLimit: '만 8세 이상',
    organizer: '오르빗뮤직',
    schedules: [
      { id: 'nova-1', date: '2026-08-14', time: '15:00' },
      { id: 'nova-2', date: '2026-08-15', time: '15:00' },
      { id: 'nova-3', date: '2026-08-16', time: '15:00' },
    ],
  },
  {
    id: 'daybreak-encore-2026',
    category: '콘서트',
    title: 'SUDOKU LEAGUE LIVE CONCERT in SEOUL',
    description: '함께 플레이하고, 함께 집중하는 SUDOKU LEAGUE의 첫 라이브 투어.',
    poster: '/posters/3.jpg',
    venue: 'KSPO DOME (올림픽체조경기장)',
    address: '서울특별시 송파구 올림픽로 424',
    ageLimit: '만 7세 이상',
    organizer: '하이라인컴퍼니',
    schedules: [
      { id: 'daybreak-1', date: '2026-11-20', time: '19:00' },
      { id: 'daybreak-2', date: '2026-11-21', time: '18:00' },
      { id: 'daybreak-3', date: '2026-11-22', time: '17:00' },
    ],
  },
]
