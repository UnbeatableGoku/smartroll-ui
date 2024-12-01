import React, { useState } from 'react'

import axios from 'axios'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

const useStudentDivision = () => {
  const [studentDivision, setStudentDivision] = useState<any[]>([])
  const handleStudentDivision = async () => {
    const [StoredTokens, CallAPI] = useAPI()

    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_division_suggestion`
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
        null,
      )
      if (response_obj.error == false) {
        // const check = get(response_obj, 'response.data.data', {})
        // setDivisionsData(check)
        // setActiveTab(check.divisions[0].division_name)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  return {
    handleStudentDivision,
  }
}

export default useStudentDivision
