import { useState } from 'react'

import axios from 'axios'
import { get, merge } from 'lodash'
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
  const [classRooms, setClassRooms] = useState<any>([])
  const [open, setOpen] = useState(false)
  const [lectureDetails, setLectureDetails] = useState<LectureDetails[]>([])
  const [classRoomData, setClassRoomData] = useState<any | null>(null)

  const clientSocketHandler = (session_id: string, auth_token: string) => {
    const newSocket = io('http://localhost:3000/client', {
      withCredentials: true,
      transports: ['websocket'],
    })
    setSocket(newSocket)
    newSocket.on('connect', () => {
      setIsSheetOpen(true)
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
      toast.success('Attendance Marked Successfully')
      setStudents((prev: any) => [...prev, ...message.data.data.data])
      setManualAttendance([])
    })

    newSocket.on('client_error', (message) => {
      socketErrorHandler(message)
    })

    newSocket.on('disconnect', () => {
      setSocket(null)
      setIsSheetOpen(false)
    })

    newSocket.on('session_ended', (message: any) => {
      setIsSessionEnded(true)

      const { data } = message
      setFinalAttendanceData(data.data.data.marked_attendances)
      setSessionData((prevData: any) => ({
        ...prevData,
        [message.data.data.data.session_id]: message.data.data.data.active,
      }))
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
        let classRoomList = {}
        const data = response.map((branch: any) => {
          const lecture_obj = {
            branch_name: branch.branch_name,
            branch_slug: branch.slug,
          }
          classRoomList = branch.classrooms
          const lecture_list: any = []
          branch?.streams[0]?.semesters?.map((semester: any) => {
            semester?.divisions?.map((division: any) => {
              if (division?.timetable?.schedule?.lectures?.length > 0) {
                division?.timetable?.schedule?.lectures?.map((lecture: any) => {
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
        setClassRooms(classRoomList)
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

  const handleClassroom = async (
    e: React.FormEvent<HTMLFormElement>,
    lectureSlug: any,
    classRoomSlug: string,
  ) => {
    e.preventDefault()

    const selectedValue = document.getElementById(
      `${lectureSlug}${classRoomSlug}`,
    ) as HTMLInputElement

    const selectElement = document.getElementById(
      `select-${lectureSlug}${classRoomSlug}`,
    ) as HTMLElement
    // Force updating the default value dynamically
    if (selectElement) {
      // Remove the element and re-add it to force React to re-render it
      selectElement.removeAttribute('data-state') // Reset select state
      selectElement.setAttribute('data-default-value', selectedValue?.value) // Set new default value
    }
    updateClassRoomHandler(lectureSlug, selectedValue?.value)
  }

  const updateClassRoomHandler = async (
    lectureSlug: any,
    classRoom_slug: any,
  ) => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/session/get_classroom_allocations`
      const params = {
        lecture_slug: lectureSlug,
        classroom_slug: classRoom_slug,
      }
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
        null,
        params,
      )

      if (response_obj.error === false) {
        const response = get(
          response_obj,
          'response.data.data.associated_lecture',
          null,
        )
        const responseData = {
          lecture_slug: lectureSlug,
          classroom_slug: classRoom_slug,
          details: response,
        }
        setClassRoomData(responseData)
        setOpen(true)
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  const changeClassRoomAPI = async (
    mergeStatus: boolean,
    lecture_slug: any,
    classroom_slug: any,
  ) => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/session/set_classroom_dynamic/`
      const body = {
        lecture_slug: lecture_slug,
        classroom_slug: classroom_slug,
        merge: mergeStatus,
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
        const response = get(response_obj, 'response.data.data', [])
        const data = response.map((branch: any) => {
          const lecture_obj = {
            branch_name: branch.branch_name,
            branch_slug: branch.slug,
          }
          const lecture_list: any = []
          branch?.streams[0]?.semesters?.map((semester: any) => {
            semester?.divisions?.map((division: any) => {
              if (division?.timetable?.schedule?.lectures?.length > 0) {
                division?.timetable?.schedule?.lectures?.map((lecture: any) => {
                  lecture_list.push({
                    ...lecture,
                    division_name: division.division_name,
                    semester: semester.no,
                    schedule: division.timetable.schedule.day,
                  })
                })
              }
            })
          })

          return { ...lecture_obj, lectures: lecture_list }
        })

        setLectureDetails(data)
        setOpen(false)
        toast.success('Your classroom has been changed successfully')
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  //function:: to download the teacher to subject map
  const handleOnClickForDownloadExcelForAttendance = async (
    session_id: string,
  ) => {
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/session/get_session_data_for_export/${session_id}`
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }

      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
      )
      if (response_obj.error === false) {
        const response = get(response_obj, 'response.data', [])
        const url = window.URL.createObjectURL(new Blob([response]))
        const a = document.createElement('a')
        a.href = url
        a.download = 'session_data.csv'
        document.body.appendChild(a)
        a.click()
        a.remove()
        // downloadExcelFile(
        //   response_obj.response?.data?.data?.file_content,
        //   response_obj.response?.data?.data?.file_name,
        // )
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  const downloadExcelFile = (base64String: string, filename: string) => {
    // Decode base64 string into binary
    const byteCharacters = atob(base64String) // decode base64 to raw binary
    const byteArrays = []

    // Convert the binary string into a byte array
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      byteArrays.push(new Uint8Array(byteNumbers))
    }

    // Create a Blob from the byte array
    const blob = new Blob(byteArrays, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    // Create an anchor element for download
    // Create an anchor element for download
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename // Specify the file name
    document.body.appendChild(link)

    // Trigger the click event to download
    link.click()

    // Clean up by removing the link element
    document.body.removeChild(link)
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
    handleClassroom,
    classRooms,
    setOpen,
    open,
    updateClassRoomHandler,
    setClassRoomData,
    classRoomData,
    changeClassRoomAPI,
    handleOnClickForDownloadExcelForAttendance,
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
