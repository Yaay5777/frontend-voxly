import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2, Home } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { User } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { useToast } from '../components/ToastProvider';

const AuthSuccessPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login: authLogin } = useAuthStore();
  const { show } = useToast();

  useEffect(() => {
    const handleGoogleOAuthSuccess = async () => {
      try {
        // Get parameters from URL (sent by backend redirect)
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        const newUser = searchParams.get('new_user') === 'true';
        const verificationEmailSent = searchParams.get('verification_sent') === 'true';
        const existingUser = searchParams.get('existing_user') === 'true';

        if (!token || !email) {
          setError('Invalid authentication response. Missing token or email.');
          setLoading(false);
          return;
        }

        // Get user info from backend using the token
        const authUrl = import.meta.env.VITE_AUTH_URL || import.meta.env.NEXT_PUBLIC_AUTH_URL || 'https://yaya5777-voxly-auth.hf.space';
        const response = await fetch(`${authUrl}/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const userData = await response.json();
          
          // Create user object for auth store
          const user: User = {
            id: userData.id,
            username: userData.username,
            email: userData.email,
            name: userData.fullName,
            fullName: userData.fullName,
            is_premium: userData.tier === 'premium',
            created_at: userData.createdAt,
            tier: userData.tier || 'free',
            weekly_quota: 1000,
            weekly_used: 0,
            quota_cycle_start: new Date().toISOString(),
            isVerified: userData.isVerified
          };

          // Log user in
          authLogin(token, user);
          setUser(user);
          setIsNewUser(newUser);
          setVerificationSent(verificationEmailSent);

          // Show appropriate success message
          if (newUser) {
            if (verificationEmailSent) {
              show('Welcome to Voxly! You\'re logged in. Please check your email to verify your account.', 'success');
            } else {
              show('Welcome to Voxly! You\'re logged in and ready to go.', 'success');
            }
          } else {
            show('Welcome back! You\'re logged in.', 'success');
          }
        } else {
          setError('Failed to get user information. Please try logging in again.');
        }
      } catch (error) {
        console.error('Google OAuth success handling failed:', error);
        setError('Authentication verification failed. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    };

    handleGoogleOAuthSuccess();
  }, [searchParams, authLogin, show]);

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-indigo-600 animate-spin" />
          <p className="mt-4 text-lg text-gray-600">Verifying your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Authentication Failed</h2>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <div className="mt-6">
            <button
              onClick={handleGoHome}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Home className="-ml-1 mr-2 h-5 w-5" />
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <div className="mx-auto h-16 w-16 bg-green-600 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-white" />
        </div>

        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
          Welcome to Voxly!
        </h2>

        {user && (
          <p className="mt-2 text-lg text-gray-600">
            {isNewUser ? 'Welcome to Voxly, ' : 'Welcome back, '}
            <span className="font-semibold text-indigo-600">{user.fullName || user.name}</span>!
          </p>
        )}

        <div className="mt-8 bg-white shadow-xl rounded-lg p-8">
          <div className="space-y-4">
            {isNewUser && verificationSent && (
              <div className="flex items-center justify-center space-x-3 text-amber-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-lg font-medium">Verification Email Sent</span>
              </div>
            )}

            <div className="flex items-center justify-center space-x-3 text-green-700">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-medium">Account {isNewUser ? 'Created' : 'Verified'}</span>
            </div>

            <div className="flex items-center justify-center space-x-3 text-green-700">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-medium">Automatically Logged In</span>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-600 mb-4">
              {isNewUser 
                ? (verificationSent 
                  ? "You're all set! You can start using Voxly immediately. Please check your email to verify your account for full access."
                  : "You're all set! You now have full access to all Voxly features including voice generation and cloning."
                )
                : "Welcome back! You have full access to all Voxly features."
              }
            </p>

            <button
              onClick={handleGoHome}
              className="w-full inline-flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              <Home className="-ml-1 mr-3 h-5 w-5" />
              Continue to Voxly
            </button>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-xs text-gray-500">
            If you weren't redirected automatically, click the button above.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSuccessPage;
