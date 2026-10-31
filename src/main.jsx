import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const urlParams = new URLSearchParams(window.location.search);
// Check if Flow B is requested
const isFlowB = urlParams.get('flow') === 'b';
const skipReset = urlParams.get('direct') === '1' || urlParams.get('skip_reset') === '1';

// App routes that should never be reset or redirected back to splash screen
const isExplicitAppRoute =
  window.location.pathname.startsWith('/feed') ||
  window.location.pathname.startsWith('/city') ||
  window.location.pathname.startsWith('/menu') ||
  window.location.pathname.startsWith('/profile') ||
  window.location.pathname.startsWith('/videos') ||
  window.location.pathname.startsWith('/epaper') ||
  window.location.pathname.startsWith('/saved') ||
  window.location.pathname.startsWith('/notifications') ||
  window.location.pathname.startsWith('/search') ||
  window.location.pathname.startsWith('/article') ||
  window.location.pathname.startsWith('/advertise');

// Only reset persisted state and route to splash screen if landing directly on root '/' without bypass flags
if (!isFlowB && !skipReset && !isExplicitAppRoute && window.location.pathname === '/') {
  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch (e) {
    console.warn('Failed to clear storage:', e);
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Register service worker for Chrome / Android / PWA installation
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((err) => {
      console.warn('SW registration failed:', err);
    });
  });
}
