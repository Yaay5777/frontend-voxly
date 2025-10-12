import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Toast Provider Component
 * Provides toast notifications throughout the app
 */
export const ToastProvider: React.FC = () => {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      toastOptions={{
        // Default options
        duration: 4000,
        style: {
          background: '#363636',
          color: '#fff',
          borderRadius: '10px',
          padding: '16px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
        },
        
        // Success toast
        success: {
          duration: 3000,
          style: {
            background: '#10b981',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#10b981',
          },
        },
        
        // Error toast
        error: {
          duration: 5000,
          style: {
            background: '#ef4444',
          },
          iconTheme: {
            primary: '#fff',
            secondary: '#ef4444',
          },
        },
        
        // Loading toast
        loading: {
          style: {
            background: '#8b5cf6',
          },
        },
      }}
    />
  );
};

export default ToastProvider;
