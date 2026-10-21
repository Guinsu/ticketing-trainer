// TODO: 기기·연습 모드·개별 연습 종류, 행동 이벤트(PracticeEvent), IndexedDB에 저장할 연습 기록(PracticeRecord) 정의
export type DeviceType = 'pc' | 'mobile'
export type PracticeMode = 'full' | 'individual'
export type PracticeType = 'captcha' | 'target-seat' | 'cancelled-ticket' | 'countdown'

export type PracticeEventType =
  | 'practice-start' // 연습 시작
  | 'captcha-submit' // 보안문자 제출
  | 'seat-click' // 좌석 클릭
  | 'refresh' // 취소표 새로고침
  | 'countdown-click' // 카운트다운 버튼 클릭
  | 'practice-end' // 연습 종료

export interface PracticeEvent {
  type: PracticeEventType
  elapsedMs: number // 연습 시작 후 경과 시간
}
