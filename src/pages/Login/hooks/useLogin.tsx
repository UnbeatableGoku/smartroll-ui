//?slices
import { useState } from 'react'

import { RootState } from '@data/redux/Store'
import { setAuth, setUserProfile } from '@data/redux/slices/authSlice'
//? axios
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import { DecodedToken } from 'types/common'

//? TYPES AND INTERFACES
type UserData = {
  email: string
  password: string
}
type LoginFormData = {
  email: string
  password: string
}

//? HOOK
const useLogin = () => {
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { register, handleSubmit, reset } = useForm<LoginFormData>()
  const [showPassword, setShowPassword] = useState(false)
  const [studentSlug, setStudentSlug] = useState<string>('')
  const [isTempPassword, setIsTempPassword] = useState<boolean>(false)
  const [callbackUrl] = useState<string | null>(
    queryParams.get('redirect_uri') ?? null,
  )
  const [fromApp] = useState<string | null>(queryParams.get('from_app') ?? null)
  const [deviceId] = useState<string | null>(
    queryParams.get('device_id') ?? null,
  )
  const access_token = useSelector((state: RootState) => state.auth.accessToken)
  const navigate = useNavigate()

  const dispatch = useDispatch()

  //? LOGIN FUNCTIONALITY

  const handleLogin = async (userdata: UserData) => {
    setIsLoading(true)
    const headers = {
      'Content-Type': 'application/json', // Assuming JSON for login
      'ngrok-skip-browser-warning': 'true',
    }

    try {
      const response = await axios.post(
        `${window.base_url}/auth/api/login/`,
        { ...userdata, device_id: deviceId },
        { headers },
      )
      setIsLoading(false)

      if (response?.data?.profile_slug) {
        setStudentSlug(response?.data?.profile_slug)
        setIsTempPassword(true)
        toast.warning('Temporary password. Please set a new password.')
        setIsLoading(false)
        return
      }

      const token: {
        access: string
        refresh: string
        isAuth: boolean
        callbackUrl: string | null
        fromApp: string | null
      } = {
        ...response.data,
        isAuth: true,
        callbackUrl,
        fromApp,
      }
      if (
        token.access == undefined &&
        token.refresh == undefined &&
        token.refresh == null &&
        token.access == null
      ) {
        throw new Error('Access token is required')
      }
      //? set the tokens in the rdux store
      dispatch(setAuth(token))

      //? set the tokens to local storage
      localStorage.setItem('accessToken', token.access)
      localStorage.setItem('refreshToken', token.refresh)
      localStorage.setItem('callbackUrl', callbackUrl ?? '')
      localStorage.setItem('fromApp', fromApp ?? '')

      const decode: DecodedToken = jwtDecode<DecodedToken>(response.data.access)
      dispatch(setUserProfile(decode))

      //? return success message and the token
      if (decode.obj.profile.role === 'admin') {
        return navigate('/subject/subject-select') //:: CHANGE TO '/'
      } else if (
        decode.obj.profile.role === 'student' ||
        decode.obj.profile.role === 'teacher'
      ) {
        if (!callbackUrl || !fromApp || !deviceId) {
          return decode.obj.profile.role === 'student'
            ? navigate('/student-dashboard')
            : navigate('/teacher-dashboard') //:: CHANGE TO '/student-dashboard'
        } else {
          window.history.replaceState(null, '', window.location.pathname)
          const callbackUrlParse: string = `${callbackUrl}?access_token=${token.access}&refresh_token=${token.access}&role=${decode.obj.profile.role}`
          return (window.location.href = callbackUrlParse)
        }
      } else {
        return navigate('/login')
      }
    } catch (error: any) {
      // Safely acces error.response
      let errorMessage
      switch (error.status) {
        case 401:
          errorMessage = 'Invalid credentials'
          break
        case 502:
          errorMessage = 'Something went wrong. Please try again later'
          break
        default:
          errorMessage =
            error.response?.data?.detail || error.message || 'An error occurred'
      }
      setIsLoading(false)
      reset()
      return toast.error(errorMessage)
    }
  }

  const redirectLogin = () => {
    try {
      if (access_token) {
        const decode = jwtDecode<DecodedToken>(access_token)
        if (decode?.obj?.profile?.role === 'admin') {
          navigate('/')
        } else if (decode?.obj?.profile?.role === 'student') {
          if (!callbackUrl || !fromApp || !deviceId) {
            return navigate('/student-dashboard')
          }
          localStorage.clear()
          return
        } else if (decode?.obj?.profile?.role === 'teacher') {
          if (!callbackUrl || !fromApp || !deviceId) {
            return navigate('/teacher-dashboard')
          }
          localStorage.clear()
          return
        } else {
          navigate('/login')
        }
      } else {
        navigate('/login')
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  //function :: handle the forogot password button

  const handleOnClickForForgotPassoword = async () => {
    try {
      const email = prompt('Please Enter The Email Address For Forgot Password')
      const headers = {
        'Content-Type': 'application/json', // Assuming JSON for login
        'ngrok-skip-browser-warning': 'true',
      }

      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (email && regex.test(email)) {
        const response = await axios.post(
          `${window.base_url}/auth/api/forgot_password/`,
          { email: email },
          { headers: headers },
        )
        if ((response.data.data = true)) {
          toast.success(
            'Email has been sent successfully. Please check your email.',
          )
        }
      } else {
        return toast.error('Please enter a valid email address')
      }
    } catch (error: any) {
      if (error.status === 403) {
        return toast.error('Please try again after 24 hours')
      }
      toast.error(error.response.data.message || 'something went wrong')
    }
  }
  return {
    studentSlug,
    isTempPassword,
    showPassword,
    isLoading,
    register,
    handleSubmit,
    reset,
    handleLogin,
    redirectLogin,
    setShowPassword,
    handleOnClickForForgotPassoword,
  }
}

export default useLogin
