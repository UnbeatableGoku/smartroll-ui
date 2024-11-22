import { useState } from 'react'
import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'
import useAPI from '@hooks/useApi'

const useAcademicYearSelection = () => {
    const [academicYears, setAcademicYears] = useState<Array<any>>([])
    const [StoredTokens,CallAPI] = useAPI()
    const get_academic_years_by_semester = async (slug: string) => {
        try {
            const axiosInstance = axios.create()
            const method = 'get'
            const endpoint = `/manage/get_accedmic_years_of_subjects_by_semester/${slug}`
            const header = {
                'ngrok-skip-browser-warning': true,
                Authorization: `Bearer ${StoredTokens.accessToken}`,
            }
            const response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, header)
            if (response_obj.error == false) {
                
                const data = get(response_obj, 'response.data.data', [])
                setAcademicYears(data)
            }
            else {
                toast.error(response_obj.errorMessage?.message)
            }

        } catch (e) {
            console.error('Error fetching streams', e)
            toast.error('Error fetching division. See console for more information.')
        }
    }
    return {
        academicYears,
        get_academic_years_by_semester
    }

}

export default useAcademicYearSelection