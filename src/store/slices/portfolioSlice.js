import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

const API_BASE_URL = 'http://localhost:3001/api'

// Async thunks for fetching data from API
export const fetchPortfolio = createAsyncThunk(
  'portfolio/fetchPortfolio',
  async () => {
    const response = await fetch(`${API_BASE_URL}/portfolio`)
    if (!response.ok) {
      throw new Error('Failed to fetch portfolio data')
    }
    return response.json()
  }
)

export const fetchProfile = createAsyncThunk(
  'portfolio/fetchProfile',
  async () => {
    const response = await fetch(`${API_BASE_URL}/portfolio/profile`)
    if (!response.ok) {
      throw new Error('Failed to fetch profile data')
    }
    return response.json()
  }
)

export const fetchSkills = createAsyncThunk(
  'portfolio/fetchSkills',
  async () => {
    const response = await fetch(`${API_BASE_URL}/portfolio/skills`)
    if (!response.ok) {
      throw new Error('Failed to fetch skills data')
    }
    return response.json()
  }
)

export const fetchProjects = createAsyncThunk(
  'portfolio/fetchProjects',
  async () => {
    const response = await fetch(`${API_BASE_URL}/portfolio/projects`)
    if (!response.ok) {
      throw new Error('Failed to fetch projects data')
    }
    return response.json()
  }
)

export const fetchProjectById = createAsyncThunk(
  'portfolio/fetchProjectById',
  async (projectId) => {
    const response = await fetch(`${API_BASE_URL}/portfolio/projects/${projectId}`)
    if (!response.ok) {
      throw new Error('Failed to fetch project data')
    }
    return response.json()
  }
)

export const fetchSocialLinks = createAsyncThunk(
  'portfolio/fetchSocialLinks',
  async () => {
    const response = await fetch(`${API_BASE_URL}/portfolio/social`)
    if (!response.ok) {
      throw new Error('Failed to fetch social links data')
    }
    return response.json()
  }
)

const initialState = {
  profile: {
    name: '',
    title: '',
    bio: '',
    about: '',
    interests: '',
    quickFacts: []
  },
  skills: [],
  projects: [],
  socialLinks: {
    linkedin: '#',
    github: '#',
    twitter: '#'
  },
  loading: false,
  error: null
}

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    updateProfile: (state, action) => {
      state.profile = { ...state.profile, ...action.payload }
    },
    addSkill: (state, action) => {
      state.skills.push(action.payload)
    },
    removeSkill: (state, action) => {
      state.skills = state.skills.filter(skill => skill !== action.payload)
    },
    addProject: (state, action) => {
      const newProject = {
        ...action.payload,
        id: Math.max(...state.projects.map(p => p.id), 0) + 1
      }
      state.projects.push(newProject)
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex(p => p.id === action.payload.id)
      if (index !== -1) {
        state.projects[index] = { ...state.projects[index], ...action.payload }
      }
    },
    removeProject: (state, action) => {
      state.projects = state.projects.filter(p => p.id !== action.payload)
    },
    updateSocialLinks: (state, action) => {
      state.socialLinks = { ...state.socialLinks, ...action.payload }
    },
    clearError: (state) => {
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch portfolio (all data)
      .addCase(fetchPortfolio.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchPortfolio.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload.profile
        state.skills = action.payload.skills
        state.projects = action.payload.projects
        state.socialLinks = action.payload.socialLinks
      })
      .addCase(fetchPortfolio.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch profile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false
        state.profile = action.payload
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch skills
      .addCase(fetchSkills.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        state.loading = false
        state.skills = action.payload
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false
        state.projects = action.payload
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false
        const index = state.projects.findIndex(p => p.id === action.payload.id)
        if (index !== -1) {
          state.projects[index] = action.payload
        } else {
          state.projects.push(action.payload)
        }
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
      // Fetch social links
      .addCase(fetchSocialLinks.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSocialLinks.fulfilled, (state, action) => {
        state.loading = false
        state.socialLinks = action.payload
      })
      .addCase(fetchSocialLinks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message
      })
  }
})

export const {
  updateProfile,
  addSkill,
  removeSkill,
  addProject,
  updateProject,
  removeProject,
  updateSocialLinks,
  clearError
} = portfolioSlice.actions

export default portfolioSlice.reducer

