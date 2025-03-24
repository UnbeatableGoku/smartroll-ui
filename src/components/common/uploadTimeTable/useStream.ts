import { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { SelectionResponse, StreamInterface } from 'types/common'



const useStream = () => {
  const [stream, setStream] = useState<SelectionResponse[]>([])
  const [streamData,setStreamData] = useState<StreamInterface[]>([])
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
        const data:Array<StreamInterface> = get(response_obj, 'response.data.data', [])
        
        setStreamData(response_obj.response?.data.data)
        const stream_lst: Array<SelectionResponse> = data.map(
          (stream: StreamInterface) => {
            return {
              slug: stream.slug,
              name: `${stream.title} - ${stream.stream_code} ${stream.branch.branch_name} `,
            }
          },
        )

        setStream(stream_lst)
        toast.info('Please select the stream')
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (e) {
      console.error('Error fetching streams', e)
      toast.error('Error fetching streams. See console for more information.')
    }
  }
  return {
    stream,
    streamData,
    setStreamData,
    handleStream,
  }
}

export default useStream

// demo data
// {stream.title} - {stream.branch.branch_code}{' '}
//           {stream.branch.branch_name}
