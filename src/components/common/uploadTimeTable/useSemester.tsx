import React, { useState } from 'react'
import axios from 'axios'
import useAPI from '@hooks/useApi'
import { get } from 'lodash'
import { toast } from 'sonner'
const useSemester = () => {
    const [StoredTokens, CallAPI] = useAPI()
    const [semester, setSemester] = useState<Array<any>>([]);


    const loadSemesterByStream = async(slug: string) => {
        try {
            const header = {
                'ngrok-skip-browser-warning': true,
                Authorization: `Bearer ${StoredTokens.accessToken}`,
            }
            const axiosInstance = axios.create()
            const method = 'get'
            const endpoint = `/manage/get_semsters_from_stream/${slug}`
            const response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, header)
            if (response_obj.error == false) {
                const data = get(response_obj, 'response.data.data', [])
                setSemester(data)
            }
            else {
                toast.error(response_obj.errorMessage?.message)
            }
        }
        catch (error) {
            console.error('Error fetching Semester', error)
            toast.error('Error fetching Semester. See console for more information.')
        }

    }
    return {
        semester,
        loadSemesterByStream,
    }
}

export default useSemester