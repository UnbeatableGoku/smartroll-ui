import { setAuth, setUserProfile } from '@data/redux/slices/authSlice'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { DecodedToken } from 'types/common'

interface NewPasswordData {
  password: string
  profile_slug: string
}
const useNewPassword = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleNewPassword = async (newPasswordData: NewPasswordData) => {
    try {
      const headers = {
        'Content-Type': 'application/json', // Assuming JSON for login
        'ngrok-skip-browser-warning': 'true',
      }
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/api/set_new_password_stakeholders/`,
        newPasswordData,
        { headers },
      )

      if (response) {
        const { access, refresh }: { access: string; refresh: string } = {
          ...response.data,
        }
        const token: { access: string; refresh: string; isAuth: boolean } = {
          access,
          refresh,
          isAuth: true,
        }
        dispatch(setAuth(token))

        //? set the tokens to local storage
        localStorage.setItem('accessToken', token.access)
        localStorage.setItem('refreshToken', token.refresh)

        // Decode the new access token to get the user profile
        const decode: DecodedToken = jwtDecode<DecodedToken>(access)
        dispatch(setUserProfile(decode))

        // Show success toast and navigate
        toast.success('Password Updated Successfully!')
        if (decode.obj.profile.role === 'teacher') {
          navigate('/teacher-dashboard/subject-choice')
        } else {
          navigate('/student-dashboard/elective-subject')
        }

        return {
          success: true,
          message: 'Password Updated Successfully!',
        }
      }
    } catch (error: any) {
      console.error('Error Updating Password', error)
      toast.error(error.response.data.message)
    }
  }
  return {
    handleNewPassword,
  }
}

export default useNewPassword
