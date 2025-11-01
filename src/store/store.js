import { configureStore } from '@reduxjs/toolkit'
import portfolioReducer from './slices/portfolioSlice'
import preferencesReducer from './slices/preferencesSlice'
import authReducer from './slices/authSlice'

export const store = configureStore({
  reducer: {
    portfolio: portfolioReducer,
    preferences: preferencesReducer,
    auth: authReducer,
  },
})

