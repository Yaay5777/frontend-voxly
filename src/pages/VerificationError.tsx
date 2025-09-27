import React from 'react';
import { AlertTriangle, RefreshCw, Home, Mail } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const VerificationErrorPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const errorType = searchParams.get('error');

  const getErrorMessage = () => {
    switch (errorType) {
      case 'missing_token':
        return {
          title: 'Verification Link Incomplete',
          message: 'The verification link is missing the required token parameter.',
          suggestion: 'Please check your email and use the complete verification link.'
        };
      case 'invalid_expired':
        return {
          title: 'Link Expired or Invalid',
          message: 'The verification link has expired or is no longer valid.',
          suggestion: 'Please request a new verification email to complete your registration.'
        };
      case 'server_error':
        return {
          title: 'Server Error',
          message: 'There was a problem processing your verification request.',
          suggestion: 'Please try again or contact support if the problem persists.'
        };
      default:
        return {
          title: 'Verification Failed',
          message: 'The verification link you used is invalid or has expired.',
          suggestion: 'Please request a new verification email to complete your registration.'
        };
    }
  };

  const errorInfo = getErrorMessage();

  const handleGoHome = () => {
    navigate('/');
  };

  const handleResendVerification = () => {
    navigate('/verify-email-pending');
  };

  const handleGoToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-rose-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-red-600 rounded-full flex items-center justify-center">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {errorInfo.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {errorInfo.message}
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg p-8">
          <div className="space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    What happened?
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{errorInfo.suggestion}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleResendVerification}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Mail className="-ml-1 mr-3 h-5 w-5" />
                Request New Verification Email
              </button>

              <button
                onClick={handleGoToLogin}
                className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <RefreshCw className="-ml-1 mr-3 h-5 w-5" />
                Try Logging In
              </button>

              <button
                onClick={handleGoHome}
                className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Home className="-ml-1 mr-3 h-5 w-5" />
                Back to Home
              </button>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Need help? Contact our support team for assistance.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationErrorPage;
