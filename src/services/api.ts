import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { User, Voice, AudioFile, SynthesisRequest, SynthesisResponse, QuotaInfo } from '../types';
import { useAuthStore } from '../store/useAuthStore';
import { ENV, TIMEOUTS } from '../config/env';
import { logger } from '../utils/logger';

class ApiService {
  private api: AxiosInstance;
  private ttsApi: AxiosInstance;

  constructor() {
    // Auth API instance
    this.api = axios.create({
      baseURL: ENV.AUTH_URL,
      timeout: TIMEOUTS.AUTH,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // TTS API instance
    this.ttsApi = axios.create({
      baseURL: ENV.TTS_URL,
      timeout: TIMEOUTS.TTS_CLONE,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Helper function to get token from multiple sources
    const getAuthToken = () => {
      // Try Zustand store first
      const storeToken = useAuthStore.getState().token;
      if (storeToken) return storeToken;
      
      // Try cookies
      const cookieMatch = document.cookie.match(/voxly_at=([^;]+)/);
      if (cookieMatch) return cookieMatch[1];
      
      // Try localStorage as fallback
      return localStorage.getItem('voxly_jwt_token');
    };

    // Request interceptor to add auth token (for auth API)
    this.api.interceptors.request.use(
      (config) => {
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Request interceptor to add auth token (for TTS API)
    this.ttsApi.interceptors.request.use(
      (config) => {
        const token = getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          logger.debug('🔑 Adding auth token to TTS request');
        } else {
          logger.warn('⚠️ No auth token found for TTS request');
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling (auth API)
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logger.error('❌ Auth API 401: Token might be expired');
          // Only logout on specific auth endpoints, not all 401s
          const url = error.config?.url || '';
          if (url.includes('/auth/me') || url.includes('/auth/login')) {
            logger.info('🚪 Logging out due to invalid credentials');
            useAuthStore.getState().logout();
            window.location.href = '/login';
          } else {
            logger.info('⚠️ 401 on other endpoint, keeping session active');
          }
        }
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling (TTS API)
    this.ttsApi.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          logger.error('❌ TTS API 401: Authentication failed');
          logger.warn('⚠️ This might be a backend issue. Not logging you out.');
          // Don't logout automatically - the token might be valid
          // The auth backend is the source of truth, not TTS backend
        }
        return Promise.reject(error);
      }
    );
  }

  // Authentication endpoints
  async login(username: string, password: string): Promise<{ access_token: string; token_type: string; message: string; user: any }> {
    const loginData = {
      usernameOrEmail: username,
      password: password
    };

    logger.api('POST', '/auth/login', { username });

    const response = await this.api.post('/auth/login', loginData, {
      headers: { "Content-Type": "application/json" },
    });
    
    logger.info('✅ Login successful');
    return response.data;
  }

  async register(fullName: string, username: string, email: string, password: string): Promise<{ access_token: string; token_type: string; message: string; user: any; verification_email_sent: boolean; warning?: string }> {
    try {
      const registrationData = {
        fullName,
        username,
        email,
        password
      };

      logger.api('POST', '/auth/register', { username, email });

      const response = await this.api.post('/auth/register', registrationData, {
        headers: { "Content-Type": "application/json" },
      });
      
      logger.info('✅ Registration successful');
      return response.data;
    } catch (error: any) {
      logger.error('❌ Registration failed:', error);
      logger.error('Error details:', error.response?.data);
      throw error;
    }
  }

  // Google OAuth - Initiate login flow
  async initiateGoogleOAuth(): Promise<void> {
    try {
      console.log('🚀 Initiating Google OAuth flow');
      // Redirect directly to backend Google OAuth endpoint
      window.location.href = `${ENV.AUTH_URL}/auth/google`;
    } catch (error: any) {
      console.error('❌ Google OAuth initiation failed:', error);
      throw new Error('Failed to initiate Google OAuth');
    }
  }

  // Handle Google OAuth callback (called when user returns from Google)
  async handleGoogleOAuthCallback(code: string): Promise<{ access_token: string; token_type: string; username: string }> {
    try {
      console.log('🚀 Handling Google OAuth callback with code:', code);

      const response = await this.api.get(`/auth/google/callback?code=${code}`);
      
      console.log('✅ Google OAuth callback successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Google OAuth callback failed:', error);
      if (error.response?.status === 404) {
        throw new Error('OAuth route not found – check backend URLs');
      }
      throw error;
    }
  }

  async appleOAuth(idToken: string, email: string, name: string): Promise<{ access_token: string; token_type: string; username: string }> {
    try {
      const formData = new FormData();
      formData.append('id_token', idToken);
      formData.append('email', email);
      formData.append('name', name);

      console.log('🚀 Apple OAuth attempt:', { email, name });

      const response = await this.api.post('/auth/oauth/apple', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      console.log('✅ Apple OAuth successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Apple OAuth failed:', error);
      throw error;
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.api.get('/me');
    return response.data;
  }

  // Voice endpoints (use TTS backend)
  async getVoices(): Promise<Voice[]> {
    try {
      const response = await this.ttsApi.get('/voices');
      // Backend returns { speakers: [...] }
      return response.data.speakers || response.data.voices || [];
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }

  // Text-to-Speech synthesis (use TTS backend)
  async synthesizeText(request: SynthesisRequest, speakerFile?: File): Promise<Blob> {
    try {
      const formData = new FormData();
      formData.append('text', request.text);
      formData.append('language', request.language);
      formData.append('voice_id', request.voice_id || 'en_us_arianeural');
      
      // NEW: Advanced voice controls
      if (request.speed !== undefined) {
        formData.append('speed', request.speed.toString());
      }
      if (request.pitch !== undefined) {
        formData.append('pitch', request.pitch.toString());
      }
      if (request.emotion) {
        formData.append('emotion', request.emotion);
      }
      if (request.stability !== undefined) {
        formData.append('stability', request.stability.toString());
      }
      
      if (speakerFile) {
        formData.append('speaker_wav', speakerFile);
      }

      console.log('🚀 Synthesis request:', { 
        text: request.text, 
        voice_id: request.voice_id, 
        language: request.language,
        speed: request.speed,
        pitch: request.pitch,
        emotion: request.emotion,
        stability: request.stability
      });

      // The auth token is automatically added by the interceptor
      // No need to manually add it here
      const response = await this.ttsApi.post('/synthesize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      console.log('✅ Synthesis successful:', response.data.size, 'bytes');
      return response.data;
    } catch (error: any) {
      console.error('❌ Synthesis failed:', error);
      console.error('Error details:', error.response?.data, error.response?.status);
      throw error;
    }
  }

  // Voice demo generation (use TTS backend with /synthesize endpoint)
  async generateVoiceDemo(text: string, voiceId: string, language: string = 'en'): Promise<Blob> {
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('voice_id', voiceId);  // Changed from speaker_id to voice_id
      formData.append('language', language);

      console.log('🚀 Demo generation:', { text, voiceId, language });

      // Use /synthesize endpoint (backend doesn't have /demo)
      // Auth token is automatically added by interceptor
      const response = await this.ttsApi.post('/synthesize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      console.log('✅ Demo generated:', response.data.size, 'bytes');
      return response.data;
    } catch (error: any) {
      console.error('❌ Demo generation failed:', error);
      console.error('Error details:', error.response?.data, error.response?.status);
      throw error;
    }
  }

  // Audio file management (use TTS backend)
  async getAudioFiles(): Promise<AudioFile[]> {
    const response = await this.ttsApi.get('/outputs/list');
    
    // Transform backend response to match our AudioFile interface
    return response.data.map((file: any) => ({
      id: file.id || file.filename,
      filename: file.filename,
      url: `${ENV.TTS_URL}/outputs/${file.filename}`,
      duration: file.duration || 0,
      size: file.size || 0,
      created_at: file.created_at || new Date().toISOString(),
      voice_id: file.voice_id || 'unknown',
      text: file.text || '',
      language: file.language || 'en',
    }));
  }

  async downloadAudio(filename: string): Promise<Blob> {
    const response = await this.ttsApi.get(`/outputs/${filename}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // User quota and usage
  async getQuotaInfo(): Promise<QuotaInfo> {
    try {
      const quotaResponse = await this.api.get('/auth/quota');
      const quotaInfo: QuotaInfo = {
        current_usage: quotaResponse.data.current_usage || 0,
        weekly_used: quotaResponse.data.weekly_used || 0,
        weekly_quota: quotaResponse.data.weekly_quota || 10000,
        weekly_limit: quotaResponse.data.weekly_limit || 10000,
        reset_date: quotaResponse.data.reset_date || new Date().toISOString(),
        tier: quotaResponse.data.tier || 'free',
        percentage_used: quotaResponse.data.percentage_used || 0,
      };
      return quotaInfo;
    } catch (error) {
      console.warn('Quota endpoint not available, using defaults');
      // Return default quota info if endpoint doesn't exist
      return {
        current_usage: 0,
        weekly_used: 0,
        weekly_quota: 10000,
        weekly_limit: 10000,
        reset_date: new Date().toISOString(),
        tier: 'free',
        percentage_used: 0,
      };
    }
  }

  // Admin endpoints (for development/testing)
  async upgradeUser(username: string, tier: 'free' | 'premium'): Promise<void> {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('tier', tier);

    await this.api.post('/admin/upgrade', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      const response = await this.api.get('/health');
      return response.data;
    } catch (error) {
      // Fallback if health endpoint doesn't exist
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
      };
    }
  }

  // Voice cloning with custom audio
  async cloneVoice(text: string, audioFile: File, language: string = 'en'): Promise<Blob> {
    return this.synthesizeText({ text, voice_id: 'custom', language }, audioFile);
  }

  // Batch synthesis (for premium users)
  async batchSynthesize(requests: SynthesisRequest[]): Promise<Blob[]> {
    const promises = requests.map(request => this.synthesizeText(request));
    return Promise.all(promises);
  }
}

// Create singleton instance
const apiService = new ApiService();

// Export individual methods for convenience
export const login = apiService.login.bind(apiService);
export const register = apiService.register.bind(apiService);
export const initiateGoogleOAuth = apiService.initiateGoogleOAuth.bind(apiService);
export const handleGoogleOAuthCallback = apiService.handleGoogleOAuthCallback.bind(apiService);
export const appleOAuth = apiService.appleOAuth.bind(apiService);
export const getCurrentUser = apiService.getCurrentUser.bind(apiService);
export const getVoices = apiService.getVoices.bind(apiService);
export const synthesizeText = apiService.synthesizeText.bind(apiService);
export const generateVoiceDemo = apiService.generateVoiceDemo.bind(apiService);
export const getAudioFiles = apiService.getAudioFiles.bind(apiService);
export const downloadAudio = apiService.downloadAudio.bind(apiService);
export const getQuotaInfo = apiService.getQuotaInfo.bind(apiService);
export const upgradeUser = apiService.upgradeUser.bind(apiService);
export const healthCheck = apiService.healthCheck.bind(apiService);
export const cloneVoice = apiService.cloneVoice.bind(apiService);
export const batchSynthesize = apiService.batchSynthesize.bind(apiService);

export default apiService;
