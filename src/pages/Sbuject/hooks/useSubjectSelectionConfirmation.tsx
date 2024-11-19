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
      setStudents([])
      setTeachers([])
      setComplementrySbujects([])
      setSelectedSubjectCategory("")
      
    }
    //function : handle the value change of semester  for teachers
    const handleValueChangeOfSemesterForTeacher = (value:string) =>{
      setSelectedSemester(value)
      setSelectedSubject("")
      setTeachers([])
      
      const semester_subject = semesterResponse.find((semester: any) => semester.slug === value);
    
      const finalized_subject =  get(semester_subject,'subjects',[])
      if(finalized_subject){
        const general_response_for_subject:Array<SelectionResponse> = finalized_subject.map((subject:any)=>{
          return ({slug:subject.slug,name:subject.subject_name})
      })
      
      setSubjects(general_response_for_subject)
      toast.info("please select the Subject")
      }
      else{
        setSubjects([])
      }
      
    }

     //function : handle the value change of semester  for students
    const handleValueChangeOfSemesterForStudent = async(value:string)=>{
      setSelectedSemester(value)
      setSelectedSubjectCategory("")
      setStudents([])
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
            if(check_data ){
              const subject_category = check_data.map((category:any)=>{
                return ({slug:category.slug, name:category.category})
            })
            setComplementrySbujects(subject_category)
            toast.info("please select the Subject Category")
            }
            else{
              setComplementrySbujects([])
            }
        }
        else{
          toast.error(response_obj.errorMessage?.message)
          setComplementrySbujects([])
          setSelectedSemester("")
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
      setStudents([])
      const category_subject = categoryResponse.find((category: any) => category.slug === slug);
      const finalized_subject =  get(category_subject,'subjects',[])
     
      const general_response_for_subject:Array<SelectionResponse> = finalized_subject.map((subject:any)=>{
        return ({slug:subject.slug,name:subject.subject_name})
    })
    
    setSubjects(general_response_for_subject)
    toast.info("please select the Subject")
    }

    //function: get the subject name  from slug  for students and teacher
    const getSubjectName = (subject_slug:string):string | undefined=>{
        const subject_obj = subjects.find((subject:any)=>subject.slug === subject_slug);
        return subject_obj?.name
    }

    //function:: handle the subject deletion of single student 
    const handleOnClickForDeleteSubjectOfStudent = async(subject_slug:string,student_slug:string)=>{
      try{
        const delete_choice = prompt("Please type 'delete' for delete student choice")
        if(delete_choice != 'delete'){
          return toast.error("please type 'delete' for delete student choice")
        }
        const axiosInstance = axios.create()
        const method = 'post'
        const endpoint = `/manage/unlock_subject_choice_for_student/`
        const header = {
          'ngrok-skip-browser-warning': true,
          Authorization: `Bearer ${StoredTokens.accessToken}`,
        }
        const body  = {
          subject_slug : subject_slug,
          subject_choices_slug : student_slug 
        }
        const response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, header,body)
        if(response_obj.error==false){
          if(response_obj.response?.data.data.subject_delete == false){
            return toast.error("Please Try Again")
          }
            setStudents((prevData:any) => {
              //check te student is exist 
              return prevData.filter((student:any)=> student.slug != student_slug)              
            })
        }
        else{
          toast.error(response_obj.errorMessage?.message)
        }
      }
      catch(error){
        toast.error("Something went wrong")
      }
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
    setSelectedSubjectCategory,
    getSubjectName,
    handleOnClickForDeleteSubjectOfStudent
  }
}

export default useSubjectSelectionConfirmation


