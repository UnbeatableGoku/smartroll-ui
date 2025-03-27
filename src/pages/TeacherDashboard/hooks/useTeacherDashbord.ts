import { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { Socket, io } from 'socket.io-client'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { LectureDetails } from 'types/common'

export const useTeacherDashbord = () => {
  const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API
  const [socket, setSocket] = useState<Socket | null>(null)
  const [students, setStudents] = useState<any>([])
  const [sessionData, setSessionData] = useState<any>()
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [onGoingSessionData, setOngoingSessionData] = useState<any>(null)
  const [manualAttendance, setManualAttendance] = useState<any>([])
  const [isSessionEnded, setIsSessionEnded] = useState(false)
  const [finalAttendanceData, setFinalAttendanceData] = useState<any>([])

  const [lectureDetails, setLectureDetails] = useState<LectureDetails[]>([])

  const clientSocketHandler = (session_id: string, auth_token: string) => {
    const newSocket = io('http://localhost:3000/client', {
      withCredentials: true,
      transports: ['websocket'],
    })
    setSocket(newSocket)
    newSocket.on('connect', () => {
      setIsSheetOpen(true)
      console.log('connection established with server')
      newSocket.emit('socket_connection', {
        client: 'FE',
        session_id: session_id,
        auth_token: auth_token,
      })
    })

    newSocket.on('ongoing_session_data', (message) => {
      //todo: create the handler for this
      const { data } = message.data
      onGoingSessionDataHandler(data)
    })

    newSocket.on('mark_attendance', (attendanceData: any) => {
      const { attendance_data } = attendanceData.data.data

      if (attendance_data) {
        setStudents((prev: any) => [attendance_data, ...prev])
      }
    })

    newSocket.on('regulization_request', (manualAttendanceData: any) => {
      setManualAttendance((prev: any) => [
        manualAttendanceData.data.data.data.attendance_data,
        ...prev,
      ])
    })

    newSocket.on('regulization_approved', (message) => {
      toast.success('attendance marked')
      setStudents((prev: any) => [...prev, ...message.data.data.data])
      setManualAttendance([])
    })

    newSocket.on('client_error', (message) => {
      socketErrorHandler(message)
    })

    newSocket.on('disconnect', () => {
      // setSocket(null)
    })

    newSocket.on('session_ended', (message: any) => {
      setIsSessionEnded(true)

      const { data } = message
      setFinalAttendanceData(data.data.data.marked_attendances)
      setSessionData((prevData: any) => ({
        ...prevData,
        [onGoingSessionData.session_id]: 'post',
      }))

      //todo: list of the all the students
      //todo: set the download excel button
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

    setOngoingSessionData(data)
    const { marked_attendances, pending_regulization_requests } = data
    setManualAttendance(pending_regulization_requests)
    setStudents(marked_attendances)
  }

  const socketErrorHandler = (message: any) => {
    const { status_code, data } = message
    toast.error(`${status_code} - ${data}`)
    socket?.disconnect()
    setIsSheetOpen(false)
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

  const handleOnSessionEnd = () => {
    try {
      if (!confirm('Are you sure you want to end this session.. ?')) {
        return
      }
      const requestObject = {
        client: 'FE',
        session_id: onGoingSessionData.session_id,
        auth_token: StoredTokens?.accessToken?.replace('Bearer ', '') as string,
      }
      socket?.emit('session_ended', requestObject)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const removeStudentAttendanceRequest = (student_enrollment: string) => {
    try {
      if (!confirm('Are you sure you want to reject the attendance request?')) {
        return
      }
      setManualAttendance((prev: any) => {
        return prev.filter(
          (item: any) => item.student.enrollment !== student_enrollment,
        )
      })
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const markManualStudentsAttendance = () => {
    try {
      const attendance_slug = manualAttendance.map((item: any) => item.slug)
      const payload = {
        client: 'FE',
        session_id: onGoingSessionData.session_id,
        data: attendance_slug,
        auth_token: StoredTokens.accessToken?.replace('Bearer ', ''),
      }
      socket?.emit('regulization_request', payload)
    } catch (error: any) {
      toast.error(error.message)
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
    manualAttendance,
    removeStudentAttendanceRequest,
    markManualStudentsAttendance,
    finalAttendanceData,
    isSessionEnded,
    handleOnSessionEnd,
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
