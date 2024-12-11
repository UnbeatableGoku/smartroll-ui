import useAPI from '@hooks/useApi'
import useRequestHeader from '@utils/helpers/useRequestHeader'
import axios from 'axios'
import { get } from 'lodash'
import  { useEffect, useState } from 'react'
import { toast } from 'sonner'

const useUnifiedSubjectChoiceForTeacher = () => {
    //? custome hooks ===================================================================
    const { RequestHeader } = useRequestHeader()
    const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API
    
    //? useState =======================================================================
    
    const [savedSubjects,setSaveSubjects] = useState<any[]>([]);
    const [availableSubjects,setAvailableSubjects] = useState<Array<[]>>([])
    const [deadLineData,setDeadlineData] = useState<string | null>(null)
    const [saveSubjectDraft,setSaveSubjectDraft] = useState<boolean>(false)
    const [selectedSubjects, setSelectedSubjects] = useState<any[]>([]);
    const [saveSubjectFinalLock,setSaveSubjectFinalLock] = useState<boolean>(false)
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null)


    useEffect(() => {
        handleOnPageLoadToLoadSubjectData()
    }, [])


    //? =================================================================
    //function:: to load the subject data when the page is loaded 
    const handleOnPageLoadToLoadSubjectData = async () => {
        try {
            const axiosInstance = axios.create()
            const method = 'get'
            const endpoint = `/manage/get_teachers_subject_choices`
            const response_obj = await CallAPI(StoredTokens,axiosInstance,endpoint,method,RequestHeader)
            if(response_obj.error){
                throw new Error(response_obj.errorMessage?.message)
            }
            // set the status of the subject save as draft and subject final lock status
            setSaveSubjectDraft(response_obj.response?.data.data.subject_choices.choices_saved)
            setSaveSubjectFinalLock(response_obj.response?.data.data.subject_choices.choices_locked)

            // set the deadline data if the subject is not final locked
            if(!response_obj.response?.data.data.subject_choices.choices_locked){
                setDeadlineData(response_obj.response?.data.data.subject_choice_deadline)
            }

            //check if there is any saved subjects or not 
            if(response_obj.response?.data.data.subject_choices.choices_saved){
                // check data existance
                
                const savedSubjectsObjs = get(response_obj,'response.data.data.subject_choices.saved_subjects',[])    
                const sortedSubjects = savedSubjectsObjs.flatMap((stream: any) => stream.subjects).sort((a: any, b: any) => a.priority - b.priority);
                setSaveSubjects(sortedSubjects)
                setAvailableSubjects(savedSubjectsObjs)
            }
            

            //load the available subjects only if the subject is  unsaved as draft and not final lock
            if(!response_obj.response?.data.data.subject_choices.choices_saved && !response_obj.response?.data.data.subject_choices.choices_locked){
                const savedSubjectsObjs = get(response_obj,'response.data.data.subject_choices.saved_subjects',[])    
                const sortedSubjects = savedSubjectsObjs.flatMap((stream: any) => stream.subjects)
  .sort((a: any, b: any) => a.priority - b.priority);
                setSaveSubjects(sortedSubjects)
                const availableSubhjectsObjs = get(response_obj,'response.data.data.subject_choices.available_subjects',[])
                setAvailableSubjects(availableSubhjectsObjs)
            }
        }
        catch (error: any) {
            toast.error(error.message || 'something went wrong')
        }        
    }

    const toggleSubjectSelection = (subject: any): void => {
        setSaveSubjects((prev) => {
            const isSelected = prev.some((d) => d.slug === subject.slug);
        
            if (isSelected) {
              // Remove the subject and its similar_subjects
              const similarSlugs = (subject.similar_subjects || []).map((s: any) => s.slug);
              return prev.filter((d) => d.slug !== subject.slug && !similarSlugs.includes(d.slug));
            } else {
              // Add the subject and its similar_subjects
              const similarSubjects = subject.similar_subjects || [];
              // Ensure no duplicates
              const uniqueSubjects = [...prev, subject, ...similarSubjects].filter(
                (item, index, self) => self.findIndex((s) => s.slug === item.slug) === index
              );
              return uniqueSubjects;
            }
          });
      }

      //function :: to darg and drop the selected subjects from setSelectedSubjects
  const onDrop = (index: number) => {
    if (draggedIndex !== null) {
      const updatedSubjects = [...savedSubjects]
      const [movedSubject] = updatedSubjects.splice(draggedIndex, 1)
      updatedSubjects.splice(index, 0, movedSubject)
      console.log(updatedSubjects)
      setSaveSubjects(updatedSubjects)
      setDraggedIndex(null)
    }
  }


  //function:: save the teacher subject choice
  const save_teacher_subject_choice = async (subject_slugs: any) => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/mark_subject_choices_of_teacher/`
      const body = {
        subject_choices: subject_slugs,
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
        setSaveSubjectDraft(response_obj.response?.data.data.subject_choices.choices_saved)
        setSaveSubjectFinalLock(response_obj.response?.data.data.subject_choices.choices_locked)
        const savedSubjectObjs = get(response_obj,'response.data.data.subject_choices.saved_subjects',[])
        const sortedSubjects = savedSubjectObjs.flatMap((stream: any) => stream.subjects).sort((a: any, b: any) => a.priority - b.priority);
        setSaveSubjects(sortedSubjects)
        setAvailableSubjects(savedSubjectObjs)
        
        // setSaveSubjects(check_finalized_choices)
        toast.success('Subjects saved successfully')
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error) {
      console.error('Error fetching Semester', error)
      toast.error('Error fetching Semester. See console for more information.')
    }
  }

  const moveSubject = (index: number, direction: "up" | "down") => {
    const newSubjects = [...savedSubjects]
    const newIndex = direction === "up" ? index - 1 : index + 1

    if (newIndex >= 0 && newIndex < savedSubjects.length) {
      [newSubjects[index], newSubjects[newIndex]] = [newSubjects[newIndex], newSubjects[index]]
      setSaveSubjects(newSubjects)
    }
  }

  //function :: to handle the Unsave draft button click
  const handleOnClickForUnsaveDraft = async () => {
    try {
      const confirmation = prompt('Please type "unsave" to Unsave the draft')
      if (confirmation != 'unsave') {
        return toast.error('Please re-type "unsave" to Unsave the draft')
      }

      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/unsave_subject_choices_for_teacher/`
      

      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
      )

      if (response_obj.error == false) {

        setSaveSubjectDraft(response_obj.response?.data.data.subject_choices.choices_saved)
        setSaveSubjectFinalLock(response_obj.response?.data.data.subject_choices.choices_locked)
        const savedSubjectObjs = get(response_obj,'response.data.data.subject_choices.saved_subjects',[])
        const sortedSubjects = savedSubjectObjs.flatMap((stream: any) => stream.subjects).sort((a: any, b: any) => a.priority - b.priority);
        setSaveSubjects(sortedSubjects)
        const availableSubjectobjs  = get(response_obj,'response.data.data.subject_choices.available_subjects',[])

        setAvailableSubjects(availableSubjectobjs)
        toast.success('Now your choice is open to modify subject selection')
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      console.error('Error fetching Semester', error)
      toast.error(error.message)
    }
  }

    return {
        savedSubjects,
        saveSubjectDraft,
        saveSubjectFinalLock,
        availableSubjects,
        deadLineData,
        selectedSubjects,
        handleOnPageLoadToLoadSubjectData,
        toggleSubjectSelection,
        onDrop,
        draggedIndex,
        setDraggedIndex,
        save_teacher_subject_choice,
        moveSubject,
        handleOnClickForUnsaveDraft
    }
}



export default useUnifiedSubjectChoiceForTeacher

