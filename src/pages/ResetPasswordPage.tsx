import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [tokenValid, setTokenValid] = useState<boolean | null>(null);
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    match: false
  });

  const token = searchParams.get('token');

  useEffect(() => {
    // Validate token on component mount
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false);
        return;
      }

      try {
        const response = await fetch(`https://auth-service-ancient-frost-8646.fly.dev/auth/validate-reset-token?token=${token}`, {
          method: 'GET',
        });

        setTokenValid(response.ok);
      } catch (error) {
        setTokenValid(false);
      }
    };

    validateToken();
  }, [token]);

  const validatePassword = (password: string) => {
    setPasswordStrength({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      match: password === formData.confirmPassword && password.length > 0
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (name === 'password') {
      validatePassword(value);
    }
    if (name === 'confirmPassword') {
      setPasswordStrength(prev => ({
        ...prev,
        match: value === formData.password && value.length > 0
      }));
    }
    
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    try {
      // Validation
      const newErrors: string[] = [];
      
      if (!formData.password) newErrors.push('Password is required');
      if (formData.password !== formData.confirmPassword) newErrors.push('Passwords do not match');
      
      if (!passwordStrength.length || !passwordStrength.uppercase || !passwordStrength.lowercase || !passwordStrength.number) {
        newErrors.push('Password does not meet requirements');
      }

      if (newErrors.length > 0) {
        setErrors(newErrors);
        setLoading(false);
        return;
      }

      // Submit to backend
      const response = await fetch('https://auth-service-ancient-frost-8646.fly.dev/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to login with success message
        navigate('/login', { 
          state: { 
            message: 'Password reset successful! Please sign in with your new password.' 
          } 
        });
      } else {
        setErrors([data.error || 'Password reset failed. Please try again.']);
      }
    } catch (error) {
      setErrors(['Network error. Please try again.']);
    } finally {
      setLoading(false);
    }
  };

  const PasswordStrengthIndicator = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center space-x-2 text-sm ${met ? 'text-green-600' : 'text-gray-400'}`}>
      {met ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
      <span>{text}</span>
    </div>
  );

  // Loading state while validating token
  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mb-6">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Validating Reset Link
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your password reset link...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Invalid token state
  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mb-6"
            >
              <AlertCircle className="w-10 h-10 text-white" />
            </motion.div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Invalid Reset Link
            </h1>
            
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>

            <div className="space-y-3">
              <Link
                to="/forgot-password"
                className="block w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 text-center"
              >
                Request New Reset Link
              </Link>
              <Link
                to="/login"
                className="block w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 text-center"
              >
                Back to Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // Valid token - show reset form
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Create New Password</h1>
            <p className="text-xl mb-8 opacity-90">
              Choose a strong, secure password for your Voxly account
            </p>
            <div className="space-y-4 text-left max-w-md">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <span>At least 8 characters long</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <span>Include uppercase and lowercase</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <span>Include at least one number</span>
              </div>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: 1 }}
          className="absolute bottom-32 left-20 w-12 h-12 bg-white/10 rounded-full"
        />
      </div>

      {/* Right Side - Reset Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Your Password</h2>
            <p className="text-gray-600">Create a new secure password for your account</p>
          </div>

          {/* Error Messages */}
          {errors.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            >
              {errors.map((error, index) => (
                <p key={index} className="text-red-600 text-sm">{error}</p>
              ))}
            </motion.div>
          )}

          {/* Reset Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Create a strong password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  placeholder="Confirm your password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Strength Indicator */}
            {formData.password && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2 p-3 bg-gray-50 rounded-lg"
              >
                <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
                <div className="grid grid-cols-2 gap-2">
                  <PasswordStrengthIndicator met={passwordStrength.length} text="8+ characters" />
                  <PasswordStrengthIndicator met={passwordStrength.uppercase} text="Uppercase letter" />
                  <PasswordStrengthIndicator met={passwordStrength.lowercase} text="Lowercase letter" />
                  <PasswordStrengthIndicator met={passwordStrength.number} text="Number" />
                </div>
                {formData.confirmPassword && (
                  <PasswordStrengthIndicator met={passwordStrength.match} text="Passwords match" />
                )}
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Resetting Password...</span>
                </div>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Remember your password?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
