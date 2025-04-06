import { useEffect, useState } from 'react'

import { RootState } from '@data/redux/Store'
import { jwtDecode } from 'jwt-decode'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

interface DecodedToken {
  token_type: string
  exp: number
  iat: number
  jti: string
  user_id: number
  obj: {
    id: number
    profile: {
      name: string | null
      email: string
      role: string
    }
    branch: {
      branch_name: string
      branch_code: string
      slug: string
    }
  }
}

const useAuth = () => {
  const [role, setRole] = useState<string | null>(null) // Track role
  const [loading, setLoading] = useState<boolean>(true) // Track loading state
  const Auth = useSelector((state: RootState) => state.auth) // Get auth from redux
  useEffect(() => {
    const accessToken = Auth?.accessToken

    if (accessToken != undefined && accessToken != null) {
      try {
        const decoded = jwtDecode<DecodedToken>(accessToken) // Decode the token
        if (decoded) {
          setRole(decoded.obj.profile.role) // Set the role from decoded token
        }
      } catch (error: any) {
        toast.error(error.message)
        console.error('Invalid token', error)
        setRole(null) // Reset role if token is invalid
      }
    } else {
      setRole(null) // No token, so set role to null
    }
    setLoading(false) // Set loading to false after processing
  }, [Auth?.accessToken]) // Re-run effect when accessToken changes

  return { role, loading } // Return role and loading state
}

export default useAuth
