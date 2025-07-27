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
    <header className="header-top relative flex w-full items-center justify-between bg-[#F7F7F7] px-4 py-3 shadow-md md:px-10">
      {/* Logo on far left */}
      <div className="h-8">
        <Link to={PAGE_DASHBOARD.path}>
          <img src={logo} alt="logo" className="h-full w-auto object-contain" />
        </Link>
      </div>

      {/* Spacer to push avatar right only on desktop */}
      <div className="hidden flex-1 md:block" />

      {/* Avatar + Role Icon */}
      {profile?.obj?.profile?.name && (
        <div className="flex items-center gap-2 md:ml-auto">
          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-semibold text-white shadow-sm">
            {profile.obj.profile.role === 'teacher'
              ? profile.obj.teacher_code?.substring(0, 2)?.toUpperCase()
              : profile.obj.profile.name
                  ?.split(' ')
                  .map((word) => word[0]?.toUpperCase())
                  .join('')}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
