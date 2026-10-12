import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const urlParams = new URLSearchParams(window.location.search);
// Check if Flow B is requested
const isFlowB = urlParams.get('flow') === 'b';
const skipReset = urlParams.get('direct') === '1' || urlParams.get('skip_reset') === '1';

// Reset all persisted state on every page load/reload for fresh demo onboarding experience (Flow A only)
if (!isFlowB && !skipReset) {
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
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
