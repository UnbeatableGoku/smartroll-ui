import { PayloadAction, createSlice } from '@reduxjs/toolkit'

interface Notification {
  slug: string
  status: string
  type: string
  message: string
  type_code : string
}

interface notificationTypesInterface  {
  type : string,
  url : string,
  role : string
}

const notification_types:notificationTypesInterface[] = [
  {type: 'subject_choice_alert',url:'/teacher-dashboard/subject-choice',role : 'teacher'},
  {type: 'subject_choice_alert',url:'/student-dashboard/elective-subject',role : 'student'},
  {type: 'subject_deletion_alert',url:'/student-dashboard/elective-subject',role : 'student'},
  {type: 'subject_deletion_alert',url:'/teacher-dashboard/subject-choice',role : 'teacher'},
  {type: 'subject_choice_deadline_alert',url:'/teacher-dashboard/subject-choice',role : 'student'},
  {type: 'subject_choice_deadline_alert',url:'/teacher-dashboard/subject-choice',role : 'teacher'},
  {type: 'subject_choice_reset_alert',url:'/teacher-dashboard/subject-choice',role : 'student'},
  {type: 'subject_choice_reset_alert',url:'/teacher-dashboard/subject-choice',role : 'teacher'},
]

interface NotificationState {
  seenNotifications: Notification[]
  unSeenNotifications: Notification[],
  notificationTypes: notificationTypesInterface[] 
}

// Initial state
const initialState: NotificationState = {
  seenNotifications: [],
  unSeenNotifications: [],
  notificationTypes : notification_types 
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
