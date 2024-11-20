import { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'


import useAPI from '@hooks/useApi'
import { SelectionResponse } from 'types/common'

interface Division {
  full_name: string
  slug: string
}

const useDivision = () => {
  const [division, setDivision] = useState<SelectionResponse[]>([])

  const [StoredTokens,CallAPI] = useAPI()

  const handleDivision = async (slug: string) => {
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_divisions_from_stream/${slug}`
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const response_obj = await CallAPI(StoredTokens,axiosInstance,endpoint,method,header)
      if (response_obj.error == false){
        const data = get(response_obj, 'response.data.data', [])
        const divisions:Array<SelectionResponse> = data.map((division:Division) =>{
          return {slug : division.slug,name : division.full_name,}
        })
        setDivision(divisions)
      }
      else{
        toast.error(response_obj.errorMessage?.message)  
      }
      
    } catch (e) {
      console.error('Error fetching streams', e)
      toast.error('Error fetching division. See console for more information.')
    }
  }
  return { handleDivision, division }
}

export default useDivision
