import { useRef, useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { SelectionResponse} from 'types/common'

import useStream from '@components/common/uploadTimeTable/useStream'

const useSelectionForTeacher = () => {
  const { stream} = useStream()
  const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API
  const [semesters, setSemesters] = useState<Array<any>>([]) // state to store the list of the semesters
  const [academicYears, setAcademicYears] = useState<Array<any>>([]) // state to strore the list of academic years
  const [semesterResponse, setSemesterResponse] = useState([]) // state to store the entire response of get_semester_from_stream api
  const [selectedStream, setselectedStream] = useState('')
  const [selectedSemester, setselectedSemester] = useState('')
  const [subjects, setSubjects] = useState<Array<{}> | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [selectedSubjects, setSelectedSubjects] = useState<Array<any>>([])
  const [isSubjectLock, setIsSubjectLock] = useState<boolean>(false) // state that used to check if the subject selection ls done or not
  const [choice_slug, set_choice_slug] = useState<string>('') // state that used to check if the
  const [choice_deadline, set_choice_deadline] = useState<string | null>(null)
  const [saveAsDraft, setSaveAsDraft] = useState<boolean>(false)

  //useRef
  const noSubjectFoundCard = useRef<HTMLDivElement>(null)
  const noSubjectSelectedCard = useRef<HTMLDivElement>(null)

  // useEffect(() => {
  //   handleStream()
  // }, [])

  //function :: load the semester data based on the stream
  const loadSemesterByStreamForTeacher = async (slug: string) => {
    try {
      setselectedStream(slug)
      setselectedSemester('')
      getSlectedSubjectDataByStream(slug)
      
    } catch (error) {
      console.error('Error fetching Semester', error)
      toast.error('Error fetching Semester. See console for more information.')
    }

    // setSelectedSubjects([])
  }

//function:: to load the selected subjects data

const getSlectedSubjectDataByStream = async(streamId:string)=>{
  try{
    const header = {
      'ngrok-skip-browser-warning': true,
      Authorization: `Bearer ${StoredTokens.accessToken}`,
    }
    const axiosInstance = axios.create()
    const method = 'get'
    const endpoint = `/manage/get_saved_subjects_from_stream/${streamId}`
    const response_obj = await CallAPI(
      StoredTokens,
      axiosInstance,
      endpoint,
      method,
      header,
    )

    if(response_obj.error === false){
        const stream_data = response_obj?.response?.data.data

        if (stream_data == undefined) {
          return
        }

        if (stream_data.choices_locked) {
          //for perment subject choice lock
          const saved_subjects = stream_data.saved_subjects
          if (saved_subjects) {
            setSelectedSubjects(saved_subjects)
            setSubjects(saved_subjects)
            if (!noSubjectFoundCard.current?.classList.contains('hidden')) {
              noSubjectFoundCard.current?.classList.add('hidden')
            }
          } else {
            setSelectedSubjects([])
            setSubjects([])
          }

          setSaveAsDraft(stream_data.choices_saved)
          return setIsSubjectLock(true)
        }

        setIsSubjectLock(stream_data.choices_locked)
        if ( stream_data.saved_subjects != null && stream_data.choices_saved == false) {
          const saved_subjects = stream_data.saved_subjects
          setSelectedSubjects(saved_subjects)
          setSaveAsDraft(stream_data.choices_saved)
          getSemensterData(streamId)
          setSubjects(null)
          return
        }

        if (stream_data.saved_subjects != null && stream_data.choices_saved) {
          const saved_subjects = stream_data.saved_subjects
          setSelectedSubjects(saved_subjects)
          setSubjects(saved_subjects)
          setSaveAsDraft(stream_data.choices_saved)
          getSemensterData(streamId)
          return
        }

        if (stream_data.saved_subjects == null) {
          setSelectedSubjects([])
          setSubjects(null)
          setSaveAsDraft(stream_data.choices_saved)
          setIsSubjectLock(stream_data.choices_locked)
        }
        getSemensterData(streamId)
    }
    else{
      toast.error(response_obj.errorMessage?.message)
    }
  }
  catch(error:any){
    toast.error(error.message|| 'somenting went wrong')
  }
}




  //fucition to ge the semester data based on the stream (onValuechange of stream)
  const getSemensterData = async (slug: string) => {
    try {
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_semesters_from_stream/${slug}`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
      )

      if (response_obj.error == false) {
        const semester = get(response_obj, 'response.data.data', [])

        const semester_lst: Array<SelectionResponse> = semester.map(
          (semester: any) => {
            return { slug: semester.slug, name: semester.no }
          },
        )
        setSemesters(semester_lst)
      } else {
        toast.error(response_obj.errorMessage?.message)
        setselectedSemester('')
        setSemesters([])
        setSubjects(null)
        setselectedSemester('')
        setSubjects(null) // to generilized the data to load on select component
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  //function :: for load the semester wise subjest for teacher
  const load_subjects_for_teacher_choice = async (slug: string) => {
    try {
      setselectedSemester(slug)
      setSubjects([])
      setIsSubjectLock(false)

      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_teachers_subject_choices/${slug}`
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
      )
      if (response_obj.error == false) {
        //if the choice is already lock
        if (response_obj.response?.data.data.choices_locked == false) {
          const subject_check = get(
            response_obj,
            'response.data.data.available_choices',
            [],
          )
          setSubjects(subject_check)
          set_choice_slug(response_obj.response.data.data.slug)
          set_choice_deadline(
            response_obj.response.data.data.deadline_timestamp,
          )
        }
        // if the subject choice is not lock
        else {
          const check_finalized_choices = get(
            response_obj,
            'response.data.data.finalized_choices',
            [],
          )
          setSubjects(check_finalized_choices)
          setIsSubjectLock(true)
          setSelectedSubjects(check_finalized_choices)
          set_choice_deadline(
            response_obj?.response?.data?.data?.deadline_timestamp,
          )
        }
        if (!noSubjectFoundCard.current?.classList.contains('hidden')) {
          noSubjectFoundCard.current?.classList.add('hidden')
        }
      } else {
        toast.error(response_obj.errorMessage?.message)
        setSubjects([])
      }
    } catch (error) {
      console.error('Error fetching Semester', error)
      toast.error('Error fetching Semester. See console for more information.')
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
        stream_slug: selectedStream,
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
        const check_finalized_choices = get(
          response_obj,
          'response.data.data.finalized_choices',
          [],
        )
        setSubjects(check_finalized_choices)
        setSaveAsDraft(true)
        setIsSubjectLock(response_obj.response?.data.data.choices_locked)
        // setStreamData((prevData) => {
        //   return prevData.map((stream: StreamInterface) => {
        //     if (stream.slug == selectedStream) {
        //       return { ...stream, choices_saved: true,saved_subjects:check_finalized_choices }
        //     }
        //     return stream
        //   })
        // })
        // setIsSubjectLock(true)
        setSelectedSubjects(check_finalized_choices)
        toast.success('Subjects saved successfully')
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error) {
      console.error('Error fetching Semester', error)
      toast.error('Error fetching Semester. See console for more information.')
    }
  }

  //function :: to select and de-select the subject for the teacher subject choice
  const toggleSubjectSelection = (subject: any): void => {
    setSelectedSubjects((prev) =>
      prev.some((d) => d.slug === subject.slug)
        ? prev.filter((d) => d.slug !== subject.slug)
        : [...prev, subject],
    )
  }

  //function :: to darg and drop the selected subjects from setSelectedSubjects
  const onDrop = (index: number) => {
    if (draggedIndex !== null) {
      const updatedSubjects = [...selectedSubjects]
      const [movedSubject] = updatedSubjects.splice(draggedIndex, 1)
      updatedSubjects.splice(index, 0, movedSubject)
      setSelectedSubjects(updatedSubjects)
      setDraggedIndex(null)
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
      const body = {
        stream_slug: selectedStream,
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
        const check = get(response_obj, 'response.data.data', [])
        setSelectedSubjects(check)
        setSubjects([])
        setselectedSemester('')
        // setStreamData((prevData) => {
        //   return prevData.map((stream: StreamInterface) => {
        //     if (stream.slug == selectedStream) {
        //       return { ...stream, choices_saved: false }
        //     }
        //     return stream
        //   })
        // })
        setSaveAsDraft(false)
        toast.success('Now your choice is open to modify subject selection')
        getSemensterData(selectedStream)
        // loadSemesterByStreamForTeacher(selectedStream)
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      console.error('Error fetching Semester', error)
      toast.error(error.message)
    }
  }
  return {
    stream,
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
    saveAsDraft,
    choice_slug,
    noSubjectFoundCard,
    noSubjectSelectedCard,
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
    save_teacher_subject_choice,
    handleOnClickForUnsaveDraft,
    setSaveAsDraft,
  }
}

export default useSelectionForTeacher
