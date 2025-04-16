import { useState } from 'react'

import { setLoader } from '@data/redux/slices/loaderSlice'
import axios from 'axios'
import { get } from 'lodash'
// import { startRecording } from '@utils/helpers/recorder_process'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import {
  createWavBlob,
  downloadBlob,
  flattenChunks,
} from '@utils/helpers/recorder_process'

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
          const response_obj = await CallAPI(
            StoredTokens,
            axiosInstance,
            '/manage/session/mark_attendance_for_student/',
            'post',
            headers,
            formData,
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
          toast.error(error.message)
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

  const handleManualMarking = async (
    btn: any,
    lecture_slug: string,
    session_id: string,
  ) => {
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

const startStudentRecording = async (duration = 5000) => {
  return new Promise<any>(async (resolve) => {
    const audioContext = new AudioContext()
    const sampleRate = audioContext.sampleRate
    const chunkDuration = 5 // in seconds

    let startTimestamp = 0
    let hasReceivedAudioData = false

    // Better handling of AudioContext state
    try {
      // Load audio worklet
      await audioContext.audioWorklet.addModule('recorder-processor.js')

      // Ensure audio context is running
      if (audioContext.state !== 'running') {
        await audioContext.resume()
        // Double-check the state after resuming
        if (audioContext.state === 'suspended') {
          throw new Error('Failed to resume AudioContext')
        }
      }
    } catch (err) {
      // Clean up resources
      await audioContext.close().catch(() => {})
      resolve({
        error: true,
        message: `Failed to initialize audio recording: ${err}`,
        blob: null,
      })
      return
    }

    let mic: MediaStream
    try {
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
    } catch (err) {
      // Clean up resources
      await audioContext.close().catch(() => {})
      resolve({
        error: true,
        message:
          'Microphone permission denied or not available. Please allow it from site settings.',
        blob: null,
      })
      return
    }

    const source = audioContext.createMediaStreamSource(mic)

    const recorderNode = new AudioWorkletNode(
      audioContext,
      'recorder-processor',
      {
        processorOptions: { duration: chunkDuration },
      },
    )

    source.connect(recorderNode)
    recorderNode.connect(audioContext.destination)

    const recordedData: Float32Array[] = []
    startTimestamp = Date.now()

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
    setTimeout(() => {
      clearTimeout(audioDataCheckTimer)

      // Clean up resources
      recorderNode.disconnect()
      source.disconnect()
      mic.getTracks().forEach((track) => track.stop())

      // Send command to flush any remaining audio buffer
      recorderNode.port.postMessage({ command: 'flush' })

      // Give a small delay to allow any final chunks to be processed
      setTimeout(() => {
        audioContext.close()

        // Check if we actually recorded any audio
        if (recordedData.length === 0) {
          resolve({
            error: true,
            message: 'No audio was recorded. Please try again.',
            blob: null,
            startTimestamp,
          })
          return
        }

        // Create audio blob from recorded data
        const audioBuffer = flattenChunks(recordedData)
        const wavBlob = createWavBlob(audioBuffer, sampleRate)

        // Validate the blob size (should be more than just the WAV header)
        if (wavBlob.size <= 44) {
          resolve({
            error: true,
            message: 'Recorded audio is empty. Please try again.',
            blob: null,
            startTimestamp,
          })
          return
        }

        downloadBlob(wavBlob, 'recording.wav')
        resolve({
          error: false,
          message: 'Recording successful.',
          blob: wavBlob,
          startTimestamp,
        })
      }, 100) // Short delay to collect final chunks
    }, duration)
  })
}
