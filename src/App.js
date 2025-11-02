import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useUI } from './contexts/UIContext'
import { ContactForm } from './components/ContactForm'
import { Auth } from './components/Auth'
import APITester from './components/APITester'
import { fetchPortfolio } from './store/slices/portfolioSlice'
import { initializeAuth, getCurrentUser, logout } from './store/slices/authSlice'

function App() {
  const dispatch = useDispatch()
  const { activeSection, showContactForm, scrollToSection, toggleContactForm } = useUI()
  const { profile, skills, projects, socialLinks, loading, error } = useSelector(state => state.portfolio)
  const { isAuthenticated, user } = useSelector(state => state.auth)
  const [showAPITester, setShowAPITester] = useState(false)

  useEffect(() => {
    // Initialize auth from localStorage
    dispatch(initializeAuth())
    
    // Try to get current user if token exists
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(getCurrentUser()).catch(() => {
        // Token is invalid, clear auth
        dispatch(logout())
      })
    }
    
    dispatch(fetchPortfolio())
  }, [dispatch])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <p className="text-gray-600">Make sure the API server is running on http://localhost:3001</p>
        </div>
      </div>
    )
  }

  // Show auth component if user is not authenticated
  // Wait for auth initialization to complete
  if (!isAuthenticated) {
    return <Auth />
  }

  const handleLogout = () => {
    dispatch(logout())
  }

  // Show API Tester if toggled
  if (showAPITester) {
    return (
      <div>
        {/* Navigation */}
        <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">{profile.name || 'API-Boilerplate'}</h1>
            <div className="flex items-center space-x-8">
              <button 
                onClick={() => setShowAPITester(false)}
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Home
              </button>
              <button 
                onClick={() => setShowAPITester(false)}
                className="text-gray-700 hover:text-blue-600 transition"
              >
                About
              </button>
              <button 
                onClick={() => setShowAPITester(false)}
                className="text-gray-700 hover:text-blue-600 transition"
              >
                Services
              </button>
              <button 
                onClick={() => setShowAPITester(false)}
                className="text-blue-600 font-semibold"
              >
                Test Your API
              </button>
              {isAuthenticated && user && (
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </nav>
        <div className="pt-16">
          <APITester />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">{profile.name}</h1>
          <div className="hidden md:flex items-center space-x-8">
            <button onClick={() => scrollToSection('home')} className={`hover:text-blue-600 transition ${activeSection === 'home' ? 'text-blue-600' : 'text-gray-700'}`}>Home</button>
            <button onClick={() => scrollToSection('about')} className={`hover:text-blue-600 transition ${activeSection === 'about' ? 'text-blue-600' : 'text-gray-700'}`}>About</button>
            <button onClick={() => scrollToSection('skills')} className={`hover:text-blue-600 transition ${activeSection === 'skills' ? 'text-blue-600' : 'text-gray-700'}`}>Skills</button>
            <button onClick={() => scrollToSection('projects')} className={`hover:text-blue-600 transition ${activeSection === 'projects' ? 'text-blue-600' : 'text-gray-700'}`}>Projects</button>
            <button onClick={() => scrollToSection('contact')} className={`hover:text-blue-600 transition ${activeSection === 'contact' ? 'text-blue-600' : 'text-gray-700'}`}>Contact</button>
            <button onClick={() => setShowAPITester(true)} className={`hover:text-blue-600 transition ${showAPITester ? 'text-blue-600' : 'text-gray-700'}`}>Test Your API</button>
            {isAuthenticated && user && (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">Welcome, {user.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="pt-20 pb-16 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              Hi, I'm <span className="text-blue-600">{profile.name}</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              {profile.title}
            </p>
            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              {profile.bio}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection('projects')}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                View My Work
              </button>
              <button
                onClick={() => scrollToSection('contact')}
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition duration-300"
              >
                Get In Touch
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-8">About Me</h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-lg text-gray-600 mb-6">
                  {profile.about}
                </p>
                <p className="text-lg text-gray-600">
                  {profile.interests}
                </p>
              </div>
              <div className="bg-gray-100 p-8 rounded-lg">
                <h3 className="text-2xl font-semibold mb-4">Quick Facts</h3>
                <ul className="text-left space-y-2">
                  {profile.quickFacts.map((fact, index) => (
                    <li key={index}>{fact}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Skills & Technologies</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {skills.map((skill, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm text-center hover:shadow-md transition">
                <span className="font-medium text-gray-800">{skill}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">Featured Projects</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-50 p-6 rounded-lg hover:shadow-lg transition duration-300">
                <h3 className="text-xl font-semibold mb-3 text-gray-900">{project.title}</h3>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Let's Work Together</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            I'm always interested in new opportunities and exciting projects.
            Let's discuss how we can bring your ideas to life!
          </p>
          <button
            onClick={toggleContactForm}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            {showContactForm ? 'Hide Contact Form' : 'Contact Me'}
          </button>
          <ContactForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 {profile.name}. All rights reserved.</p>
          <div className="flex justify-center space-x-6 mt-4">
            <a href={socialLinks.linkedin} className="hover:text-blue-400 transition">LinkedIn</a>
            <a href={socialLinks.github} className="hover:text-blue-400 transition">GitHub</a>
            <a href={socialLinks.twitter} className="hover:text-blue-400 transition">Twitter</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

