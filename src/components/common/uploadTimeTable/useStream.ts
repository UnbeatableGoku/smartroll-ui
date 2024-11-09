import { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

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
  const [StoredTokens, CallAPI] = useAPI()

  const handleStream = async () => {
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = '/manage/get_streams'
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

      if (response_obj.error == false) {
        const data = get(response_obj, 'response.data.data', [])
        setStream(data)
      } else {
        toast.error('Server Down. Please Contact The Administrator')
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
