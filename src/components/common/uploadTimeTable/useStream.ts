import { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import { base_url } from '@utils/base_url'

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

const useStream = () => {
  const [stream, setStream] = useState<Stream[]>([])

  const token = localStorage.getItem('accessToken')

  const handleStream = async () => {
    try {
      const response = await axios.get(`${base_url}/manage/get_streams`, {
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
  return {
    stream,
    handleStream,
  }
}

export default useStream
