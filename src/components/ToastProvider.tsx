import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

export type ToastKind = 'info' | 'success' | 'error'
export type ToastItem = { id: string; kind: ToastKind; message: string; timeout: number }

const ToastCtx = createContext<{
  show: (message: string, kind?: ToastKind, timeoutMs?: number) => void
} | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const show = useCallback((message: string, kind: ToastKind = 'info', timeoutMs = 3500) => {
    const id = Math.random().toString(36).slice(2)
    const item: ToastItem = { id, kind, message, timeout: Date.now() + timeoutMs }
    setItems(prev => [...prev, item])
    window.setTimeout(() => {
      setItems(prev => prev.filter(x => x.id !== id))
    }, timeoutMs)
  }, [])

  const value = useMemo(() => ({ show }), [show])

  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 80, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map(i => (
          <div key={i.id}
               style={{
                 minWidth: 220,
                 maxWidth: 360,
                 padding: '10px 12px',
                 borderRadius: 10,
                 color: '#E6EDF3',
                 background: i.kind === 'error' ? 'rgba(220, 38, 38, 0.9)'
                   : i.kind === 'success' ? 'rgba(16, 185, 129, 0.9)'
                   : 'rgba(30, 41, 59, 0.9)',
                 boxShadow: '0 6px 20px rgba(0,0,0,0.25)'
               }}>
            {i.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
