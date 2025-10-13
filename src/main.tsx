import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import './styles/glassmorphism.css' // NEW: Glassy/Vibey theme
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './components/ToastProvider'
import { ThemeProvider } from './contexts/ThemeContext' // NEW: Theme context
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <Suspense fallback={<div className="p-8 text-slate-500">Loading…</div>}>
            <App />
          </Suspense>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
