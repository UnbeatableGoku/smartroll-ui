import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@data/redux/Store'
import { jwtDecode } from 'jwt-decode'
import { DecodedToken } from 'types/common'

const useSidebarLinkSelector = () => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null)
    const [open, setOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)

    // Get the user profile from the Redux store
    const accessToken = useSelector((state: RootState) => state.auth.accessToken)
    
    
    // Define the sidebar links based on user role
    const userLinks = {
        admin: ['DASHBOARD', 'USER_MANAGEMENT', 'TIMETABLE','SUBJECT-SELECT','SUBJECT_SELECTION_CONFIRMATION'],
        teacher: ['TEACHER-DASHBOARD', 'USER_MANAGEMENT', 'TEACHER-TIMETABLE','SUBJECT-CHOICE'],
        student: ['STUDENT-DASHBOARD', 'USER_MANAGEMENT', 'STUDENT-TIMETABLE'],
    }

    // Compute the sidebar links based on the user's role
    const setSidebarLinks = (): Array<string> => {
        if(!accessToken){
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
