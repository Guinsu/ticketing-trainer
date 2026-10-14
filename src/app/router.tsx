import HomeScreen from '@/pages/homeScreen'
import { createBrowserRouter } from 'react-router-dom'
import QueueScreen from '@/pages/queueScreen'
import ConcertScreen from '@/pages/concertScreen'
import BookingWindowScreen from '@/pages/bookingWindowScreen'
import ResultScreen from '@/pages/resultScreen'
import RecordsScreen from '@/pages/recordsScreen'
import DrillScreen from '@/pages/drillScreen'
import NotFoundScreen from '@/pages/notFoundScreen'
import App from './App'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomeScreen /> },
      { path: '/practice', element: <ConcertScreen /> },
      { path: '/practice/window', element: <BookingWindowScreen /> },
      { path: '/practice/queue', element: <QueueScreen /> },
      { path: '/result/:recordId', element: <ResultScreen /> },
      { path: '/records', element: <RecordsScreen /> },
      { path: '/drill/:type', element: <DrillScreen /> },
      { path: '*', element: <NotFoundScreen /> },
    ],
  },
])

export default router
