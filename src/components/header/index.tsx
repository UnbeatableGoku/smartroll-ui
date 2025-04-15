import { useEffect, useState } from 'react'

import logo from '@assets/images/smartroll.png'
import { RootState } from '@data/redux/Store'
import { setUserProfile } from '@data/redux/slices/authSlice'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import { PAGE_DASHBOARD } from '@constants'

import { DecodedToken } from 'types/common'

const Header = () => {
  const dispatch = useDispatch()
  const access: any = useSelector((state: RootState) => state.auth.accessToken)

  const [profile, setProfile] = useState<DecodedToken | null>(null)
  const decodeToken = () => {
    try {
      if (access) {
        const decoded: DecodedToken = jwtDecode<DecodedToken>(access)
        dispatch(setUserProfile(decoded))
        setProfile(decoded)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  useEffect(() => {
    decodeToken()
  }, [access])

  return (
    <header className="header-top relative flex w-full items-center justify-center border-none bg-[#F7F7F7] px-10 py-3 shadow-soft md:justify-between">
      {/* Center the logo */}
      <div className="h-8">
        <Link to={PAGE_DASHBOARD.path}>
          <img src={logo} alt="logo" className="h-full w-auto object-contain" />
        </Link>
      </div>

      {/* Align the heading to the right */}
      <h1 className="ml-auto hidden text-black md:block md:text-sm lg:block">
        {profile &&
          `${profile.obj.profile.role === 'teacher' ? 'Faculty' : profile.obj.profile.role.at(0)?.toLowerCase() + profile.obj.profile.role.slice(1)} | ${profile.obj.profile.name}`}
      </h1>
    </header>
  )
}

export default Header
