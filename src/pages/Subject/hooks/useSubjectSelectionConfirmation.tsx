import { useRef, useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { SelectionResponse } from 'types/common'

import useSemester from '@components/common/uploadTimeTable/useSemester'

const useSubjectSelectionConfirmation = () => {
  const [selectedStream, setSelectedStream] = useState<string>('')
  const [selectedSemester, setSelectedSemester] = useState<string>('')
  const [selectedSubjectCategory, setSelectedSubjectCategory] =
    useState<string>('')
  const [categoryResponse, setCategoryResponse] = useState([])
  const [subjects, setSubjects] = useState<SelectionResponse[]>([])
  const [complementrySbujects, setComplementrySbujects] = useState<
    SelectionResponse[]
  >([])
  const [teachers, setTeachers] = useState([])
  const [students, setStudents] = useState([])
  const [selectedSubject, setSelectedSubject] = useState<string>('')
  const { semesters, loadSemesterByStream, semesterResponse } = useSemester()
  const [StoredTokens, CallAPI] = useAPI() // custom hooks that used to call API

  //useState to open and close the side panel for teacher to subject map
  const [openPanelForTeacherToSubjectMap, setOpenPanelForTeacherToSubjectMap] =
    useState<boolean>(false)
  const [teacherToSubjectMapData, setTeacherToSubjectMapData] = useState<any[]>(
    [],
  )
  const downloadTeachetToSubjectMapRef = useRef<HTMLAnchorElement>()

  //function : handle the value change of the stream
  const handleValueChangeOfStream = (value: string) => {
    setSelectedStream(value)
    setSelectedSemester('')
    loadSemesterByStream(value)
    setStudents([])
    setTeachers([])
    setComplementrySbujects([])
    setSelectedSubjectCategory('')
  }
  //function : handle the value change of semester  for teachers
  const handleValueChangeOfSemesterForTeacher = (value: string) => {
    setSelectedSemester(value)
    setSelectedSubject('')
    setTeachers([])

    const semester_subject = semesterResponse.find(
      (semester: any) => semester.slug === value,
    )

    const finalized_subject = get(semester_subject, 'subjects', [])

    if (finalized_subject) {
      const general_response_for_subject: Array<SelectionResponse> =
        finalized_subject.map((subject: any) => {
          return { slug: subject.slug, name: subject.subject_name }
        })

      setSubjects(general_response_for_subject)
      toast.info('Please select the Subject')
    } else {
      setSelectedSemester('')
      toast.error('No subjects found')
      setSubjects([])
    }
  }

  //function : handle the value change of semester  for students
  const handleValueChangeOfSemesterForStudent = async (value: string) => {
    setSelectedSemester(value)
    setSelectedSubjectCategory('')
    setStudents([])
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_complementry_subject_from_semester/${value}`
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
        const check_data = get(response_obj, 'response.data.data', [])
        setCategoryResponse(check_data)
        if (check_data) {
          const subject_category = check_data.map((category: any) => {
            return { slug: category.slug, name: category.category }
          })
          setComplementrySbujects(subject_category)
          toast.info('please select the Subject Category')
        } else {
          setComplementrySbujects([])
        }
      } else {
        toast.error(response_obj.errorMessage?.message)
        setComplementrySbujects([])
        setSelectedSemester('')
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }
  //function: handle the value change of subject for teahcer
  const handleValueChangeOfSubjectForTeacher = async (slug: string) => {
    setSelectedSubject(slug)
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_teachers_for_the_subject/${slug}`
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
        const check_data = get(response_obj, 'response.data.data', [])
        setTeachers(check_data)
      } else {
        setTeachers([])
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (erorr) {
      toast.error('Something went wrong')
    }
  }
  //function: handle the value change of subject for student
  const handleValueChangeOfSubjectForStudent = async (slug: string) => {
    setSelectedSubject(slug)
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_students_for_the_subject/${slug}`
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
        const check_data = get(response_obj, 'response.data.data')
        setStudents(check_data)
      } else {
        setStudents([])
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  //function: handle the value change of category  for students
  const handleValueChangeOfCategory = (slug: string) => {
    setSelectedSubjectCategory(slug)
    setSelectedSubject('')
    setStudents([])
    const category_subject = categoryResponse.find(
      (category: any) => category.slug === slug,
    )
    const finalized_subject = get(category_subject, 'subjects', [])

    const general_response_for_subject: Array<SelectionResponse> =
      finalized_subject.map((subject: any) => {
        return { slug: subject.slug, name: subject.subject_name }
      })

    setSubjects(general_response_for_subject)
    toast.info('please select the Subject')
  }

  //function: get the subject name  from slug  for students and teacher
  const getSubjectName = (subject_slug: string): string | undefined => {
    const subject_obj = subjects.find(
      (subject: any) => subject.slug === subject_slug,
    )
    return subject_obj?.name
  }

  //function:: handle the subject deletion of single student
  const handleOnClickForDeleteSubjectOfStudent = async (
    subject_slug: string,
    student_slug: string,
  ) => {
    try {
      const delete_choice = prompt(
        "Please type 'delete' for delete student choice",
      )
      if (delete_choice != 'delete') {
        return toast.error("please type 'delete' for delete student choice")
      }
      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/unlock_subject_choice_for_student/`
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const body = {
        subject_slug: subject_slug,
        subject_choices_slug: student_slug,
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
        if (response_obj.response?.data.data.subject_delete == false) {
          return toast.error('Please Try Again')
        }
        setStudents((prevData: any) => {
          //check te student is exist
          return prevData.filter((student: any) => student.slug != student_slug)
        })
        toast.success('Subject deleted successfully')
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error) {
      toast.error('Something went wrong')
    }
  }

  //function:: to load the teacher to suject map data by
  const handleOnClickForLoadTeacherToSubjectMap = async () => {
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_all_subjects_of_teacher`
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

      if (response_obj.error === false) {
        const checkData = get(response_obj, 'response.data.data', [])
        setTeacherToSubjectMapData(checkData)
        setOpenPanelForTeacherToSubjectMap(!openPanelForTeacherToSubjectMap)
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  //function:: handle the teacher subject choice unlock button
  const handleOnDeleteTeacherSubjectChoice = async (
    teacher_slug: any,
    teacherName: string,
    stream: string,
  ) => {
    try {
      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/unlock_subject_choices_for_teacher/`
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const body = {
        teacher_slug: teacher_slug,
      }
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
        body,
      )

      if (response_obj.error === false && response_obj.response?.data.data) {
        if (response_obj.response?.data?.data?.choices_unlocked) {
          setTeacherToSubjectMapData((prevData) => {
            return prevData.filter(
              (data: any) => data.teacher.slug != teacher_slug,
            )
          })
        } else {
          setTeacherToSubjectMapData((prevData: any) => {
            // Find the teacher with the matching slug
            const updatedData = prevData.map((teacher: any) => {
              if (teacher.teacher.slug === teacher_slug) {
                const updatedStreams = teacher.selected_subjects.map(
                  (streamData: any) => {
                    if (streamData.stream_name === stream) {
                      return { ...streamData, choices_locked: false }
                    }
                    return streamData
                  },
                )
                return { ...teacher, selected_subjects: updatedStreams }
              }
              return teacher
            })

            return updatedData
          })
        }
        toast.success(
          `Subject choice for facult - ${teacherName} is successfully unlock..!!`,
        )
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  //function:: to download the teacher to subject map
  const handleOnClickForDownloadExcelForTeacherToSubjectMap = async () => {
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_teacher_to_subject_excel`
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
      if (response_obj.error === false) {
        downloadExcelFile(
          response_obj.response?.data?.data?.file_content,
          response_obj.response?.data?.data?.file_name,
        )
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  const handleOnClickForDownloadExcelForSubjectToTeacherMap = async () => {
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_subject_to_teacher_excel`
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
      if (response_obj.error === false) {
        downloadExcelFile(
          response_obj.response?.data?.data?.file_content,
          response_obj.response?.data?.data?.file_name,
        )
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }

  const handleOnClickForLoadStudentToSubjectMap = async (
    semester_slug: string,
  ) => {
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_student_to_subject_excel/${semester_slug}`
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

      if (response_obj.error === false) {
        downloadExcelFile(
          response_obj.response?.data?.data?.file_content,
          response_obj.response?.data?.data?.file_name,
        )
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong')
    }
  }
  const downloadExcelFile = (base64String: string, filename: string) => {
    // Decode base64 string into binary
    const byteCharacters = atob(base64String) // decode base64 to raw binary
    const byteArrays = []

    // Convert the binary string into a byte array
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024)
      const byteNumbers = new Array(slice.length)
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i)
      }
      byteArrays.push(new Uint8Array(byteNumbers))
    }

    // Create a Blob from the byte array
    const blob = new Blob(byteArrays, {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    })

    // Create an anchor element for download
    // Create an anchor element for download
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename // Specify the file name
    document.body.appendChild(link)

    // Trigger the click event to download
    link.click()

    // Clean up by removing the link element
    document.body.removeChild(link)
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
    openPanelForTeacherToSubjectMap,
    teacherToSubjectMapData,
    setOpenPanelForTeacherToSubjectMap,
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
    handleOnClickForDeleteSubjectOfStudent,
    handleOnClickForLoadTeacherToSubjectMap,
    handleOnDeleteTeacherSubjectChoice,
    handleOnClickForDownloadExcelForTeacherToSubjectMap,
    downloadTeachetToSubjectMapRef,
    handleOnClickForDownloadExcelForSubjectToTeacherMap,
    handleOnClickForLoadStudentToSubjectMap,
  }
}

export default useSubjectSelectionConfirmation
