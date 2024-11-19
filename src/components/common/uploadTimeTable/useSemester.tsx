import  { useState } from 'react'
import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'
import useAPI from '@hooks/useApi'
import { SelectionResponse } from 'types/common'
const useSemester = () => {
    const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API
    const [semesters, setSemesters] = useState<Array<any>>([]); // state to store the list of the semesters 
    const [academicYears, setAcademicYears] = useState<Array<any>>([]); // state to strore the list of academic years 
    const [semesterResponse,setSemesterResponse] = useState<Array<any>>([]) // state to store the entire response of get_semester_from_stream api

    // function to load the semester data from stream 
    const loadSemesterByStream = async (slug: string) => { 
        try {
            const header = {
                'ngrok-skip-browser-warning': true,
                Authorization: `Bearer ${StoredTokens.accessToken}`,
            }
            const axiosInstance = axios.create()
            const method = 'get'
            const endpoint = `/manage/get_semesters_from_stream/${slug}`
            const response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, header)
            if (!response_obj.error) {
                const semester = get(response_obj, 'response.data.data', [])
            
                const semester_lst: Array<SelectionResponse> = semester.map((semester: any) => {
                    return ({ slug: semester.slug, name: semester.no })
                })
                setSemesters(semester_lst)     // to generilized the data to load on select component
            
                const data = get(response_obj,'response.data.data',[])
                
                setSemesterResponse(data) // set the enrtire response in setSemesterResponse state
                toast.info("please select the semester")
            }
            else {
                toast.error(response_obj.errorMessage?.message)
                setSemesters([])
            }
        }
        catch (error) {
            console.error('Error fetching Semester', error)
            toast.error('Error fetching Semester. See console for more information.')
        }

    }
    return {
        semesters,
        semesterResponse,
        loadSemesterByStream,
        academicYears,
        setAcademicYears,
        setSemesterResponse
    }
}

export default useSemester