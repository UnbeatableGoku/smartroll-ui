import { useCallback, useRef, useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

const useElectiveSubject = () => {
  const [electiveSubject, setElectiveSubject] = useState<Array<any>>([])
  const [subjectChoicesSlug, setSubjectChoicesSlug] = useState<string>('')
  const [finalizedChoice, setFinalizedChoice] = useState<Array<any>>([])
  const [isSubjectSave, setIsSubjectSave] = useState<boolean>(false)
  const [StoredTokens, CallAPI] = useAPI()
  const [totalCategories, setTotalCategories] = useState<string[]>([])
  const [selectedSubjects, setSelectedSubjects] = useState<Array<{}>>([])
  const [deadline, setDeadline] = useState<string>()
  const [FinalChoiceLock, setFinalChoiceLock] = useState<boolean>(false)

  //useRef

  const noElectiveSubjectCard = useRef<HTMLDivElement>(null)

  //function :: to load the choices of the elective subjects
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
        setSubjectChoicesSlug(data.slug)
        setFinalChoiceLock(data.choices_locked)
        setDeadline(data.deadline_timestamp)
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

        if (!noElectiveSubjectCard.current?.classList.contains('hidden')) {
          noElectiveSubjectCard?.current?.classList.add('hidden')
        }

        // Set finalized choices
        if (data?.choices_saved) {
          const finalizedSubjects = get(data, 'finalized_choices', [])
          setFinalizedChoice(finalizedSubjects)
          setIsSubjectSave(true)
        } else {
          setFinalizedChoice([])
          setIsSubjectSave(false)
        }
      } else {
        toast.error(response_obj.errorMessage?.message)
        if (response_obj.errorMessage?.statusCode === 404) {
          if (noElectiveSubjectCard.current) {
            noElectiveSubjectCard.current.classList.remove('hidden')
          }
        }
      }
    } catch (error: any) {
      setIsSubjectSave(false)
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
    setSelectedSubjects((prevSubjects) => {
      // Check if the subject with the given group_slug already exists
      const index = prevSubjects.findIndex(
        (item: any) => item.group_slug === group_slug,
      )
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

  //function:: to loak
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
        const endpoint = `/manage/mark_subject_choices_of_student/`
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
          setIsSubjectSave(true)
          setFinalizedChoice(final_subject)
          toast.success('Subjects are saved Successfully ')
        } else {
          toast.error(response_obj.errorMessage?.message)
        }
      } catch (error) {
        console.error('Error in handleStudentChoice:', error)
        toast.error('Something went wrong')
      }
    },
    [CallAPI, StoredTokens, selectedSubjects],
  )

  const handleOnClickForUnsaveDraft = async () => {
    try {
      const confirmation = prompt('Please type "unsave" to Unsave the draft')
      if (confirmation != 'unsave') {
        return toast.error('Please re-type "unsave" to Unsave the draft')
      }
      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = '/manage/unsave_subject_choices_for_student/'
      const headers = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const body = {
        subject_choices_slug: subjectChoicesSlug,
      }
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        headers,
        body,
      )

      if (response_obj?.error === false) {
        const data = get(response_obj, 'response.data.data', [])

        // Set subject slug
        setSubjectChoicesSlug(data.slug)

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
        setIsSubjectSave(false)
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  return {
    electiveSubject,
    subjectChoicesSlug,
    noElectiveSubjectCard,
    isSubjectSave,
    finalizedChoice,
    totalCategories,
    selectedSubjects,
    deadline,
    FinalChoiceLock,
    handleGetElectiveSubject,
    handleStudentChoice,
    toggleSubjectSelection,
    handleOnClickForUnsaveDraft,
  }
}

export default useElectiveSubject
