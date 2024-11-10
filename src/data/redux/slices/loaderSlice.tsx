import {createSlice, PayloadAction  } from '@reduxjs/toolkit' 

interface loaderInteface {
    LOADER_STATE : boolean   
}

const initialState: loaderInteface = {
    LOADER_STATE: false
}

const loaderSlice = createSlice({
    name : 'loader',
    initialState : initialState,
    reducers : {
        setLoader : (state, action : PayloadAction<boolean>) => {
            state.LOADER_STATE = action.payload
        }
    }
})
export const { setLoader } = loaderSlice.actions
export default loaderSlice.reducer