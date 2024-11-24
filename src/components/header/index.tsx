import { useEffect, useState } from 'react'

import logo from '@assets/images/smartroll.png'
import { RootState } from '@data/redux/Store'
import { jwtDecode } from 'jwt-decode'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { PAGE_DASHBOARD } from '@constants'

import { DecodedToken } from 'types/common'

const Header = () => {
  const access: any = useSelector((state: RootState) => state.auth.accessToken)

  const [profile, setProfile] = useState<DecodedToken | null>(null)
  const decodeToken = () => {
    if (access) {
      const decoded: DecodedToken = jwtDecode<DecodedToken>(access)
      setProfile(decoded)
    }
  }
  useEffect(() => {
    decodeToken()
  }, [access])

  return (
    <header className="header-top relative flex items-center border-none px-10 py-3 dark:bg-black">
      {/* Center the logo */}
      <div className="absolute left-1/2 h-8 -translate-x-1/2 transform">
        <Link to={PAGE_DASHBOARD.path}>
          <img src={logo} alt="logo" className="h-full w-auto object-contain" />
        </Link>
      </div>

      {/* Align the heading to the right */}
      <h1 className="ml-auto hidden text-white md:block md:text-sm lg:block">
        {profile &&
          `${profile.obj.profile.role.charAt(0).toUpperCase() + profile.obj.profile.role.slice(1)} | ${profile.obj.profile.name}`}
      </h1>
    </header>
  )
}

export default Header
