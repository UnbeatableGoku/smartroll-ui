import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface loaderInteface {
  LOADER_STATE: boolean
  message: string | null
}

const initialState: loaderInteface = {
  LOADER_STATE: false,
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
  },
})
export const { setLoader } = loaderSlice.actions
export default loaderSlice.reducer
