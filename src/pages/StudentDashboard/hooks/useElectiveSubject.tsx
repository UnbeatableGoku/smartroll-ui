import { useCallback, useState } from 'react'

import axios from 'axios'
import { group } from 'console'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

const useElectiveSubject = () => {
  const [electiveSubject, setElectiveSubject] = useState<Array<any>>([])
  const [subjectSlug, setSubjectSlug] = useState<string>('')
  const [finalizedChoice, setFinalizedChoice] = useState<Array<any>>([])
  const [isLocked, setIsLocked] = useState<boolean>(false)
  const [StoredTokens, CallAPI] = useAPI()
  const [totalCategories, setTotalCategories] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<Array<{}>>([])

  const handleGetElectiveSubject = useCallback(async () => {
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
        const availableCategories = [
          ...new Set(
            electiveSubjectData
              .flatMap((choice: any) =>
                choice.subjects.map((subject: any) => subject.category),
              )
              .filter((category: any): category is string => category != null), // Ensure non-null values
          ),
        ]
        setTotalCategories(availableCategories as string[])

        setElectiveSubject(electiveSubjectData)
        console.log(totalCategories)

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
        toast.error(
          !response_obj
            ? 'Something went wrong. Please try again later'
            : response_obj?.errorMessage?.message,
        )
      }
    } catch (error: any) {
      setIsLocked(false)
      if (!error.response) {
        toast.error(
          'Server is unreachable. Please check your connection or try again later.',
        )
      } else {
        const errorMessage =
          error.response?.data?.errorMessage?.message || 'An error occurred'
        toast.error(errorMessage)
      }
    }
  }, [CallAPI, StoredTokens])

  const toggleSubjectSelection = (subject: any, group_slug: any): void => {
    // setSelectedSubjects((prev: any) =>
    //   prev.some((d: any) => d.selectedSubjects.slug === subject.slug)
    //     ? prev.filter((d: any) => d.selectedSubjects.slug !== subject.slug)
    //     : { group_slug: group_slug, selectedSubjects: [subject] },
    // )
    console.log(subject)
    setSelectedSubjects((prevSubjects) => {
      // Check if the subject with the given group_slug already exists
      const index = prevSubjects.findIndex(
        (item: any) => item.group_slug === group_slug,
      )

      console.log(index)
      // If it exists, remove it
      if (index !== -1) {
        return prevSubjects.map((item, idx) =>
          idx == index ? { ...item, subject: subject } : item,
        )
      }

      // If it doesn't exist, add it
      return [...prevSubjects, { group_slug: group_slug, subject: subject }]
    })
  }

  const handleStudentChoice = useCallback(
    async (selectedChoices: string[], selectedChoicesSlug: string) => {
      try {
        if (selectedChoices.length !== totalCategories.length) {
          toast.error('Please select one subject from each category')
          return
        }

        // If validation passes, proceed with API call
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
        console.error('Error in handleStudentChoice:', error)
        toast.error('Something went wrong')
      }
    },
    [CallAPI, StoredTokens, selectedSubjects],
  )

  return {
    handleGetElectiveSubject,
    electiveSubject,
    subjectSlug,
    handleStudentChoice,
    isLocked,
    finalizedChoice,
    totalCategories,
    toggleSubjectSelection,
    selectedSubjects,
  }
}

export default useElectiveSubject
