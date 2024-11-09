//?slices
import { RootState } from '@data/redux/Store'
import { setAuth, setUserProfile } from '@data/redux/slices/authSlice'
//? axios
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { base_url } from '@utils/base_url'

import { DecodedToken } from 'types/common'

//? TYPES AND INTERFACES
type UserData = {
  email: string
  password: string
}

//? HOOK
const useLogin = () => {
  const access_token = useSelector((state: RootState) => state.auth.accessToken)
  const navigate = useNavigate()

  const dispatch = useDispatch()
  //? LOGIN FUNCTIONALITY

  const handleLogin = async (userdata: UserData) => {
    const headers = {
      'Content-Type': 'application/json', // Assuming JSON for login
      'ngrok-skip-browser-warning': 'true',
    }

    try {
      const response = await axios.post(
        `${base_url}/auth/api/login/`,
        userdata,
        { headers },
      )
      const token: { access: string; refresh: string; isAuth: boolean } = {
        ...response.data,
        isAuth: true,
      }

      if (response?.data?.student_slug) {
        return {
          error: true,
          message: 'Temporary password. Please set a new password.',
          student_slug: response?.data?.student_slug,
        }
      }

      //? set the tokens in the rdux store
      dispatch(setAuth(token))

      //? set the tokens to local storage
      localStorage.setItem('accessToken', token.access)
      localStorage.setItem('refreshToken', token.refresh)

      //TODO: DEOCODE THE ACCESS TOKEN AND STORE THE PROFILE OF STACKHOLDER IN REDUX STORE
      const decode = jwtDecode<DecodedToken>(response.data.access)
      dispatch(setUserProfile(decode))

      //? return success message and the token
      return {
        error: false,
        message: 'Login successful',
        data: token,
        status: response.status,
        profile: decode.obj,
      }
    } catch (error: any) {
      // Safely access error.response
      const message = error.response?.data?.message || 'An error occurred'
      if (error.code === 'ERR_NETWORK') {
        return {
          error: true,
          message,
          data: null,
          status: 404,
          profile: null,
        }
      }

      if (error.response) {
        return {
          error: true,
          message:
            error?.response?.data?.detail ||
            error?.response?.data?.message ||
            'An error occurred',
          data: null,
          status: error?.response?.status || 500,
          profile: null,
        }
      }
      return {
        error: true,
        message,
        data: null,
        status: 500,
        profile: null,
      }
    }
  }

  const redirectLogin = () => {
    if (access_token) {
      const decode = jwtDecode<DecodedToken>(access_token)
      console.log(decode)
      if (decode?.obj?.profile?.role === 'admin') {
        navigate('/')
      } else if (decode?.obj?.profile?.role === 'student') {
        navigate('/student-dashboard')
      } else if (decode?.obj?.profile?.role === 'teacher') {
        navigate('/teacher-dashboard')
      } else {
        navigate('/login')
      }
    } else {
      navigate('/login')
    }
  }

  return {
    handleLogin,
    redirectLogin,
  }
}

export default useLogin
