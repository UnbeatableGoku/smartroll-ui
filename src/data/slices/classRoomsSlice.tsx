import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IInitialState {
  classes: IClassrooms[]
}
interface IClassrooms {
  slug: string
  classroom_name: string
}

const initialState: IInitialState = {
  classes: [],
}

const classRoomsSlice = createSlice({
  name: 'classRooms',
  initialState,
  reducers: {
    setClassRoomList: (state, action: PayloadAction<IClassrooms[]>) => {
      return {
        ...state,
        classes: action.payload,
      }
    },
  },
})

export const { setClassRoomList } = classRoomsSlice.actions
export default classRoomsSlice.reducer
