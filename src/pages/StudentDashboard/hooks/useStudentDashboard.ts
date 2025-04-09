import { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

const useStudentDashboard = () => {
  const [permission_state, set_permission_state] = useState(false)
  const [lectureDetails, setLectureDetails] = useState<any>([])
  const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API

  const get_location_permission = () => {
    // if(!permission_state){
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        set_permission_state(true)
      } else if (result.state === 'prompt') {
        navigator.geolocation.getCurrentPosition(() => {
          set_permission_state(true)
        })
      } else if (result.state === 'denied') {
        navigator.geolocation.getCurrentPosition(() => {
          set_permission_state(true)
        })
      }
      result.addEventListener('change', () => {
        if (result.state === 'granted') {
          set_permission_state(true)
        } else if (result.state === 'prompt') {
          set_permission_state(false)
        } else if (result.state === 'denied') {
          set_permission_state(false)
        }
      })
    })
    // }
  }
  const getLectureDetails = async () => {
    try {
      if (!permission_state) {
        return toast.error('Please allow the location permission!')
      }
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_timetable_for_student`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
      )

      if (response_obj.error === false) {
        const response = get(response_obj, 'response.data.data', [])
        setLectureDetails(response)
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  const mark_attendance = async (
    btn: any,
    lecture_slug: string,
    session_id: string,
  ) => {
    btn.disabled = true
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.')
      return
    }
    try {
      navigator.geolocation.getCurrentPosition(
        async (positions) => {
          const latitude = positions.coords.latitude
          const longitude = positions.coords.longitude
          const headers = {
            'Content-Type': 'application/json',
            'ngrok-skip-browser-warning': true,
          }
          const axiosInstance = axios.create()
          const response_obj = await CallAPI(
            StoredTokens,
            axiosInstance,
            '/manage/session/mark_attendance_for_student/',
            'post',
            headers,
            {
              lecture_slug: lecture_slug,
              latitude: latitude,
              longitude: longitude,
            },
            null,
          )
          if (response_obj.error === false) {
            const response = get(response_obj, 'response.data.data', [])
            const code = get(response_obj, 'response.data.code', [])
            if (response) {
              if (code === 100) {
                btn.disabled = true
                btn.classList.add('btn-outline-secondary')
                const manualBtn = document.getElementById(
                  `${lecture_slug}${session_id}`,
                ) as HTMLButtonElement
                manualBtn.disabled = true

                const presentBadge = document.getElementById(
                  `badge_${lecture_slug}${session_id}`,
                ) as HTMLElement
                presentBadge.classList.remove('hidden')
              } else {
                btn.disabled = false
              }

              toast.success('Attendance Marked successfully!')
            }
          } else {
            toast.error(response_obj.errorMessage?.message)
            btn.disabled = false
          }
        },
        (error) => {
          toast.error(error.message)
          return
        },
        { enableHighAccuracy: true, maximumAge: 0 },
      )
    } catch (error) {
      btn.disabled = false
      toast.error(
        'Location services are not available, Please enable it from you browser',
      )
    }
  }

  const handleManualMarking = async (btn: any, lecture_slug: string,session_id:string) => {
    try {
      const regulization_commet: string | null = prompt('Enter the comment')
      if (!regulization_commet) {
        return
      }

      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/session/mark_for_regulization/`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
        {
          lecture_slug,
          regulization_commet,
        },
      )

      if (response_obj.error === false) {
        const response = get(response_obj, 'response.data.code', [])
        toast.success('Your request to mark manually has been sent.')
        if (response === 100) {
          btn.disabled = true
          btn.classList.add('btn-outline-secondary')
          const markBtn = document.getElementById(
            `attendance_${lecture_slug}${session_id}`,
          ) as HTMLButtonElement
          markBtn.disabled = true
        }
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }
  return {
    get_location_permission,
    permission_state,
    getLectureDetails,
    lectureDetails,
    mark_attendance,
    handleManualMarking,
  }
}
export default useStudentDashboard
