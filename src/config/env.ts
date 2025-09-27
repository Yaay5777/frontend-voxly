// Environment configuration with validation and fallbacks
// REPLACE: All hardcoded URLs now use environment variables

interface EnvConfig {
  TTS_URL: string;
  AUTH_URL: string;
  FRONTEND_URL: string;
  IS_DEVELOPMENT: boolean;
  IS_PRODUCTION: boolean;
}

// Validate required environment variables
const validateEnv = (): EnvConfig => {
  const TTS_URL = process.env.NEXT_PUBLIC_TTS_URL;
  const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;
  const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
  const NODE_ENV = process.env.NODE_ENV;

  // Development and production fallbacks
  const config: EnvConfig = {
    TTS_URL: TTS_URL || (NODE_ENV === 'production' 
      ? 'https://huggingface.co/spaces/Yaya5777/voxly-tts' 
      : 'http://localhost:8000'),
    AUTH_URL: AUTH_URL || 'http://localhost:8001', 
    FRONTEND_URL: FRONTEND_URL || 'http://localhost:3000',
    IS_DEVELOPMENT: NODE_ENV === 'development',
    IS_PRODUCTION: NODE_ENV === 'production',
  };

  // Warn about missing environment variables in production
  if (config.IS_PRODUCTION) {
    if (!TTS_URL) {
      console.warn('⚠️  NEXT_PUBLIC_TTS_URL not set in production');
    }
    if (!AUTH_URL) {
      console.warn('⚠️  NEXT_PUBLIC_AUTH_URL not set in production');
    }
    if (!FRONTEND_URL) {
      console.warn('⚠️  NEXT_PUBLIC_FRONTEND_URL not set in production');
    }
  }

  // Log configuration in development
  if (config.IS_DEVELOPMENT) {
    console.log('🔧 Environment Configuration:', {
      TTS_URL: config.TTS_URL,
      AUTH_URL: config.AUTH_URL,
      FRONTEND_URL: config.FRONTEND_URL,
      NODE_ENV,
    });
  }

  return config;
};

export const env = validateEnv();

// Export individual URLs for convenience
export const { TTS_URL, AUTH_URL, FRONTEND_URL } = env;
