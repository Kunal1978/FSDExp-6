import { useState } from 'react'
import { useSelector } from 'react-redux'

const API_BASE_URL = 'http://localhost:3001/api'

const APITester = () => {
  const { token } = useSelector(state => state.auth)
  const [loginEmail, setLoginEmail] = useState('test@example.com')
  const [loginPassword, setLoginPassword] = useState('test123')
  const [loginResponse, setLoginResponse] = useState(null)
  const [loginLoading, setLoginLoading] = useState(false)

  // Form states for each endpoint
  const [profileForm, setProfileForm] = useState({ name: '', email: '' })
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '' })
  const [portfolioProfileForm, setPortfolioProfileForm] = useState({ name: '', title: '' })
  const [projectId, setProjectId] = useState('1')
  const [projectForm, setProjectForm] = useState({ title: '', description: '', tech: '' })
  const [projectPatchForm, setProjectPatchForm] = useState({ title: '' })
  const [deleteProjectId, setDeleteProjectId] = useState('1')

  // Response states
  const [responses, setResponses] = useState({})

  // Login function
  const handleLogin = async () => {
    setLoginLoading(true)
    setLoginResponse(null)
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })
      const data = await response.json()
      setLoginResponse({
        status: response.status,
        ok: response.ok,
        data: data,
        token: data.token ? `${data.token.substring(0, 50)}...` : null
      })
      if (data.token) {
        localStorage.setItem('token', data.token)
        window.location.reload() // Reload to update auth state
      }
    } catch (error) {
      setLoginResponse({
        status: 'Error',
        ok: false,
        data: { error: error.message }
      })
    }
    setLoginLoading(false)
  }

  // Generic request handler
  const handleRequest = async (endpoint, method, body = null, key) => {
    try {
      const url = `${API_BASE_URL}${endpoint}`
      const authToken = token || localStorage.getItem('token')
      
      const headers = {
        'Content-Type': 'application/json',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` })
      }

      const config = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) })
      }

      const response = await fetch(url, config)
      let data
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        const text = await response.text()
        data = { message: text || `Response status: ${response.status}` }
      }
      
      setResponses(prev => ({
        ...prev,
        [key]: {
          success: response.ok,
          status: response.status,
          data: data
        }
      }))
    } catch (error) {
      setResponses(prev => ({
        ...prev,
        [key]: {
          success: false,
          status: 'Error',
          data: { error: error.message }
        }
      }))
    }
  }

  const handlePutProfile = () => {
    handleRequest('/auth/profile', 'PUT', profileForm, 'putProfile')
  }

  const handlePatchPassword = () => {
    handleRequest('/auth/password', 'PATCH', passwordForm, 'patchPassword')
  }

  const handlePatchPortfolioProfile = () => {
    handleRequest('/portfolio/profile', 'PATCH', portfolioProfileForm, 'patchPortfolioProfile')
  }

  const handlePutProject = () => {
    const techArray = projectForm.tech.split(',').map(t => t.trim()).filter(t => t)
    handleRequest(`/portfolio/projects/${projectId}`, 'PUT', {
      title: projectForm.title,
      description: projectForm.description,
      tech: techArray
    }, 'putProject')
  }

  const handlePatchProject = () => {
    handleRequest(`/portfolio/projects/${projectId}`, 'PATCH', projectPatchForm, 'patchProject')
  }

  const handleDeleteProject = () => {
    handleRequest(`/portfolio/projects/${deleteProjectId}`, 'DELETE', null, 'deleteProject')
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      handleRequest('/auth/account', 'DELETE', null, 'deleteAccount')
    }
  }

  const currentToken = token || localStorage.getItem('token')

  return (
    <div className="min-h-screen bg-white text-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-gray-900">Test API Endpoints</h1>

        {/* Step 1: Get Token */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8 border border-gray-200 shadow-sm">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Step 1: Get your token (if you don't have one)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Method: POST</label>
              <label className="block text-sm font-medium mb-2 text-gray-700">URL: {API_BASE_URL}/auth/login</label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Email:</label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Password:</label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="test123"
              />
            </div>
            <button
              onClick={handleLogin}
              disabled={loginLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold disabled:opacity-50"
            >
              {loginLoading ? 'Sending...' : 'Send → Get Token'}
            </button>
            {loginResponse && (
              <div className={`mt-4 p-4 rounded ${loginResponse.ok ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <p className="font-semibold text-gray-900">Status: {loginResponse.status}</p>
                <pre className="mt-2 text-sm overflow-x-auto text-gray-800">
                  {JSON.stringify(loginResponse.data, null, 2)}
                </pre>
                {loginResponse.token && (
                  <p className="mt-2 text-yellow-600">Token (first 50 chars): {loginResponse.token}</p>
                )}
              </div>
            )}
            {currentToken && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <p className="font-semibold text-gray-900">Current Token:</p>
                <p className="text-sm break-all mt-2 text-gray-700">{currentToken.substring(0, 100)}...</p>
                <p className="text-xs mt-2 text-gray-600">Token is automatically included in all requests</p>
              </div>
            )}
          </div>
        </div>

        {/* Example Requests */}
        <div className="space-y-6">
          {/* 1. PUT - Update user profile */}
          <div className="bg-gray-50 rounded-lg p-6 border border-orange-300 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-orange-600">1. PUT — Update user profile (full update)</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Method: PUT | URL: {API_BASE_URL}/auth/profile</p>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Name:</label>
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Updated Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Email:</label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="newemail@example.com"
                />
              </div>
              <button
                onClick={handlePutProfile}
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded font-semibold"
              >
                Update Profile (Protected)
              </button>
              {responses.putProfile && (
                <div className={`mt-3 p-3 rounded ${responses.putProfile.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <pre className="text-xs overflow-x-auto text-gray-800">
                    {JSON.stringify(responses.putProfile.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* 2. PATCH - Update password */}
          <div className="bg-gray-50 rounded-lg p-6 border border-blue-300 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-blue-600">2. PATCH — Update password (partial update)</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Method: PATCH | URL: {API_BASE_URL}/auth/password</p>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Current Password:</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="test123"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">New Password:</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="newpassword456"
                />
              </div>
              <button
                onClick={handlePatchPassword}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-semibold"
              >
                Update Password (Protected)
              </button>
              {responses.patchPassword && (
                <div className={`mt-3 p-3 rounded ${responses.patchPassword.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <pre className="text-xs overflow-x-auto text-gray-800">
                    {JSON.stringify(responses.patchPassword.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* 3. PATCH - Update portfolio profile */}
          <div className="bg-gray-50 rounded-lg p-6 border border-purple-300 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">3. PATCH — Update portfolio profile (partial update)</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Method: PATCH | URL: {API_BASE_URL}/portfolio/profile</p>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Name:</label>
                <input
                  type="text"
                  value={portfolioProfileForm.name}
                  onChange={(e) => setPortfolioProfileForm({ ...portfolioProfileForm, name: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Title:</label>
                <input
                  type="text"
                  value={portfolioProfileForm.title}
                  onChange={(e) => setPortfolioProfileForm({ ...portfolioProfileForm, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Senior Developer"
                />
              </div>
              <button
                onClick={handlePatchPortfolioProfile}
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded font-semibold"
              >
                Update Portfolio Profile (Protected)
              </button>
              {responses.patchPortfolioProfile && (
                <div className={`mt-3 p-3 rounded ${responses.patchPortfolioProfile.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <pre className="text-xs overflow-x-auto text-gray-800">
                    {JSON.stringify(responses.patchPortfolioProfile.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* 4. PUT - Update project */}
          <div className="bg-gray-50 rounded-lg p-6 border border-yellow-300 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-yellow-600">4. PUT — Update project (full replacement)</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Method: PUT | URL: {API_BASE_URL}/portfolio/projects/:id</p>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Project ID:</label>
                <input
                  type="number"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Title:</label>
                <input
                  type="text"
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Updated Project"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Description:</label>
                <textarea
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="New description"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Tech (comma-separated):</label>
                <input
                  type="text"
                  value={projectForm.tech}
                  onChange={(e) => setProjectForm({ ...projectForm, tech: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>
              <button
                onClick={handlePutProject}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 rounded font-semibold"
              >
                Update Project (Protected)
              </button>
              {responses.putProject && (
                <div className={`mt-3 p-3 rounded ${responses.putProject.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <pre className="text-xs overflow-x-auto text-gray-800">
                    {JSON.stringify(responses.putProject.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* 5. PATCH - Partially update project */}
          <div className="bg-gray-50 rounded-lg p-6 border border-indigo-300 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">5. PATCH — Partially update project</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Method: PATCH | URL: {API_BASE_URL}/portfolio/projects/:id</p>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Project ID:</label>
                <input
                  type="number"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Title (only updating this field):</label>
                <input
                  type="text"
                  value={projectPatchForm.title}
                  onChange={(e) => setProjectPatchForm({ title: e.target.value })}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Only updating title"
                />
              </div>
              <button
                onClick={handlePatchProject}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded font-semibold"
              >
                Partially Update Project (Protected)
              </button>
              {responses.patchProject && (
                <div className={`mt-3 p-3 rounded ${responses.patchProject.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <pre className="text-xs overflow-x-auto text-gray-800">
                    {JSON.stringify(responses.patchProject.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* 6. DELETE - Delete project */}
          <div className="bg-gray-50 rounded-lg p-6 border border-red-300 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-red-600">6. DELETE — Delete a project</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Method: DELETE | URL: {API_BASE_URL}/portfolio/projects/:id</p>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Project ID:</label>
                <input
                  type="number"
                  value={deleteProjectId}
                  onChange={(e) => setDeleteProjectId(e.target.value)}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="1"
                />
              </div>
              <button
                onClick={handleDeleteProject}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded font-semibold"
              >
                Delete Project (Protected)
              </button>
              {responses.deleteProject && (
                <div className={`mt-3 p-3 rounded ${responses.deleteProject.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <pre className="text-xs overflow-x-auto text-gray-800">
                    {JSON.stringify(responses.deleteProject.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* 7. DELETE - Delete account */}
          <div className="bg-gray-50 rounded-lg p-6 border border-red-400 shadow-sm">
            <h3 className="text-xl font-semibold mb-4 text-red-600">7. DELETE — Delete user account</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Method: DELETE | URL: {API_BASE_URL}/auth/account</p>
              <p className="text-sm text-yellow-600 font-medium">⚠️ Warning: This will permanently delete your account!</p>
              <button
                onClick={handleDeleteAccount}
                className="bg-red-700 hover:bg-red-800 text-white px-6 py-2 rounded font-semibold"
              >
                Delete Account (Protected)
              </button>
              {responses.deleteAccount && (
                <div className={`mt-3 p-3 rounded ${responses.deleteAccount.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <pre className="text-xs overflow-x-auto text-gray-800">
                    {JSON.stringify(responses.deleteAccount.data, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Tip */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200 shadow-sm">
          <h3 className="text-xl font-semibold mb-2 text-gray-900">Quick Tip</h3>
          <p className="text-sm text-gray-700">
            Your token is automatically included in all requests via the Authorization header. 
            The token is stored in localStorage and sent with every authenticated request as: 
            <code className="bg-white border border-gray-300 px-2 py-1 rounded ml-1 text-gray-800">Authorization: Bearer {'{your-token}'}</code>
          </p>
        </div>
      </div>
    </div>
  )
}

export default APITester

