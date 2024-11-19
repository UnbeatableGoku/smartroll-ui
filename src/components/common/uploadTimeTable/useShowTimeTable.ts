import { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

interface Schedule {
  id: number
  time: string
  subject: string
  faculty: string
}
const useShowTimeTable = () => {
  const [masterTimeTable, setMasterTimeTable] = useState<Schedule[]>([])
  const [StoredTokens, CallAPI] = useAPI()

  const handleTimeTable = async (slug: string) => {
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_timetable/${slug}`
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }

      // )
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
      )
      if (!response_obj.error) {
        const data = get(response_obj, 'response.data.data.schedules', [])
        setMasterTimeTable(data)
      } else {
        
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (e) {
      console.error('Error fetching streams', e)
      toast.error('Error fetching timetable. See console for more information.')
    }
  }

  return { masterTimeTable, handleTimeTable }
}

export default useShowTimeTable
