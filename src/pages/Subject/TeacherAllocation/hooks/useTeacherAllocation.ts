import axios from 'axios'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

const useTeacherAllocation = () => {
  const [StoredTokens, CallAPI] = useAPI()
  const getTeacherData = async () => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_semesters_from_stream`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
      )

      if (response_obj.error == false) {
        // const teacherData = get(response_obj, 'response.data.data', [])
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  return { getTeacherData }
}
export default useTeacherAllocation
