import React, { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface Branch {
  branch_name: string
  branch_code: string
  slug: string
}

interface Stream {
  title: string
  slug: string
  branch: Branch
}

interface Division {
  full_name: string
  slug: string
}

type FormValues = {
  file: File | null
}

const baseUrl =
  'https://8137-2405-201-2024-b91e-65f1-b35a-996-121c.ngrok-free.app'
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzMwOTYyNDg4LCJpYXQiOjE3MzA4NzYwODgsImp0aSI6IjdlYjRhMzljNDk5ZjQ3ODdhZTNkMWJkOWJiOTRiYzFjIiwidXNlcl9pZCI6MSwib2JqIjp7ImlkIjoxLCJwcm9maWxlIjp7Im5hbWUiOm51bGwsImVtYWlsIjoibWFuYXZzaGFoMTAxMS5tc0BnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4ifSwiYnJhbmNoIjp7ImJyYW5jaF9uYW1lIjoiQ29tcHV0ZXIgRW5naW5lZXJpbmciLCJicmFuY2hfY29kZSI6IjA3Iiwic2x1ZyI6IjMwODQ4MF8xNzMwMjkzMTM5In19fQ.O5_bsbPARITHGFwy_cabxz2Uaw4aSUeWJ6_jex-7kEs'
const useTimeTable = () => {
  interface Schedule {
    id: number
    time: string
    subject: string
    faculty: string
  }

  interface SubmitData {
    file: File | null
  }

  const [stream, setStream] = useState<Stream[]>([])
  const [division, setDivision] = useState<Division[]>([])
  const [timeTable, setTimeTable] = useState(false)
  const [loadTimeTable, setLoadTimeTable] = useState(false)
  const [masterTimeTable, setMasterTimeTable] = useState<Schedule[] | null>(
    null,
  )
  const [fileName, setFileName] = React.useState<string | null>(null)

  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>()

  //Fetched streams
  const handleStream = async () => {
    try {
      const response = await axios.get(`${baseUrl}/manage/get_streams`, {
        headers: {
          'ngrok-skip-browser-warning': true,
          Authorization: `Bearer ${token}`,
        },
      })
      const data = get(response, 'data.data', [])

      if (data.length > 0) {
        setStream(data)
        console.log(data)
      }
    } catch (e) {
      console.error('Error fetching streams', e)
      toast.error('Error fetching streams. See console for more information.')
    }
  }

  //HandleDivision
  const handleDivision = async (slug: string) => {
    try {
      const response = await axios.get(
        `${baseUrl}/manage/get_divisions_from_stream/${slug}`,
        {
          headers: {
            'ngrok-skip-browser-warning': true,
            Authorization: `Bearer ${token}`,
          },
        },
      )
      // console.log(response?.data?.data)
      const data = get(response, 'data.data', [])
      if (data.length > 0) {
        setDivision(data)
        console.log(data)
      }
    } catch (e) {
      console.error('Error fetching streams', e)
      toast.error('Error fetching division. See console for more information.')
    }
  }

  //HandleTimeTable
  const handleTimeTable = async (slug: string) => {
    try {
      const response = await axios.get(
        `${baseUrl}/manage/get_timetable/${slug}`,
        {
          headers: {
            'ngrok-skip-browser-warning': true,
            Authorization: `Bearer ${token}`,
          },
        },
      )
      // console.log(response?.data?.data)
      const data = get(response, 'data.data', [])
      setMasterTimeTable(data?.schedules)
    } catch (e) {
      console.error('Error fetching streams', e)
      toast.error('Error fetching timetable. See console for more information.')
    }
  }

  //FileUploadLogic
  const onSubmit = async (data: SubmitData) => {
    const formData = new FormData()
    console.log(data)

    if (data.file) {
      formData.append('master_tt.csv', data.file)
      setLoadTimeTable(true)
    } else {
      toast.error('Please select a file')
      return
    }

    try {
      const response = await axios.post(
        `${baseUrl}/manage/upload_master_timetable/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
            'ngrok-skip-browser-warning': true,
          },
        },
      )

      console.log('File uploaded successfully', response.data)
      // Successfully uploaded
      setTimeout(() => {
        setTimeTable(true)
        toast.success('File uploaded successfully')
      }, 1000)
    } catch (error) {
      console.error('Error Uploading File', error)
      if (axios.isAxiosError(error)) {
        setTimeout(() => {
          setTimeTable(false)
          setLoadTimeTable(false)
          toast.error('File upload failed. See console for more information.')
        }, 1000)
      }
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file ? file.name : null)
      setValue('file', file)
    }
  }

  return {
    handleStream,
    stream,
    handleDivision,
    division,
    handleTimeTable,
    setTimeTable,
    timeTable,
    onSubmit,
    handleSubmit,
    fileName,
    loadTimeTable,
    handleFileChange,
    setLoadTimeTable,
    masterTimeTable,
    errors,
    setError,
  }
}
export default useTimeTable
