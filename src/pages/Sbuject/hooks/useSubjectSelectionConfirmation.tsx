import useSemester from '@components/common/uploadTimeTable/useSemester'
import { SelectionResponse } from 'types/common'
import { get } from 'lodash'
import { useState } from 'react'
import { toast } from 'sonner'
import axios from 'axios'
import useAPI from '@hooks/useApi'

const useSubjectSelectionConfirmation = () => {
    const [selectedStream,setSelectedStream] = useState<string>("")
    const [selectedSemester,setSelectedSemester]  = useState<string>("")
    const [selectedSubjectCategory,setSelectedSubjectCategory] = useState<string>("")
    const [categoryResponse,setCategoryResponse] = useState([])
    const [subjects,setSubjects] = useState<SelectionResponse[]>([])
    const [complementrySbujects,setComplementrySbujects] = useState<SelectionResponse[]>([])
    const [teachers,setTeachers] = useState([])
    const [students,setStudents] = useState([])
    const [selectedSubject,setSelectedSubject] = useState<string>("")
    const { semesters, loadSemesterByStream, semesterResponse} = useSemester()
    const [StoredTokens, CallAPI] = useAPI() // custom hooks that used to call API

    //function : handle the value change of the stream 
    const handleValueChangeOfStream = (value:string) =>{
      setSelectedStream(value)
      setSelectedSemester("")
      loadSemesterByStream(value)
    }
    //function : handle the value change of semester  for teachers
    const handleValueChangeOfSemesterForTeacher = (value:string) =>{
      setSelectedSemester(value)
      setSelectedSubject("")
      const semester_subject = semesterResponse.find((semester: any) => semester.slug === value);
    
      const finalized_subject =  get(semester_subject,'subjects',[])
      const general_response_for_subject:Array<SelectionResponse> = finalized_subject.map((subject:any)=>{
          return ({slug:subject.slug,name:subject.subject_name})
      })
      setSubjects(general_response_for_subject)
    }

     //function : handle the value change of semester  for students
    const handleValueChangeOfSemesterForStudent = async(value:string)=>{
      setSelectedSemester(value)
      setSelectedSubjectCategory("")
      try{
        const axiosInstance = axios.create()
        const method = 'get'
        const endpoint = `/manage/get_complementry_subject_from_semester/${value}`
        const header = {
          'ngrok-skip-browser-warning': true,
          Authorization: `Bearer ${StoredTokens.accessToken}`,
        }
        const response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, header)
        if(response_obj.error == false){
            const check_data = get(response_obj,'response.data.data',[])
            setCategoryResponse(check_data)
            const subject_category = check_data.map((category:any)=>{
                return ({slug:category.slug, name:category.category})
            })
            console.log(subject_category)
            setComplementrySbujects(subject_category)
        }
        else{
          toast.error(response_obj.errorMessage?.message)
        }
      }
      catch(error){
        toast.error("Something went wrong")
      }
      
    }
    //function: handle the value change of subject for teahcer 
    const handleValueChangeOfSubjectForTeacher = async(slug:string)=>{
      setSelectedSubject(slug)
      try{
        const axiosInstance = axios.create()
        const method = 'get'
        const endpoint = `/manage/get_teachers_for_the_subject/${slug}`
        const header = {
          'ngrok-skip-browser-warning': true,
          Authorization: `Bearer ${StoredTokens.accessToken}`,
        }
        const response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, header)
        if(response_obj.error == false){
          const check_data = get(response_obj,'response.data.data',[])
          setTeachers(check_data)

        }
        else{
          setTeachers([])
          toast.error(response_obj.errorMessage?.message)
        }
      }
      catch(erorr){
        toast.error("Something went wrong")
      }
    }
    //function: handle the value change of subject for student 
    const handleValueChangeOfSubjectForStudent = async(slug:string)=>{
      setSelectedSubject(slug)
      try{
        const axiosInstance = axios.create()
        const method = 'get'
        const endpoint = `/manage/get_students_for_the_subject/${slug}`
        const header = {
          'ngrok-skip-browser-warning': true,
          Authorization: `Bearer ${StoredTokens.accessToken}`,
        }
        const response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, header)
        if(response_obj.error == false){
          const check_data = get(response_obj,'response.data.data')
          setStudents(check_data)
        }
        else{
          setStudents([])
          toast.error(response_obj.errorMessage?.message)
        }
      }
      catch(error){
        toast.error("Something went wrong")
      }
    }

    //function: handle the value change of category  for students
    const handleValueChangeOfCategory = (slug:string)=>{
      setSelectedSubjectCategory(slug)
      setSelectedSubject("")
      const category_subject = categoryResponse.find((category: any) => category.slug === slug);
      const finalized_subject =  get(category_subject,'subjects',[])
     
      const general_response_for_subject:Array<SelectionResponse> = finalized_subject.map((subject:any)=>{
        return ({slug:subject.slug,name:subject.subject_name})
    })
    setSubjects(general_response_for_subject)
    }
  return {
    selectedStream,
    selectedSemester,
    selectedSubject,
    semesters,
    subjects,
    teachers,
    complementrySbujects,
    selectedSubjectCategory,
    students,
    setSelectedSemester,
    setSelectedSubject,
    setSubjects,
    handleValueChangeOfSemesterForTeacher,
    handleValueChangeOfStream,
    handleValueChangeOfSubjectForStudent,
    handleValueChangeOfSubjectForTeacher,
    handleValueChangeOfCategory,
    handleValueChangeOfSemesterForStudent,
    setTeachers,
    setStudents,
    setSelectedSubjectCategory
  }
}

export default useSubjectSelectionConfirmation

