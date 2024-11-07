import { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import { base_url } from '@utils/base_url'

interface Schedule {
  id: number
  time: string
  subject: string
  faculty: string
}
const useShowTimeTable = () => {
  const [masterTimeTable, setMasterTimeTable] = useState<Schedule[]>([])
  const token = localStorage.getItem('accessToken')

  const handleTimeTable = async (slug: string) => {
    try {
      const response = await axios.get(
        `${base_url}/manage/get_timetable/${slug}`,
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

  return { masterTimeTable, handleTimeTable }
}

export default useShowTimeTable
