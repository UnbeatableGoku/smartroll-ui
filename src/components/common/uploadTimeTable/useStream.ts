import { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { base_url } from '@utils/base_url'

import { SelectionResponse } from 'types/common'

interface Branch {
  branch_name: string
  slug: string
}

interface Stream {
  title: string
  slug: string
  branch: Branch
  stream_code: string
}

const useStream = () => {
  const [stream, setStream] = useState<SelectionResponse[]>([])
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

        const stream_lst: Array<SelectionResponse> = data.map(
          (stream: Stream, index: string) => {
            return {
              slug: stream.slug,
              name: `${stream.title} - ${stream.stream_code} ${stream.branch.branch_name} `,
            }
          },
        )

        setStream(stream_lst)
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

// demo data
// {stream.title} - {stream.branch.branch_code}{' '}
//           {stream.branch.branch_name}
