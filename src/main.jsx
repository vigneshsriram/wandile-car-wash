import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#1a1a1a', color: '#fff', border: '1px solid rgba(212,175,55,0.3)' },
            success: { iconTheme: { primary: '#D4AF37', secondary: '#0a0a0a' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
