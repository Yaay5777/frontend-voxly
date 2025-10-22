/**
 * Centralized Environment Configuration
 * All environment variables in one place for easy management
 */

export const ENV = {
  // API URLs
  AUTH_URL: import.meta.env.VITE_AUTH_URL || import.meta.env.NEXT_PUBLIC_AUTH_URL || 'https://yaya5777-voxly-auth.hf.space',
  TTS_URL: import.meta.env.VITE_TTS_URL || import.meta.env.NEXT_PUBLIC_TTS_URL || 'https://yaya5777-voxly-tts.hf.space',
  LLM_URL: import.meta.env.VITE_LLM_URL || 'https://yaya5777-voxly-ai-script-generator.hf.space',
  
  // OAuth
  GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID || '653058402849-265m72dul3omrl2mrm5b2bfmdmqgv3l2.apps.googleusercontent.com',
  
  // Frontend URL
  PUBLIC_URL: import.meta.env.VITE_PUBLIC_URL || 'https://frontend-voxly.vercel.app',
  
  // Feature Flags
  USE_LOCAL_LLM: import.meta.env.VITE_USE_LOCAL_LLM === 'true',
  
  // Environment
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,
  MODE: import.meta.env.MODE,
} as const;

// API Timeouts (in milliseconds)
export const TIMEOUTS = {
  AUTH: 30000,      // 30s for auth operations
  TTS_QUICK: 45000, // 45s for quick TTS
  TTS_CLONE: 90000, // 90s for voice cloning (XTTS)
  DEFAULT: 30000,   // 30s default
} as const;

// Validate critical environment variables
if (!ENV.AUTH_URL) {
  console.warn('⚠️ AUTH_URL not configured, using fallback');
}

if (!ENV.TTS_URL) {
  console.warn('⚠️ TTS_URL not configured, using fallback');
}

export default ENV;
