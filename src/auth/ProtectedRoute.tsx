// src/components/common/ProtectedRoute.tsx
import React from 'react'

import { Navigate } from 'react-router-dom'

import { PAGE_LOGIN,PAGE_SUBJECT_SELECT,PAGE_ELECTIVE_SUBJECT,PAGE_SUBJECT_CHOICE } from '@constants'

import useAuth from '@hooks/useAuth'

interface ProtectedRouteProps {
  children: React.ReactElement // This is the content that will be protected
  roleRequired?: string // Optional: you can specify which role is required
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roleRequired,
}) => {
  const { role, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div> // Show a loading state until role is determined
  }

  // Redirect to login if no role or invalid role
  if (!role) {
    return <Navigate to={PAGE_LOGIN.path} replace />
  }
  
  
  // Optionally check for specific roles if roleRequired is provided
  if (roleRequired && role !== roleRequired) {
    console.log("first")
    if(role == 'admin')
      return <Navigate to={PAGE_SUBJECT_SELECT.path} replace />
    else if (role == 'teacher'){
      return <Navigate to={PAGE_SUBJECT_CHOICE.path} replace />
    }
    else if (role =='student'){
      return <Navigate to={PAGE_ELECTIVE_SUBJECT.path} replace />
    }
  }

  return children // Render the protected content
}

export default ProtectedRoute
