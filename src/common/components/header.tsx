import { Link, useLocation } from 'react-router-dom'
import { supabase } from '@/lib/supabaseClient'
import { useState } from 'react'
import { setStoredNickname, getStoredNickname } from '@/common/utils/nicknameStrorage'
import logError from '@/lib/logError'

// TODO: 집중 연습 :type 슬러그는 인수 님과 확정 후 수정
const NAV_ITEMS = [
  { label: '실전 연습', to: '/', match: ['/', '/practice', '/result'] },
  { label: '집중 연습', to: '/drill/captcha', match: ['/drill'] },
  { label: '기록', to: '/records', match: ['/records'] },
]

/**
 * Header
 * @description 공통 네비게이션 헤더, 상단 안내 줄·로고·메뉴 탭
 */

const Header = () => {
  const { pathname } = useLocation()
  //닉네임
  const [nickName, setNickName] = useState('')

  // 저장된 닉네임으로 상태 초기화
  const [registeredNickname, setRegisteredNickname] = useState(() => getStoredNickname())

  // 닉네임 에러
  const [nicknameError, setNickNameError] = useState('')

  const isActive = (match: string[]) =>
    match.some((path) => (path === '/' ? pathname === '/' : pathname.startsWith(path)))

  async function saveNickName() {
    setNickNameError('')
    const trimmedNickname = nickName.trim()

    if (trimmedNickname === '') {
      return
    }

    const { error } = await supabase.from('profiles').insert({ nickname: trimmedNickname })

    if (error) {
      // nickname unique 위반시
      setNickNameError(
        error.code === '23505'
          ? '이미 사용 중인 닉네임입니다.'
          : '닉네임 등록에 실패했습니다. 다시 시도해 주세요.',
      )

      //애러 로그 추가
      await logError({
        operation: 'saveNickName.insert',
        message: error.message,
        error_code: error.code,
      })

      return
    }

    setStoredNickname(trimmedNickname)
    setRegisteredNickname(trimmedNickname)
  }

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex min-h-18 max-w-6xl flex-wrap items-center gap-x-4 gap-y-3 px-4 sm:gap-x-12">
        <Link
          to="/"
          className="shrink-0 text-xl leading-none font-black tracking-tight italic sm:text-[28px]"
        >
          TICKET<span className="text-primary">RUN</span>
        </Link>
        <nav className="h-18">
          <ul className="flex h-full gap-4 sm:gap-10">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  aria-current={isActive(item.match) ? 'page' : undefined}
                  className="flex h-full items-center text-[15px] font-bold whitespace-nowrap text-gray-800 hover:text-primary aria-[current=page]:text-primary aria-[current=page]:shadow-[inset_0_-3px_0_var(--color-primary)] sm:text-[17px]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mb-3 flex w-full items-center gap-2 sm:mb-0 sm:ml-auto sm:w-auto">
          <label htmlFor="nickname" className="sr-only">
            닉네임
          </label>

          {registeredNickname !== '' ? (
            <span className="inline-flex h-10 min-w-0 max-w-full items-center gap-1 rounded-full border border-primary/20 bg-primary/5 px-4 text-sm font-bold text-primary sm:max-w-60">
              <span className="truncate" title={registeredNickname}>
                {registeredNickname}
              </span>
              <span className="shrink-0 font-medium text-gray-600">님</span>
            </span>
          ) : (
            <div className="relative">
              <input
                id="nickname"
                name="nickname"
                type="text"
                placeholder="닉네임을 입력하세요"
                className="h-10 min-w-0 flex-1 rounded-lg border border-gray-300 px-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 sm:w-40 sm:flex-none"
                onChange={(e) => {
                  setNickName(e.target.value)
                  setNickNameError('')
                }}
              />
              <button
                type="button"
                className="h-10 shrink-0 rounded-lg bg-primary px-3 text-sm font-bold text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                onClick={saveNickName}
              >
                닉네임 등록
              </button>
              {nicknameError && (
                <p
                  role="alert"
                  className="absolute left-0 top-full ps-1 text-xs whitespace-nowrap text-red-600"
                >
                  {nicknameError}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
