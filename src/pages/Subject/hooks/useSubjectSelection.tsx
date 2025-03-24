import { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { SelectionResponse } from 'types/common'

import useSemester from '@components/common/uploadTimeTable/useSemester'

const useSubjectSelection = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<Array<any>>([]) // state that holds the list of the selected subjects
  const [selectedStream, setSelectedStream] = useState<string>('') // state that holds the slug of the selected stream
  const [selectedSemester, setSelectedSemester] = useState<string>('') // state that holds the slug of the selected semester
  const [selectedYear, setSelectedYear] = useState<string>('') // state that holds the slug of the selected yeaer
  const [subjects, setSubject] = useState<Array<{}> | null>(null) // state that hold the list of the premenet subjects before selection
  const [unlockSubjectAfterDeadline, setunloackSubjectAfterDeadline] =
    useState(false)
  const [deadLine, setDeadLine] = useState<string>('')
  const [notTechSubjects, setNotTechSubjects] = useState<Array<any>>([])
  const [openDeadlineDailog, setOpenDeadlineDailog] = useState<boolean>(false)
  const {
    semesters,
    loadSemesterByStream,
    academicYears,
    semesterResponse,
    setAcademicYears,
    setSemesterResponse,
  } = useSemester() // custome hook that use to load the semester
  const [isSubjectLock, setIsSubjectLock] = useState<boolean>(false) // state that used to check if the subject selection ls done or not
  const [StoredTokens, CallAPI] = useAPI() // custom hooks that used to call API

  // function that  is invoked when the user selects the stream
  const handleOnValueChangeStreams = (value: string) => {
    setSelectedStream(value)
    setSelectedSemester('')
    setSelectedYear('')
    setSelectedSubjects([])
    setIsSubjectLock(false)
    setSubject(null)
    loadSemesterByStream(value)
    setNotTechSubjects([])
  }

  // fuction that is invoked when the user selet the semester
  const handleOnValueChangeSemenster = (value: string) => {
    setSelectedSemester(value) // set the current selected semester slug to state

    // get the object of the current selected semester
    const semester_subject = semesterResponse.find(
      (semester: any) => semester.slug === value,
    )
    if (semester_subject.deadline_reached) {
      setunloackSubjectAfterDeadline(semester_subject.deadline_reached)
    } else {
      setunloackSubjectAfterDeadline(false)
    }
    setDeadLine(semester_subject.subject_choice_deadline)
    const finalized_subject = get(semester_subject, 'subjects', []) // check: to get the list of the selected subjects

    // check: if subjects is already selected
    if (finalized_subject) {
      setSelectedSubjects(finalized_subject) // set the selected subject state
      setSubject(finalized_subject) // load the subject
      const subjects_slug = finalized_subject.map((subject:any)=> subject.slug)
      setNotTechSubjects(subjects_slug)
      setIsSubjectLock(semester_subject.subjects_locked) // lock subject selection
    } else {
      setIsSubjectLock(false) // unlock subject selection
      const years = get(semester_subject, 'years', []) // get the years
      // to generilized the data to load on select component
      const year_lst: Array<SelectionResponse> = years.map((year: string) => {
        return { slug: year, name: year }
      })
      toast.info('please select the year')

      setAcademicYears(year_lst) // set the years to state

      setSelectedSubjects([]) // clear selected subjects
      setSubject(null) // clear subjects
      setNotTechSubjects([])
    }
    setSelectedYear('') // clear selected years
  }

  // function that is invoked when the user selects the year
  const handleOnValueChangeAcademicYear = (value: string) => {
    setSelectedYear(value)
    setSelectedSubjects([])
    setSubject([])
    loadSubjectsByYear(value, selectedSemester)
  }

  // function: to load all the subjects of given year
  const loadSubjectsByYear = async (
    year: string,
    semester_slug: string,
  ): Promise<void> => {
    try {
      // Simulating API call to fetch subjects by year and semester
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_subjects_from_acedemic_year/${semester_slug}/${year}`
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

  // function: to toggle the selection of subject
  const toggleSubjectSelection = (subject: any): void => {
    setSelectedSubjects((prev) =>
      prev.some((d) => d.slug === subject.slug)
        ? prev.filter((d) => d.slug !== subject .slug)
        : [...prev, subject],
    )


    // setSelectedSubjects((prevArray) => {
    
    //   const streamIndex = prevArray.findIndex(stream => stream.stream_slug === selectedStream);
    
    
    //   if (streamIndex !== -1) {
    //     const updatedSubjects = prevArray[streamIndex].subjects.some((subject:any) => subject.slug === subject.slug)
    //       ? prevArray[streamIndex].subjects.filter((subject:any) => subject.slug !== subject.slug)
    //       : [...prevArray[streamIndex].subjects, subject];
          
    
    //     return prevArray.map((stream, index) =>
    //       index === streamIndex ? { ...stream, subjects: updatedSubjects } : stream
    //     );
    //   }
    
    
    //   return [...prevArray, { stream_slug: selectedStream, subjects: [subject] }];
    // });
    

    setNotTechSubjects((prevArry: any) => {
      return prevArry.includes(subject.slug)
        ? prevArry.filter((item: any) => item !== subject.slug)
        : [...prevArry, subject.slug]
    })
  }

  // function: to save the selected subjects
  const handleSubjectSelection = async (
    semester_slug: any,
    subject_slugs: any,
    time_stamp: string,
    non_tech_subjects: any,
  ): Promise<void> => {
    try {
      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/add_subjects_to_semester/`
      const difference = subject_slugs.filter(
        (item: string) => !non_tech_subjects.includes(item),
      )
      const body = {
        semester_slug: semester_slug,
        subject_slugs: subject_slugs,
        deadline_timestamp: parseInt(time_stamp) / 1000,
        non_tech_subjects: difference,
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
      if (response_obj.error == false) {
        const selected_subjects = get(response_obj, 'response.data.data', [])
        setSelectedSubjects(selected_subjects)
        setSubject(selected_subjects)
        setIsSubjectLock(true)

        const updateResponse: any = semesterResponse.map((item: any) =>
          item.slug === semester_slug
            ? {
                ...item,
                subjects: selectedSubjects,
                subjects_locked: true,
                deadline_reached: false,
              }
            : item,
        )
        setSemesterResponse(updateResponse)
        setunloackSubjectAfterDeadline(false)
        toast.success('Subjects are successfully Locked')
      } else {
        if (response_obj?.errorMessage)
          toast.error(response_obj.errorMessage?.message)
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  //function :: to handle the subject selection unlock after the deadline reached
  const UnlockSubjectAfterDeadline = async () => {
    try {
      const check = prompt('Please Type "unlock" to unlock selected subjects')
      if (check === 'unlock') {
        //TODO: MAKE THE API CALL TO UNLOCK THE SELECTED SUBJECTS
        const axiosInstance = axios.create()
        const method = 'post'
        const endpoint = `/manage/unlock_subject_choices/`
        const header = {
          'ngrok-skip-browser-warning': true,
          Authorization: `Bearer ${StoredTokens.accessToken}`,
        }
        const body = {
          semester_slug: selectedSemester,
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
          const check = get(response_obj, 'response.data.data', false)
          if (check == true) {
            setIsSubjectLock(!isSubjectLock)
            const subjects_slug = selectedSubjects.map((subject:any)=>subject.slug)
            setNotTechSubjects(subjects_slug)
          }
        }
      } else {
        toast.error('Please re-type "unlock"')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  const handleOnCheckForNonTechSubject = (subject_slug: string) => {
    try {
      setNotTechSubjects((prevArry: any) => {
        return prevArry.includes(subject_slug)
          ? prevArry.filter((item: any) => item !== subject_slug)
          : [...prevArry, subject_slug]
      })
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  //function:: to update the deadline for the choice lock for teacher and student
  const handleOnClickToUpdateDeadline = async () => {
    try {
      const confirmation = prompt('Please type "yes" to update the deadline')
      if (confirmation != 'yes') {
        return toast.error('Please re-type "yes" to update the deadline')
      }
      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/extend_subject_choice_deadline/`
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const body = {
        semester_slug: selectedSemester,
        new_deadline_timestamp: new Date(deadLine).getTime() / 1000,
      }
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
        body,
      )
      if (
        response_obj.error === false &&
        response_obj.response?.data.data.is_changed
      ) {
        setDeadLine(response_obj.response?.data.data.deadline_timestamp)
        setunloackSubjectAfterDeadline(false)
        setSemesterResponse((prevArray:any)=>{
          return prevArray.map((semester:any)=>{
              if(semester.slug == selectedSemester)
              {
                return {
                 ...semester,
                  deadline_reached: response_obj.response?.data.data.is_changed ? false : true,
                  subject_choice_deadline: deadLine,
                }
              }
              else{
                return semester
              }
          })
        })
        toast.success('Deadline is successfully updated')
        setOpenDeadlineDailog(!openDeadlineDailog)
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error) {}
  }
  return {
    selectedSubjects,
    selectedStream,
    selectedSemester,
    selectedYear,
    semesters,
    academicYears,
    subjects,
    isSubjectLock,
    unlockSubjectAfterDeadline,
    notTechSubjects,
    deadLine,
    openDeadlineDailog,
    setOpenDeadlineDailog,
    handleOnValueChangeStreams,
    handleOnValueChangeSemenster,
    handleOnValueChangeAcademicYear,
    loadSemesterByStream,
    setSelectedSubjects,
    loadSubjectsByYear,
    toggleSubjectSelection,
    handleSubjectSelection,
    setIsSubjectLock,
    UnlockSubjectAfterDeadline,
    handleOnCheckForNonTechSubject,
    setDeadLine,
    handleOnClickToUpdateDeadline,
  }
}

export default useSubjectSelection
