// src/api.ts - UPDATED BY CLAUDE for JWT Authentication Flow
import axios from "axios";

// Service URLs - Updated for Final-Voxly Backend
const AUTH_API = import.meta.env.VITE_AUTH_URL || "https://yaya5777-voxly-auth.hf.space";
const TTS_API = import.meta.env.VITE_TTS_URL || "https://yaya5777-voxly-tts.hf.space";

// Configure axios defaults
axios.defaults.timeout = 30000; // 30 second timeout
axios.defaults.withCredentials = true;

// JWT Token Management
export const TokenManager = {
  getToken: () => localStorage.getItem("voxly_jwt_token"),
  setToken: (token: string) => localStorage.setItem("voxly_jwt_token", token),
  removeToken: () => localStorage.removeItem("voxly_jwt_token"),
  isAuthenticated: () => !!localStorage.getItem("voxly_jwt_token")
};

function authHeaders() {
  const token = TokenManager.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Auth Service API Calls
export async function register(fullName: string, username: string, email: string, password: string) {
  try {
    console.log(`Registering user: ${username} to ${AUTH_API}/api/auth/register`);
    const response = await axios.post(`${AUTH_API}/api/auth/register`, {
      fullName,
      username,
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('Register success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Register error:', error);
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      throw new Error(`Cannot connect to auth server: ${AUTH_API}`);
    }
    throw error.response?.data || error;
  }
}

export async function login(login: string, password: string) {
  try {
    console.log(`Logging in user: ${login} to ${AUTH_API}/api/auth/login`);
    const response = await axios.post(`${AUTH_API}/api/auth/login`, {
      login, // Can be username or email
      password
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('Login success:', response.data);
    
    // Extract JWT token from response (assuming it's in response.data.access_token or similar)
    const token = response.data.access_token || response.data.token;
    if (token) {
      TokenManager.setToken(token);
      console.log('JWT token stored successfully');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      throw new Error(`Cannot connect to auth server: ${AUTH_API}`);
    }
    throw error.response?.data || error;
  }
}

// Auth Service - User Management
export async function me() {
  try {
    const response = await axios.get(`${AUTH_API}/api/auth/me`, { 
      headers: authHeaders() 
    });
    return response.data;
  } catch (error: any) {
    console.error('Get user error:', error);
    if (error.response?.status === 401) {
      TokenManager.removeToken(); // Clear invalid token
    }
    throw error.response?.data || error;
  }
}

export async function logout() {
  try {
    await axios.post(`${AUTH_API}/api/auth/logout`, {}, {
      headers: authHeaders()
    });
    TokenManager.removeToken();
    console.log('Logged out successfully');
  } catch (error: any) {
    console.error('Logout error:', error);
    TokenManager.removeToken(); // Clear token anyway
    throw error.response?.data || error;
  }
}

// TTS Service API Calls - All require JWT authentication
export async function getVoices() {
  try {
    if (!TokenManager.isAuthenticated()) {
      throw new Error('Authentication required. Please login first.');
    }
    
    const response = await axios.get(`${TTS_API}/voices`, { 
      headers: authHeaders() 
    });
    console.log('Voices fetched successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Get voices error:', error);
    if (error.response?.status === 401) {
      TokenManager.removeToken(); // Clear invalid token
      throw new Error('Authentication expired. Please login again.');
    }
    throw error.response?.data || error;
  }
}

export async function synthesize(text: string, voice: string = "emma_american_female", language: string = "en") {
  try {
    if (!TokenManager.isAuthenticated()) {
      throw new Error('Authentication required. Please login first.');
    }
    
    console.log(`Synthesizing text with voice: ${voice}`);
    const response = await axios.post(`${TTS_API}/tts/speak`, {
      text,
      voice,
      language
    }, {
      headers: {
        ...authHeaders(),
        'Content-Type': 'application/json'
      },
      responseType: "blob",
      timeout: 120000,
    });
    
    console.log('TTS synthesis successful');
    return response;
  } catch (error: any) {
    console.error('TTS synthesis error:', error);
    if (error.response?.status === 401) {
      TokenManager.removeToken(); // Clear invalid token
      throw new Error('Authentication expired. Please login again.');
    }
    throw error.response?.data || error;
  }
}

// Legacy function for backward compatibility
export async function getSpeakers() {
  return getVoices();
}

export async function listOutputs() {
  // This might not be needed for the new TTS service, but keeping for compatibility
  try {
    const response = await axios.get(`${TTS_API}/outputs/list`, { 
      headers: authHeaders() 
    });
    return response.data;
  } catch (error: any) {
    console.error('List outputs error:', error);
    throw error.response?.data || error;
  }
}
