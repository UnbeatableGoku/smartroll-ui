import useSemester from '@components/common/uploadTimeTable/useSemester'
import useAPI from '@hooks/useApi'
import { SelectionResponse } from 'types/common'
import axios from 'axios'
import { get } from 'lodash'
import { useState } from 'react'
import { toast } from 'sonner'

const useSubjectSelection = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<Array<any>>([]) // state that holds the list of the selected subjects
  const [selectedStream, setSelectedStream] = useState<string>('') // state that holds the slug of the selected stream
  const [selectedDivision, setSelectedDivision] = useState<string>('') // state that holds the slug of the selected division
  const [selectedSemester, setSelectedSemester] = useState<string>('') // state that holds the slug of the selected semester
  const [selectedYear, setSelectedYear] = useState<string>('') // state that holds the slug of the selected yeaer
  const [subjects, setSubject] = useState<Array<{}> | null>(null) // state that hold the list of the premenet subjects before selection
  const { semesters, loadSemesterByStream, academicYears,semesterResponse,setAcademicYears} = useSemester() // custome hook that use to load the semester
  const [isSubjectLock, setIsSubjectLock] = useState<boolean>(false) // state that used to check if the subject selection ls done or not
  const [StoredTokens, CallAPI] = useAPI() // custom hooks that used to call API
 
  // function that  is invoked when the user selects the stream 
  const handleOnValueChangeStreams = (value: string) => {
    setSelectedStream(value)
    setSelectedDivision('')
    loadSemesterByStream(value)
  }

  // fuction that is invoked when the user selet the semester
  const handleOnValueChangeSemenster = (value: string) => {
    setSelectedSemester(value) // set the current selected semester slug to state
    
    // get the object of the current selected semester 
    const semester_subject = semesterResponse.find((semester: any) => semester.slug === value);
    
    const finalized_subject =  get(semester_subject,'subjects',[])    // check: to get the list of the selected subjects

    // check: if subjects is already selected
    if(finalized_subject){
      setSelectedSubjects(finalized_subject) // set the selected subject state 
      setSubject(finalized_subject) // load the subject 
      setIsSubjectLock(true) // lock subject selection
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

  // function that is invoked when the user selects the year
  const handleOnValueChangeAcademicYear = (value: string) => {
    setSelectedYear(value)
    setSelectedSubjects([])
    loadSubjectsByYear(value, selectedSemester)
  }

  // function: to load all the subjects of given year
  const loadSubjectsByYear = async (year: string, semester_slug: string): Promise<void> => {

    try {
      // Simulating API call to fetch subjects by year and semester
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_subjects_from_acedemic_year/${semester_slug}/${year}`
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, header)
      if (response_obj.error == false) {
        const subjects = get(response_obj, 'response.data.data', [])
        setSubject(subjects)
      }
      else {
        toast.error(response_obj.errorMessage?.message)
      }
    }
    catch (erorr) {
      toast.error("Something went wrong")
    }
  }

  // function: to toggle the selection of subject
  const toggleSubjectSelection = (subject: any): void => {
    console.log(subject.slug)
    setSelectedSubjects(prev =>
      prev.some(d => d.slug === subject.slug)
        ? prev.filter(d => d.slug !== subject.slug)
        : [...prev, subject]
    );
  };

  // function: to save the selected subjects
  const handleSubjectSelection = async (semester_slug: any, subject_slugs: any): Promise<void> => {
    try {
      console.log(semester_slug,subject_slugs);
      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/add_subjects_to_semester/`
      const body = {
        semester_slug : semester_slug,
        subject_slugs : subject_slugs
      }
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, header,body)
      if(response_obj.error== false) {
        const selected_subjects = get(response_obj,'response.data.data',[])
        setSelectedSubjects(selected_subjects)
        toast.success("Subjects are successfully  Locked")
        setIsSubjectLock(true)
      }
      else{
        toast.error(response_obj.errorMessage?.message)
      }
    }
    catch (error) {
      toast.error("Something went wrong")
    }
  }


  return {
    selectedSubjects,
    selectedStream,
    selectedDivision,
    selectedSemester,
    selectedYear,
    semesters,
    academicYears,
    subjects,
    isSubjectLock,
    handleOnValueChangeStreams,
    handleOnValueChangeSemenster,
    handleOnValueChangeAcademicYear,
    loadSemesterByStream,
    setSelectedSubjects,
    loadSubjectsByYear,
    toggleSubjectSelection,
    handleSubjectSelection,
    setIsSubjectLock,
  }
}

export default useSubjectSelection