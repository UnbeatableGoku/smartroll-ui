import {createSlice, PayloadAction  } from '@reduxjs/toolkit' 

interface authState {
    isAuth: boolean,
    accessToken: string | null,
    refreshToken: string | null,
    
}

const initialState: authState = {
    isAuth: true,
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth: (state, action: PayloadAction<{isAuth : boolean,access: string,refresh: string}>) => {
            return {
                ...state,
                isAuth: action.payload.isAuth,
                accessToken: action.payload.access,
                refreshToken: action.payload.refresh,
            }
        }
    }
})

export const { setAuth } = authSlice.actions
export default authSlice.reducer