// 사용할 문자 (대문자, 소문자, 숫자)
const CHARACTERS = 'ABDEFGHJKLMNQRTYabdefghjkmnpqrty23456789'

// 문자를 무작위로 골라 6자리의 문자열을 만든다.
export function generateCaptcha(length = 6): string {
  return Array.from({ length }, () => {
    const index = Math.floor(Math.random() * CHARACTERS.length)
    return CHARACTERS[index]
  }).join('')

}
