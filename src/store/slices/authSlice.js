import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_BASE_URL = 'http://localhost:3001/api'

// Get token from localStorage
const getToken = () => localStorage.getItem('token')
const getUser = () => {
  const userStr = localStorage.getItem('user')
  return userStr ? JSON.parse(userStr) : null
}

// Set token in localStorage
const setToken = (token) => {
  if (token) {
    localStorage.setItem('token', token)
  } else {
    localStorage.removeItem('token')
  }
}

// Set user in localStorage
const setUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user))
  } else {
    localStorage.removeItem('user')
  }
}

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        return rejectWithValue('Server returned an invalid response. Make sure the server is running on http://localhost:3001')
      }

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || 'Login failed')
      }

      setToken(data.token)
      setUser(data.user)
      return data
    } catch (error) {
      if (error.message.includes('JSON')) {
        return rejectWithValue('Server connection error. Make sure the server is running on http://localhost:3001')
      }
      return rejectWithValue(error.message)
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        return rejectWithValue('Server returned an invalid response. Make sure the server is running on http://localhost:3001')
      }

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || 'Registration failed')
      }

      setToken(data.token)
      setUser(data.user)
      return data
    } catch (error) {
      if (error.message.includes('JSON')) {
        return rejectWithValue('Server connection error. Make sure the server is running on http://localhost:3001')
      }
      return rejectWithValue(error.message)
    }
  }
)

export const getCurrentUser = createAsyncThunk(
  'auth/getCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken()
      if (!token) {
        return rejectWithValue('No token found')
      }

      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || 'Failed to get user')
      }

      setUser(data)
      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

export const verifyToken = createAsyncThunk(
  'auth/verifyToken',
  async (_, { rejectWithValue }) => {
    try {
      const token = getToken()
      if (!token) {
        return rejectWithValue('No token found')
      }

      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        return rejectWithValue(data.error || 'Token verification failed')
      }

      return data
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
)

const initialState = {
  user: getUser(),
  token: getToken(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      setToken(null)
      setUser(null)
    },
    clearError: (state) => {
      state.error = null
    },
    initializeAuth: (state) => {
      const token = getToken()
      const user = getUser()
      state.token = token
      state.user = user
      state.isAuthenticated = !!token
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.payload
      })
      // Register
      .addCase(register.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.error = null
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.error = action.payload
      })
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        setToken(null)
        setUser(null)
        state.error = action.payload
      })
      // Verify token
      .addCase(verifyToken.pending, (state) => {
        state.loading = true
      })
      .addCase(verifyToken.fulfilled, (state) => {
        state.loading = false
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.loading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
        setToken(null)
        setUser(null)
        state.error = action.payload
      })
  },
})

export const { logout, clearError, initializeAuth } = authSlice.actions
export default authSlice.reducer

