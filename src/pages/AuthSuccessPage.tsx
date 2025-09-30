import React, { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'
import { useToast } from '../components/ToastProvider'

export default function AuthSuccessPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login: authLogin } = useAuthStore()
  const { show } = useToast()
  const [processing, setProcessing] = useState(true)

  useEffect(() => {
    const handleOAuthSuccess = async () => {
      try {
        const allParams = Object.fromEntries(searchParams.entries())
        console.log('OAuth Success - All URL parameters:', allParams)
        
        const token = searchParams.get('token')
        const email = searchParams.get('email')
        const existingUser = searchParams.get('existing_user') === 'true'
        const newUser = searchParams.get('new_user') === 'true'
        const verificationSent = searchParams.get('verification_sent') === 'true'

        console.log('OAuth Success - Extracted params:', { 
          token: token?.substring(0, 20) + '...', 
          email, 
          existingUser, 
          newUser, 
          verificationSent 
        })

        if (!token || !email) {
          console.error('OAuth Success - Missing parameters:', { hasToken: !!token, hasEmail: !!email })
          throw new Error(`Missing authentication parameters: token=${!!token}, email=${!!email}`)
        }

        // Extract username from email (before @ symbol)
        const username = email.split('@')[0]

        // Create user object
        const user = {
          id: Date.now(), // Temporary ID until we get real one from API
          username: username,
          email: email,
          name: username, // Use username as name for now
          fullName: username,
          is_premium: false, // Default to free tier
          created_at: new Date().toISOString(),
          tier: 'free' as const,
          weekly_quota: 1000,
          weekly_used: 0,
          quota_cycle_start: new Date().toISOString(),
        }

        console.log('OAuth Success - Created user object:', user)

        // Store authentication data
        localStorage.setItem('token', token)
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('isAuthenticated', 'true')
        
        // Update auth store
        authLogin(token, user)
        
        console.log('OAuth Success - Authentication stored successfully')

        // Show appropriate message based on user type
        if (newUser) {
          show('Welcome to Voxly! Your account has been created! Please check your email for verification instructions.', 'success')
        } else {
          show('You have been successfully logged in.', 'success')
        }

        // Navigate to dashboard
        setTimeout(() => {
          navigate('/dashboard')
        }, 2000)

      } catch (error) {
        console.error('OAuth Success - Error:', error)
        show('There was a problem completing your login. Please try again.', 'error')
        
        // Redirect to login after error
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } finally {
        setProcessing(false)
      }
    }

    handleOAuthSuccess()
  }, [searchParams, authLogin, navigate, show])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 w-[420px] shadow-2xl border border-white/20 text-center">
        {processing ? (
          <>
            <div className="text-6xl mb-4">🔄</div>
            <h2 className="text-2xl font-bold text-white mb-4">Completing Sign In...</h2>
            <p className="text-slate-300 mb-6">
              Please wait while we set up your account.
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          </>
        ) : (
          <>
            <div className="text-green-400 text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold text-white mb-4">Welcome to Voxly!</h2>
            <p className="text-slate-300 mb-6">
              Your account has been set up successfully. Redirecting you to the app...
            </p>
            <div className="bg-gradient-to-r from-sky-500 to-indigo-600 rounded-lg p-3">
              <p className="text-white font-semibold">🎙️ Ready to create amazing voices!</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
