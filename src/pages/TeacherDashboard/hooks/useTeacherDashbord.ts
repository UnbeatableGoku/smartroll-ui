import { useEffect, useState } from 'react'

import { RootState } from '@data/redux/Store'
import { setClassRoomList } from '@data/redux/slices/classRoomsSlice'
import { setLoader } from '@data/redux/slices/loaderSlice'
import axios from 'axios'
import { get } from 'lodash'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Socket, io } from 'socket.io-client'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { createWavBlob } from '@utils/helpers/recorder_process'

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
  const [classRooms] = useState<any>([])
  const [open, setOpen] = useState(false)
  const [lectureDetails, setLectureDetails] = useState<LectureDetails[]>([])
  const [classRoomData, setClassRoomData] = useState<any | null>(null)
  const [date, setDate] = useState<any>(getWeekDates())
  const [stopStreamFunction, setStopStreamFunction] = useState<any>(null) // To hold the stop function

  //days list
  const days = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
  ]
  const [dayList] = useState(days)
  const [currentDay, setCurrentDay] = useState<string>('')

  const dispatch = useDispatch()
  // do some changes

  const { isalreadyLoaded, classes } = useSelector(
    (state: RootState) => state.classRoomSlice,
  )
  const [classesList, setClasses] = useState<any>(classes)
  useEffect(() => {
    if (!isalreadyLoaded) {
      // call the classroom load data
      loadClassRooms()
    }
  }, [isalreadyLoaded, dispatch])

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
      if (response_obj.error === false) {
        const response = get(response_obj, 'response.data.data', [])
        setClasses(response)
        const payload = {
          isalreadyLoaded: true,
          classes: response,
        }
        dispatch(setClassRoomList(payload))
      }
    } catch (error: any) {
      toast.error(error.message || 'something went wrong')
    }
  }
  const clientSocketHandler = (session_id: string, auth_token: string) => {
    const newSocket = io(`${window.socket_url}/client`, {
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

    newSocket.on('ongoing_session_data', async (message) => {
      //todo: create the handler for this
      const { data } = message.data
      onGoingSessionDataHandler(data)
      const stopFunction = await startTeacherStreaming(
        newSocket,
        session_id,
        StoredTokens?.accessToken?.replace('Bearer ', '') as string,
      )
      setStopStreamFunction(() => stopFunction) // Store the stop function
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
      if (stopStreamFunction) {
        stopStreamFunction() // Call the function to stop streaming
        console.log('Session ended')
        setStopStreamFunction(null)
      }
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

    if (stopStreamFunction) {
      stopStreamFunction() // Call the function to stop streaming
      console.log('Session ended')
      setStopStreamFunction(null)
    }
  }

  const startSessionHandler = async (
    session_id: string,
    lecture_slug: string,
    classroomSlug: string,
    // session_status: string,
  ) => {
    const selectedClassRoom = document.getElementById(
      `select-${lecture_slug}${classroomSlug}`,
    ) as HTMLSelectElement
    try {
      dispatch(
        setLoader({
          state: true,
          message: 'Starting the session. Please do not refresh the page!',
        }),
      )

      const formData = new FormData()
      formData.append('lecture_slug', lecture_slug)
      formData.append('classroom_slug', selectedClassRoom.value)
      // if (session_status === 'ongoing') {
      //   const stopFunction = await startTeacherStreaming(
      //     socket,
      //     session_id,
      //     StoredTokens?.accessToken?.replace('Bearer ', '') as string,
      //   )
      //   setStopStreamFunction(() => stopFunction) // Store the stop function
      // }
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
        formData,
      )

      if (response_obj.error === false) {
        const { data } = response_obj?.response?.data

        setSessionData((prevData: any) => ({
          ...prevData,
          [data.session_id]: data.active,
        }))
        const updatedLectureDetails = lectureDetails.map((branch: any) => {
          return {
            ...branch,
            lectures: branch.lectures.map((lecture: any) => {
              if (lecture.session.session_id === data.session_id) {
                return data.lecture
              } else {
                return lecture
              }
            }),
          }
        })
        setLectureDetails(updatedLectureDetails)

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
    const { data } = message

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
  const getLectureDetails = async (day: string = 'current') => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_timetable_for_teacher/${day}`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
      )

      if (response_obj.error === false) {
        const response = get(response_obj, 'response.data.data', [])
        const day = get(response_obj, 'response.data.day', '')
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
              } else {
              }
            })
          })

          return { ...lecture_obj, lectures: lecture_list }
        })
        const lectureStatusData = extractLectureStatusData(data)
        setSessionData(lectureStatusData)
        setLectureDetails(data)
        setDate((prev: any) =>
          prev.map((d: any) => {
            if (d.longDay === day) {
              return { ...d, isActive: true }
            } else {
              return { ...d, isActive: false }
            }
          }),
        )
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
    lectureSlug: any,
    classRoomSlug: string,
    finalClassRoomSlug: string,
  ) => {
    // Get the input element
    document.getElementById(
      `${lectureSlug}${classRoomSlug}`,
    ) as HTMLInputElement

    const selectElement = document.getElementById(
      `select-${lectureSlug}${finalClassRoomSlug}`,
    ) as HTMLSelectElement
    // Force updating the default value dynamically
    selectElement.value = classRoomSlug
    classRoomDetailsAPI(lectureSlug, classRoomSlug, finalClassRoomSlug)
  }

  const classRoomDetailsAPI = async (
    lectureSlug: any,
    classRoom_slug: any,
    finalClassRoomSlug: string,
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
        const response = get(response_obj, 'response.data.data', null)
        const messageDiv = document.getElementById(
          `class_message-${lectureSlug}${finalClassRoomSlug}`,
        ) as HTMLDivElement
        if (!response.associated_lecture) {
          return messageDiv.classList.add('hidden')
        }
        messageDiv.innerHTML = `${response.associated_lecture.teacher} already has a lecture in selected class`
        messageDiv.classList.remove('hidden')
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
    setClassRoomData,
    classRoomData,
    changeClassRoomAPI,
    handleOnClickForDownloadExcelForAttendance,
    dayList,
    currentDay,
    setCurrentDay,
    date,
    classesList,
    stopStreamFunction,
    setStopStreamFunction,
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

function getWeekDates() {
  const today = new Date()
  const currentDay = today.getDay()
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay

  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)

  const result = []

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)

    const longDay = d
      .toLocaleString('en-US', { weekday: 'long' })
      .toLocaleLowerCase()
    const shortDay = d
      .toLocaleString('en-US', { weekday: 'short' })
      .toUpperCase()
    const day = String(d.getDate()).padStart(2, '0')
    const month = d.toLocaleString('en-US', { month: 'short' }).toUpperCase()

    result.push({ longDay, shortDay, day, month, isActive: false })
  }

  return result
}

const startTeacherStreaming = async (
  socket: any,
  session_id: string,
  auth_token: string,
) => {
  const audioContext = new AudioContext()
  const sampleRate = audioContext.sampleRate
  const chunkDuration = 1000 // 1 second
  const startTime = Date.now() // Record start time
  let chunkIndex = 0

  await audioContext.audioWorklet.addModule('recorder-processor.js')

  const mic = await navigator.mediaDevices.getUserMedia({ audio: true })
  const source = audioContext.createMediaStreamSource(mic)

  const recorderNode = new AudioWorkletNode(
    audioContext,
    'recorder-processor',
    {
      processorOptions: {
        duration: chunkDuration / 1000,
      },
    },
  )

  source.connect(recorderNode)
  recorderNode.connect(audioContext.destination)

  let stopStream = false

  recorderNode.port.onmessage = (event) => {
    const chunk = event.data[0] // Float32Array
    const wavBlob = createWavBlob(chunk, sampleRate)

    const timestamp = startTime + chunkIndex * chunkDuration
    chunkIndex++

    if (!stopStream) {
      console.log('object')
      socket.emit('incoming_audio_chunks', {
        client: 'FE',
        session_id,
        auth_token,
        blob: wavBlob,
        timestamp,
      })
    }
  }

  return async () => {
    stopStream = true
    recorderNode.disconnect()
    source.disconnect()
    await audioContext.close()
  }
}
