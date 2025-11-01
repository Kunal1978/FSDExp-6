import { useState } from 'react'
import { useUI } from '../contexts/UIContext'

export const ContactForm = () => {
  const { showContactForm } = useUI()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically dispatch an action or make an API call
    console.log('Form submitted:', formData)
    // Reset form
    setFormData({ name: '', email: '', message: '' })
    alert('Message sent successfully!')
  }

  if (!showContactForm) return null

  return (
    <div className="mt-8 max-w-md mx-auto bg-white text-gray-900 p-6 rounded-lg">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Your Name"
          value={formData.name}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <textarea
          name="message"
          placeholder="Your Message"
          rows="4"
          value={formData.message}
          onChange={handleChange}
          className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded font-semibold hover:bg-blue-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
  )
}

