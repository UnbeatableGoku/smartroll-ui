import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@data/redux/Store'

const useSidebarLinkSelector = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [open, setOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

    // Get the user profile from the Redux store
    const userProfile = useSelector((state: RootState) => state.auth.userProfile?.obj)

    // Define the sidebar links based on user role
    const userLinks = {
        admin: ['DASHBOARD', 'USER_MANAGEMENT', 'TIMETABLE'],
        teacher: ['TEACHER-DASHBOARD', 'USER_MANAGEMENT', 'TEACHER-TIMETABLE'],
        student: ['STUDENT-DASHBOARD', 'USER_MANAGEMENT', 'STUDENT-TIMETABLE'],
    }

    // Compute the sidebar links based on the user's role
    const setSidebarLinks = (): Array<string> => {
        if (userProfile?.profile.role === 'admin') {
            return userLinks.admin
        } else if (userProfile?.profile.role === 'teacher') {
            return userLinks.teacher
        } else if (userProfile?.profile.role === 'student') {
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
