import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface Notification {
  slug: string
  status: string
  type: string
  message: string
}

interface NotificationState {
  seenNotifications: Notification[]
  unSeenNotifications: Notification[]
}

// Initial state
const initialState: NotificationState = {
  seenNotifications: [],
  unSeenNotifications: [],
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Action to set seen notifications
    setSeenNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.seenNotifications = action.payload
    },
    // Action to set unseen notifications
    setUnSeenNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.unSeenNotifications = action.payload
    },
    // Action to mark all notifications as read
    markAllAsRead: (state) => {
      state.seenNotifications = [
        ...state.seenNotifications,
        ...state.unSeenNotifications,
      ]
      state.unSeenNotifications = []
    },
    // Action to clear all notifications
    clearNotifications: (state) => {
      state.seenNotifications = []
      state.unSeenNotifications = []
    },
  },
})

export const {
  setSeenNotifications,
  setUnSeenNotifications,
  markAllAsRead,
  clearNotifications,
} = notificationSlice.actions

export default notificationSlice.reducer
