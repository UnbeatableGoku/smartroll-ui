import { useEffect, useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import useRequestHeader from '@utils/helpers/useRequestHeader'

const useUnifiedSubjectChoiceForTeacher = () => {
  //? custome hooks ===================================================================
  const { RequestHeader } = useRequestHeader()
  const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API

  //? useState =======================================================================

  const [savedSubjects, setSaveSubjects] = useState<any[]>([])
  const [availableSubjects, setAvailableSubjects] = useState<Array<[]>>([])
  const [deadLineData, setDeadlineData] = useState<string | null>(null)
  const [saveSubjectDraft, setSaveSubjectDraft] = useState<boolean>(false)
  const [selectedSubjects] = useState<any[]>([])
  const [saveSubjectFinalLock, setSaveSubjectFinalLock] =
    useState<boolean>(false)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const [similarSubjects, setSimilarSubjects] = useState<any[]>([])
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [subjectList, setSubjectList] = useState<any[]>([])
  const [activeSection, setActiveSection] = useState<string | null>(null)
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
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        RequestHeader,
      )
      if (response_obj.error) {
        throw new Error(response_obj.errorMessage?.message)
      }
      // set the status of the subject save as draft and subject final lock status
      setSaveSubjectDraft(
        response_obj.response?.data.data.subject_choices.choices_saved,
      )
      setSaveSubjectFinalLock(
        response_obj.response?.data.data.subject_choices.choices_locked,
      )

      // set the deadline data if the subject is not final locked
      if (!response_obj.response?.data.data.subject_choices.choices_locked) {
        setDeadlineData(
          response_obj.response?.data.data.subject_choice_deadline,
        )
      }

      //check if there is any saved subjects or not
      if (response_obj.response?.data.data.subject_choices.choices_saved) {
        // check data existance

        const savedSubjectsObjs = get(
          response_obj,
          'response.data.data.subject_choices.saved_subjects',
          [],
        )
        const sortedSubjects = savedSubjectsObjs
          .flatMap((stream: any) => stream.subjects)
          .sort((a: any, b: any) => a.priority - b.priority)
        const similar_subject: any[] = []
        sortedSubjects.forEach((subject: any) => {
          const already_subject = similar_subject.some(
            (d: any) => d.slug === subject.slug,
          )
          if (!already_subject) {
            if (subject.similar_subjects) {
              similar_subject.push(...subject.similar_subjects)
            }
          }
        })

        const sortedSaveSubjects = savedSubjectsObjs.map((streamObj: any) => ({
          ...streamObj,
          subjects: streamObj.subjects.sort(
            (a: any, b: any) => a.priority - b.priority,
          ),
        }))
        setSimilarSubjects(similar_subject)
        setSaveSubjects(sortedSubjects)

        setAvailableSubjects(sortedSaveSubjects)
        setActiveSection(savedSubjectsObjs[0].stream)
      }

      //load the available subjects only if the subject is  unsaved as draft and not final lock
      if (
        !response_obj.response?.data.data.subject_choices.choices_saved &&
        !response_obj.response?.data.data.subject_choices.choices_locked
      ) {
        const savedSubjectsObjs = get(
          response_obj,
          'response.data.data.subject_choices.saved_subjects',
          [],
        )
        const sortedSubjects = savedSubjectsObjs
          .flatMap((stream: any) => stream.subjects)
          .sort((a: any, b: any) => a.priority - b.priority)
        const similar_subject: any[] = []
        sortedSubjects.forEach((subject: any) => {
          const already_subject = similar_subject.some(
            (d: any) => d.slug === subject.slug,
          )
          if (!already_subject) {
            if (subject.similar_subjects) {
              similar_subject.push(...subject.similar_subjects)
            }
          }
        })

        setSimilarSubjects(similar_subject)
        setSaveSubjects(sortedSubjects)
        const availableSubhjectsObjs = get(
          response_obj,
          'response.data.data.subject_choices.available_subjects',
          [],
        )
        const sortedAvailableSubjects = availableSubhjectsObjs.map(
          (streamObj: any) => ({
            ...streamObj,
            subjects: streamObj.subjects.sort(
              (a: any, b: any) => a.priority - b.priority,
            ),
          }),
        )
        setAvailableSubjects(sortedAvailableSubjects)
        setActiveSection(availableSubhjectsObjs[0].stream)
      }
    } catch (error: any) {
      toast.error(error.message || 'something went wrong')
    }
  }

  const toggleSubjectSelection = (subject: any): void => {
    setSaveSubjects((prev) => {
      const isSelected = prev.some((d) => d.slug === subject.slug)

      if (isSelected) {
        // Remove the subject and its similar_subjects
        const similarSlugs = (subject.similar_subjects || []).map(
          (s: any) => s.slug,
        )
        return prev.filter(
          (d) => d.slug !== subject.slug && !similarSlugs.includes(d.slug),
        )
      } else {
        // Add the subject and its similar_subjects
        const similarSubjects = subject.similar_subjects || []
        // Ensure no duplicates
        const uniqueSubjects = [...prev, subject, ...similarSubjects].filter(
          (item, index, self) =>
            self.findIndex((s) => s.slug === item.slug) === index,
        )
        return uniqueSubjects
      }
    })

    // subject.similar_subjects.map((subject:any)=>{
    //   console.log(subject)
    //   const simData = similarSubjects.findIndex((s:any)=>s.slug === subject.slug);
    //   if(simData != -1){
    //     console.log(similarSubjects[simData])
    //   }
    // })

    setSimilarSubjects((prevData: any) => {
      const already_subject = prevData.some((d: any) => d.slug === subject.slug)

      if (already_subject) {
        // Remove the subject if it already exists
        const filteredData = prevData.filter(
          (d: any) => d.slug !== subject.slug,
        )
        return filteredData
      } else {
        if (subject.similar_subjects) {
          // remove similar subjects if they are not already in prevData
          const updatedSimilarSubjects = prevData.filter((simData: any) =>
            subject.similar_subjects.some((d: any) => d.slug !== simData.slug),
          )
          //add the similar subject
          const remainingSubject = subject.similar_subjects.filter(
            (simData: any) =>
              !similarSubjects.some((d: any) => d.slug === simData.slug),
          )
          return [...updatedSimilarSubjects, ...remainingSubject]
        } else {
          // Return previous data if there are no similar subjects
          return [...prevData]
        }
      }
    })

    // setSimilarSubjects((prev:any)=> {
    //   if(subject.similar_subjects){
    //       return subject.similar_subjects.flatMap((d:any)=>{

    //       })
    //     // return prev.some((d:any)=> d.slug === subject.slug) ? prev.filter((d:any)=> d.slug !== subject.slug) : [...prev,subject.similar_subjects]
    //   }
    //   else{
    //     return [...prev]
    //   }
    // })
  }

  //function :: to darg and drop the selected subjects from setSelectedSubjects
  const onDrop = (index: number) => {
    if (draggedIndex !== null) {
      const updatedSubjects = [...subjectList]
      const [movedSubject] = updatedSubjects.splice(draggedIndex, 1)
      updatedSubjects.splice(index, 0, movedSubject)
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
        setSaveSubjectDraft(
          response_obj.response?.data.data.subject_choices.choices_saved,
        )
        setSaveSubjectFinalLock(
          response_obj.response?.data.data.subject_choices.choices_locked,
        )
        const savedSubjectObjs = get(
          response_obj,
          'response.data.data.subject_choices.saved_subjects',
          [],
        )
        const sortedSubjects = savedSubjectObjs
          .flatMap((stream: any) => stream.subjects)
          .sort((a: any, b: any) => a.priority - b.priority)
        const similar_subject: any[] = []
        sortedSubjects.forEach((subject: any) => {
          const already_subject = similar_subject.some(
            (d: any) => d.slug === subject.slug,
          )
          if (!already_subject) {
            if (subject.similar_subjects) {
              similar_subject.push(...subject.similar_subjects)
            }
          }
        })

        const sortedSaveSubjects = savedSubjectObjs.map((streamObj: any) => ({
          ...streamObj,
          subjects: streamObj.subjects.sort(
            (a: any, b: any) => a.priority - b.priority,
          ),
        }))

        setSimilarSubjects(similar_subject)
        setSaveSubjects(sortedSubjects)
        setAvailableSubjects(sortedSaveSubjects)
        setActiveSection(savedSubjectObjs[0].stream)

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

  const moveSubject = (index: number, direction: 'up' | 'down') => {
    const newSubjects = [...subjectList]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex >= 0 && newIndex < subjectList.length) {
      ;[newSubjects[index], newSubjects[newIndex]] = [
        newSubjects[newIndex],
        newSubjects[index],
      ]
      setSubjectList(newSubjects)
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
        setSaveSubjectDraft(
          response_obj.response?.data.data.subject_choices.choices_saved,
        )
        setSaveSubjectFinalLock(
          response_obj.response?.data.data.subject_choices.choices_locked,
        )
        const savedSubjectObjs = get(
          response_obj,
          'response.data.data.subject_choices.saved_subjects',
          [],
        )
        const sortedSubjects = savedSubjectObjs
          .flatMap((stream: any) => stream.subjects)
          .sort((a: any, b: any) => a.priority - b.priority)
        const similar_subject: any[] = []
        sortedSubjects.forEach((subject: any) => {
          const already_subject = similar_subject.some(
            (d: any) => d.slug === subject.slug,
          )
          if (!already_subject) {
            if (subject.similar_subjects) {
              similar_subject.push(...subject.similar_subjects)
            }
          }
        })

        setSimilarSubjects(similar_subject)
        setSaveSubjects(sortedSubjects)
        const availableSubjectobjs = get(
          response_obj,
          'response.data.data.subject_choices.available_subjects',
          [],
        )
        const sortedAvailableSubjects = availableSubjectobjs.map(
          (streamObj: any) => ({
            ...streamObj,
            subjects: streamObj.subjects.sort(
              (a: any, b: any) => a.priority - b.priority,
            ),
          }),
        )
        setAvailableSubjects(sortedAvailableSubjects)
        setActiveSection(availableSubjectobjs[0].stream)
        toast.success('Now your choice is open to modify subject selection')
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      console.error(error)
      console.error('Error fetching Semester', error)
      toast.error(error.message)
    }
  }

  const togglePanel = () => {
    const final_subjects = savedSubjects.filter(
      (subject: any) =>
        !similarSubjects.some((similar: any) => similar.slug === subject.slug),
    )

    setSubjectList(final_subjects)
    setIsPanelOpen(!isPanelOpen)
  }

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return
    }

    const items = Array.from(subjectList)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSubjectList(items)
  }

  const moveSubjectDrag = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === subjectList.length - 1)
    ) {
      return
    }

    const newSubjects = [...subjectList]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    const [movedSubject] = newSubjects.splice(index, 1)
    newSubjects.splice(newIndex, 0, movedSubject)

    setSubjectList(newSubjects)
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
    handleOnClickForUnsaveDraft,
    similarSubjects,
    togglePanel,
    isPanelOpen,
    setIsPanelOpen,
    subjectList,
    activeSection,
    setActiveSection,
    onDragEnd,
    moveSubjectDrag,
  }
}

export default useUnifiedSubjectChoiceForTeacher
