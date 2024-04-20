import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'
import Header from './components/Header'

export default function Root() {
  return (
    <div className="min-h-dvh mx-10 flex flex-col">
      <Header />
      <div className="flex-1 flex">
        <Outlet />
      </div>
      <Footer />
    </div>
  )
}
