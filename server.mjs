/* eslint-env node */
/* global process */
import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const app = express()
const PORT = process.env.PORT || 3001
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

// Middleware
app.use(cors())
app.use(express.json())

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' })
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(403).json({ error: 'Invalid or expired token.' })
  }
}

// Mock user database - In a real app, this would be a database
// Note: Users need to register first. For testing, you can register via the API
const users = []

// Mock database - In a real app, this would be a database
const portfolioData = {
  profile: {
    name: 'John Doe',
    title: 'Full Stack Developer & UI/UX Designer',
    bio: "I create beautiful, functional, and user-centered digital experiences that bring ideas to life.",
    about: "I'm a passionate developer with over 5 years of experience creating digital solutions. I love turning complex problems into simple, beautiful designs.",
    interests: "When I'm not coding, you'll find me exploring new technologies, contributing to open-source projects, or enjoying outdoor activities.",
    quickFacts: [
      '🎓 Computer Science Graduate',
      '💼 5+ Years Experience',
      '🌍 Remote Work Enthusiast',
      '🚀 Always Learning'
    ]
  },
  skills: [
    'React', 'JavaScript', 'Node.js', 'Python',
    'Tailwind CSS', 'TypeScript', 'MongoDB', 'AWS',
    'Git', 'Docker', 'Figma', 'Adobe XD'
  ],
  projects: [
    {
      id: 1,
      title: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with React, Node.js, and Stripe integration.',
      tech: ['React', 'Node.js', 'MongoDB']
    },
    {
      id: 2,
      title: 'Task Management App',
      description: 'Collaborative task management tool with real-time updates and team features.',
      tech: ['React', 'Firebase', 'Tailwind']
    },
    {
      id: 3,
      title: 'Weather Dashboard',
      description: 'Beautiful weather app with location-based forecasts and interactive maps.',
      tech: ['JavaScript', 'OpenWeather API', 'Chart.js']
    }
  ],
  socialLinks: {
    linkedin: '#',
    github: '#',
    twitter: '#'
  }
}

// Authentication Routes

// Register a new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' })
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password: hashedPassword,
      name,
      role: 'user'
    }
    users.push(newUser)

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get current user (protected route)
app.get('/api/auth/me', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.userId)
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role
  })
})

// Verify token
app.post('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: req.user
  })
})

// Initialize default admin user (for development/testing)
app.post('/api/auth/init-admin', async (req, res) => {
  try {
    if (users.length > 0) {
      return res.status(400).json({ error: 'Users already exist. Cannot initialize admin.' })
    }

    const { email = 'admin@example.com', password = 'admin123', name = 'Admin User' } = req.body
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create admin user
    const adminUser = {
      id: 1,
      email,
      password: hashedPassword,
      name,
      role: 'admin'
    }
    users.push(adminUser)

    // Generate JWT token
    const token = jwt.sign(
      { userId: adminUser.id, email: adminUser.email, role: adminUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    )

    res.status(201).json({
      message: 'Admin user initialized successfully',
      token,
      user: {
        id: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role
      },
      credentials: {
        email,
        password
      }
    })
  } catch (error) {
    console.error('Init admin error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET Routes

// Root info route
app.get('/', (req, res) => {
  res.type('application/json').send({
    message: 'Portfolio API is running',
    health: '/api/health',
    endpoints: {
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        me: 'GET /api/auth/me (protected)',
        verify: 'POST /api/auth/verify (protected)',
        initAdmin: 'POST /api/auth/init-admin (dev only)'
      },
      portfolio: {
        all: '/api/portfolio',
        profile: '/api/portfolio/profile',
        skills: '/api/portfolio/skills',
        projects: '/api/portfolio/projects',
        projectById: '/api/portfolio/projects/:id',
        social: '/api/portfolio/social',
        preferences: '/api/preferences'
      }
    }
  })
})

// Get all portfolio data
app.get('/api/portfolio', (req, res) => {
  res.json(portfolioData)
})

// Get profile information
app.get('/api/portfolio/profile', (req, res) => {
  res.json(portfolioData.profile)
})

// Get skills list
app.get('/api/portfolio/skills', (req, res) => {
  res.json(portfolioData.skills)
})

// Get all projects
app.get('/api/portfolio/projects', (req, res) => {
  res.json(portfolioData.projects)
})

// Get a specific project by ID
app.get('/api/portfolio/projects/:id', (req, res) => {
  const projectId = parseInt(req.params.id)
  const project = portfolioData.projects.find(p => p.id === projectId)
  
  if (!project) {
    return res.status(404).json({ error: 'Project not found' })
  }
  
  res.json(project)
})

// Get social links
app.get('/api/portfolio/social', (req, res) => {
  res.json(portfolioData.socialLinks)
})

// Get preferences (placeholder for future use)
app.get('/api/preferences', (req, res) => {
  res.json({
    theme: 'light',
    language: 'en',
    colorScheme: 'blue'
  })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' })
})

// PUT/PATCH/DELETE Routes (Protected - require authentication)

// Update user profile (PUT - replaces entire resource)
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body
    const user = users.find(u => u.id === req.user.userId)
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Check if email is being changed and already exists
    if (email && email !== user.email) {
      const emailExists = users.find(u => u.email === email && u.id !== user.id)
      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' })
      }
    }

    // Update user
    if (name) user.name = name
    if (email) user.email = email

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update user password (PATCH - partial update)
app.patch('/api/auth/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' })
    }

    const user = users.find(u => u.id === req.user.userId)
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    // Update password
    user.password = await bcrypt.hash(newPassword, 10)

    res.json({ message: 'Password updated successfully' })
  } catch (error) {
    console.error('Update password error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update portfolio profile (PATCH)
app.patch('/api/portfolio/profile', authenticateToken, (req, res) => {
  try {
    const updates = req.body
    
    // Update only provided fields
    if (updates.name !== undefined) portfolioData.profile.name = updates.name
    if (updates.title !== undefined) portfolioData.profile.title = updates.title
    if (updates.bio !== undefined) portfolioData.profile.bio = updates.bio
    if (updates.about !== undefined) portfolioData.profile.about = updates.about
    if (updates.interests !== undefined) portfolioData.profile.interests = updates.interests
    if (updates.quickFacts !== undefined) portfolioData.profile.quickFacts = updates.quickFacts

    res.json({
      message: 'Profile updated successfully',
      profile: portfolioData.profile
    })
  } catch (error) {
    console.error('Update portfolio profile error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Update a project (PUT - replaces entire project)
app.put('/api/portfolio/projects/:id', authenticateToken, (req, res) => {
  try {
    const projectId = parseInt(req.params.id)
    const { title, description, tech } = req.body

    if (!title || !description || !tech) {
      return res.status(400).json({ error: 'Title, description, and tech are required' })
    }

    const projectIndex = portfolioData.projects.findIndex(p => p.id === projectId)
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' })
    }

    // Replace entire project
    portfolioData.projects[projectIndex] = {
      id: projectId,
      title,
      description,
      tech: Array.isArray(tech) ? tech : [tech]
    }

    res.json({
      message: 'Project updated successfully',
      project: portfolioData.projects[projectIndex]
    })
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Partially update a project (PATCH)
app.patch('/api/portfolio/projects/:id', authenticateToken, (req, res) => {
  try {
    const projectId = parseInt(req.params.id)
    const updates = req.body

    const project = portfolioData.projects.find(p => p.id === projectId)
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' })
    }

    // Update only provided fields
    if (updates.title !== undefined) project.title = updates.title
    if (updates.description !== undefined) project.description = updates.description
    if (updates.tech !== undefined) project.tech = Array.isArray(updates.tech) ? updates.tech : [updates.tech]

    res.json({
      message: 'Project updated successfully',
      project
    })
  } catch (error) {
    console.error('Update project error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete a project (DELETE)
app.delete('/api/portfolio/projects/:id', authenticateToken, (req, res) => {
  try {
    const projectId = parseInt(req.params.id)
    const projectIndex = portfolioData.projects.findIndex(p => p.id === projectId)
    
    if (projectIndex === -1) {
      return res.status(404).json({ error: 'Project not found' })
    }

    const deletedProject = portfolioData.projects.splice(projectIndex, 1)[0]

    res.json({
      message: 'Project deleted successfully',
      project: deletedProject
    })
  } catch (error) {
    console.error('Delete project error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Delete user account (DELETE)
app.delete('/api/auth/account', authenticateToken, async (req, res) => {
  try {
    const userIndex = users.findIndex(u => u.id === req.user.userId)
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' })
    }

    users.splice(userIndex, 1)

    res.json({ message: 'Account deleted successfully' })
  } catch (error) {
    console.error('Delete account error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})

