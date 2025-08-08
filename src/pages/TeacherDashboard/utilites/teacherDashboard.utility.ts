import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { float32ToInt16BlobAsync } from '@utils/helpers/recorder_process'

import {
  BranchLectures,
  LectureStatusMap,
  LoadClassroomResponse,
  micPermission,
} from './teacherDashboard.types'

const TeacherDashboardUtilites = () => {
  const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API

  /**
   * @link /manage/get_classrooms_for_teacher
   * @returns list of the classes
   */
  const loadClassRooms = async (): Promise<LoadClassroomResponse> => {
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
      const payload = {
        isalreadyLoaded: true,
        classes: response,
      }
      return payload
    } catch (error: any) {
      toast.error(error.message || 'something went wrong')
      return {
        isalreadyLoaded: false,
        classes: [],
      }
    }
  }

  const playWaveSoundFrequency = async (url: any) => {
    // Create AudioContext
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

    // Measure network speed while fetching audio
    const startTime = performance.now()
    const response = await fetch(`${window.base_url}/media/${url}`)
    const arrayBuffer = await response.arrayBuffer()
    const endTime = performance.now()
    const durationSeconds = (endTime - startTime) / 1000
    const fileSizeBytes = arrayBuffer.byteLength    
    // Mbps = (bytes * 8) / (seconds * 1_000_000)
    const speedMbps =
      durationSeconds > 0
        ? (fileSizeBytes * 8) / (durationSeconds * 1_000_000)
        : 0

    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

    // Create and configure buffer source
    const source = audioCtx.createBufferSource()
    source.buffer = audioBuffer
    source.connect(audioCtx.destination)
    source.loop = true
    source.start()

    // Return stop function with full cleanup and the measured speed
    const stop = async () => {
      try {
        source.stop()
        source.disconnect()
        await new Promise((resolve) => setTimeout(resolve, 50))
        if (audioCtx.state !== 'closed') {
          await audioCtx.close()
        }
      } catch (err) {
        console.error('Error stopping audio:', err)
      }
    }
    return { stop, speedMbps }
  }

  /**
   *
   * @param data
   * @returns map of the lecture session map
   */
  function extractLectureStatusData(data: any): LectureStatusMap {
    const lectureStatusMap: LectureStatusMap = {}

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

  const checkAndReturnMicPermission = async (): Promise<micPermission> => {
    let mic: MediaStream | null = null
    mic = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount:1,
        echoCancellation: false,
        noiseSuppression: false,
        autoGainControl: false,
      },
    })
    return mic
  }

  /**
   * @param socket
   * @param session_id
   * @param auth_token
   * @param mic
   * @returns stopFunction
   * @description strart the mic of teacher to record data
   */
  const startTeacherStreaming = async (
    socket: any,
    session_id: string,
    auth_token: string,
    mic: any,
  ) => {
    let audioContext: any | null = null
    if (audioContext) {
      audioContext.close()
      audioContext = null
    }
    audioContext = new (window.AudioContext || window.webkitAudioContext)()
    const chunkDuration = 1000 // 1 second
    const startTime = Date.now() // Record start time
    let chunkIndex = 0

    await audioContext.audioWorklet.addModule('recorder-processor.js')

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

    recorderNode.port.onmessage = async (event) => {
      const chunk = event.data[0] // Float32Array
      const wavBlob = await float32ToInt16BlobAsync(chunk)
      const timestamp = startTime + chunkIndex * chunkDuration
      chunkIndex++

      if (!stopStream) {
        if (socket) {
          socket.emit('incoming_audio_chunks', {
            client: 'FE',
            session_id,
            auth_token,
            blob: wavBlob,
            timestamp,
          })
        } else {
          stopStream = true
          // Call stopFunction to fully clean up resources when socket is gone
          stopFunction().catch((err) =>
            console.error('Error stopping stream:', err),
          )
        }
      }
    }

    // Clean up function to stop all streaming resources
    const stopFunction = async () => {
      stopStream = true

      // Disconnect audio nodes
      if (recorderNode) {
        recorderNode.disconnect()
      }
      if (source) {
        source.disconnect()
      }

      // Stop all microphone tracks
      if (mic && mic.getTracks) {
        mic.getTracks().forEach((track: any) => track.stop())
      }

      // Close audio context
      if (audioContext && audioContext.state === 'running') {
        try {
          await audioContext.close()
        } catch (err) {
          console.error('Error closing audio context:', err)
        }
      }
    }

    // Handle page unload (reload/close/navigate away)
    const handlePageUnload = () => {
      stopFunction()
    }

    // Add event listeners for page unload
    window.addEventListener('beforeunload', handlePageUnload)

    // Add event listener for popstate (browser back/forward navigation)
    window.addEventListener('popstate', handlePageUnload)

    // Monitor socket status and stop streaming if socket disconnects
    const checkSocketInterval = setInterval(() => {
      if (!socket || (socket && !socket.connected)) {
        clearInterval(checkSocketInterval)
        stopFunction().catch((err) =>
          console.error('Error stopping stream on socket check:', err),
        )
      }
    }, 2000) // Check every 2 seconds

    // Return the cleanup function that also removes event listeners
    return async () => {
      // Remove event listeners
      window.removeEventListener('beforeunload', handlePageUnload)
      window.removeEventListener('popstate', handlePageUnload)

      // Clear socket status check interval
      clearInterval(checkSocketInterval)

      // Stop the stream and clean up resources
      await stopFunction()
    }
  }

  /**
   *
   * @param lectureDetails
   * @returns build easy object structure of the lecture details
   */
  const buildTeacherLectureListResponse = (
    lectureDetails: any,
  ): BranchLectures[] => {
    try {
      const result = lectureDetails.map((branch: any) => {
        const lectures = branch.streams.flatMap((stream: any) =>
          stream.semesters.flatMap((semester: any) =>
            semester.divisions.flatMap((division: any) =>
              division.timetable.schedule.lectures.map((lecture: any) => ({
                semester_no: semester.no,
                division_name: division.division_name,
                day: division.timetable.schedule.day,
                start_time: lecture.start_time,
                end_time: lecture.end_time,
                type: lecture.type,
                subject_name:
                  lecture.subject?.subject_map?.subject_name || null,
                teacher_name: lecture.teacher?.profile?.name || null,
                teacher_code: lecture.teacher?.teacher_code || null,
                batch_name: lecture.batches?.batch_name || null,
                classroom_name:
                  lecture.session?.classroom_final?.class_name || null,
                classroom_slug: lecture.session?.classroom_final?.slug || null,
                session_id: lecture.session?.session_id || null,
                session_status: lecture.session?.active || null,
                lecture_slug: lecture.slug || null,
                is_active: lecture.is_active,
              })),
            ),
          ),
        )

        return {
          branch_name: branch.branch_name,
          lectures: lectures,
        }
      })
      return result
    } catch (error) {
      throw new Error('something went worng')
    }
  }

  return {
    loadClassRooms,
    extractLectureStatusData,
    getWeekDates,
    buildTeacherLectureListResponse,
    checkAndReturnMicPermission,
    startTeacherStreaming,
    playWaveSoundFrequency,
  }
}

export default TeacherDashboardUtilites
