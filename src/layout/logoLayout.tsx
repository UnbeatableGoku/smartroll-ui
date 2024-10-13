import logo from '@assets/images/smartroll.png'
import { Outlet } from 'react-router-dom'

const LogoLayout = () => {
  return (
    <>
      <header className="flex items-center justify-end border-2 px-10 py-3">
        <div className="w-28 shrink-0">
          <img
            src={logo}
            alt="smart-roll"
            className="h-full w-full object-contain"
          />
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  )
}
export default LogoLayout
