import CaptchaBox from '@/features/captcha/components/captchaBox'
import GenerateCaptcha from '@/features/captcha/util/generateCaptcha'
import { useState, type FormEvent } from 'react'

export type CaptchaRecord = {
  ms: number
  misses: number
}

interface CaptchaStepProps {
  onPass: (misses: number) => void
  onChangeSchedule: () => void
}

/**
 * CaptchaStep
 * @description 좌석 선택 전 보안문자, 좌석 화면 위를 덮고 통과해야 좌석을 고를 수 있다
 */
const CaptchaStep = ({ onPass, onChangeSchedule }: CaptchaStepProps) => {
  const [answer, setAnswer] = useState(GenerateCaptcha)
  const [input, setInput] = useState('')
  const [misses, setMisses] = useState(0)

  const refresh = () => {
    setAnswer(GenerateCaptcha())
    setInput('')
  }

  // 대소문자 구분 없이 비교, 틀리면 새 문자로 바뀐다
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (input.trim().toUpperCase() === answer.toUpperCase()) {
      onPass(misses)
      return
    }
    setMisses((prev) => prev + 1)
    refresh()
  }

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/40 px-4 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        role="dialog"
        aria-modal="true"
        aria-labelledby="captcha-title"
        className="w-full max-w-md border border-gray-300 bg-white p-6"
      >
        <h2 id="captcha-title" className="text-xl font-extrabold tracking-tight">
          안심예매
        </h2>
        <p className="mt-1 text-sm text-gray-600">문자를 입력해주세요.</p>

        <div className="mt-5 flex gap-2">
          <div className="h-24 flex-1 text-5xl font-black tracking-widest">
            <CaptchaBox text={answer} />
          </div>
          <button
            type="button"
            onClick={refresh}
            aria-label="보안문자 새로고침"
            className="w-14 cursor-pointer border border-gray-300 text-xl text-gray-600 hover:border-primary hover:text-primary"
          >
            ↻
          </button>
        </div>

        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          autoFocus
          autoComplete="off"
          aria-label="보안문자 입력"
          placeholder="대소문자 구분 없이 입력"
          className="mt-4 h-12 w-full border border-gray-300 px-3 text-lg font-bold tracking-widest uppercase outline-none focus:border-primary"
        />
        {misses > 0 && (
          <p role="alert" className="mt-2 text-sm font-bold text-red-500">
            입력한 문자가 일치하지 않습니다. 다시 입력해주세요.
          </p>
        )}

        <button
          type="submit"
          disabled={input.trim() === ''}
          className="mt-5 h-13 w-full text-lg font-bold enabled:cursor-pointer enabled:bg-primary enabled:text-white enabled:hover:bg-primary-hover disabled:bg-gray-100 disabled:text-gray-400"
        >
          입력완료
        </button>
        <button
          type="button"
          onClick={onChangeSchedule}
          className="mt-3 w-full cursor-pointer text-sm font-bold text-gray-500 hover:text-primary"
        >
          날짜 다시 선택
        </button>
      </form>
    </div>
  )
}

export default CaptchaStep
