import React from 'react'

import { RootState } from '@data/Store'
import {
  setSeenNotifications,
  setUnSeenNotifications,
} from '@data/slices/notificationSlice'
import axios from 'axios'
import { get } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { DecodedToken } from 'types/common'

interface Notification {
  slug: string
  status: string
  type: string
  message: string
}

const useNotification = () => {
  const dispatch = useDispatch()
  const { seenNotifications, unSeenNotifications, notificationTypes } =
    useSelector((state: RootState) => state.notification)
  const profile: DecodedToken | null = useSelector(
    (state: RootState) => state.auth.userProfile,
  )

  const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API
  //   const [seenNotifications, setSeenNotifications] = useState<
  //     Array<Notification>
  //   >([])
  //   const [unSeenNotifications, setUnSeenNotifications] = useState<
  //     Array<Notification>
  //   >([])

  const replaceLink = (message: string, messageType: string) => {
    if (!message) return message
    // Check if the string contains 'belective_sub_link'
    if (message.includes('subject_choice_url')) {
      const parts = message.split('subject_choice_url')

      const role = profile?.obj.profile.role
      const notificationType = notificationTypes.find(
        (notificationType: any) =>
          notificationType.type === messageType &&
          notificationType.role === role,
      )
      return parts.map((part, index) => (
        <React.Fragment key={index}>
          {part}
          {index < parts.length - 1 && (
            <Link
              to={`${notificationType?.url}`}
              className="text-blue-700 underline"
            >
              Click Here.
            </Link>
          )}
        </React.Fragment>
      ))
    }

    // If 'belective_sub_link' is not found, just return the original string
    return message
  }

  //function :: to get the notification
  const handleOnClickForNotifications = async () => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/alerts/get_alerts`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
      )
      if (response_obj.error == false) {
        const check = get(response_obj, 'response.data.data', [])
        if (check) {
          const seenNotifications_lst = check.filter(
            (notification: Notification) => notification.status === 'seen',
          )
          const unSeenNotifications_lst = check.filter(
            (notification: Notification) => notification.status === 'unseen',
          )
          dispatch(setSeenNotifications(seenNotifications_lst))
          dispatch(setUnSeenNotifications(unSeenNotifications_lst))
        }
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error) {
      toast.error('Failed to fetch notifications')
    }
  }
  //function:: mark all the notifications as read
  const handleOnClickForMarkNotifications = async () => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/alerts/mark_all_as_read/`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
      )
      if (response_obj.error == false) {
        const check = get(response_obj, 'response.data.data', [])
        if (check) {
          const seenNotifications_lst = check.filter(
            (notification: Notification) => notification.status === 'seen',
          )
          const unseenNotifications_lst = check.filter(
            (notification: Notification) => notification.status === 'unseen',
          )
          dispatch(setSeenNotifications(seenNotifications_lst))
          dispatch(setUnSeenNotifications(unseenNotifications_lst))
        } else {
          dispatch(setSeenNotifications([]))
          dispatch(setUnSeenNotifications([]))
        }
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error) {
      toast.error('Failed to fetch notifications')
    }
  }
  return {
    unSeenNotifications,
    seenNotifications,
    handleOnClickForNotifications,
    handleOnClickForMarkNotifications,
    replaceLink,
  }
}

export default useNotification
