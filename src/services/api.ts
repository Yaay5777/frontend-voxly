// API service with environment-driven URLs
// REPLACE: https://auth-service-ancient-frost-8646.fly.dev → process.env.NEXT_PUBLIC_AUTH_URL
// REPLACE: https://huggingface.co/spaces/Yaya5777/voxly-tts-api → process.env.NEXT_PUBLIC_TTS_URL

import axios from 'axios';
import { AUTH_URL, TTS_URL } from '../config/env';

// Create axios instances for each service
const authApi = axios.create({
  baseURL: AUTH_URL,
  timeout: 10000,
  withCredentials: true,
});

const ttsApi = axios.create({
  baseURL: TTS_URL,
  timeout: 30000, // TTS operations can take longer
});

// Request interceptors for auth tokens
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

ttsApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptors for error handling
const handleAuthError = (error: any) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }
  return Promise.reject(error);
};

authApi.interceptors.response.use(
  (response) => response,
  handleAuthError
);

ttsApi.interceptors.response.use(
  (response) => response,
  handleAuthError
);

// Auth API functions
export const authService = {
  // Registration
  register: async (data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
  }) => {
    const response = await authApi.post('/auth/register', data);
    return response.data;
  },

  // Login
  login: async (data: {
    usernameOrEmail: string;
    password: string;
  }) => {
    const response = await authApi.post('/auth/login', data);
    return response.data;
  },

  // Google OAuth
  googleLogin: () => {
    window.location.href = `${AUTH_URL}/auth/google`;
  },

  // Email verification
  verifyEmail: async (token: string, email: string) => {
    const response = await authApi.post('/auth/verify-email', { token, email });
    return response.data;
  },

  // Resend verification email
  resendVerification: async (data: { email: string }) => {
    const response = await authApi.post('/auth/resend-verification', data);
    return response.data;
  },

  // Password reset
  forgotPassword: async (email: string) => {
    const response = await authApi.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Verify reset token
  verifyResetToken: async (token: string) => {
    const response = await authApi.post('/auth/verify-reset-token', { token });
    return response.data;
  },

  resetPassword: async (token: string, email: string, newPassword: string) => {
    const response = await authApi.post('/auth/reset-password', {
      token,
      email,
      new_password: newPassword,
    });
    return response.data;
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await authApi.get('/auth/me');
    return response.data;
  },
};

// TTS API functions - Updated for Hugging Face Spaces
export const ttsService = {
  // Get available voices
  getVoices: async () => {
    try {
      const response = await ttsApi.get('/voices');
      return response.data;
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  },

  // Get specific voice
  getVoice: async (voiceId: string) => {
    try {
      const response = await ttsApi.get(`/voices/${voiceId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching voice ${voiceId}:`, error);
      throw error;
    }
  },

  // Generate voice demo (no auth required) - Updated for HF Spaces
  generateDemo: async (voiceId: string, text?: string) => {
    try {
      // For Hugging Face Spaces, use JSON payload instead of FormData
      const payload = {
        voice_id: voiceId,
        text: text || 'Hello, this is a sample of my voice.',
        format: 'wav'
      };

      const response = await ttsApi.post('/demo', payload, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error generating demo:', error);
      throw error;
    }
  },

  // Synthesize text - Updated for HF Spaces API
  synthesize: async (data: {
    text: string;
    voice_id: string;
    language?: string;
    speed?: number;
    pitch?: number;
    format?: string;
  }) => {
    try {
      // Use JSON payload for HF Spaces API
      const payload = {
        text: data.text,
        voice_id: data.voice_id,
        format: data.format || 'wav',
        language: data.language || 'en',
        ...(data.speed && { speed: data.speed }),
        ...(data.pitch && { pitch: data.pitch }),
      };

      const response = await ttsApi.post('/synthesize', payload, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error synthesizing text:', error);
      throw error;
    }
  },

  // HF Spaces specific API predict endpoint
  predict: async (data: {
    text: string;
    voice_id: string;
    format?: string;
  }) => {
    try {
      // Use the HF Spaces predict API endpoint
      const payload = {
        data: [data.text, data.voice_id, data.format || 'wav']
      };

      const response = await fetch(`${TTS_URL}/api/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // HF Spaces returns JSON with data array containing the audio blob
      const result = await response.json();
      
      // Convert base64 audio data to blob if needed
      if (result.data && result.data[0]) {
        const audioData = result.data[0];
        if (typeof audioData === 'string') {
          // If it's base64, convert to blob
          const byteCharacters = atob(audioData);
          const byteNumbers = new Array(byteCharacters.length);
          for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
          }
          const byteArray = new Uint8Array(byteNumbers);
          return new Blob([byteArray], { type: 'audio/wav' });
        }
      }
      
      return result;
    } catch (error) {
      console.error('Error with HF Spaces predict API:', error);
      throw error;
    }
  },

  // Get synthesis status
  getStatus: async () => {
    try {
      const response = await ttsApi.get('/status');
      return response.data;
    } catch (error) {
      console.error('Error getting status:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await ttsApi.get('/health');
      return response.data;
    } catch (error) {
      console.error('Error checking health:', error);
      throw error;
    }
  },
};

// Export individual APIs for convenience
export { authApi, ttsApi };

// Legacy exports for backward compatibility
export const getVoices = ttsService.getVoices;
export const synthesizeText = ttsService.synthesize;
