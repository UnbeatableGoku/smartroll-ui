import { useRef, useState } from 'react'

import {
  IinstantSession,
  InstantSessionMetataData,
} from '../pages/TeacherDashboard/instant-lectures/types'
import Store from '@data/Store'
import { setLoader, setReconnectionLoader } from '@data/slices/loaderSlice'
import TeacherDashboardUtilites from '@pages/TeacherDashboard/utilites/teacherDashboard.utility'
import { loader } from '@types'
import axios from 'axios'
import { get } from 'lodash'
import { useDispatch } from 'react-redux'
import { Socket, io } from 'socket.io-client'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { Option } from '@components/common/multi-select'

const useCreateInstantSession = () => {
  //redux
  const dispatch = useDispatch()

  //custome api call hook
  const [StoredTokens, CallAPI] = useAPI()
  const {
    checkAndReturnMicPermission,
    playWaveSoundFrequency,
    startTeacherStreaming,
    serverSideEventHandler,
  } = TeacherDashboardUtilites()

  const [socket, setSocket] = useState<Socket | null>(null)
  const [sse, setSse] = useState<EventSource | null>(null)
  const [instantSession, setInstantSession] = useState<IinstantSession>({
    batches: [],
    branch: '',
    divisions: [],
    semester: '',
    subject: '',
    title: '',
  })
  const [instantSessionsMetadata, setInstantSessionMetadata] =
    useState<InstantSessionMetataData>({
      batches: [],
      branches: [],
      divisions: [],
      semesters: [],
      subjects: [],
      tittle: null,
    })
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [instantSessions, setInstantSessions] = useState<Array<any>>([])
  const [sessionStates, setSessionStates] = useState<Record<string, string>>({})
  const [showCustomLoader, setShowCustomLoader] = useState(false)
  const [sessionSetupStarted, setSessionSetupStarted] = useState(false)
  const pendingSessionDataRef = useRef<any>(null)
  const [isAttendanceSheetOpen, setAttendanceSheetOpen] = useState(false)
  const [onGoingSessionData, setOngoingSessionData] = useState<any>(null)

  //sutdent-attendace state
  const [manualAttendance, setManualAttendance] = useState<any>([])
  const [students, setStudents] = useState<any>([])
  const [isSessionEnded, setIsSessionEnded] = useState(false)
  const [finalAttendanceData, setFinalAttendanceData] = useState<any>([])

  //audio clean-up
  const [stopWaveFrequency, setStopWaveFrequency] = useState<
    (() => Promise<void>) | null
  >(null)
  const [stopStreamFunction, setStopStreamFunction] = useState<any>(null)

  //network state
  const [isSlowNetwork, setIsNetworkTooSlow] = useState(false)
  const isNetworkTooSlowRef = useRef(false)

  const handleInstantSessionChange = (
    field: keyof IinstantSession,
    value: string,
    clearObj: Record<string, any> = {},
  ) => {
    setInstantSession((prev) => {
      const currentValue = prev[field]

      if (Array.isArray(currentValue)) {
        const exists = currentValue.includes(value)
        return {
          ...prev,
          [field]: exists
            ? currentValue.filter((v) => v !== value)
            : [...currentValue, value],
          ...clearObj,
        }
      } else {
        return {
          ...prev,
          [field]: currentValue === value ? '' : value,
          ...clearObj,
        }
      }
    })
  }
  const fetchInstantSessionMetadata = async (params: any = null) => {
    try {
      const endpoint = `/manage/get_instant_lecture_metadata`
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'get'
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
        null,
        params,
        loader.SHEET,
      )
      const metaType = params ? Object.keys(params)[0] : '-1'

      const data = prepareMetadata(metaType, response_obj.response?.data)

      if (!data) {
        toast.error('Failed to fetch the metadata')
      }

      //set the metadata in state
      setInstantSessionMetadata((prev) => ({ ...prev, ...data }))

      if (response_obj.error) {
        toast.error(
          response_obj.errorMessage?.message || 'Something went worng',
        )
      }
    } catch (error: any) {
      toast.error(error.message || 'something went worng')
    }
  }

  ///manage/get_instant_lectures_for_teacher
  const fetchInstantSessions = async () => {
    try {
      const endpoint = `/manage/get_instant_lectures_for_teacher`
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'get'
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
      )
      if (response_obj.error) {
        toast.error(
          response_obj.errorMessage?.message || 'Something went worng',
        )
      }
      const sessions = get(response_obj, 'response.data.data', [])
      const sessionState = extractSessionState(sessions)
      setSessionStates(sessionState)
      setInstantSessions(sessions)
    } catch (error: any) {
      toast.error(error.message || 'something went worng')
    }
  }

  const createInstantSessionAPI = async () => {
    try {
      const endpoint = `/manage/create_instant_lecture`
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'post'
      const body = {
        semester: instantSession.semester,
        divisions: instantSession.divisions,
        ...(instantSession.batches.length && {
          batches: instantSession.batches,
        }),
        ...(instantSession.subject
          ? { subject: instantSession.subject }
          : { title: instantSession.title }),
      }
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
        body,
        null,
        loader.SHEET,
      )
      if (response_obj.error) {
        toast.error(
          response_obj.errorMessage?.message || 'Something went worng',
        )
      }

      const createdInstantSession = get(
        response_obj,
        'response.data.data',
        null,
      )
      if (!createdInstantSession) {
        throw new Error('Failed to create instant lecture')
      }

      setInstantSessions((prev) => [createdInstantSession, ...prev])
      setSessionStates((prev) => ({
        ...prev,
        [createdInstantSession.session.session_id]:
          createdInstantSession.session.active,
      }))
      toast.success('Instant Lecture created successfully..!')

      setIsSheetOpen(false)
      clearInstantSessionData()
    } catch (error: any) {
      toast.error(error.message || 'something went worng')
    }
  }

  const startSessionHandler = async (
    session_id: string,
    lecture_slug: string,
  ) => {
    let mic = null
    try {
      mic = await checkAndReturnMicPermission()
    } catch (error: any) {
      return toast.error(`Error at micro-phone: ${error.message}`)
    }

    try {
      // Show loader while checking network speed
      dispatch(setLoader({ state: true, message: 'Starting the session...' }))
      //check the microphone permission
      const formData = new FormData()
      formData.append('lecture_slug', lecture_slug)
      // No network_speed here, unless you want to use speedMbps from playWaveSoundFrequency later
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }

      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/session/create_instant_lecture_session/`
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

        setSessionStates((prevData: any) => ({
          ...prevData,
          [data.session_id]: data.active,
        }))
        const updatedLectureDetails = instantSessions.map((session: any) => {
          if (session?.session?.session_id === data.session_id) {
            return {
              ...session,
              session: {
                ...session.session,
                active: data.active,
              },
            }
          }
          return session
        })
        setInstantSessions(updatedLectureDetails)

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
                clearInterval(checkInterval)
                resolve(undefined)
              }
            }, 50) // Reduced from 100ms to 50ms for faster response

            // Fallback timeout after 3 seconds
            setTimeout(() => {
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
      dispatch(setLoader({ state: false, message: null }))
      mic?.getTracks().forEach((track: any) => track.stop())
      if (stopWaveFrequency) {
        await stopWaveFrequency()
      }
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

  const prepareMetadata = (key: any, data: any) => {
    switch (key) {
      case 'branch': {
        const semesters: Option[] = data?.data?.map((semester: any) => ({
          label: semester.no,
          value: semester.slug,
        }))
        return { semesters }
      }
      case 'semester': {
        const divisions: Option[] = data?.data?.divisions.map(
          (division: any) => ({
            label: division.division_name,
            value: division.slug,
          }),
        )

        const subjects = data?.data?.subjects.map((subject: any) => ({
          label: subject.subject_map.subject_name,
          value: subject.slug,
        }))

        return { divisions, subjects }
      }
      case 'division': {
        const batches = data?.data?.map((batch: any) => ({
          label: batch.batch_name,
          value: batch.slug,
        }))
        return { batches }
      }
      case '-1': {
        const branches = data?.data?.map((branch: any) => ({
          label: branch.branch_name,
          value: branch.slug,
        }))
        return { branches }
      }
      default:
        throw new Error('Metadata is not found')
    }
  }

  const handleInputValueChange = (key: string, value: any) => {
    setInstantSessionMetadata((prev: any) => ({ ...prev, [key]: value }))
  }

  const clearInstantSessionData = () => {
    setInstantSession({
      batches: [],
      branch: '',
      divisions: [],
      semester: '',
      subject: '',
      title: '',
    })
  }

  const extractSessionState = (
    sessions: Array<any>,
  ): Record<string, string> => {
    const sessionMap: Record<string, string> = {}
    sessions.forEach((session) => {
      sessionMap[session.session.session_id] = session.session.active
    })
    return sessionMap
  }

  const handleSheet = async () => {
    // Reset custom loader states when sheet closes
    setShowCustomLoader(false)
    setSessionSetupStarted(false)
    pendingSessionDataRef.current = null

    handleSessionCleanUp()
  }

  const onGoingSessionDataHandler = (message: any) => {
    const { data } = message

    setOngoingSessionData(data)
    const { marked_attendances, pending_regulization_requests } = data
    setManualAttendance(pending_regulization_requests)
    setStudents(marked_attendances)
  }

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
        setAttendanceSheetOpen(true)

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
          setStudents((prev: any) => [attendance_data, ...prev])
        }
      })

      newSocket?.on('update_attendance', (data: any) => {
        // const {data, message, status} = message?.data?.data'
        const { status_code, attendance_slug, message } = data
        if (status_code === 200) {
          setStudents((prev: any) =>
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
        setAttendanceSheetOpen(false)
      })

      newSocket.on('session_ended', async (message: any) => {
        setIsSessionEnded(true)
        const { data } = message
        setFinalAttendanceData(data.data.data.marked_attendances)
        setSessionStates((prevData: any) => ({
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

  const socketErrorHandler = async (message: any) => {
    const { status_code, data } = JSON.parse(message)
    console.log(message)
    toast.error(`${status_code} - ${data}`)
    if (status_code === 409) {
      socket?.disconnect()
    }
    dispatch(setLoader({ state: false, message: null }))
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

      const { stop: stopWaveFrequency1, speedMbps } =
        await playWaveSoundFrequency(audio_url)
      setStopWaveFrequency(() => stopWaveFrequency1)

      const tempStopWaveFunction = async () => {
        // This will be replaced when audio loads
        console.log('Temporary stop function called')
      }

      if (speedMbps !== null && speedMbps < 0.3) {
        isNetworkTooSlowRef.current = true
        setIsNetworkTooSlow(true)
        mic?.getTracks().forEach((track: any) => track.stop())
        handleServerSideEventConnection(session_id)
      } else {
        isNetworkTooSlowRef.current = false
        setIsNetworkTooSlow(false)
        clientSocketHandler(session_id, accessToken, mic, tempStopWaveFunction)
      }

      // Start socket connection with temporary function
      clientSocketHandler(session_id, accessToken, mic, tempStopWaveFunction)
    } catch (error) {
      console.error('Error in early session setup:', error)
      // Reset state on error
      setSessionSetupStarted(false)
    }
  }

  const handleSessionCleanUp = async () => {
    try {
      // Disconnect socket first
      if (socket) {
        socket.disconnect()
        setSocket(null)
      }

      // close sse
      if (sse) {
        sse.close()
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
      setAttendanceSheetOpen(false)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const handleServerSideEventConnection = (sessionId: string) => {
    try {
      const sse = serverSideEventHandler(sessionId)
      setSse(sse)
      setIsSheetOpen(true)
      sse.onmessage = (event) => {
        const data = JSON.parse(event.data)
        console.log(data?.type)
        if (data?.status_code != 200) {
          throw new Error('something went worng, please contact support team')
        }
        switch (data?.type) {
          case 'ongoing_session_data':
            handleOngoingSessionDataEvent(data?.data)
            break
          case 'attendance_marked':
            handleMarkAttendanceEvent(data?.data)
            break
          case 'update_attendace':
            handleUpdateAttendaceEvent(data?.data)
            break
          case 'regulization_request':
            handleRegulizationRequestEvent(data?.data)
            break
          case 'handleRegulizationApprovedEvent':
            handleRegulizationApprovedEvent(data?.data)
            break
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'something went worng')
      setIsSheetOpen(false)
      if (sse) {
        sse.close()
      }
    }
  }

  const handleOngoingSessionDataEvent = (data: any) => {
    setOngoingSessionData(data)
    const { marked_attendances, pending_regulization_requests } = data
    setManualAttendance(pending_regulization_requests)
    const valid_attendance = marked_attendances.filter(
      (attendance: any) => attendance.chirp_detected,
    )

    setStudents(valid_attendance)
  }

  const handleMarkAttendanceEvent = (data: any) => {
    console.log(data)
    if (data) {
      setStudents((prev: any) => [data?.attendance_data, ...prev])
    }
  }

  const handleUpdateAttendaceEvent = (attendance_slug: string) => {
    setStudents((prev: any) =>
      prev.filter((student: any) => student.slug !== attendance_slug),
    )

    dispatch(setLoader({ state: false, message: null }))
    toast.success('Attendace updated successfully..!')
  }

  const handleRegulizationRequestEvent = (data: any) => {
    setManualAttendance((prev: any) => [data?.attendance_data, ...prev])
  }

  const handleRegulizationApprovedEvent = (data: any) => {
    toast.success('Attendance Marked Successfully')

    setStudents((prev: any) => [...prev, ...data])
    setManualAttendance([])
  }

  const markRegulizattionRequestEntryAPI = async () => {
    try {
      const attendance_slug = manualAttendance.map((item: any) => item.slug)
      // No network_speed here, unless you want to use speedMbps from playWaveSoundFrequency later
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }

      const body = {
        session_id: onGoingSessionData.session_id,
        data: attendance_slug,
      }

      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/session/regulization_request_entry/`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
        body,
        null,
        loader.SHEET,
      )

      if (response_obj.error) {
        throw new Error(response_obj.errorMessage?.message)
      }
      const data = get(response_obj, 'response.data.data', [])
      if (!data.length) {
        throw new Error('No Studnets Founds to mark Attendance')
      }
      handleRegulizationApprovedEvent(data)
    } catch (error: any) {
      toast.error(error.message || 'something went worng')
    }
  }

  const updateStudentAttendaceAPI = async (attendance_slug: string) => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }

      const body = {
        session_id: onGoingSessionData.session_id,
        attendance_slug,
        action: false,
      }

      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/session/update_attendance/`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
        body,
        null,
        loader.SHEET,
      )

      if (response_obj.error) {
        throw new Error(response_obj.errorMessage?.message)
      }
      handleUpdateAttendaceEvent(attendance_slug)
    } catch (error: any) {
      toast.error(error.message || 'something went worng')
    }
  }

  const endSessionhandlerAPI = async () => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }

      const body = {
        session_id: onGoingSessionData.session_id,
      }

      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/session/end_session/`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
        body,
        null,
        loader.SHEET,
      )

      if (response_obj.error) {
        throw new Error(response_obj.errorMessage?.message)
      }
      setStudents([])
      setManualAttendance([])
      setIsSheetOpen(false)
      handleSessionCleanUp()
    } catch (error: any) {
      toast.error(error.message || 'something went worng')
    }
  }

  return {
    handleInstantSessionChange,
    setIsSheetOpen,
    fetchInstantSessionMetadata,
    fetchInstantSessions,
    handleInputValueChange,
    clearInstantSessionData,
    createInstantSessionAPI,
    startSessionHandler,
    handleSheet,
    setAttendanceSheetOpen,
    handleOnSessionEnd,
    markManualStudentsAttendance,
    removeStudentAttendanceRequest,
    updateStudentAttendance,
    handleEarlySheetOpen,
    setShowCustomLoader,
    markRegulizattionRequestEntryAPI,
    updateStudentAttendaceAPI,
    endSessionhandlerAPI,
    instantSession,
    isSheetOpen,
    instantSessions,
    instantSessionsMetadata,
    sessionStates,
    isAttendanceSheetOpen,
    showCustomLoader,
    manualAttendance,
    students,
    onGoingSessionData,
    isSessionEnded,
    finalAttendanceData,
    isSlowNetwork,
  }
}

export default useCreateInstantSession
