import logo from '@assets/images/smartroll.png'
import { Link, Outlet } from 'react-router-dom'

const LogoLayout = () => {
  return (
    <>
      <div className="relative h-[100dvh]">
        <div className="wrapper flex h-full flex-col overflow-hidden">
          <header className="absolute z-10 flex w-full items-center justify-center bg-white px-10 py-3 shadow-soft">
            <div className="w-28 shrink-0">
              <Link to="/">
                <img
                  src={logo}
                  alt="smart-roll"
                  className="h-full w-full object-contain"
                />
              </Link>
            </div>
          </header>
          <main className="relative">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}
export default LogoLayout
