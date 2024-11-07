import {createSlice, PayloadAction  } from '@reduxjs/toolkit' 
import { DecodedToken } from 'types/common'

interface authState {
    isAuth: boolean,
    accessToken: string | null,
    refreshToken: string | null,
    userProfile : DecodedToken | null,
}

const initialState: authState = {
    isAuth: true,
    accessToken: localStorage.getItem("accessToken"),
    refreshToken: localStorage.getItem("refreshToken"),
    userProfile: {
        "token_type": "access",
        "exp": 1730962488,
        "iat": 1730876088,
        "jti": "7eb4a39c499f4787ae3d1bd9bb94bc1c",
        "user_id": 1,
        "obj": {
          "id": 1,
          "profile": {
            "name": null,
            "email": "manavshah1011.ms@gmail.com",
            "role": "admin"
          },
          "branch": {
            "branch_name": "Computer Engineering",
            "branch_code": "07",
            "slug": "308480_1730293139"
          }
        }
      }
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
        },
        setUserProfile: (state, action: PayloadAction<DecodedToken>) =>{
            return {
                ...state,
                userProfile: action.payload
            }
        }
    }
})

export const { setAuth,setUserProfile } = authSlice.actions
export default authSlice.reducer