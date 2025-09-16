import { setAuth, setUserProfile } from '@data/slices/authSlice'
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
        `${window.base_url}/auth/api/set_new_password_for_stakeholders/`,
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
          navigate('/teacher-dashboard/')
        } else {
          navigate('/student-dashboard')
        }

        return {
          success: true,
          message: 'Password Updated Successfully!',
        }
      }
    } catch (error: any) {
      if (error.status == 404) {
        toast.error(error.message)
      }
      if (error.status == 500) {
        toast.error(error.response.data.message)
      }
    }
  }

  //function:: to handel the forgot password
  const handleForgotPassword = async (
    profile_slug: string,
    ForgotPasswordCode: any,
    password: string,
  ) => {
    try {
      const headers = {
        'Content-Type': 'application/json', // Assuming JSON for login
        'ngrok-skip-browser-warning': 'true',
      }
      const body = {
        password: password,
        profile_forgot_password_code: ForgotPasswordCode,
        profile_slug,
      }
      const response = await axios.post(
        `${window.base_url}/auth/api/set_updated_password/`,
        body,
        { headers: headers },
      )
      if (response.data.data === true) {
        toast.success('Your password has been updated successfully')
        navigate('/login')
      }
    } catch (error: any) {
      toast.error(
        error.response.data.message || error.message || 'someting went wrong',
      )
    }
  }
  return {
    handleNewPassword,
    handleForgotPassword,
  }
}

export default useNewPassword
