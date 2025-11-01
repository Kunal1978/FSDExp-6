import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { login } from '../store/slices/authSlice'

export const Login = ({ onSwitchToRegister }) => {
  const dispatch = useDispatch()
  const { loading, error } = useSelector(state => state.auth)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await dispatch(login(formData)).unwrap()
      // Login successful - the auth slice will update the state
    } catch (err) {
      // Error is already handled in the slice
      console.error('Login error:', err)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 mt-8">
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Login</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
            placeholder="Enter your email"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {onSwitchToRegister && (
        <p className="mt-4 text-center text-gray-600">
          Don't have an account?{' '}
          <button
            onClick={onSwitchToRegister}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Register here
          </button>
        </p>
      )}

      <div className="mt-6 p-3 bg-gray-100 rounded-lg text-sm text-gray-600">
        <p className="font-semibold mb-1">Getting Started:</p>
        <p className="text-xs">Register a new account or initialize an admin user via the API endpoint: POST /api/auth/init-admin</p>
      </div>
    </div>
  )
}

