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
        const token = searchParams.get('token')
        const username = searchParams.get('username')
        const email = searchParams.get('email')
        const name = searchParams.get('name')
        const tier = searchParams.get('tier')

        if (!token || !username) {
          throw new Error('Missing authentication parameters')
        }

        // Create user object
        const user = {
          id: Date.now(),
          username: username,
          email: email || '',
          name: name || username,
          fullName: name || username,
          is_premium: tier === 'premium',
          created_at: new Date().toISOString(),
          tier: 'free' as const,
          weekly_quota: 1000,
          weekly_used: 0,
          quota_cycle_start: new Date().toISOString(),
        }

        // Update auth store with token and user
        authLogin(token, user)

        show('Successfully signed in with Google!', 'success')

        // Redirect to home page after successful authentication
        setTimeout(() => {
          navigate('/')
        }, 2000)

      } catch (error) {
        console.error('OAuth success handling error:', error)
        show('Authentication failed. Please try again.', 'error')
        
        // Redirect to home page with error
        setTimeout(() => {
          navigate('/')
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
