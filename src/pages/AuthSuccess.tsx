import React, { useEffect, useState } from 'react';
import { CheckCircle, Loader2, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { User } from '../types';

const AuthSuccessPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in via cookies
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setError('Authentication failed. Please try logging in again.');
        }
      } catch (error) {
        setError('Failed to verify authentication status.');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

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
            Successfully verified and logged in as <span className="font-semibold text-indigo-600">{user.fullName || user.name}</span>
          </p>
        )}

        <div className="mt-8 bg-white shadow-xl rounded-lg p-8">
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-3 text-green-700">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-medium">Email Verified</span>
            </div>

            <div className="flex items-center justify-center space-x-3 text-green-700">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-medium">Account Activated</span>
            </div>

            <div className="flex items-center justify-center space-x-3 text-green-700">
              <CheckCircle className="h-6 w-6" />
              <span className="text-lg font-medium">Automatically Logged In</span>
            </div>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-600 mb-4">
              You're all set! You now have access to all Voxly features including voice generation and cloning.
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
