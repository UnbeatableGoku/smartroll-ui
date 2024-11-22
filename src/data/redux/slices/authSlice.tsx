import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { DecodedToken } from 'types/common'

interface authState {
  isAuth: boolean
  accessToken: string | null
  refreshToken: string | null
  userProfile: DecodedToken | null
}

const initialState: authState = {
  isAuth: true,
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  userProfile: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (
      state,
      action: PayloadAction<{
        isAuth: boolean
        access: string
        refresh: string
      }>,
    ) => {
      return {
        ...state,
        isAuth: action.payload.isAuth,
        accessToken: action.payload.access,
        refreshToken: action.payload.refresh,
      }
    },
    setUserProfile: (state, action: PayloadAction<DecodedToken>) => {
      
      return {
        ...state,
        userProfile: action.payload,
      }
    },
  },
})

export const { setAuth, setUserProfile } = authSlice.actions
export default authSlice.reducer
