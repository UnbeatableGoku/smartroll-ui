import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface Ibar {
  display: boolean
  title: string
  message: string
  type?: string
}

const initialState: Ibar = {
  display: false,
  title: '',
  message: '',
  type: '',
}
const barSlice = createSlice({
  name: 'bar',
  initialState: initialState,
  reducers: {
    showAdverticesment: (state, action: PayloadAction<Ibar>) => {
      ;(state.display = action.payload.display),
        (state.title = action.payload.title),
        (state.message = action.payload.message)
      state.type = action.payload.type
    },
    hideAdverticement: (state) => {
      ;(state.display = false),
        (state.title = ''),
        (state.message = ''),
        (state.type = '')
    },
  },
})
export const { showAdverticesment, hideAdverticement } = barSlice.actions
export default barSlice.reducer
