import { useRef, useState } from 'react'

import axios from 'axios'
import { get } from 'lodash'
import { DropResult } from 'react-beautiful-dnd'
import { toast } from 'sonner'

import useAPI from '@hooks/useApi'

import { SelectionResponse } from 'types/common'

type Group = {
  slug: string
  subjects: string
  totalCount: number
  availableCount: number
  students: any
}

type Division = {
  id: string
  groups: { groupId: string; count: number }[]
}

const useDivisionCreation = () => {
  //useState
  const [selectedStream, setSelectedStream] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('')
  const [semesters, setSemester] = useState<SelectionResponse[]>([])
  const [isOpenSuggesition, setIsOpenSuggesition] = useState<boolean>(false)
  const [sujectChoiceGroup, setSubjectChoiceGroup] = useState<Group[]>([])
  const [isSuggesitionAccept, setIsSuggetionAccept] = useState(true)
  const [maxDivisionCapacity, setMaxDivisionCapacity] = useState<string>('')
  const [divisionsData, setDivisionsData] = useState(null)
  const [activeTab, setActiveTab] = useState('')
  const [renderStudentList, setRenderStudentList] = useState(false)
  const [divisions, setDivisions] = useState<Division[]>([])
  const [divisionsAlreadyCreated, setDivisionsAlreadyCreated] = useState(false)
  const [studentBatchList, setStudentBatchList] = useState<any[]>([])
  const [totalStudentsCount,setTotoalStudentCount] = useState(0)
  const [isDeadllineReached,setDeadllineReached] = useState<boolean>(false)
  //custom hooks
  const [StoredTokens, CallAPI] = useAPI() // custom hooks that used to call API
  //useRef
  const setCapacityDivision = useRef<HTMLDivElement | null>(null)

  //function :: handle on value change of the stream
  const handleOnValueChangeOfStream = async (slug: string) => {
    setSelectedStream(slug)
    setRenderStudentList(false)
    setMaxDivisionCapacity('')
    setTotoalStudentCount(0)
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_semesters_only_from_stream/${slug}`
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
        const check = get(response_obj, 'response.data.data', [])
        const semester_lst: Array<SelectionResponse> = check.map(
          (semester: any) => {
            return { slug: semester.slug, name: semester.no }
          },
        )
        setSemester(semester_lst)
      } else {
        toast.error(response_obj.errorMessage?.message)
        setSemester([])
      }
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      //reset
      setSelectedSemester('')
      setIsSuggetionAccept(true)
      if (setCapacityDivision.current) {
        setCapacityDivision.current.classList.remove('hidden')
      }
      setDivisionsAlreadyCreated(false)
      setDivisionsData(null)
      setDivisionsAlreadyCreated(false)
      setRenderStudentList(false)
    }
  }

  //function:: handle on value change of semester
  const handleOnValueChangeOfSemester = async (slug: string) => {
    setSelectedSemester(slug)
    setRenderStudentList(false)
    setMaxDivisionCapacity('')
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_subject_choice_groups/${slug}`
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

        // check if the division is already created 
        if (response_obj.response?.data?.data?.divisions?.length > 0) {
          const check = get(response_obj, 'response.data.data', {})
          
          let student_wise_batch_details: any[] = [];
  
          // Assuming `check.division` is your original data structure
          check?.divisions.forEach((division: any) => {
            // Initialize the division structure if it doesn't already exist
            let division_data = student_wise_batch_details.find((data: any) => data.division_name === division.division_name);
  
            if (!division_data) {
              // If this division doesn't exist, create a new division structure
              division_data = {
                division: division.division_name,
                students: [],  // Array to store students of this division
                total_batches: division.total_batches
              };
              student_wise_batch_details.push(division_data);
            }
  
            // Now process the batches and students
            division?.batches.forEach((batch: any) => {
              batch?.students.forEach((student: any) => {
                // Check if the student already exists in this division
                const student_data = division_data.students.find((data: any) => data.slug === student.slug);
  
                if (student_data) {
                  // If student exists, check if the batch is already in their list of batches
                  if (!student_data.batches.includes(batch.batch_name)) {
                    student_data.batches.push(batch.batch_name);
                  }
                } else {
                  // If student doesn't exist, add the student with their batch
                  division_data.students.push({
                    slug: student.slug,
                    profile: student.profile, 
                    enrollment: student.enrollment,  // Assuming you want to store student name as well
                    batches: [batch.batch_name]
                  });
                }
              });
            });
          });
  
          
  
          setDivisionsData(response_obj.response?.data.data)
          setStudentBatchList(student_wise_batch_details)
          setRenderStudentList(true)
          setDivisionsAlreadyCreated(true)
          setActiveTab(
            response_obj.response?.data.data.divisions[0].division_name,
          )
        } 
        else {
          const check = get(response_obj, 'response.data.data', {})
          setTotoalStudentCount(check?.total_students)
          const subjectChoiceGroup: Group[] = check?.subject_groups.map((choice: any) => {
            const subjects = choice.subjects.map((subject: any) => {
              const subject_name_word = subject?.subject_name
                .toUpperCase()
                .split(' ')
              if (subject_name_word.length == 1) {
                return subject_name_word[0]
              } else {
                const short_form = subject_name_word.map((data: string) => {
                  return data.at(0)
                })
                return short_form.join('')
              }
            })
            return { ...choice, subjects: subjects.join(' , ') }
          })
          setSubjectChoiceGroup(subjectChoiceGroup)
          setDivisionsAlreadyCreated(false)
        }
        setDeadllineReached(true)
      } else {
        toast.error(response_obj.errorMessage?.message)
        setSubjectChoiceGroup([])
        setDivisionsAlreadyCreated(false)
        setDeadllineReached(false)
        setTotoalStudentCount(0)
        //TODO: to set the state false
      }
    } catch (error: any) {
      toast.error(error.message)
      setSubjectChoiceGroup([])
    }

    //reset
    setIsSuggetionAccept(true)
    if (setCapacityDivision.current) {
      setCapacityDivision.current.classList.remove('hidden')
    }
    setMaxDivisionCapacity('')
  }

  //function  :: handle the decline button for the suggestion
  const handleOnClickForDeclineSuggestion = () => {
    setIsSuggetionAccept(false)
    setIsOpenSuggesition(!isOpenSuggesition)
    if (setCapacityDivision.current) {
      setCapacityDivision.current.classList.add('hidden')
    }
    setRenderStudentList(false)
  }
  //function :: handle the accept button for the suggestion
  const handleOnClickForAcceptSuggestion = () => {
    setIsSuggetionAccept(true)
    setIsOpenSuggesition(!isOpenSuggesition)
    setRenderStudentList(true)

    //RESET
    if (setCapacityDivision.current) {
      setCapacityDivision.current.classList.add('hidden')
    }
  }

  //fuction:: handle the display the suggestion (pannel)
  const handleOnClickForDisplaySuggestion = async () => {
    try {
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_division_suggestion/${selectedSemester}`
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const params = {
        max_students: maxDivisionCapacity,
      }
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
        null,
        params,
      )
      if (response_obj.error == false) {
        const check = get(response_obj, 'response.data.data', {})
        let student_wise_batch_details: any[] = [];

        // Assuming `check.division` is your original data structure
        check?.divisions.forEach((division: any) => {
          // Initialize the division structure if it doesn't already exist
          let division_data = student_wise_batch_details.find((data: any) => data.division_name === division.division_name);

          if (!division_data) {
            // If this division doesn't exist, create a new division structure
            division_data = {
              division: division.division_name,
              students: [],  // Array to store students of this division
              total_batches: division.total_batches
            };
            student_wise_batch_details.push(division_data);
          }

          // Now process the batches and students
          division?.batches.forEach((batch: any) => {
            batch?.students.forEach((student: any) => {
              // Check if the student already exists in this division
              const student_data = division_data.students.find((data: any) => data.slug === student.slug);

              if (student_data) {
                // If student exists, check if the batch is already in their list of batches
                if (!student_data.batches.includes(batch.batch_name)) {
                  student_data.batches.push(batch.batch_name);
                }
              } else {
                // If student doesn't exist, add the student with their batch
                division_data.students.push({
                  slug: student.slug,
                  profile: student.profile, 
                  enrollment: student.enrollment,  // Assuming you want to store student name as well
                  batches: [batch.batch_name]
                });
              }
            });
          });
        });

        

        
        setStudentBatchList(student_wise_batch_details)
        setDivisionsData(check)
        setActiveTab(check.divisions[0].division_name)
      }
      setIsOpenSuggesition(true)
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  //function :: handle the save button for the division
  const handelOnClickForSaveDivisions = async () => {
    try {
      const axiosInstance = axios.create()
      const method = 'post'
      const endpoint = `/manage/confirm_suggested_divisions/`
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const body = {
        semester_slug: selectedSemester,
        divisions_data: divisionsData,
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
        setDivisionsAlreadyCreated(true)
        toast.success('Divisions saved successfully')
      } else {
        toast.error(response_obj.errorMessage?.message)
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  //section for the darg and drop the subject choice group

  const createDivisions = () => {
    const division_count: string | null = prompt(
      'please enter Approx Division Count',
    )
    if (!division_count) {
      return toast.error('please enter apporx division count')
    }
    const newDivisions = Array.from(
      { length: parseInt(division_count) },
      (_, index) => ({
        id: `division-${index + 1}`,
        groups: [],
      }),
    )
    setDivisions(newDivisions)
  }

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result

    if (!destination) return

    if (
      source.droppableId === 'groups' &&
      destination.droppableId.startsWith('division-')
    ) {
      const groupId = draggableId
      const divisionIndex = divisions.findIndex(
        (d) => d.id === destination.droppableId,
      )

      if (divisionIndex !== -1) {
        const updatedDivisions = [...divisions]
        const existingGroupIndex = updatedDivisions[
          divisionIndex
        ].groups.findIndex((g) => g.groupId === groupId)

        if (existingGroupIndex === -1) {
          updatedDivisions[divisionIndex].groups.push({ groupId, count: 0 })
          setDivisions(updatedDivisions)
        }
      }
    }
  }

  const updateGroupCount = (
    divisionId: string,
    groupId: string,
    count: number,
  ) => {
    const updatedDivisions = divisions.map((division) => {
      if (division.id === divisionId) {
        const updatedGroups = division.groups.map((group) => {
          if (group.groupId === groupId) {
            return { ...group, count: Math.max(0, count) }
          }
          return group
        })
        return { ...division, groups: updatedGroups }
      }
      return division
    })
    setDivisions(updatedDivisions)

    updateAvailableCounts()
  }

  const removeGroupFromDivision = (divisionId: string, groupId: string) => {
    const updatedDivisions = divisions.map((division) => {
      if (division.id === divisionId) {
        const updatedGroups = division.groups.filter(
          (group) => group.groupId !== groupId,
        )
        return { ...division, groups: updatedGroups }
      }
      return division
    })
    setDivisions(updatedDivisions)

    updateAvailableCounts()
  }

  const updateAvailableCounts = () => {
    const updatedGroups = sujectChoiceGroup.map((group) => {
      const totalAssigned = divisions.reduce((total, division) => {
        const groupInDivision = division.groups.find(
          (g) => g.groupId === group.slug,
        )
        return total + (groupInDivision ? groupInDivision.count : 0)
      }, 0)
      return {
        ...group,
        availableCount: Math.max(0, group.totalCount - totalAssigned),
      }
    })
    setSubjectChoiceGroup(updatedGroups)
  }

  const handleOnClickForDownloadExcel = async(division_name:string)=>{
    try{
      const axiosInstance = axios.create()
      const method = 'get'
      const endpoint = `/manage/get_division_student_data_excel`
      const header = {
        'ngrok-skip-browser-warning': true,
        Authorization: `Bearer ${StoredTokens.accessToken}`,
      }
      const params = {
          semester_slug : selectedSemester,
          division_name : division_name
      }
      console.log(params)
      const response_obj = await CallAPI(
        StoredTokens,
        axiosInstance,
        endpoint,
        method,
        header,
        null,
        params
      )
  
      if(response_obj.error === false){
        console.log(response_obj.response)
        downloadExcelFile(response_obj.response?.data?.data?.file_content,response_obj.response?.data?.data?.file_name)
      }
      else{
        toast.error(response_obj.errorMessage?.message)
      }
    }
    catch(error:any){
      toast.error(error.message || 'Something went wrong')
    }
  }

  const downloadExcelFile = (base64String:string,filename:string) => {
    // Decode base64 string into binary
    const byteCharacters = atob(base64String); // decode base64 to raw binary
    const byteArrays = [];

    // Convert the binary string into a byte array
    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      byteArrays.push(new Uint8Array(byteNumbers));
    }

    // Create a Blob from the byte array
    const blob = new Blob(byteArrays, { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Create an anchor element for download
     // Create an anchor element for download
     const link = document.createElement('a');
     link.href = URL.createObjectURL(blob);
     link.download = filename; // Specify the file name
     document.body.appendChild(link);
     
     // Trigger the click event to download
     link.click();
     
     // Clean up by removing the link element
     document.body.removeChild(link);
  };

  return {
    selectedStream,
    divisions,
    selectedSemester,
    semesters,
    isOpenSuggesition,
    isSuggesitionAccept,
    setCapacityDivision,
    sujectChoiceGroup,
    maxDivisionCapacity,
    divisionsData,
    activeTab,
    renderStudentList,
    divisionsAlreadyCreated,
    studentBatchList,
    totalStudentsCount,
    isDeadllineReached,
    setActiveTab,
    setIsOpenSuggesition,
    setSubjectChoiceGroup,
    setMaxDivisionCapacity,
    handleOnValueChangeOfStream,
    handleOnValueChangeOfSemester,
    handleOnClickForAcceptSuggestion,
    handleOnClickForDeclineSuggestion,
    handleOnClickForDisplaySuggestion,
    handelOnClickForSaveDivisions,
    createDivisions,
    onDragEnd,
    updateGroupCount,
    removeGroupFromDivision,
    updateAvailableCounts,
    setDivisionsAlreadyCreated,
    setRenderStudentList,
    handleOnClickForDownloadExcel
  }
}

export default useDivisionCreation
