import { RootState } from '@data/redux/Store'
import useAPI from '@hooks/useApi'
import { SubjectToTeacherMap, TeacherAllocation, TeacherToSubjectMap } from 'types/common'
import useRequestHeader from '@utils/helpers/useRequestHeader'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { toast } from 'sonner'
import { resetSubjectAllocationState, updateHoursForSubjectToTeacherMap, updateSubjectAllocationState} from '@data/redux/slices/subjectAllocation'
import _ from 'lodash';



const useSubjectToTeacherAllocation = () => {

    //? -------- custome hook -------------
    const [StoredTokens, CallAPI] = useAPI() // custom hook to call the API
    const { RequestHeader } = useRequestHeader()
    //? useState and anoter hooks ----
    const [activeTab, setActiveTab] = useState('subject-to-teacher')
    //? -------- redux state -------/ 

    const { SubjectToTeacherAllocation, TeacherToSubjectAllocation, isDataLoaded } = useSelector((state: RootState) => state.subjectAllocation)
    const [subjectAllocation, setSubjectAllocation] = useState<SubjectToTeacherMap | null>(SubjectToTeacherAllocation)
    const [teacherAllocation, setTeacherAllocation] = useState<TeacherToSubjectMap[] | null>(TeacherToSubjectAllocation)
    const [selectedSubject, setSelectedSubject] = useState<any>(null)
    const [selectedTeacher, setSelectedTeacher] = useState<any>(null)
    const [teacherList,setTeacherList] = useState<any>(null)
    const dispatch = useDispatch()


    //? -------- useEffect -------

    useEffect(() => {
        if (!isDataLoaded) {
            loadSubjetAllocationData()
        }
    }, [isDataLoaded, dispatch])

    //? -------- functions ---------

    // function:: to load the data from the server 

    const loadSubjetAllocationData = async () => {
        try {
            const axiosInstance = axios.create()
            const method = 'get'
            const url = '/manage/get_subject_allocation_context'
            const response_obj = await CallAPI(StoredTokens, axiosInstance, url, method, RequestHeader)
            if (response_obj.error) {
                throw new Error(response_obj.errorMessage?.message)
            }
            const subjectAllocationData = response_obj.response?.data.data.subject_to_teacher_map
            const teacherAllocationData = response_obj.response?.data.data.teacher_to_subject_map
            setSubjectAllocation(subjectAllocationData)
            setTeacherAllocation(teacherAllocationData)
            dispatch(updateSubjectAllocationState({error:null,isDataLoaded:true,status:null,SubjectToTeacherAllocation:subjectAllocationData,TeacherToSubjectAllocation:teacherAllocationData}))

            //TODO: check the availability of the response 
            //TODO: stoer the state on the redux state

        }
        catch (error: any) {
            toast.error(error.message || "something went wrong.. please contact the administrator")
        }
    }

    //function:: to reset the subject allocation state from localstorage and recall the api
    const handleOnResetState = async()=>{
        try{
            const flag = confirm("Are you sure you want to reset load allocation")
            if(!flag){
                return;
            }
            const axiosInstance = axios.create()
            const method = 'post'
            const url = '/manage/rest_subject_allocation_context/'
            const response_obj = await CallAPI(StoredTokens, axiosInstance, url, method, RequestHeader)
            if (response_obj.error) {
                throw new Error(response_obj.errorMessage?.message)
            }
            dispatch(resetSubjectAllocationState())
        }
        catch(error:any){
            toast.error(error.message || "something went worong")
        }
    }
    //function:: to manage the increace and decrease the subject hours from subject to teacher map
    const handleOnChangeManageHoursForSubjectToTeacher = (current_hours: number, new_hours: number, subject_slug: string, teacher_slug: string, subject_type: string, allocation_catgory: any, flag: boolean) => {
        try {
            const state = _.cloneDeep(subjectAllocation);
            const teacherState = _.cloneDeep(teacherAllocation)
            // Determine the correct allocation array based on subject type
            const allocation_array = subject_type !== 'practical'
                ? state?.instant_allocations
                : state?.separate_allocations;

            if(!state){
                return;
            }
            // Find the subject map
            const subject_map = allocation_array?.find((d: any) => d.subject.slug === subject_slug);
            if (!subject_map) {
                toast.error("subject not found")
                return;
            }

            // Get subject allocation and teacher allocation
            const subject_allocation = subject_map.teacher_allocation[allocation_catgory as keyof TeacherAllocation];
            const teacher_map = subject_allocation.teachers.find((d: any) => d.teacher.slug === teacher_slug);
            if(!teacherState){
                toast.error("no teacher data is found")
                return;
            }
            const teacher = teacherState[0][teacher_slug];


            // Validate teacher and teacher map
            if (!teacher || !teacher_map) {
                toast.error("teacher not found")
                return;
            }

            // Determine hour change direction and calculate difference
            const isIncreasing = new_hours > current_hours;
            const difference_hours = Math.abs(new_hours - current_hours);

            // Common validation for both increase and decrease
            if (isIncreasing) {
                // Increase hours scenario
                console.log(subject_allocation.remaining_hours)
                if (subject_allocation.remaining_hours - difference_hours < 0) {
                    toast.error("subject is full")
                    return;
                }

                if (teacher.total_hours_left - difference_hours < 0) {
                    toast.error("teacher is fully allocated")
                    return;
                }

                // Update allocations for increasing hour
                subject_allocation.allocation_done += difference_hours;
                subject_allocation.remaining_hours -= difference_hours;
                teacher_map.hours += difference_hours;
                teacher.total_hours_left -= difference_hours;
                const allocation_type = teacher[allocation_catgory as keyof typeof teacher]

                if (Object.keys(allocation_catgory).length === 0 || allocation_type === null) {
                    toast.error("no subject found from teacher to subject map")
                    return
                }
                if (allocation_type) {
                    allocation_type[subject_slug].hours += difference_hours;
                }
                if (subject_type !== 'practical') {
                    state.stats.unallocated_subject_hours_instant_allocation -= difference_hours
                    state.stats.unallocated_teacher_hours_instant_allocation -= difference_hours
                }
                else {
                    state.stats.unallocated_subject_hours_serparate_allocation -= difference_hours
                    state.stats.unallocated_teacher_hours_separate_allocation -= difference_hours
                }

            } else {
                // Decrease hours scenario
                if (subject_allocation.allocation_done - difference_hours <= 0) {
                    toast.error("can not decrease hours scenario")
                    return;
                }

                if (teacher_map.hours - difference_hours < 0) {
                    toast.error("teacher has no hours to decrease")
                    return;
                }

                // Update allocations for decreasing hours
                subject_allocation.allocation_done -= difference_hours;
                subject_allocation.remaining_hours += difference_hours;
                teacher_map.hours -= difference_hours;
                teacher.total_hours_left += difference_hours;

                const allocation_type = teacher[allocation_catgory as keyof typeof teacher]
                if (Object.keys(allocation_catgory).length === 0 || allocation_type === null) {
                    toast.error("no subject found from teacher to subject map")
                    return
                }
                if (allocation_type) {
                    allocation_type[subject_slug].hours -= difference_hours;
                }
                if (new_hours == 0) {
                    // remove the subject from teacher to subject map 
                    delete allocation_type[subject_slug]
                    // remove the teacher from subject to teacher map
                    const teacher_index = subject_allocation.teachers.findIndex((d: any) => d.teacher.slug === teacher_map.teacher.slug)
                    if (teacher_index !== -1) {
                        subject_allocation.teachers.splice(teacher_index, 1)
                    }
                }
                if (subject_type !== 'practical') {
                    state.stats.unallocated_subject_hours_instant_allocation += difference_hours
                    state.stats.unallocated_teacher_hours_instant_allocation += difference_hours
                }
                else {
                    state.stats.unallocated_subject_hours_serparate_allocation += difference_hours
                    state.stats.unallocated_teacher_hours_separate_allocation += difference_hours
                }
            }

            setSubjectAllocation(state)
            setTeacherAllocation(teacherState)

            if (flag) {
                // set the selected state of the subject to teacher map
                setSelectedSubject(subject_map)
            }
            else {
                // set the state of the selected teacher to subject map
                setSelectedTeacher(teacher)
            }
            dispatch(updateHoursForSubjectToTeacherMap({ state, teacherState }))

        }
        catch (error: any) {
            console.log(error.message)
            toast.error(error.message || "something went worng")
        }
    }

    //fuunction :: handleOnClickToDeleate the teacher / subject
    const handleOnClickToDeleteAllocation = (subject_slug: string, teacher_slug: string, subject_type: string, allocation_category: string) => {
        try {
            const state = _.cloneDeep(subjectAllocation);
            const teacherState = _.cloneDeep(teacherAllocation)
            if(!state){
                return;
            }
            if(!teacherState){
                return;
            }
            const allocation_array = subject_type !== 'practical'
                ? state.instant_allocations
                : state.separate_allocations;

            // Find the subject map
            const subject_map = allocation_array.find((d: any) => d.subject.slug === subject_slug);
            if (!subject_map) {
                toast.error("subject not found")
                return;
            }

            // Get subject allocation and teacher allocation
            const subject_allocation = subject_map.teacher_allocation[allocation_category as keyof TeacherAllocation];
            const teacher_map = subject_allocation.teachers.find((d: any) => d.teacher.slug === teacher_slug);
            const teacher = teacherState[0][teacher_slug];

            // Validate teacher and teacher map
            if (!teacher || !teacher_map) {
                toast.error("teacher not found")
                return;
            }

            subject_allocation.allocation_done -= teacher_map.hours
            subject_allocation.remaining_hours += teacher_map.hours;
            teacher.total_hours_left += teacher_map.hours
            const allocation_type = teacher[allocation_category as keyof typeof teacher]
            delete allocation_type[subject_slug]
            const teacher_index = subject_allocation.teachers.findIndex((d: any) => d.teacher.slug === teacher_map.teacher.slug)
            if (teacher_index !== -1) {
                subject_allocation.teachers.splice(teacher_index, 1)
            }
            console.log(subject_allocation)
            console.log(allocation_type)
            if (subject_type !== 'practical') {
                state.stats.unallocated_subject_hours_instant_allocation += teacher_map.hours
                state.stats.unallocated_teacher_hours_instant_allocation += teacher_map.hours
            }
            else{
                state.stats.unallocated_subject_hours_serparate_allocation += teacher_map.hours
                state.stats.unallocated_teacher_hours_separate_allocation += teacher_map.hours
            }

            setSubjectAllocation(state)
            setTeacherAllocation(teacherState)
            setSelectedSubject(subject_map)
            dispatch(updateHoursForSubjectToTeacherMap({ state, teacherState }))
            toast.success("Teacher has removed succssfully")

        }
        catch (error: any) {
            toast.error(error.message || "something went worng")
        }
    }

    //function :: to get the teacher list based on the subject category and remaining hours
    const getTeacherList = (allocation_category:string)=>{
        try{
            if(!teacherAllocation){
                throw new Error("teacher data is not found")
            }
            const hours = allocation_category == "Lab" || allocation_category == 'Practical' ? 2 : 1
            const filterdData = Object.entries(teacherAllocation[0]).filter(([_,value])=> value.total_hours_left  >= hours)
            setTeacherList(filterdData)
            // .map(([key, value]) => ({ [key]: value }));
            
        }
        catch(error:any){
            toast.error(error.message || "something went worng")
        }
    }


    //function:: add the new teacher to particular subject
    const addTeacherToSubject = (teacher_slug: string, subject_slug: string, hours: number, subject_type: string, allocation_category: string) => {
        try {
            const state = _.cloneDeep(subjectAllocation);
            const teacherState = _.cloneDeep(teacherAllocation)
            if(!teacherState || !state){
                return;
            }
            const allocation_array = subject_type !== 'practical'
                ? state.instant_allocations
                : state.separate_allocations;

            const subject_map = allocation_array.find((d: any) => d.subject.slug === subject_slug);
            const teacher = teacherState[0][teacher_slug];
            if(!teacher){
                throw new Error("teacher is not found")
                
            }
            if (!subject_map) {
                throw new Error("subject not found")
                
            }
            const subject_allocation = subject_map.teacher_allocation[allocation_category.toLowerCase() as keyof TeacherAllocation];
            if(subject_allocation.remaining_hours - hours >= 0){
                // add the teacher to subject
                subject_allocation.remaining_hours -= hours
                subject_allocation.allocation_done += hours
                teacher.total_hours_left -= hours
                const teacher_obj = {
                    teacher : teacher.teacher,
                    hours: hours
                }

                const teacher_map = subject_allocation.teachers.find((d:any)=>d.teacher.slug === teacher_slug)
                if(teacher_map){
                    teacher_map.hours += hours 
                }
                else{
                    subject_allocation.teachers.push(teacher_obj)
                }
                console.log(subject_allocation)
                const subject_obj = {
                    [subject_map?.subject.slug] : {
                        subject : subject_map?.subject,
                        hours : hours
                    }
                }
                
                if (subject_type !== 'practical') {
                    state.stats.unallocated_subject_hours_instant_allocation -= hours
                    state.stats.unallocated_teacher_hours_instant_allocation -= hours
                }
                else{
                    state.stats.unallocated_subject_hours_serparate_allocation -= hours
                    state.stats.unallocated_teacher_hours_separate_allocation -= hours
                }
                 const allocation_type = teacher[allocation_category.toLowerCase() as keyof typeof teacher]
                 console.log(allocation_type)
                 if (subject_slug in allocation_type){
                        allocation_type[subject_slug].hours += hours
                 }
                 else{
                      Object.assign(allocation_type,subject_obj)
                 }
                
                  console.log(allocation_type)
                  setSubjectAllocation(state)
                    setTeacherAllocation(teacherState)
                    setSelectedSubject(subject_map)
                    dispatch(updateHoursForSubjectToTeacherMap({ state, teacherState }))
                    setTeacherList(null)
                    toast.success("Teacher has succssfully assigned")
                
            }
            else{
                throw new Error("please allocate the less number of hours to teacher as total remaining hours are :" + subject_allocation.remaining_hours)
            }

        }
        catch (error: any) {
            toast.error(error.message || "something went worng")
            setTeacherList(null)
        }
    }

    //function:: to submit the allocation details to the server
    const handleOnSubmitAllocation = async()=>{
        try{
            const flag = confirm("Are you sure you want to confirm load allocation")
            if(!flag){
                return;
            }
            const body = {
                "subject_to_teacher_map" : subjectAllocation
            }
            const axiosInstance = axios.create()
            const method = 'post'
            const url = '/manage/confirm_subject_allocation/'
            const response_obj = await CallAPI(StoredTokens, axiosInstance, url, method, RequestHeader,body)
            if (response_obj.error) {
                throw new Error(response_obj.errorMessage?.message)
            }
            toast.success("Subject allocation has been confirmed successfully")
            dispatch(resetSubjectAllocationState())
            
        }catch(error:any){
            toast.error(error.messaage || "something went worng")
        }
    }
    return {
        activeTab,
        setActiveTab,
        SubjectToTeacherAllocation,
        TeacherToSubjectAllocation,
        loadSubjetAllocationData,
        handleOnChangeManageHoursForSubjectToTeacher,
        subjectAllocation,
        selectedSubject,
        setSelectedSubject,
        teacherAllocation,
        selectedTeacher,
        setSelectedTeacher,
        handleOnClickToDeleteAllocation,
        getTeacherList,
        teacherList,
        addTeacherToSubject,
        handleOnResetState,
        handleOnSubmitAllocation
    }
}


export default useSubjectToTeacherAllocation

