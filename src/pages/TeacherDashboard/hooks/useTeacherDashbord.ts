import { useEffect, useRef, useState } from 'react'

import TeacherDashboardUtilites from '../utilites/teacherDashboard.utility'
import Store, { RootState } from '@data/redux/Store'
import { setClassRoomList } from '@data/redux/slices/classRoomsSlice'
import {
  setLoader,
  setReconnectionLoader,
} from '@data/redux/slices/loaderSlice'
import axios from 'axios'
import { get } from 'lodash'
import { useSelector } from 'react-redux'
import { useDispatch } from 'react-redux'
import { Socket, io } from 'socket.io-client'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { LectureDetails } from 'types/common'

export const useTeacherDashbord = () => {
  const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API
  const dispatch = useDispatch()
  const {
    loadClassRooms,
    extractLectureStatusData,
    getWeekDates,
    checkAndReturnMicPermission,
    startTeacherStreaming,
    playWaveSoundFrequency,
  } = TeacherDashboardUtilites()
  const [socket, setSocket] = useState<Socket | null>(null)
  const [students, setStudents] = useState<any>([])
  const [redStudents, setRedStudents] = useState<any>([])
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
  const [stopStreamFunction, setStopStreamFunction] = useState<any>(null)
  const [stopWaveFrequency, setStopWaveFrequency] = useState<
    (() => Promise<void>) | null
  >(null)
  const [_, setIsNetworkTooSlow] = useState(false)
  const [isHistorySheetOpen, setIsHistorySheetOpen] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [showCustomLoader, setShowCustomLoader] = useState(false)
  const [sessionSetupStarted, setSessionSetupStarted] = useState(false)
  const pendingSessionDataRef = useRef<any>(null)
  const calendarContainerRef = useRef<HTMLDivElement>(null)
  const activeDateRef = useRef<HTMLDivElement>(null) // To hold the stop function
  const isNetworkTooSlowRef = useRef(false)

  const { isalreadyLoaded, classes } = useSelector(
    (state: RootState) => state.classRoomSlice,
  )

  const [classesList, setClasses] = useState<any>(classes)

  useEffect(() => {
    return () => {
      if (stopStreamFunction) {
        ;(async () => {
          await stopStreamFunction()
          setStopStreamFunction(null)
        })()
      }
    }
  }, [stopStreamFunction])

  useEffect(() => {
    setSocket(null)

    const loadData = async () => {
      if (!isalreadyLoaded) {
        const payload = await loadClassRooms()
        setClasses(payload.classes)
        dispatch(setClassRoomList(payload))
        // you can now use payload if needed
      }
    }

    loadData() // call the inner async function
  }, [isalreadyLoaded, dispatch])

  const clientSocketHandler = async (
    session_id: string,
    auth_token: string,
    mic: any,
    stopWaveFrq: any,
  ) => {
    let mic1 = mic
    try {
      const newSocket = io(`${window.socket_url}/client`, {
        withCredentials: true,
        transports: ['websocket'],
        reconnectionAttempts: Infinity, // unlimited attempts
        reconnectionDelay: 1000, // delay between attempts (ms)
        reconnectionDelayMax: 5000,
      })
      newSocket.on('connect', () => {
        setSocket(newSocket)
        newSocket.emit('socket_connection', {
          client: 'FE',
          session_id: session_id,
          auth_token: auth_token,
          isReConnect: Store.getState().loader.RECONNECTION_LOADER_STAT,
        })
      })

      newSocket.io.on('reconnect_attempt', () => {
        dispatch(setReconnectionLoader({ state: true }))
      })

      newSocket.io.on('reconnect', () => {
        console.log('Reconnected!')
      })

      newSocket.on('ongoing_session_data', async (message) => {
        const { data } = message.data
        if (!data) {
          throw new Error('Session data is missing')
        }

        // Open the panel immediately for better UX
        onGoingSessionDataHandler(data)
        setIsSheetOpen(true)

        // Handle async operations in the background
        if (!isNetworkTooSlowRef.current) {
          try {
            mic1 = await checkAndReturnMicPermission()
            const stopFunction = await startTeacherStreaming(
              newSocket,
              session_id,
              StoredTokens?.accessToken?.replace('Bearer ', '') as string,
              mic1,
            )
            setStopStreamFunction(() => stopFunction) // Store the stop function
          } catch (error) {
            console.error('Error in background operations:', error)
          }
        }

        dispatch(setReconnectionLoader({ state: false }))
        const networkResponse = {
          session_id,
          auth_token,
          is_network_too_slow: isNetworkTooSlowRef.current,
        }
        newSocket?.emit('network_too_slow', networkResponse)
      })

      newSocket.on('mark_attendance', (attendanceData: any) => {
        const { attendance_data } = attendanceData.data.data

        if (attendance_data) {
          if (attendance_data.chirp_detected) {
            setStudents((prev: any) => [attendance_data, ...prev])
          } else {
            setRedStudents((prev: any) => [attendance_data, ...prev])
          }
        }
      })

      newSocket?.on('update_attendance', (data: any) => {
        // const {data, message, status} = message?.data?.data'
        const { status_code, attendance_slug, message } = data
        if (status_code === 200) {
          setStudents((prev: any) =>
            prev.filter((student: any) => student.slug !== attendance_slug),
          )
          setRedStudents((prev: any) =>
            prev.filter((student: any) => student.slug !== attendance_slug),
          )
          dispatch(setLoader({ state: false, message: null }))
          toast.success(message)
        } else {
          toast.error(message)
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
        setStudents((prev: any) => [...prev, ...message?.data?.data?.data])
        setManualAttendance([])
      })

      newSocket.on('client_error', async (message) => {
        if (stopWaveFrq && typeof stopWaveFrq === 'function') {
          await stopWaveFrq()
        }
        mic.getTracks().forEach((track: any) => track.stop())
        socketErrorHandler(message)
      })

      newSocket.on('error', () => {
        console.log('error')
      })

      newSocket.on('disconnect', async (reason) => {
        if (stopStreamFunction) {
          await stopStreamFunction() // Call the function to stop streaming
        }
        setStopStreamFunction(null)
        if (
          reason !== 'transport close' &&
          stopWaveFrq &&
          typeof stopWaveFrq === 'function'
        ) {
          await stopWaveFrq()
        }
        mic.getTracks().forEach((track: any) => track.stop())

        setSocket(null)
        if (reason === 'transport close') {
          // You can show a loader or attempt reconnection UI here
          dispatch(setReconnectionLoader({ state: true }))
          return
        }
        setIsSheetOpen(false)
      })

      newSocket.on('session_ended', async (message: any) => {
        setIsSessionEnded(true)
        const { data } = message
        setFinalAttendanceData(data.data.data.marked_attendances)
        setSessionData((prevData: any) => ({
          ...prevData,
          [message.data.data.data.session_id]: message.data.data.data.active,
        }))

        if (stopStreamFunction) {
          await stopStreamFunction() // Call the function to stop streaming
          setStopStreamFunction(null)
        }
      })

      newSocket.on('connect_error', (error) => {
        console.error('❌ Connection error:', error.message)
      })
    } catch (error: any) {
      // handle cleaer socket logic
      toast.error(error.message || 'Something went worng')
      if (socket) {
        socket.disconnect()
      }
      if (stopWaveFrequency) {
        await stopWaveFrequency()
      }
      setOngoingSessionData(null)
      setSocket(null)
    }
  }

  const startSessionHandler = async (
    session_id: string,
    lecture_slug: string,
    classroomSlug: string,
    sessionDay: string,
    // session_status: string,
  ) => {
    const selectedClassRoom = document.getElementById(
      `select-${lecture_slug}${classroomSlug}`,
    ) as HTMLSelectElement
    const mic = await checkAndReturnMicPermission()
    try {
      // Show loader while checking network speed
      dispatch(setLoader({ state: true, message: 'Starting the session...' }))
      //check the microphone permission
      const formData = new FormData()
      formData.append('lecture_slug', lecture_slug)
      formData.append('classroom_slug', selectedClassRoom.value)
      formData.append('day', sessionDay)
      // No network_speed here, unless you want to use speedMbps from playWaveSoundFrequency later
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
        const { audio_url } = data

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
          // Clean up any previous states first (synchronously)
          setShowCustomLoader(false)
          setSessionSetupStarted(false)
          pendingSessionDataRef.current = null

          // Store session data for early completion
          pendingSessionDataRef.current = {
            session_id,
            audio_url,
            mic,
            accessToken: StoredTokens?.accessToken?.replace(
              'Bearer ',
              '',
            ) as string,
          }

          // Show custom loader immediately
          setShowCustomLoader(true)

          // Wait for either early completion or 3 seconds with faster polling
          await new Promise((resolve) => {
            const checkInterval = setInterval(() => {
              // If session setup has started, exit early
              if (sessionSetupStarted) {
                console.log('🚀 Exiting early due to session setup completion')
                clearInterval(checkInterval)
                resolve(undefined)
              }
            }, 50) // Reduced from 100ms to 50ms for faster response

            // Fallback timeout after 3 seconds
            setTimeout(() => {
              console.log('⏰ Fallback timeout reached - proceeding normally')
              clearInterval(checkInterval)
              resolve(undefined)
            }, 3000)
          })

          // Hide custom loader
          setShowCustomLoader(false)

          // Clean up pending data
          pendingSessionDataRef.current = null
        }
      } else {
        toast.error(response_obj.errorMessage?.message)
        mic?.getTracks().forEach((track: any) => track.stop())
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
      mic?.getTracks().forEach((track: any) => track.stop())
      if (stopWaveFrequency) {
        await stopWaveFrequency()
      }
    }
  }
  const onGoingSessionDataHandler = (message: any) => {
    const { data } = message

    setOngoingSessionData(data)
    const { marked_attendances, pending_regulization_requests } = data
    setManualAttendance(pending_regulization_requests)
    const valid_attendance = marked_attendances.filter(
      (attendance: any) => attendance.chirp_detected,
    )

    const red_students = marked_attendances.filter(
      (attendance: any) => !attendance.chirp_detected,
    )

    setStudents(valid_attendance)
    setRedStudents(red_students)
  }

  const socketErrorHandler = async (message: any) => {
    const { status_code, data } = JSON.parse(message)
    console.log(message)
    toast.error(`${status_code} - ${data}`)
    if (status_code === 409) {
      socket?.disconnect()
    }
    dispatch(setLoader({ state: false, message: null }))
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

  const handleOnSessionEnd = async () => {
    try {
      if (!confirm('Are you sure you want to end this session.. ?')) {
        return
      }
      const requestObject = {
        client: 'FE',
        session_id: onGoingSessionData.session_id,
        auth_token: StoredTokens?.accessToken?.replace('Bearer ', '') as string,
      }
      if (stopWaveFrequency) {
        await stopWaveFrequency()
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
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  const handleSheet = async () => {
    // Reset custom loader states when sheet closes
    setShowCustomLoader(false)
    setSessionSetupStarted(false)
    pendingSessionDataRef.current = null

    handleSessionCleanUp()
  }

  const updateStudentAttendance = (student_slug: string, checked: boolean) => {
    const flg = confirm('Are you sure to continue ?')
    if (!flg) return
    dispatch(setLoader({ state: true, message: 'Please wait ..' }))
    const payload = {
      client: 'FE',
      attendance_slug: student_slug,
      session_id: onGoingSessionData?.session_id,
      auth_token: StoredTokens.accessToken,
      action: checked,
    }

    socket?.emit('update_attendance', payload)
  }

  const handleAttendaceHistoryData = async (session_id: string) => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/session/get_session_data/${session_id}`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
      )
      if (response_obj.error === true) {
        return toast.error(response_obj.errorMessage?.message)
      }
      const response = get(response_obj, 'response.data.data', [])
      setIsHistorySheetOpen(true)
      setStudents(response.marked_attendances)
      setSessionId(session_id)
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  const handleHistorySheetOpen = () => {
    setIsHistorySheetOpen(!isHistorySheetOpen)
    setSessionId(null)
    setStudents([])
    setRedStudents([])
  }

  const handleSessionCleanUp = async () => {
    try {
      // Disconnect socket first
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }

      // Stop audio frequency
      if (stopWaveFrequency) {
        await stopWaveFrequency()
        setStopWaveFrequency(null)
      }

      // Stop streaming
      if (stopStreamFunction) {
        await stopStreamFunction()
        setStopStreamFunction(null)
      }

      // Reset all loader states
      dispatch(
        setLoader({
          state: false,
          message: null,
        }),
      )

      // Reset custom loader states
      setShowCustomLoader(false)
      setSessionSetupStarted(false)
      pendingSessionDataRef.current = null

      // Close sheet
      setIsSheetOpen(false)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleEarlySheetOpen = async () => {
    // Prevent double execution and conflicts
    if (sessionSetupStarted || !pendingSessionDataRef.current || socket) {
      return
    }

    // Set state immediately to prevent race conditions
    setSessionSetupStarted(true)

    try {
      const { session_id, audio_url, mic, accessToken } =
        pendingSessionDataRef.current

      // Start audio and socket setup in parallel for faster response
      const audioPromise = playWaveSoundFrequency(audio_url)

      // Don't await here - let it run in background
      audioPromise
        .then(({ stop: stopWaveFrequency1, speedMbps }) => {
          setStopWaveFrequency(() => stopWaveFrequency1)

          // Set network speed state based on measured speed
          if (speedMbps !== null && speedMbps < 0.3) {
            isNetworkTooSlowRef.current = true
            setIsNetworkTooSlow(true)
          } else {
            isNetworkTooSlowRef.current = false
            setIsNetworkTooSlow(false)
          }
        })
        .catch((error) => {
          console.error('Error in audio setup:', error)
        })

      // Create a temporary stop function until audio loads
      const tempStopWaveFunction = async () => {
        // This will be replaced when audio loads
        console.log('Temporary stop function called')
      }

      // Start socket connection with temporary function
      clientSocketHandler(session_id, accessToken, mic, tempStopWaveFunction)
    } catch (error) {
      console.error('Error in early session setup:', error)
      // Reset state on error
      setSessionSetupStarted(false)
    }
  }

  return {
    students,
    lectureDetails,
    sessionData,
    isSheetOpen,
    date,
    classesList,
    stopStreamFunction,
    socket,
    onGoingSessionData,
    manualAttendance,
    finalAttendanceData,
    isSessionEnded,
    classRooms,
    open,
    classRoomData,
    setOpen,
    setClassRoomData,
    handleOnSessionEnd,
    handleClassroom,
    changeClassRoomAPI,
    handleOnClickForDownloadExcelForAttendance,
    setIsSheetOpen,
    removeStudentAttendanceRequest,
    markManualStudentsAttendance,
    setStopStreamFunction,
    setSocket,
    handleSheet,
    getLectureDetails,
    startSessionHandler,
    calendarContainerRef,
    activeDateRef,
    updateStudentAttendance,
    isHistorySheetOpen,
    handleHistorySheetOpen,
    sessionId,
    handleAttendaceHistoryData,
    showCustomLoader,
    setShowCustomLoader,
    handleEarlySheetOpen,
    redStudents,
  }
}
