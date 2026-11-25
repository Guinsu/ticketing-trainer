import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import router from '@/app/router'
import { RouterProvider } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)

// 한글 웹폰트(약 230KB)가 첫 화면과 대역폭을 다투지 않도록, 페이지 로딩이 끝난 뒤에 불러옴
// 그 전까지는 index.css의 시스템 폰트로 표시된다
const loadWebFont = () =>
  setTimeout(() => import('pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css'))
if (document.readyState === 'complete') loadWebFont()
else window.addEventListener('load', loadWebFont, { once: true })
