import {configureStore} from '@reduxjs/toolkit'
import authSlice from './slices/authSlice'

const Store = configureStore({
    reducer: {
        auth: authSlice
    } 
})

// Define types for RootState and AppDispatch for better type support across the app
export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store