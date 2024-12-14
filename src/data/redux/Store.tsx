import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // Defaults to localStorage for web
import authSlice from './slices/authSlice';
import loaderSlice from './slices/loaderSlice';
import notificationSlice from './slices/notificationSlice';
import subjectAllocationSlice from './slices/subjectAllocation'
// Redux persist configuration
const persistConfig = {
  key: 'root', // Key for localStorage
  storage,     // Storage engine (e.g., localStorage)
};

// Combine all reducers into a single root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  loader: loaderSlice,
  notification: notificationSlice,
  subjectAllocation: subjectAllocationSlice
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

const Store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability checks for redux-persist
    }),
});

// Persistor for rehydration
export const persistor = persistStore(Store);

// Define types for RootState and AppDispatch for better type support across the app
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
