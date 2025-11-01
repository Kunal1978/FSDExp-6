import { createContext, useContext, useState } from 'react'

const UIContext = createContext()

export const useUI = () => {
  const context = useContext(UIContext)
  if (!context) {
    throw new Error('useUI must be used within a UIProvider')
  }
  return context
}

export const UIProvider = ({ children }) => {
  const [activeSection, setActiveSection] = useState('home')
  const [showContactForm, setShowContactForm] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    element?.scrollIntoView({ behavior: 'smooth' })
    setActiveSection(sectionId)
    setIsMenuOpen(false)
  }

  const toggleContactForm = () => {
    setShowContactForm(prev => !prev)
  }

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  const value = {
    activeSection,
    setActiveSection,
    showContactForm,
    setShowContactForm,
    isMenuOpen,
    setIsMenuOpen,
    scrollToSection,
    toggleContactForm,
    toggleMenu
  }

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  )
}

