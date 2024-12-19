import useAPI from '@hooks/useApi'
import useRequestHeader from '@utils/helpers/useRequestHeader'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

const useLoadAllocation = () => {
    //?--custom hook--
        const {RequestHeader} = useRequestHeader()
        const [StoredTokens, CallAPI] = useAPI()
    //?-- build in hook--
    const [AllocationData,setAllocationData] = useState<any | null>(null)
    //? useEffect 

    useEffect(() => {      
        LoadAllocationData()
    }, [])
    
    //?-- functions

    //function:: load the teacher load allocation data 
    const LoadAllocationData = async()=>{
        try{
            const axiosInstance = axios.create()
            const method = 'get'
            const url = '/manage/get_teachers_allocation'
            const response_obj = await CallAPI(StoredTokens, axiosInstance, url, method, RequestHeader)
            if (response_obj.error) {
                throw new Error(response_obj.errorMessage?.message)
            }
            setAllocationData(response_obj.response?.data.data)
        }
        catch(error:any){
            toast.error(error.message || "something went worng")
        }
    }
  return{
    AllocationData
  }
}

export default useLoadAllocation