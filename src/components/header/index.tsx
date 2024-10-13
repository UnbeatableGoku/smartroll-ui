import React from 'react'

import logo from '@assets/images/smartroll.png'
import { Link } from 'react-router-dom'

import { PAGE_DASHBOARD } from '@constants/page'

import UsernameSection from './usernameSection'

const Header = () => {
  return (
    <header className="header-top flex items-center justify-between gap-3 px-10 py-3">
      <div className="h-8 shrink-0">
        <Link to={PAGE_DASHBOARD.path}>
          <img src={logo} alt="logo" className="h-full w-full object-contain" />
        </Link>
      </div>
      <UsernameSection />
    </header>
  )
}

export default Header
