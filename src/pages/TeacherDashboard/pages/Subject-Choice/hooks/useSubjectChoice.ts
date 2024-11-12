import { useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import useSemester from '@components/common/uploadTimeTable/useSemester'
import { SelectionResponse } from 'types/common'

const useSubjectChoice = () => {
  const [selectedStream, setSelectedStream] = useState<string>('') // state that holds the slug of the selected stream
  const [selectedSubjects, setSelectedSubjects] = useState<Array<any>>([])
  const [selectedSemester, setSelectedSemester] = useState<string>('') // state that holds the slug of the selected semester
  const [isSubjectLock, setIsSubjectLock] = useState<boolean>(false) // state that used to check if the subject selection ls done or not
  const [subjects, setSubject] = useState<Array<{}> | null>(null) // state that hold the list of the premenet subjects before selection
  const { semesters, loadSemesterByStream, academicYears,semesterResponse,setAcademicYears} = useSemester() // custome hook that use to load the semester
  const [StoredTokens, CallAPI] = useAPI()
  const [selectedYear, setSelectedYear] = useState<string>('') // state that holds the slug of the selected yeaer
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

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

  const handleOnValueChangeSemenster = (value:string)=>{
    setSelectedSemester(value) // set the current selected semester slug to state
    
    // get the object of the current selected semester 
    const semester_subject = semesterResponse.find((semester: any) => semester.slug === value);
    
    const finalized_subject =  get(semester_subject,'subjects',[])    // check: to get the list of the selected subjects

    // check: if subjects is already selected
    if(finalized_subject){
      
      setSubject(finalized_subject) // load the subject 
      
    }
    else{
      setIsSubjectLock(false) // unlock subject selection
      const years = get(semester_subject, 'years', []) // get the years
      // to generilized the data to load on select component
      const year_lst: Array<SelectionResponse> = years.map((year: string) => {
        return ({ slug: year, name: year })
      })

      setAcademicYears(year_lst) // set the years to state

      setSelectedSubjects([]) // clear selected subjects
      setSubject(null) // clear subjects
    }
    setSelectedYear("") // clear selected years
  }

  const handleOnValueChangeStreams = (value: string) => {
    setSelectedStream(value)
    loadSemesterByStream(value)
  }    

  const onDrop = (index: number) => {
    if (draggedIndex !== null) {
      const updatedSubjects = [...selectedSubjects]
      console.log(updatedSubjects)
      const [movedSubject] = updatedSubjects.splice(draggedIndex, 1)
      updatedSubjects.splice(index, 0, movedSubject)
      setSelectedSubjects(updatedSubjects)
      setDraggedIndex(null)
    }
  }

  return {
    selectedSubjects,
    subjects,
    academicYears,
    selectedSemester,
    isSubjectLock,
    semesters,
    selectedYear,
    selectedStream,
    loadSemesterByStream,
    setIsSubjectLock,
    setSelectedSubjects,
    toggleSubjectSelection,
    loadSubjects,
    handleOnValueChangeSemenster,
    handleOnValueChangeStreams,
    onDrop,
    draggedIndex,
    setDraggedIndex,
    
  }
}

export default useSubjectChoice
