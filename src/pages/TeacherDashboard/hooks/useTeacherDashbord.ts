import { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { Socket, io } from 'socket.io-client'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { LectureDetails, StudentData } from 'types/common'

export const useTeacherDashbord = () => {
  const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API
  const [socket, setSocket] = useState<Socket | null>(null)
  const [students, setStudents] = useState<StudentData[]>([])
  const [sessionData, setSessionData] = useState<any>()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [onGoingSessionData, setOngoingSessionData] = useState<any[]>([])

  const [lectureDetails, setLectureDetails] = useState<LectureDetails[]>([])

  const clientSocketHandler = (session_id: string, auth_token: string) => {
    const newSocket = io(
      'https://fingers-assign-warner-genetic.trycloudflare.com/client',
      {
        query: { session_id: session_id },
        auth: {
          token: auth_token,
        },
        withCredentials: true,
        transports: ['websocket'],
      },
    )
    setSocket(newSocket)
    newSocket.on('connect', () => {
      setIsSheetOpen(true)
      console.log('connection established with server')
      newSocket.emit('socket_connection', {
        client: 'FE',
        data: 'connection establish',
      })
    })

    newSocket.on('ongoing_session_data', (message) => {
      //todo: create the handler for this
      const { data } = message.data
      onGoingSessionDataHandler(data)
    })

    newSocket.on('session_data', (studentData) => {
      //todo: create the handler for this
      const { data } = studentData

      // setStudents((prev) => [...prev, data])
    })

    newSocket.on('client_error', (message) => {
      socketErrorHandler(message)
      if (message.status_code === 401) {
        newSocket.disconnect()
        setIsSheetOpen(false)
      }
    })
  }

  const startSessionHandler = async (
    session_id: string,
    lecture_slug: string,
  ) => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/session/create_lecture_session/`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
        { lecture_slug: lecture_slug },
      )

      if (response_obj.error === false) {
        const { data } = response_obj?.response?.data

        setSessionData((prevData: any) => ({
          ...prevData,
          [data.session_id]: data.active,
        }))
        if (data.active === 'ongoing') {
          clientSocketHandler(
            session_id,
            StoredTokens?.accessToken?.replace('Bearer ', '') as string,
          )
        }
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }
  const onGoingSessionDataHandler = (message: any) => {
    const { event, client, status_code, data } = message
    console.log('🚀 ~ onGoingSessionDataHandler ~ data:', data)

    setOngoingSessionData(data)
    const { marked_attendances } = data
    if (marked_attendances.length > 0) {
      setStudents((prev) => ({ ...prev, marked_attendances }))
    }
  }

  const socketErrorHandler = (message: any) => {
    const { event, client, status_code, data } = message
    toast.error(`${event} - ${data}`)
  }
  const getLectureDetails = async () => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_timetable_for_teacher`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
      )

      if (response_obj.error === false) {
        const response = get(response_obj, 'response.data.data', [])

        const data = response.map((branch: any) => {
          const lecture_obj = {
            branch_name: branch.branch_name,
            branch_slug: branch.slug,
          }
          const lecture_list: any = []
          branch.streams[0]?.semesters?.map((semester: any) => {
            semester.divisions.map((division: any) => {
              if (division.timetable.schedule.lectures.length > 0) {
                division.timetable.schedule.lectures.map((lecture: any) => {
                  lecture_list.push({
                    ...lecture,
                    division_name: division.division_name,
                    semester: semester.no,
                    schedule: division.timetable.schedule.day,
                  })
                })
              } else {
              }
            })
          })

          return { ...lecture_obj, lectures: lecture_list }
        })
        const lectureStatusData = extractLectureStatusData(data)
        setSessionData(lectureStatusData)
        setLectureDetails(data)
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  return {
    getLectureDetails,
    startSessionHandler,
    students,
    lectureDetails,
    sessionData,
    isSheetOpen,
    setIsSheetOpen,
    socket,
    onGoingSessionData,
  }
}
function extractLectureStatusData(data: any) {
  const lectureStatusMap: Record<string, string> = {}

  data.forEach((lecture: any) => {
    lecture.lectures.forEach((l: any) => {
      if (l.slug && l.session && l.session.active) {
        lectureStatusMap[l.session.session_id] = l.session.active
      }
    })
  })
  return lectureStatusMap
}
