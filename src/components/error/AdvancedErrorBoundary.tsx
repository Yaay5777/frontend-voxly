import React, { Component, ErrorInfo, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home, Bug, Copy, CheckCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  showDetails?: boolean;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  copied: boolean;
}

class AdvancedErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      copied: false,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID
    const errorId = `voxly_error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.group('🚨 Voxly Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.groupEnd();
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);

    // Log error to analytics/monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      this.logErrorToService(error, errorInfo);
    }
  }

  private logErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // In a real app, you would send this to your error tracking service
    // like Sentry, LogRocket, or Bugsnag
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      errorId: this.state.errorId,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    // Example: Send to monitoring service
    console.log('Error logged to monitoring service:', errorData);
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      copied: false,
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleCopyError = async () => {
    const errorDetails = this.getErrorDetails();
    
    try {
      await navigator.clipboard.writeText(errorDetails);
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  private getErrorDetails = (): string => {
    const { error, errorInfo, errorId } = this.state;
    
    return `
Voxly Error Report
==================
Error ID: ${errorId}
Timestamp: ${new Date().toISOString()}
URL: ${window.location.href}

Error Message:
${error?.message || 'Unknown error'}

Stack Trace:
${error?.stack || 'No stack trace available'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}

User Agent:
${navigator.userAgent}
    `.trim();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-purple-50 dark:from-gray-900 dark:via-red-900 dark:to-purple-900 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", bounce: 0.5 }}
              className="flex justify-center mb-6"
            >
              <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-10 h-10 text-red-500" />
              </div>
            </motion.div>

            {/* Error Title */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-6"
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Oops! Something went wrong
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                We encountered an unexpected error in the Voxly application.
              </p>
            </motion.div>

            {/* Error ID */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Error ID
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                    {this.state.errorId}
                  </p>
                </div>
                <button
                  onClick={this.handleCopyError}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors"
                >
                  {this.state.copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-green-600 dark:text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy Details</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Error Details (Development Only) */}
            {this.props.showDetails && process.env.NODE_ENV === 'development' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ delay: 0.5 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
              >
                <div className="flex items-center space-x-2 mb-3">
                  <Bug className="w-4 h-4 text-red-500" />
                  <h3 className="font-medium text-red-800 dark:text-red-200">
                    Development Details
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-300">
                      Error Message:
                    </p>
                    <p className="text-sm text-red-600 dark:text-red-400 font-mono bg-red-100 dark:bg-red-900/40 p-2 rounded">
                      {this.state.error?.message}
                    </p>
                  </div>
                  {this.state.error?.stack && (
                    <div>
                      <p className="text-sm font-medium text-red-700 dark:text-red-300">
                        Stack Trace:
                      </p>
                      <pre className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 p-2 rounded overflow-x-auto max-h-32">
                        {this.state.error.stack}
                      </pre>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <button
                onClick={this.handleRetry}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="flex-1 flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-200"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>
            </motion.div>

            {/* Help Text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-6 text-center"
            >
              <p className="text-sm text-gray-500 dark:text-gray-400">
                If this problem persists, please contact support with the error ID above.
              </p>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdvancedErrorBoundary;
