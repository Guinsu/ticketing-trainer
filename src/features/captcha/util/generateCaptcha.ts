//captcha에서 사용되는 랜덤 문자들을 생성하는 함수
const GenerateCaptcha = function catchaBox() {
  const characters = '123456789acdefhjmnprtwxyACDEFHJMNPRTWXY'
  let result = ''

  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

export default GenerateCaptcha
