const NICKNAME_KEY = 'nickname'

export function getStoredNickname(): string {
  return localStorage.getItem(NICKNAME_KEY) ?? ''
}

export function setStoredNickname(nickname: string): void {
  localStorage.setItem(NICKNAME_KEY, nickname)
}
