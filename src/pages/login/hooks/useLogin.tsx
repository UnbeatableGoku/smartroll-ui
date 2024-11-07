import React from 'react'

//?slices
import { setAuth , setUserProfile } from '@data/redux/slices/authSlice';
import { useDispatch } from 'react-redux';

//? axios
import axios from 'axios';

import {jwtDecode} from 'jwt-decode'
import { DecodedToken } from 'types/common'
import { base_url } from '@utils/base_url';


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

      //TODO: DEOCODE THE ACCESS TOKEN AND STORE THE PROFILE OF STACKHOLDER IN REDUX STORE
      const decode = jwtDecode<DecodedToken>(response.data.access)
      dispatch(setUserProfile(decode));
      //? return success message and the token
      return {
        error: false,
        message: 'Login successful',
        data: token,
        status: response.status,
        profile : decode.obj
      };
    } catch (error:any) {
      // Safely access error.response
      const message = error.response?.data?.message || 'An error occurred'
      if (error.code === 'ERR_NETWORK') {
        return {
          error: true,
          message,
          data: null,
          status : 404,
          profile : null
        };
      }
      return {
        error: true,
        message,
        data: null,
        status : 500,
        profile : null
      };
    }
  }

  return {
    handleLogin,
  }
}

export default useLogin
