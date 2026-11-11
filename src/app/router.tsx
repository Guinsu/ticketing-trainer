import HomeScreen from '@/pages/homeScreen'
import type { ComponentType } from 'react'
import { createBrowserRouter } from 'react-router-dom'
import App from './App'

// 화면 코드는 그 화면에 들어갈 때 받는다, 첫 화면(홈)만 처음 번들에 포함
const page = (load: () => Promise<{ default: ComponentType }>) => async () => ({
  Component: (await load()).default,
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomeScreen /> },
      { path: '/practice', lazy: page(() => import('@/pages/concertScreen')) },
      { path: '/practice/window', lazy: page(() => import('@/pages/bookingWindowScreen')) },
      { path: '/practice/queue', lazy: page(() => import('@/pages/queueScreen')) },
      { path: '/result/:recordId', lazy: page(() => import('@/pages/resultScreen')) },
      { path: '/records', lazy: page(() => import('@/pages/recordsScreen')) },
      { path: '/drill', lazy: page(() => import('@/pages/drillScreen')) },
      { path: '/drill/:type', lazy: page(() => import('@/pages/drillScreen')) },
      { path: '*', lazy: page(() => import('@/pages/notFoundScreen')) },
    ],
  },
])

export default router
