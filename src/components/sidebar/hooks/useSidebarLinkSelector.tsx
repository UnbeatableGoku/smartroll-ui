import { useState } from 'react'

import { RootState } from '@data/Store'
import { jwtDecode } from 'jwt-decode'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

import { DecodedToken } from 'types/common'

const useSidebarLinkSelector = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)

  // Get the user profile from the Redux store
  const accessToken = useSelector((state: RootState) => state.auth.accessToken)

  // Define the sidebar links based on user role
  const userLinks = {
    admin: [
      'SUBJECT-SELECT',
      'SUBJECT_SELECTION_CONFIRMATION',
      // 'DIVISION_CREATION',
      // 'TEACHER_ALLOCATION',
      // 'TIMETABLE',
      // 'ADMIN_ROUTES',
    ],
    teacher: [
      // 'LOAD_ALLOCATION_FOR_TEACHER_END',
      'INSTANT_LECTURE',
      'LECTURE_SESSIONS_HISTORY',
      'LECTRUE_ANALYTICS',
      'SUBJECT-CHOICE',
    ],
    student: [
      'ELECTIVE_SUBJECT',
      // 'STUDENT_DIVISION'
    ],
  }

  // Compute the sidebar links based on the user's role
  const setSidebarLinks = (): Array<string> => {
    try {
      if (!accessToken && accessToken == undefined) {
        return []
      }

      if (accessToken != undefined && accessToken != null) {
        const userProfile = jwtDecode<DecodedToken | undefined>(accessToken)
        if (userProfile?.obj.profile.role === 'admin') {
          return userLinks.admin
        } else if (userProfile?.obj.profile.role === 'teacher') {
          return userLinks.teacher
        } else if (userProfile?.obj.profile.role === 'student') {
          return userLinks.student
        } else {
          return []
        }
      } else {
        return []
      }
    } catch (error: any) {
      toast.error(error.message)
    }

    return []
  }

  return {
    activeIndex,
    setActiveIndex,
    open,
    setOpen,
    setCollapsed,
    setSidebarLinks,
    collapsed,
    isProfileModalOpen,
    setIsProfileModalOpen,
  }
}

export default useSidebarLinkSelector
