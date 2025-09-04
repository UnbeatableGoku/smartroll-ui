import { useState } from 'react'

import { RootState } from '@data/redux/Store'
import { setAuth, setUserProfile } from '@data/redux/slices/authSlice'
import { setClassRoomList } from '@data/redux/slices/classRoomsSlice'
import { setLoader } from '@data/redux/slices/loaderSlice'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { get } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { DecodedToken } from 'types/common'

import useNotification from '@components/sidebar/hooks/useNotification'

const useToValidateTokenAndServer = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const access = useSelector((state: RootState) => state.auth.accessToken)
  const refresh = useSelector((state: RootState) => state.auth.refreshToken)
  const [serverAvailiblity, setServerAvailability] = useState(false)
  const [accessTokenValid, setAccessTokenValid] = useState(false)
  const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API

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
        await loadClassRooms()
        const decode: DecodedToken = jwtDecode<DecodedToken>(access)
        dispatch(setUserProfile(decode))
        dispatch(setLoader({ state: false, message: null }))
        setAccessTokenValid(true)
        handleOnClickForNotifications()
      }
    } catch (error: any) {
      dispatch(setLoader({ state: false, message: null }))
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

  /**
   * @link /manage/get_classrooms_for_teacher
   * @returns list of the classes
   */
  const loadClassRooms = async () => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_classrooms_for_teacher`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
      )
      if (response_obj.error !== false) {
        toast.error(response_obj.errorMessage?.message)
      }
      const response = get(response_obj, 'response.data.data', [])
      console.log(response)
      dispatch(setClassRoomList(response))
    } catch (error: any) {
      toast.error(error.message || 'something went wrong')
      return {
        classes: [],
      }
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
