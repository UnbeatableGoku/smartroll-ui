import { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import { base_url } from '@utils/base_url'

interface Division {
  full_name: string
  slug: string
}

const useDivision = () => {
  const [division, setDivision] = useState<Division[]>([])

  const token = localStorage.getItem('accessToken')

  const handleDivision = async (slug: string) => {
    try {
      const response = await axios.get(
        `${base_url}/manage/get_divisions_from_stream/${slug}`,
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
  return { handleDivision, division }
}

export default useDivision
