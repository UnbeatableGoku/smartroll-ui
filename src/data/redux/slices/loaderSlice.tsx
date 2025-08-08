import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface loaderInteface {
  LOADER_STATE: boolean
  RECONNECTION_LOADER_STAT: boolean
  message: string | null
}

const initialState: loaderInteface = {
  LOADER_STATE: false,
  RECONNECTION_LOADER_STAT: false,
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
  },
})
export const { setLoader, setReconnectionLoader } = loaderSlice.actions
export default loaderSlice.reducer
