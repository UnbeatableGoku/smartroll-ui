import { useState } from 'react'

import type { DecodedToken } from '@/types/common'
import { RootState } from '@data/Store'
import { setAuth, setUserProfile } from '@data/slices/authSlice'
import { setClassRoomList } from '@data/slices/classRoomsSlice'
import { setLoader } from '@data/slices/loaderSlice'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import useNotification from '@components/sidebar/hooks/useNotification'

const useToValidateTokenAndServer = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const access = useSelector((state: RootState) => state.auth.accessToken)
  const refresh = useSelector((state: RootState) => state.auth.refreshToken)
  const [serverAvailiblity, setServerAvailability] = useState(false)
  const [accessTokenValid, setAccessTokenValid] = useState(false)

  const { handleOnClickForNotifications } = useNotification()

  const checkServerAvailability = async () => {
    try {
      dispatch(setLoader({ state: true, message: null }))
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
      }
      const response = await axios.get(
        `${window.base_url}/check_server_avaibility`,
        { headers: headers },
      )
      if (response) {
        setServerAvailability(serverAvailiblity)
        if (access) {
          // call the token availablity api
          checkTokenAuthenticity(access)
        } else {
          dispatch(setLoader({ state: false, message: null }))
          navigate('/login')
        }
      }
    } catch (error: any) {
      dispatch(setLoader({ state: false, message: null }))
      navigate('/502')
    }
  }

  const checkTokenAuthenticity = async (access: string) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${access}`,
      }

      const response = await axios.get(
        `${window.base_url}/check_token_authenticity`,
        { headers: headers },
      )
      if (response.data.data.isAuthenticated === true) {
        const decode: DecodedToken = jwtDecode<DecodedToken>(access)
        dispatch(setUserProfile(decode))
        dispatch(setLoader({ state: false, message: null }))
        setAccessTokenValid(true)
        handleOnClickForNotifications()
      }
    } catch (error: any) {
      dispatch(setLoader({ state: false, message: null }))
      if (error?.response?.data?.code === 'user_not_found') {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('callbackUrl')
        localStorage.removeItem('fromApp')
        localStorage.removeItem('persist:root')
        localStorage.clear()
        // clear redux state
        dispatch(setClassRoomList([]))
        dispatch(setAuth({ access: '', refresh: '', isAuth: false }))
        // redirect to login page
        return navigate('/login')
      }
      if (refresh) {
        expireToken(refresh)
      } else {
        navigate('/login')
      }
    }
  }
  const expireToken = async (refresh: string) => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
      }
      const response = await axios.post(
        `${window.base_url}/auth/api/token/refresh/`,
        {
          refresh: refresh,
        },
        { headers: header },
      )

      if (response) {
        const token: { access: string; refresh: string; isAuth: boolean } = {
          ...response.data,
          isAuth: true,
        }
        if (token.access && token.refresh) {
          localStorage.setItem('accessToken', token.access)
          localStorage.setItem('refreshToken', token.refresh)
          const decoded: DecodedToken = jwtDecode<DecodedToken>(token.access)
          dispatch(setUserProfile(decoded))
          dispatch(setAuth(token))
          setAccessTokenValid(true)
        } else {
          navigate('/login')
        }
      }
    } catch (error: any) {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      const token = {
        access: null,
        refresh: null,
        isAuth: false,
      }
      dispatch(setAuth(token))
      navigate('/login')
    }
  }

  return {
    accessTokenValid,
    access,
    checkServerAvailability,
    checkTokenAuthenticity,
  }
}

export default useToValidateTokenAndServer
