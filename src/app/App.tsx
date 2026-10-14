import { Outlet } from 'react-router-dom'

function App() {
  return (
    <div>
      <header>티켓런 연습 서비스</header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default App
