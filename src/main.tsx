import React, { Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastProvider } from './components/ToastProvider'
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ToastProvider>
        <Suspense fallback={<div className="p-8 text-slate-500">Loading…</div>}>
          <App />
        </Suspense>
      </ToastProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
