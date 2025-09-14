import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface loaderInteface {
  LOADER_STATE: boolean
  RECONNECTION_LOADER_STAT: boolean
  PAGINATION_LOADER_STATE: boolean
  SHEET_LOADER_STATE: boolean
  message: string | null
}

const initialState: loaderInteface = {
  LOADER_STATE: false,
  RECONNECTION_LOADER_STAT: false,
  PAGINATION_LOADER_STATE: false,
  SHEET_LOADER_STATE: false,
  message: null,
}

const loaderSlice = createSlice({
  name: 'loader',
  initialState: initialState,
  reducers: {
    setLoader: (
      state,
      action: PayloadAction<{ state: boolean; message: string | null }>,
    ) => {
      state.LOADER_STATE = action.payload.state
      state.message = action.payload.message
    },
    setReconnectionLoader: (
      state,
      action: PayloadAction<{ state: boolean }>,
    ) => {
      state.RECONNECTION_LOADER_STAT = action.payload.state
    },
    setPaginationLoader: (state, action: PayloadAction<boolean>) => {
      state.PAGINATION_LOADER_STATE = action.payload
    },
    setSheetLoader: (state, action: PayloadAction<boolean>) => {
      state.SHEET_LOADER_STATE = action.payload
    },
  },
})
export const {
  setLoader,
  setReconnectionLoader,
  setPaginationLoader,
  setSheetLoader,
} = loaderSlice.actions
export default loaderSlice.reducer
