import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Reset all persisted state on every page load/reload for fresh demo onboarding experience
try {
  localStorage.clear();
  sessionStorage.clear();
} catch (e) {
  console.warn('Failed to clear storage:', e);
}

// Reset route to splash screen ('/') on every reload
if (window.location.pathname !== '/') {
  window.history.replaceState(null, '', '/');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
