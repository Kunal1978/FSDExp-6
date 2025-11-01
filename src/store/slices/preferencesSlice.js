import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  theme: 'light',
  language: 'en',
  colorScheme: 'blue'
}

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload
    },
    setLanguage: (state, action) => {
      state.language = action.payload
    },
    setColorScheme: (state, action) => {
      state.colorScheme = action.payload
    }
  }
})

export const { setTheme, setLanguage, setColorScheme } = preferencesSlice.actions

export default preferencesSlice.reducer

