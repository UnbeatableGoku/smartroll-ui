import { useState } from 'react'

import { RootState } from '@data/redux/Store'
import { setAuth } from '@data/redux/slices/authSlice'
import { setClassRoomList } from '@data/redux/slices/classRoomsSlice'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

const useStackHolderProfile = () => {
  const [isEditing, setIsEditing] = useState(false)
  const profile = useSelector((state: RootState) => state.auth.userProfile)
  const [email, setEmail] = useState(profile?.obj.profile.email)
  const [StoredTokens, CallAPI] = useAPI()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  //function:: handle to update the email id of the profile
  const handleOnUpdateProfile = async () => {
    try {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (email && regex.test(email)) {
        const axiosInstance = axios.create()
        const method = 'post'
        const endpoint = '/auth/api/update_email/'
        const header = {
          'ngrok-skip-browser-warning': true,
          Authorization: `Bearer ${StoredTokens.accessToken}`,
        }
        const body = {
          email: email,
        }
        const response_obj = await CallAPI(
          StoredTokens,
          axiosInstance,
          endpoint,
          method,
          header,
          body,
        )
        if (response_obj.error === false) {
          toast.success('Email updated successfully')
          // setEmail(response_obj.response?.data.email)
          handelLogout()
        } else {
          if (response_obj.errorMessage?.statusCode === 403) {
            setEmail(profile?.obj.profile.email)
            return toast.error('Please try again after 24 hours')
          }
          toast.error(response_obj.errorMessage?.message)
        }
      } else {
        toast.error('Please enter a valid email address')
        setEmail(profile?.obj.profile.email)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
      setEmail(profile?.obj.profile.email)
    }
  }

  const handelLogout = () => {
    //clear local storage
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('callbackUrl')
    localStorage.removeItem('fromApp')
    localStorage.removeItem('persist:root')
    localStorage.clear()
    // clear redux state
    dispatch(setClassRoomList({ isalreadyLoaded: false, classes: [] }))
    dispatch(setAuth({ access: '', refresh: '', isAuth: false }))
    // redirect to login page
    navigate('/login')
  }
  return {
    isEditing,
    email,
    profile,
    setIsEditing,
    setEmail,
    handleOnUpdateProfile,
    handelLogout,
  }
}

export default useStackHolderProfile
