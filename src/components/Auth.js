import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Login } from './Login'
import { Register } from './Register'

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const { isAuthenticated } = useSelector(state => state.auth)

  // Auto-close if authenticated (handled by parent component, but safety check)
  useEffect(() => {
    if (isAuthenticated) {
      // Authentication state is managed in App.js
    }
  }, [isAuthenticated])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {isLogin ? (
        <Login onSwitchToRegister={() => setIsLogin(false)} />
      ) : (
        <Register onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  )
}

