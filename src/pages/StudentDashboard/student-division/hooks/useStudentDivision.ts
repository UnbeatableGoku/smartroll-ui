import { useState } from 'react'

import { RootState } from '@data/redux/Store'
import axios from 'axios'

import { get } from 'lodash'
import { useSelector } from 'react-redux'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

const useStudentDivision = () => {
  const [studentDivision, setStudentDivision] = useState<any>(null)
  const profile = useSelector((state: RootState) => state.auth.userProfile)

  const [StoredTokens, CallAPI] = useAPI()
  const handleStudentDivision = async () => {
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_students_division`
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
        const check = get(response_obj, 'response.data.data', {})

        let student_wise_batch_details: any[] = []

        check?.batches.forEach((batch: any) => {
          batch?.students.forEach((students: any) => {
            let student_data = student_wise_batch_details.find(
              (data: any) => data.slug === students.slug,
            )
            if (student_data) {
              if (!student_data.batches.includes(batch.batch_name)) {
                student_data.batches.push(batch.batch_name)
              }
            } else {
              student_wise_batch_details.push({
                slug: students.slug,
                batches: [batch.batch_name],
                profile: students.profile,
                enrollment: students.enrollment,
              })
            }
          })
        })
        const response = {
          divisionDetails: {
            division_name: check.division_name,
            total_batches: check.total_batches,
          },
          studentDetails: student_wise_batch_details,
        }

        setStudentDivision(response)
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  return {
    handleStudentDivision,
    studentDivision,
    profile,
  }
}

export default useStudentDivision
