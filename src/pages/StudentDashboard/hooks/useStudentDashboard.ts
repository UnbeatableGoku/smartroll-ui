import { useState } from 'react'

import { setLoader } from '@data/redux/slices/loaderSlice'
import axios from 'axios'
import { get } from 'lodash'
// import { startRecording } from '@utils/helpers/recorder_process'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { createWavBlob, flattenChunks } from '@utils/helpers/recorder_process'

const useStudentDashboard = () => {
  const [permission_state, set_permission_state] = useState(false)
  const [lectureDetails, setLectureDetails] = useState<any>([])
  const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API
  const dispatch = useDispatch()
  const get_location_permission = () => {
    // if(!permission_state){
    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      if (result.state === 'granted') {
        set_permission_state(true)
      } else if (result.state === 'prompt') {
        try {
          navigator.geolocation.getCurrentPosition(
            () => {
              set_permission_state(true)
            },
            () => {},
            {
              enableHighAccuracy: true,
              timeout: 5000,
              maximumAge: 0,
            },
          )
        } catch (error: any) {}
        // navigator.geolocation.getCurrentPosition(() => {
        //   set_permission_state(true)
        // })
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
    dispatch(
      setLoader({
        state: true,
        message: 'Marking Attendance. Please do not refresh this page!',
      }),
    )
    btn.disabled = true
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by this browser.')
      return
    }
    try {
      const { error, message, blob, startTimestamp }: any =
        await startStudentRecording()
      if (error) {
        btn.disabled = false
        dispatch(setLoader({ state: false, message: null }))
        setLoader({
          state: false,
          message: 'null',
        })
        return toast.error(message)
      }
      navigator.geolocation.getCurrentPosition(
        async (positions) => {
          const latitude: any = positions.coords.latitude
          const longitude: any = positions.coords.longitude

          const formData = new FormData()

          formData.append('latitude', latitude)
          formData.append('longitude', longitude)
          formData.append('lecture_slug', lecture_slug)
          formData.append('audio', blob, 'recording.wav')
          formData.append('start_time', startTimestamp)
          const headers = {
            'ngrok-skip-browser-warning': true,
          }
          const axiosInstance = axios.create()

          // Timeout logic for 20 seconds
          let timeoutId: NodeJS.Timeout | null = null
          let didTimeout = false
          const timeoutPromise = new Promise((resolve) => {
            timeoutId = setTimeout(() => {
              didTimeout = true
              resolve('timeout')
            }, 20000)
          })

          const apiPromise = CallAPI(
            StoredTokens,
            axiosInstance,
            '/manage/session/mark_attendance_for_student/',
            'post',
            headers,
            formData,
            null,
          )

          const result = await Promise.race([apiPromise, timeoutPromise])
          if (timeoutId) clearTimeout(timeoutId)

          if (didTimeout || (result && result === 'timeout')) {
            // Mark for regulization automatically
            await handleManualMarking(btn, lecture_slug, session_id, 'Slow Internet')
            dispatch(setLoader({ state: false, message: null }))
            return
          }

          const response_obj = result as any
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
                presentBadge.classList.add('flex')
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
          let message = error.message
          if (error.code === 2) {
            message =
              error.message ||
              'GPS is unavailable, please try marking attandance manually'
          }
          toast.error(message)
          dispatch(setLoader({ state: false, message: null }))
          btn.disabled = false
          return
        },
        { enableHighAccuracy: true, maximumAge: 0 },
      )
    } catch (error) {
      btn.disabled = false
      dispatch(
        setLoader({
          state: false,
          message: null,
        }),
      )
      toast.error(
        'Location services are not available, Please enable it from you browser',
      )
    }
  }

  // Modified handleManualMarking to accept a default comment
  const handleManualMarking = async (
    btn: any,
    lecture_slug: string,
    session_id: string,
    defaultComment?: string,
  ) => {
    try {
      let regulization_commet: string | null = defaultComment || prompt('Enter the comment')
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

const startStudentRecording = async (duration = 5000) => {
  return new Promise<any>(async (resolve) => {
    let audioContext: AudioContext | null = null
    let mic: MediaStream | null = null
    let recorderNode: AudioWorkletNode | null = null
    let source: MediaStreamAudioSourceNode | null = null

    const cleanup = async () => {
      if (recorderNode) {
        recorderNode.disconnect()
        recorderNode = null
      }
      if (source) {
        source.disconnect()
        source = null
      }
      if (mic) {
        mic.getTracks().forEach((track) => track.stop())
        mic = null
      }
      if (audioContext) {
        await audioContext.close()
        audioContext = null
      }
    }

    try {
      // Create new AudioContext for this recording session
      audioContext = new AudioContext()
      const sampleRate = audioContext.sampleRate
      const chunkDuration = 5 // in seconds

      let startTimestamp = Date.now()
      let hasReceivedAudioData = false

      // Load audio worklet
      await audioContext.audioWorklet.addModule('recorder-processor.js')

      // Ensure audio context is running
      if (audioContext.state !== 'running') {
        await audioContext.resume()
        if (audioContext.state === 'suspended') {
          throw new Error('Failed to resume AudioContext')
        }
      }

      mic = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      })

      // Verify we have audio tracks
      if (!mic || mic.getAudioTracks().length === 0) {
        throw new Error('No audio tracks available')
      }

      source = audioContext.createMediaStreamSource(mic)
      recorderNode = new AudioWorkletNode(audioContext, 'recorder-processor', {
        processorOptions: { duration: chunkDuration },
      })

      source.connect(recorderNode)
      recorderNode.connect(audioContext.destination)

      const recordedData: Float32Array[] = []

      // Monitor for audio data
      recorderNode.port.onmessage = (event) => {
        if (event.data && event.data.length > 0) {
          hasReceivedAudioData = true
          for (const chunk of event.data) {
            recordedData.push(chunk)
          }
        }
      }

      // Set up a check to detect if no audio data is being received
      const audioDataCheckTimer = setTimeout(() => {
        if (!hasReceivedAudioData) {
          console.warn('No audio data received after 2 seconds')
        }
      }, 2000)

      // End recording after specified duration
      setTimeout(async () => {
        clearTimeout(audioDataCheckTimer)

        // Send command to flush any remaining audio buffer
        if (recorderNode) {
          recorderNode.port.postMessage({ command: 'flush' })
        }

        // Give a small delay to allow any final chunks to be processed
        setTimeout(async () => {
          await cleanup()

          // Create audio blob from recorded data
          const audioBuffer = flattenChunks(recordedData)
          const wavBlob = createWavBlob(audioBuffer, sampleRate)
          resolve({
            error: false,
            message: 'Recording successful.',
            blob: wavBlob,
            startTimestamp,
          })
        }, 100)
      }, duration)
    } catch (err) {
      await cleanup()
      resolve({
        error: true,
        message: `Failed to record audio: ${err}`,
        blob: null,
      })
    }
  })
}
