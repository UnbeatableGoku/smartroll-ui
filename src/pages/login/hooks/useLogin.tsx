import React from 'react'

//?slices
import { setAuth } from '@data/redux/slices/authSlice'
//? axios
import axios from 'axios'
import { useDispatch } from 'react-redux'

//? utils
import { base_url } from '@utils/base_url'

//? TYPES AND INTERFACES
type UserData = {
  email: string
  password: string
}

//? HOOK
const useLogin = () => {
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

      //? set the tokens in the rdux store
      dispatch(setAuth(token))

      //? set the tokens to local storage
      localStorage.setItem('accessToken', token.access)
      localStorage.setItem('refreshToken', token.refresh)

      //? return success message and the token
      return {
        error: false,
        message: 'Login successful',
        data: token,
        status: response.status,
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
        }
      }
      return {
        error: true,
        message,
        data: null,
        status: 500,
      }
    }
  }

  return {
    handleLogin,
  }
}

export default useLogin
