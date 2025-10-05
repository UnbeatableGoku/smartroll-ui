import { toast } from "sonner"
import useAPI from "./useApi"
import axios from "axios"
import { useState } from "react"
import { get } from "lodash"
import { loader } from "@types"


const useLectureAnalytics = () => {
    const [StoredTokens, CallAPI] = useAPI()

    const [subjects, setSubjects] = useState<Array<Record<string, any>>>([])
    const [studentDetails, setStudentDetails] = useState<Record<string, any>>({})
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
    const [subjectSlug, setSubjectSlug] = useState<string | null>(null)
    const fetchSubjects = async () => {
        try {
            const endpoint = `/manage/get_subjects_of_teacher`
            const header = {
                'ngrok-skip-browser-warning': true,
                Authorization: `Bearer ${StoredTokens.accessToken}`,
            }
            const axiosInstance = axios.create()
            const method = 'get'
            const response_obj = await CallAPI(
                StoredTokens,
                axiosInstance,
                endpoint,
                method,
                header,
            )
            if (response_obj.error) {
                throw new Error(response_obj.errorMessage?.message)
            }

            const data = get(response_obj, 'response.data.data', [])
            setSubjects(data)
        }
        catch (error: any) {
            toast.error(error.message || "something went wrong")
        }
    }

    const fetchAnalyticsData = async (subjectSlug: string, params: Record<string, any> = {}, sheetLoader: boolean = false) => {
        try {
            const endpoint = `/manage/analytics/get_detained_studetns_by_subject/${subjectSlug}`
            const header = {
                'ngrok-skip-browser-warning': true,
                Authorization: `Bearer ${StoredTokens.accessToken}`,
            }
            const axiosInstance = axios.create()
            const method = 'get'
            const response_obj = await CallAPI(
                StoredTokens,
                axiosInstance,
                endpoint,
                method,
                header,
                null,
                Object.keys(params).length ? params : null,
                sheetLoader ? loader.SHEET : loader.API
            )
            if (response_obj.error) {
                throw new Error(response_obj.errorMessage?.message)
            }

            const data = get(response_obj, 'response.data.data', {})
            setStudentDetails(data)
            setIsSheetOpen(true)

        }
        catch (error: any) {
            toast.error(error.message || "something went wrong")
        }
    }

    const exportAnalyticsData = async () => {
        try {
            const endpoint = `/manage/analytics/get_detalied_student_excel_report/`
            const header = {
                'ngrok-skip-browser-warning': true,
                Authorization: `Bearer ${StoredTokens.accessToken}`,
            }
            const body = {
                subject_slug: subjectSlug,
                columns: studentDetails?.columns ?? [],
                details: studentDetails?.details ?? []
            }
            const axiosInstance = axios.create()
            const method = 'post'
            const response_obj = await CallAPI(
                StoredTokens,
                axiosInstance,
                endpoint,
                method,
                header,
                body,
                null,
                loader.SHEET
            )

            if (response_obj.error) {
                throw new Error(response_obj.errorMessage?.message)
            }

            const result = get(response_obj, 'response.data.data', {})


            const fileName = result?.file_name

            const base64 = result?.file_content

            // Decode base64 string to binary data
            const byteCharacters = atob(base64);

            // Convert to byte array
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);

            // Create a blob for Excel MIME type
            const blob = new Blob([byteArray], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            });



            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = fileName
            document.body.appendChild(a)
            a.click()
            a.remove()
        }
        catch (error: any) {
            toast.error(error.message || "something went wrong")
        }
    }

    const clearSheet = () => {
        setIsSheetOpen(false)
        setStudentDetails({})
    }
    return {
        fetchSubjects,
        clearSheet,
        fetchAnalyticsData,
        setSubjectSlug,
        exportAnalyticsData,
        subjectSlug,
        subjects,
        studentDetails,
        isSheetOpen,

    }
}

export default useLectureAnalytics