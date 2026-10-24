import { Link, useLocation } from 'react-router-dom'

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

  const isActive = (match: string[]) =>
    match.some((path) => (path === '/' ? pathname === '/' : pathname.startsWith(path)))

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-18 max-w-6xl items-center gap-4 px-4 sm:gap-12">
        <Link to="/" className="shrink-0 text-xl leading-none font-black tracking-tight italic sm:text-[28px]">
          TICKET<span className="text-primary">RUN</span>
        </Link>
        <nav className="h-full">
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
      </div>
    </header>
  )
}

export default Header
