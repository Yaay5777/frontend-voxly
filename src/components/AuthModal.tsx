import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { login, register } from '../services/api'
import { useToast } from './ToastProvider'
import { useAuthStore } from '../store/useAuthStore'

export default function AuthModal({ open, onClose, onAuth }: { open: boolean; onClose: () => void; onAuth: () => void }) {
  const { show } = useToast()
  const { login: authLogin } = useAuthStore()
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmailVerification, setShowEmailVerification] = useState(false)

  // loosen typing for className on motion wrappers
  const MotionDiv = (motion.div as unknown) as React.FC<any>

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation for login
    if (tab === 'login') {
      if (!username.trim() || !password.trim()) {
        show('Please enter both username and password', 'error')
        return
      }
    } else {
      // Validation for registration
      if (!username.trim() || !email.trim() || !password.trim()) {
        show('Please fill in all fields', 'error')
        return
      }
      if (password.length < 8) {
        show('Password must be at least 8 characters', 'error')
        return
      }
      if (!email.includes('@') || !email.includes('.')) {
        show('Please enter a valid email address', 'error')
        return
      }
    }
    
    setLoading(true)
    try {
      console.log(`Attempting ${tab} for user: ${username}`)
      
      if (tab === 'login') {
        const data = await login(username, password)
        console.log('Login response:', data)
        if (data?.access_token) {
          // Create user object from response
          const user = {
            id: Date.now(),
            username: data.username || username,
            email: `${username}@example.com`,
            name: username,
            fullName: username,
            is_premium: (data as any).tier === 'premium',
            created_at: new Date().toISOString(),
            tier: ((data as any).tier || 'free') as 'free' | 'premium',
            weekly_quota: 1000,
            weekly_used: 0,
            quota_cycle_start: new Date().toISOString()
          }
          
          // Update auth store with token and user
          authLogin(data.access_token, user)
          
          show('Successfully logged in!', 'success')
          
          // Add small delay to ensure auth state is set
          setTimeout(() => {
            onAuth()
            onClose()
          }, 100)
        } else {
          show('Login failed - no access token received', 'error')
        }
      } else {
        // Registration with email verification
        const formData = new FormData()
        formData.append('username', username)
        formData.append('email', email)
        formData.append('password', password)
        
        const response = await fetch(`${import.meta.env.VITE_AUTH_URL || "https://auth-service-ancient-frost-8646.fly.dev"}/auth/register`, {
          method: 'POST',
          body: formData
        })
        
        const data = await response.json()
        console.log('Register response:', data)
        
        if (response.ok) {
          if (data.verification_required) {
            setShowEmailVerification(true)
            show('Registration successful! Please check your email to verify your account.', 'success')
          } else if (data.access_token) {
            // Immediate login (shouldn't happen with new system, but handle it)
            const user = {
              id: Date.now(),
              username: data.username || username,
              email: email,
              name: username,
              fullName: username,
              is_premium: data.tier === 'premium',
              created_at: new Date().toISOString(),
              tier: 'free' as const,
              weekly_quota: 1000,
              weekly_used: 0,
              quota_cycle_start: new Date().toISOString(),
            }
            
            authLogin(data.access_token, user)
            show('Successfully registered and logged in!', 'success')
            
            setTimeout(() => {
              onAuth()
              onClose()
            }, 100)
          }
        } else {
          throw new Error(data.detail || 'Registration failed')
        }
      }
    } catch (err: any) {
      console.error('Auth error:', err)
      const errorMessage = err?.response?.data?.detail || err?.response?.data?.message || err.message || 'Authentication failed'
      show(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setLoading(true)
    try {
      console.log('Attempting demo login...')
      const data = await login('testuser', 'testpass123')
      console.log('Demo login response:', data)
      if (data?.access_token) {
        // Create user object from response (backend returns {access_token, token_type, username})
        const user = {
          id: Date.now(),
          username: data.username || 'testuser',
          email: 'testuser@example.com',
          name: 'Test User',
          fullName: 'Test User',
          is_premium: false,
          created_at: new Date().toISOString(),
          tier: 'free' as const,
          weekly_quota: 1000,
          weekly_used: 0,
          quota_cycle_start: new Date().toISOString(),
        }
        
        // Update auth store with token and user
        authLogin(data.access_token, user)
        
        show('Successfully logged in with demo account!', 'success')
        
        // Add small delay to ensure auth state is set
        setTimeout(() => {
          onAuth()
          onClose()
        }, 100)
      } else {
        show('Demo login failed - no access token received', 'error')
      }
    } catch (err: any) {
      console.error('Demo login error:', err)
      const errorMessage = err?.response?.data?.detail || err?.response?.data?.message || err.message || 'Demo login failed'
      show(errorMessage, 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    try {
      // Get Google OAuth URL from backend
      const backendUrl = import.meta.env.VITE_AUTH_URL || "https://auth-service-ancient-frost-8646.fly.dev"
      const response = await fetch(`${backendUrl}/auth/google/login`)
      const data = await response.json()
      
      if (data.auth_url) {
        // Redirect to Google OAuth
        window.location.href = data.auth_url
      } else {
        throw new Error('Failed to get Google OAuth URL')
      }
    } catch (error) {
      console.error('Google OAuth error:', error)
      show('Failed to initiate Google sign-in', 'error')
      setLoading(false)
    }
  }

  // Apple sign-in removed per user request

  return (
    <AnimatePresence>
      {open && (
        <MotionDiv
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <MotionDiv
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 w-[420px] shadow-2xl border border-white/20"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">Sign {tab === 'login' ? 'in' : 'up'} to Voxly</h3>
              <button className="text-slate-300 hover:text-white text-xl" onClick={onClose} aria-label="Close">✕</button>
            </div>
            
            {/* Quick Demo Login Button */}
            <div className="mb-4">
              <button 
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {loading ? '🔄 Logging in...' : '🚀 Quick Demo Login (testuser)'}
              </button>
              <p className="text-xs text-slate-300 mt-1 text-center">Use this to test voices immediately!</p>
            </div>

            <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-white/20"></div>
              <span className="px-3 text-sm text-slate-300">or</span>
              <div className="flex-1 h-px bg-white/20"></div>
            </div>
            
            <div className="flex gap-2 mb-4">
              <button 
                onClick={() => setTab('login')} 
                className={`px-4 py-2 rounded-lg transition-all ${tab === 'login' ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Login
              </button>
              <button 
                onClick={() => setTab('register')} 
                className={`px-4 py-2 rounded-lg transition-all ${tab === 'register' ? 'bg-white/20 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
              >
                Register
              </button>
            </div>
            
            {showEmailVerification ? (
              <div className="text-center space-y-4">
                <div className="text-green-400 text-6xl mb-4">✅</div>
                <h4 className="text-lg font-semibold text-white">Check Your Email!</h4>
                <p className="text-slate-300">
                  We've sent a verification link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-slate-400">
                  Click the link in your email to verify your account and start using Voxly!
                </p>
                <button 
                  onClick={() => {
                    setShowEmailVerification(false)
                    setTab('login')
                  }}
                  className="text-sky-400 hover:text-sky-300 underline"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <input 
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500" 
                  placeholder="Username" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
                {tab === 'register' && (
                  <input 
                    className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500" 
                    placeholder="Email Address" 
                    type="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                )}
                <input 
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500" 
                  placeholder={tab === 'register' ? 'Password (min 8 characters)' : 'Password'} 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-600 hover:to-indigo-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {loading ? '🔄 Processing...' : `${tab === 'login' ? 'Sign In' : 'Create Account'}`}
                </button>
              </form>
            )}

            <div className="mt-4">
              <button 
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '🔄 Redirecting...' : '🔍 Continue with Google'}
              </button>
            </div>
            
            <p className="text-xs text-slate-400 mt-4 text-center">
              Having trouble? Use the demo login above to test all voices immediately!
            </p>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  )
}
