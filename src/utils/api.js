// Utility function for making authenticated API calls
const API_BASE_URL = 'http://localhost:3001/api'

export const getAuthHeaders = () => {
  const token = localStorage.getItem('token')
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  }
}

export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = getAuthHeaders()

  const config = {
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Request failed')
    }

    return data
  } catch (error) {
    throw error
  }
}

// Helper functions for common HTTP methods
export const apiGet = (endpoint) => apiRequest(endpoint, { method: 'GET' })
export const apiPost = (endpoint, body) => 
  apiRequest(endpoint, { method: 'POST', body: JSON.stringify(body) })
export const apiPut = (endpoint, body) => 
  apiRequest(endpoint, { method: 'PUT', body: JSON.stringify(body) })
export const apiPatch = (endpoint, body) => 
  apiRequest(endpoint, { method: 'PATCH', body: JSON.stringify(body) })
export const apiDelete = (endpoint) => 
  apiRequest(endpoint, { method: 'DELETE' })

