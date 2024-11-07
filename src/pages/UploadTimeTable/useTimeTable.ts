import React, { useState } from 'react'

import axios from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { base_url } from '@utils/base_url'

type FormValues = {
  file: File | null
}

const token = localStorage.getItem('accessToken')
const useTimeTable = () => {
  interface SubmitData {
    file: File | null
  }

  const [timeTable, setTimeTable] = useState(true)
  const [loadTimeTable, setLoadTimeTable] = useState(false)

  const [fileName, setFileName] = React.useState<string | null>(null)

  const {
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<FormValues>()

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
        `${base_url}/manage/upload_master_timetable/`,
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
    setTimeTable,
    timeTable,
    onSubmit,
    handleSubmit,
    fileName,
    loadTimeTable,
    handleFileChange,
    setLoadTimeTable,
    errors,
    setError,
  }
}
export default useTimeTable
