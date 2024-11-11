import { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import useSemester from '@components/common/uploadTimeTable/useSemester'

const useSubjectChoice = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<Array<any>>([])

  const [subjects, setSubject] = useState<Array<{}>>([])
  const { semester, loadSemesterByStream, academicYears } = useSemester()

  const [StoredTokens, CallAPI] = useAPI()

  const loadSubjects = async (): Promise<void> => {
    try {
      // Simulating API call to fetch subjects by year and semester
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_subjects_from_acedemic_year`
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
      )
      if (response_obj.error == false) {
        const subjects = get(response_obj, 'response.data.data', [])
        setSubject(subjects)
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (erorr) {
      toast.error('Something went wrong')
    }
  }

  const toggleSubjectSelection = (subject: any): void => {
    console.log(subject.slug)
    setSelectedSubjects((prev) =>
      prev.some((d) => d.slug === subject.slug)
        ? prev.filter((d) => d.slug !== subject.slug)
        : [...prev, subject],
    )
  }

  return {
    selectedSubjects,
    semester,
    academicYears,
    subjects,
    loadSemesterByStream,
    setSelectedSubjects,
    toggleSubjectSelection,
    loadSubjects,
  }
}

export default useSubjectChoice
