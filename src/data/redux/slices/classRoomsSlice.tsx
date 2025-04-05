import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface IInitialState {
    isalreadyLoaded : boolean,
    classes : IClassrooms[]
}
interface IClassrooms {
    slug : string
    classroom_name : string
}

const initialState:IInitialState  = {
    isalreadyLoaded : false,
    classes : []
}

const classRoomsSlice = createSlice({
    name: 'classRooms',
    initialState,
    reducers: {
      setClassRoomList: (state, action: PayloadAction<IInitialState>) => {
        return {
            ...state,
            isalreadyLoaded : action.payload.isalreadyLoaded,
            classes : action.payload.classes
        };
      },
    }
  })
  
  export const { setClassRoomList } = classRoomsSlice.actions;
  export default classRoomsSlice.reducer;
  

  