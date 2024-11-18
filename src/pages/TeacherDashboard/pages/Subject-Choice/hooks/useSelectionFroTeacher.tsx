import useAPI from '@hooks/useApi';
import { SelectionResponse } from 'types/common';
import axios from 'axios';
import { get } from 'lodash';
import  { useState } from 'react'
import { toast } from 'sonner';

const useSelectionFroTeacher = () => {
    const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API
    const [semesters, setSemesters] = useState<Array<any>>([]); // state to store the list of the semesters 
    const [academicYears, setAcademicYears] = useState<Array<any>>([]); // state to strore the list of academic years 
    const [semesterResponse,setSemesterResponse] = useState([]) // state to store the entire response of get_semester_from_stream api
    const [selectedStream,setselectedStream] =  useState("")
    const [selectedSemester,setselectedSemester] = useState("")
    const [subjects,setSubjects] = useState<Array<{}> | null >(null)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
    const [selectedSubjects, setSelectedSubjects] = useState<Array<any>>([])
    const [isSubjectLock, setIsSubjectLock] = useState<boolean>(false) // state that used to check if the subject selection ls done or not
   const [choice_slug,set_choice_slug] = useState<string>("") // state that used to check if the
   const [choice_deadline,set_choice_deadline] = useState<string | null>(null)
    const loadSemesterByStreamForTeacher = async (slug: string) => { 
        try {
            setselectedStream(slug)
            const header = {
                'ngrok-skip-browser-warning': true,
                Authorization: `Bearer ${StoredTokens.accessToken}`,
            }
            const axiosInstance = axios.create()
            const method = 'get'
            const endpoint = `/manage/get_semesters_from_stream/${slug}`
            const response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, header)

            if (response_obj.error == false) {
                const semester = get(response_obj, 'response.data.data', [])
            
                const semester_lst: Array<SelectionResponse> = semester.map((semester: any) => {
                    return ({ slug: semester.slug, name: semester.no })
                })
                setSemesters(semester_lst)     // to generilized the data to load on select component 
                
            }
            else {
                toast.error(response_obj.errorMessage?.message)
                setselectedSemester("")
                setSemesters([])
                setSubjects(null)
                setSelectedSubjects([])
            }
        }
        catch (error) {
            console.error('Error fetching Semester', error)
            toast.error('Error fetching Semester. See console for more information.')
        }

    }

    const load_subjects_for_teacher_choice = async(slug:string)=>{
        try{
            setselectedSemester(slug)
            setSubjects([])
            setIsSubjectLock(false)
            setSelectedSubjects([])
            const header = {
                'ngrok-skip-browser-warning': true,
                Authorization: `Bearer ${StoredTokens.accessToken}`,
            }
            const axiosInstance = axios.create()
            const method = 'get'
            const endpoint = `/manage/get_teachers_subject_choices/${slug}`
            const response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, header)
            if(response_obj.error == false){
                if(response_obj.response?.data.data.choices_locked == false){
                    const subject_check = get(response_obj,'response.data.data.available_choices',[])
                    setSubjects(subject_check)
                    set_choice_slug(response_obj.response.data.data.slug)
                    set_choice_deadline(response_obj.response.data.data.deadline_timestamp)
                }
                else{
                    
                    const check_finalized_choices = get(response_obj,'response.data.data.finalized_choices',[])
                    setSubjects(check_finalized_choices)
                    setIsSubjectLock(true)
                    setSelectedSubjects(check_finalized_choices)
                    set_choice_deadline(response_obj?.response?.data?.data?.deadline_timestamp)
                }
            }
            else{
                toast.error(response_obj.errorMessage?.message)
                setSubjects(null)
                setSelectedSubjects([])
            }
        }
        catch(error){
            console.error('Error fetching Semester', error)
            toast.error('Error fetching Semester. See console for more information.')
        }
    }


    const save_teacher_subject_choice = async(subject_slugs:any)=>{
        try{
            
            console.log("first")
            console.log(subject_slugs);
            const header = {
                'ngrok-skip-browser-warning': true,
                Authorization: `Bearer ${StoredTokens.accessToken}`,
            }
            const axiosInstance = axios.create()
            const method = 'post'
            const endpoint = `/manage/mark_subject_choices/`
            const body = {
                subject_choices_slug: choice_slug,
                subject_choices : subject_slugs
            }
            const response_obj = await CallAPI(StoredTokens, axiosInstance, endpoint, method, header,body)
            
            if(response_obj.error == false){
                const check_finalized_choices = get(response_obj,'response.data.data.finalized_choices',[])
                setSubjects(check_finalized_choices)
                setIsSubjectLock(true)
                setSelectedSubjects(check_finalized_choices)
                toast.success('Subjects saved successfully')
            }
            else{
                toast.error(response_obj.errorMessage?.message)
            }
            
        }
        catch(error){
            console.error('Error fetching Semester', error)
            toast.error('Error fetching Semester. See console for more information.')
        }
    }   
    const toggleSubjectSelection = (subject: any): void => {
        
        setSelectedSubjects((prev) =>
          prev.some((d) => d.slug === subject.slug)
            ? prev.filter((d) => d.slug !== subject.slug)
            : [...prev, subject],
        )
      }

      const onDrop = (index: number) => {
        if (draggedIndex !== null) {
          const updatedSubjects = [...selectedSubjects]
          const [movedSubject] = updatedSubjects.splice(draggedIndex, 1)
          updatedSubjects.splice(index, 0, movedSubject)
          setSelectedSubjects(updatedSubjects)
          setDraggedIndex(null)
        }
      }
    return {
        semesters,
        academicYears,
        semesterResponse,
        selectedStream,
        selectedSemester,
        subjects,
        isSubjectLock,
        draggedIndex,
        selectedSubjects,
        choice_deadline,
        setIsSubjectLock,
        toggleSubjectSelection,
        onDrop,
        setAcademicYears,
        setSemesterResponse,
        loadSemesterByStreamForTeacher,
        setselectedStream,
        load_subjects_for_teacher_choice,
        setselectedSemester,
        setDraggedIndex,
        save_teacher_subject_choice
    }
}

export default useSelectionFroTeacher