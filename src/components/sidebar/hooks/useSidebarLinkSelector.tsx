import { useState } from 'react'

import { RootState } from '@data/redux/Store'
import { jwtDecode } from 'jwt-decode'
import { useSelector } from 'react-redux'

import { DecodedToken } from 'types/common'

const useSidebarLinkSelector = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  // Get the user profile from the Redux store
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  // Define the sidebar links based on user role
  const userLinks = {
    admin: [
      //   'TIMETABLE',
      'SUBJECT-SELECT',
      'SUBJECT_SELECTION_CONFIRMATION',
      'DIVISION_CREATION'
    ],
    teacher: ['SUBJECT-CHOICE'],
    student: ['ELECTIVE_SUBJECT'],
  }

  // Compute the sidebar links based on the user's role
  const setSidebarLinks = (): Array<string> => {
    if (!accessToken) {
      return []
    }
    const userProfile = jwtDecode<DecodedToken>(accessToken)
    if (userProfile?.obj.profile.role === 'admin') {
      return userLinks.admin
    } else if (userProfile?.obj.profile.role === 'teacher') {
      return userLinks.teacher
    } else if (userProfile?.obj.profile.role === 'student') {
      return userLinks.student
    } else {
      return []
    }
  }

  return {
    activeIndex,
    setActiveIndex,
    open,
    setOpen,
    setCollapsed,
    setSidebarLinks,
    collapsed,
  }
}

export default useSidebarLinkSelector
