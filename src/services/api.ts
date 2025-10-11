import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { User, Voice, AudioFile, SynthesisRequest, SynthesisResponse, QuotaInfo } from '../types';
import { useAuthStore } from '../store/useAuthStore';

// API Configuration - Dual Backend Architecture
const AUTH_BASE_URL = import.meta.env.VITE_AUTH_URL || import.meta.env.NEXT_PUBLIC_AUTH_URL || 'https://yaya5777-voxly-auth.hf.space';
const TTS_BASE_URL = import.meta.env.VITE_TTS_URL || import.meta.env.NEXT_PUBLIC_TTS_URL || 'https://yaya5777-voxly-tts.hf.space';
const API_BASE_URL = AUTH_BASE_URL; // Default for auth endpoints

class ApiService {
  private api: AxiosInstance;
  private ttsApi: AxiosInstance;

  constructor() {
    // Auth API instance (port 8000)
    this.api = axios.create({
      baseURL: AUTH_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // TTS API instance (port 8001)
    this.ttsApi = axios.create({
      baseURL: TTS_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.api.interceptors.request.use(
      (config) => {
        const token = useAuthStore.getState().token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          useAuthStore.getState().logout();
          window.location.href = '/login';
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

    console.log('🚀 Login attempt:', { username, url: `${API_BASE_URL}/auth/login` });

    const response = await this.api.post('/auth/login', loginData, {
      headers: { "Content-Type": "application/json" },
    });
    
    console.log('✅ Login successful:', response.data);
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

      console.log('🚀 Registration attempt:', { username, email, url: `${API_BASE_URL}/auth/register` });

      const response = await this.api.post('/auth/register', registrationData, {
        headers: { "Content-Type": "application/json" },
      });
      
      console.log('✅ Registration successful:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('❌ Registration failed:', error);
      console.error('Error details:', error.response?.data);
      throw error;
    }
  }

  // Google OAuth - Initiate login flow
  async initiateGoogleOAuth(): Promise<void> {
    try {
      console.log('🚀 Initiating Google OAuth flow');
      // Redirect directly to backend Google OAuth endpoint
      window.location.href = `${API_BASE_URL}/auth/google`;
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

  // Voice endpoints (use XTTS backend - 150 voices)
  async getVoices(): Promise<Voice[]> {
    try {
      const response = await this.ttsApi.get('/xtts/voices');
      return response.data.voices || [];
    } catch (error) {
      console.error('Error fetching XTTS voices:', error);
      throw error;
    }
  }

  // Text-to-Speech synthesis (use TTS backend)
  async synthesizeText(request: SynthesisRequest, speakerFile?: File): Promise<Blob> {
    try {
      const formData = new FormData();
      formData.append('text', request.text);
      formData.append('language', request.language);
      formData.append('voice_id', request.voice_id || 'sophia_british_female');
      
      if (speakerFile) {
        formData.append('speaker_wav', speakerFile);
      }

      console.log('🚀 XTTS Synthesis request:', { text: request.text, voice_id: request.voice_id, language: request.language });

      const response = await this.ttsApi.post('/xtts/synthesize', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      console.log('✅ Synthesis successful:', response.data.size, 'bytes');
      return response.data;
    } catch (error: any) {
      console.error('❌ Synthesis failed:', error);
      throw error;
    }
  }

  // Voice demo generation (use TTS backend)
  async generateVoiceDemo(text: string, voiceId: string): Promise<Blob> {
    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('speaker_id', voiceId);
      formData.append('language', 'en');

      console.log('🚀 Demo generation:', { text, voiceId });

      const response = await this.ttsApi.post('/demo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'blob',
      });

      console.log('✅ Demo generated:', response.data.size, 'bytes');
      return response.data;
    } catch (error: any) {
      console.error('❌ Demo generation failed:', error);
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
      url: `${TTS_BASE_URL}/outputs/${file.filename}`,
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
    const quotaResponse = await this.api.get('/quota');
    const quotaInfo: QuotaInfo = {
      current_usage: quotaResponse.data.current_usage,
      weekly_used: quotaResponse.data.weekly_limit - quotaResponse.data.current_usage,
      weekly_quota: quotaResponse.data.weekly_limit,
      weekly_limit: quotaResponse.data.weekly_limit,
      reset_date: quotaResponse.data.reset_date,
      tier: quotaResponse.data.tier,
      percentage_used: quotaResponse.data.percentage_used,
    };
    return quotaInfo;
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
