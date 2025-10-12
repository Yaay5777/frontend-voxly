import toast from 'react-hot-toast';

/**
 * Centralized toast notification utilities
 * Replaces all alert() calls with beautiful toast notifications
 */

export const showToast = {
  /**
   * Success notification
   */
  success: (message: string) => {
    toast.success(message, {
      icon: '✅',
    });
  },

  /**
   * Error notification
   */
  error: (message: string) => {
    toast.error(message, {
      icon: '❌',
    });
  },

  /**
   * Loading notification (returns ID to dismiss later)
   */
  loading: (message: string) => {
    return toast.loading(message, {
      icon: '🎤',
    });
  },

  /**
   * Info notification
   */
  info: (message: string) => {
    toast(message, {
      icon: 'ℹ️',
      style: {
        background: '#3b82f6',
        color: '#fff',
      },
    });
  },

  /**
   * Warning notification
   */
  warning: (message: string) => {
    toast(message, {
      icon: '⚠️',
      style: {
        background: '#f59e0b',
        color: '#fff',
      },
    });
  },

  /**
   * Dismiss a specific toast
   */
  dismiss: (toastId: string) => {
    toast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    toast.dismiss();
  },

  /**
   * Promise-based toast (shows loading, then success/error)
   */
  promise: <T,>(
    promise: Promise<T>,
    messages: {
      loading: string;
      success: string | ((data: T) => string);
      error: string | ((error: any) => string);
    }
  ) => {
    return toast.promise(
      promise,
      {
        loading: messages.loading,
        success: messages.success,
        error: messages.error,
      },
      {
        success: {
          icon: '✅',
        },
        error: {
          icon: '❌',
        },
        loading: {
          icon: '🎤',
        },
      }
    );
  },

  /**
   * Audio generation toast
   */
  audioGeneration: (voiceName: string) => {
    return toast.loading(`Generating audio with ${voiceName}...`, {
      icon: '🎙️',
    });
  },

  /**
   * Audio success toast
   */
  audioSuccess: (duration?: number) => {
    const message = duration 
      ? `Audio generated successfully! (${duration.toFixed(1)}s)`
      : 'Audio generated successfully!';
    
    toast.success(message, {
      icon: '🎵',
      duration: 3000,
    });
  },

  /**
   * Authentication toast
   */
  auth: {
    loginSuccess: (username: string) => {
      toast.success(`Welcome back, ${username}!`, {
        icon: '👋',
        duration: 3000,
      });
    },
    
    logoutSuccess: () => {
      toast.success('Logged out successfully', {
        icon: '👋',
      });
    },
    
    sessionExpired: () => {
      toast.error('Your session has expired. Please login again.', {
        icon: '🔒',
        duration: 5000,
      });
    },
    
    registerSuccess: () => {
      toast.success('Account created successfully! Welcome to Voxly! 🎉', {
        icon: '✨',
        duration: 4000,
      });
    },
  },

  /**
   * Voice-related toasts
   */
  voice: {
    demoPlaying: (voiceName: string) => {
      toast(`Playing ${voiceName} demo`, {
        icon: '▶️',
        duration: 2000,
      });
    },
    
    favoriteAdded: (voiceName: string) => {
      toast.success(`${voiceName} added to favorites`, {
        icon: '⭐',
        duration: 2000,
      });
    },
    
    favoriteRemoved: (voiceName: string) => {
      toast(`${voiceName} removed from favorites`, {
        icon: '⭐',
        duration: 2000,
      });
    },
  },

  /**
   * Quota-related toasts
   */
  quota: {
    warning: (remaining: number) => {
      toast(`Only ${remaining.toLocaleString()} characters remaining in your quota`, {
        icon: '⚠️',
        duration: 5000,
        style: {
          background: '#f59e0b',
          color: '#fff',
        },
      });
    },
    
    exceeded: () => {
      toast.error('Quota exceeded! Please upgrade your plan or wait until next week.', {
        icon: '🚫',
        duration: 6000,
      });
    },
  },
};

export default showToast;
