import type { Concert } from '@/types/concert'

export const CONCERTS: Concert[] = [
  {
    id: 'luminous-bloom-2026',
    category: '콘서트',
    title: '루미너스 2026 WORLD TOUR <BLOOM>',
    description: '봄처럼 피어나는 세 번째 월드투어를 만나보세요.',
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
    category: '콘서트',
    title: 'NOVA [RIGHT NOW] CONCERT',
    description: '데뷔 5주년, 지금 이 순간의 NOVA.',
    poster: '/posters/2.jpg',
    venue: 'KSPO DOME (올림픽체조경기장)',
    address: '서울특별시 송파구 올림픽로 424',
    ageLimit: '만 8세 이상',
    organizer: '오르빗뮤직',
    schedules: [
      { id: 'nova-1', date: '2026-11-28', time: '18:00' },
      { id: 'nova-2', date: '2026-11-29', time: '17:00' },
    ],
  },
  {
    id: 'daybreak-encore-2026',
    category: '콘서트',
    title: '데이브레이크 단독 콘서트 <ENCORE>',
    description: '한 해를 마무리하는 앙코르 무대.',
    poster: '/posters/3.jpg',
    venue: 'KSPO DOME (올림픽체조경기장)',
    address: '서울특별시 송파구 올림픽로 424',
    ageLimit: '만 7세 이상',
    organizer: '하이라인컴퍼니',
    schedules: [
      { id: 'daybreak-1', date: '2026-12-12', time: '19:00' },
      { id: 'daybreak-2', date: '2026-12-13', time: '18:00' },
    ],
  },
]
