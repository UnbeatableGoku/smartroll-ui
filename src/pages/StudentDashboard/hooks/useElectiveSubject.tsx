import { useCallback, useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

const useElectiveSubject = () => {
  const [electiveSubject, setElectiveSubject] = useState<Array<any>>([])
  const [subjectSlug, setSubjectSlug] = useState<string>('')
  const [finalizedChoice, setFinalizedChoice] = useState<Array<any>>([])
  const [isLocked, setIsLocked] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [StoredTokens, CallAPI] = useAPI()

  const handleGetElectiveSubject = useCallback(async () => {
    setIsLoading(true)
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = '/manage/get_students_subject_choices'
      const headers = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }

      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        headers,
      )

      if (response_obj?.error === false) {
        const data = get(response_obj, 'response.data.data', [])
        // Set subject slug
        setSubjectSlug(data.slug)

        // Set elective subjects
        const electiveSubjectData = get(data, 'available_choices', [])
        setElectiveSubject(electiveSubjectData)

        // Set finalized choices
        if (data?.choices_locked) {
          const finalizedSubjects = get(data, 'finalized_choices', [])
          setFinalizedChoice(finalizedSubjects)
          setIsLocked(true)
        } else {
          setFinalizedChoice([])
          setIsLocked(false)
        }
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (e) {
      setIsLocked(false)
      toast.error('Something went wrong' + e)
    } finally {
      setIsLoading(false)
    }
  }, [CallAPI, StoredTokens])

  const handleStudentChoice = useCallback(
    async (selectedChoices: string[], selectedChoicesSlug: string) => {
      setIsLoading(true)
      try {
        const axiosInstance = axios.create()
        const method = 'post'
        const endpoint = `/manage/mark_subject_choices/`
        const body = {
          subject_choices_slug: selectedChoicesSlug,
          subject_choices: selectedChoices,
        }
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
          body,
        )

        if (response_obj.error === false) {
          const final_subject = get(
            response_obj,
            'response.data.data.finalized_choices',
            [],
          )
          setIsLocked(true)
          setFinalizedChoice(final_subject)
          toast.success('Subjects are Successfully Locked')
        } else {
          toast.error(
            response_obj?.errorMessage?.message ||
              'Error marking subject choices',
          )
        }
      } catch (error) {
        toast.error('Something went wrong')
      } finally {
        setIsLoading(false)
      }
    },
    [CallAPI, StoredTokens],
  )

  return {
    handleGetElectiveSubject,
    electiveSubject,
    subjectSlug,
    handleStudentChoice,
    isLocked,
    finalizedChoice,
    isLoading,
  }
}

export default useElectiveSubject
