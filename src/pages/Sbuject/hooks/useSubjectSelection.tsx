import useSemester from '@components/common/uploadTimeTable/useSemester'
import useAPI from '@hooks/useApi'
import axios from 'axios'
import { get } from 'lodash'
import  { useState } from 'react'
import { toast } from 'sonner'

const useSubjectSelection = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<Array<any>>([])
  const [selectedStream, setSelectedStream] = useState<string>('')
  const [selectedDivision, setSelectedDivision] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [selectedYear, setSelectedYear] = useState<string>('')
  const [subjects, setSubject] = useState<Array<{}>>([])
  const { semester, loadSemesterByStream ,academicYears} = useSemester()
  
  const [StoredTokens,CallAPI] = useAPI()

  const handleOnValueChangeStreams = (value: string) => {
    setSelectedStream(value)
    setSelectedDivision('')
    loadSemesterByStream(value)
  }

  const handleOnValueChangeSemenster = (value: string) => {
    setSelectedSemester(value)
    setSelectedYear("")

  }
  const handleOnValueChangeAcademicYear = (value:string) =>{
      setSelectedYear(value)
      loadSubjectsByYear(value,selectedSemester)
  }

  const loadSubjectsByYear = async(year : string,semester_slug:string):Promise<void> =>{
        
    try{
    // Simulating API call to fetch subjects by year and semester
    const axiosInstance =  axios.create()
    const method = 'get'
    const endpoint = `/manage/get_subjects_from_acedemic_year/${semester_slug}/${year}`
    const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const response_obj = await CallAPI(StoredTokens,axiosInstance, endpoint, method, header)
      if(response_obj.error == false){
        const subjects = get(response_obj,'response.data.data',[])
        setSubject(subjects)
      }
      else{
        toast.error(response_obj.errorMessage?.message)
      }
    }
    catch(erorr){
        toast.error("Something went wrong")
    }
  }

  const toggleSubjectSelection = (subject:any): void => {
    console.log(subject.slug)
    setSelectedSubjects(prev =>
      prev.some(d => d.slug === subject.slug) 
        ? prev.filter(d => d.slug !== subject.slug) 
        : [...prev, subject]
    );
  };
  

  return {
    selectedSubjects,
    selectedStream,
    selectedDivision,
    selectedSemester,
    selectedYear,
    semester,
    academicYears,
    subjects,
    handleOnValueChangeStreams,
    handleOnValueChangeSemenster,
    handleOnValueChangeAcademicYear,
    loadSemesterByStream,
    setSelectedSubjects,
    loadSubjectsByYear, 
    toggleSubjectSelection
  }
}

export default useSubjectSelection