import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { UIProvider } from './contexts/UIContext'
import './index.css'
import App from './App.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <UIProvider>
        <App />
      </UIProvider>
    </Provider>
  </StrictMode>
)

