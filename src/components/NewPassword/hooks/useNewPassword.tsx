import { setAuth, setUserProfile } from '@data/redux/slices/authSlice'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { base_url } from '@utils/base_url'

import { DecodedToken } from 'types/common'

interface NewPasswordData {
  password: string
  student_slug: string
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
        `${base_url}/auth/api/set_new_password_for_student/`,
        newPasswordData,
        { headers },
      )
      if (response) {
        console.log(response)
        const token: { access: string; refresh: string; isAuth: boolean } = {
          ...response?.data,
          isAuth: true,
        }
        dispatch(setAuth(token))

        //? set the tokens to local storage
        localStorage.setItem('accessToken', token.access)
        localStorage.setItem('refreshToken', token.refresh)

        // Decode the new access token to get the user profile
        const decode = jwtDecode<DecodedToken>(response?.data?.access)
        console.log(decode)
        dispatch(setUserProfile(decode))

        // Show success toast and navigate
        toast.success('Password Updated Successfully!')
        navigate('/student-dashboard')
        return {
          success: true,
          message: 'Password Updated Successfully!',
        }
      } else {
        toast.error('Password Update Failed. Please Contact Administrator.')
      }
    } catch (error) {
      console.error('Error Updating Password', error)
      toast.error('An error occurred while updating the password')
    }
  }
  return {
    handleNewPassword,
  }
}

export default useNewPassword
