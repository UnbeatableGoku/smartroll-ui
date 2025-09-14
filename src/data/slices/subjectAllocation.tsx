import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SubjectToTeacherMap, TeacherToSubjectMap } from 'types/common';

interface InitialStateInterface {
    SubjectToTeacherAllocation: SubjectToTeacherMap | null,
    TeacherToSubjectAllocation: TeacherToSubjectMap[] | null
    status: string | null,
    error: string | null,
    isDataLoaded: boolean | null
}

const initialState: InitialStateInterface = {
    SubjectToTeacherAllocation: null,
    TeacherToSubjectAllocation: null,
    status: 'ideal',
    error: null,
    isDataLoaded: false
}
const subjectAllocationSlice = createSlice({
    name: 'subjectAllocation',
    initialState,
    reducers: {
        updateSubjectAllocationState: (state: InitialStateInterface, action: PayloadAction<{ SubjectToTeacherAllocation: SubjectToTeacherMap, status: string | null, error: string | null, isDataLoaded: boolean,TeacherToSubjectAllocation: TeacherToSubjectMap[] }>) => {
            return {
                ...state,
                SubjectToTeacherAllocation: action.payload.SubjectToTeacherAllocation,
                TeacherToSubjectAllocation: action.payload.TeacherToSubjectAllocation,
                status: action.payload.status,
                error: action.payload.error,
                isDataLoaded: action.payload.isDataLoaded
            }
        },
        resetSubjectAllocationState: (state:InitialStateInterface)=>{
            return {
                ...state,
                error: null,
                isDataLoaded:false,
                status:null,
                SubjectToTeacherAllocation:null,
                TeacherToSubjectAllocation:null
            }
        },
        updateHoursForSubjectToTeacherMap: (state: InitialStateInterface, action: PayloadAction<{
            state: SubjectToTeacherMap,
            teacherState: TeacherToSubjectMap[]            
        }>) => {
              return {
                ... state,
                error : null,
                SubjectToTeacherAllocation : action.payload.state,
                TeacherToSubjectAllocation : action.payload.teacherState
              }  

            
        },
    },
})

export const { updateSubjectAllocationState,updateHoursForSubjectToTeacherMap,resetSubjectAllocationState} = subjectAllocationSlice.actions
export default subjectAllocationSlice.reducer;