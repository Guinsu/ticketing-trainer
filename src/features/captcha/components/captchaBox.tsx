import { useState, useEffect } from 'react'

interface CaptchaBoxProps {
  text: string
}

// 점에 대한 위치 정보
interface Dot {
  x: number
  y: number
  size: number
  opacity: number
}

// 배경색
const backgroundColors = [
  'linear-gradient(to right, #0c0c6d, #de512b, #98d0c1, #5bb226, #023c0d)',
  'linear-gradient(to right, #ff1e56, #f9c942, #1e90ff)',
  'linear-gradient(to right, #de8a41, #2ada53)',
  'linear-gradient(to right, #8a2be2, #0000cd, #228b22, #ccff00)',
  'linear-gradient(to right, #8a2be2, #ffa500, #f8f8ff)',
  'linear-gradient(to right, #36B1C7, #960B33 )',
  'linear-gradient(to right, #c31432, #240b36 )',
  'linear-gradient(to right, #1E9600, #FFF200, #FF0000)',
  'linear-gradient(to right, #0f0c29, #302b63, #24243e)',
]

/**
 * 보안문자 표시 컴포넌트
 *
 * //사용 예시:
 * import { useState } from 'react'
 * import CaptchaBox from '@/features/captcha/components/captchaBox'
 * import GenerateCaptcha from '@/features/captcha/util/generateCaptcha'
 *
 * function Example() {
 *   const [answer, setAnswer] = useState('')
 *
 *   function startCaptcha() {
 *     setAnswer(GenerateCaptcha())
 *   }
 *
 *   return (
 *     <>
 *       <button onClick={startCaptcha}>보안문자 생성</button>
 *       <div className="h-48 text-6xl">
 *         <CaptchaBox text={answer} />
 *       </div>
 *     </>
 *   )
 * }
 *
 * text: 화면에 표시할 보안문자 문자열
 * - text가 바뀌면 랜덤 배경과 점을 새로 생성합니다.
 * - 부모에서 높이와 글자 크기를 지정해주세요.
 * - 입력창과 정답 비교는 사용하는 화면에서 구현해주세요.
 */

const CaptchaBox = function catchaBox({ text }: CaptchaBoxProps) {
  //배경색 관리
  const [backgroundColor, setBackgroundColor] = useState(backgroundColors[0])

  // 도트 위치 관리
  const [dots, setDots] = useState<Dot[]>([])

  useEffect(() => {
    // 배경색 랜덤으로 뽑기
    const index = Math.floor(Math.random() * backgroundColors.length)
    setBackgroundColor(backgroundColors[index])

    // 점에 위치 점보 랜덤 뽑기
    const newDots = Array.from({ length: 50 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      opacity: Math.random() * 0.3 + 0.2,
    }))

    setDots(newDots)
  }, [text])

  return (
    <div
      className="relative flex h-full w-full items-center justify-center rounded-xl text-white "
      style={{
        backgroundImage: backgroundColor,
        // WebkitTextStroke: '1px black',
        // paintOrder: 'stroke fill',
      }}
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {dots.map((dot, index) => (
          <span
            key={index}
            className="absolute rounded-full bg-black"
            style={{
              left: `${dot.x}%`,
              top: `${dot.y}%`,
              width: dot.size,
              height: dot.size,
              opacity: dot.opacity,
            }}
          />
        ))}
      </div>
      <span>{text}</span>
    </div>
  )
}

export default CaptchaBox
