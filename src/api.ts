// src/api.ts - UPDATED BY CLAUDE for JWT Authentication Flow
import axios from "axios";

// Service URLs - Updated for Final-Voxly Backend
const AUTH_API = import.meta.env.VITE_AUTH_URL || "https://yaya5777-voxly-auth.hf.space";
const TTS_API = import.meta.env.VITE_TTS_URL || "https://yaya5777-voxly-tts.hf.space";

// Configure axios defaults
axios.defaults.timeout = 30000; // 30 second timeout
axios.defaults.withCredentials = true;

// Cookie utility functions for token management
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// JWT Token Management - Uses cookies for cross-tab persistence
export const TokenManager = {
  getToken: () => {
    // Try cookie first (primary method)
    const cookieToken = getCookie('voxly_at');
    if (cookieToken) return cookieToken;
    
    // Fallback to localStorage for backward compatibility
    return localStorage.getItem("voxly_jwt_token");
  },
  setToken: (token: string) => {
    // Store in both cookie and localStorage for redundancy
    setCookie('voxly_at', token, 7);
    localStorage.setItem("voxly_jwt_token", token);
  },
  removeToken: () => {
    deleteCookie('voxly_at');
    deleteCookie('voxly_rt');
    localStorage.removeItem("voxly_jwt_token");
  },
  isAuthenticated: () => !!TokenManager.getToken()
};

function authHeaders() {
  const token = TokenManager.getToken();
  if (!token) {
    console.warn('⚠️ No auth token found for request');
    return {};
  }
  return { Authorization: `Bearer ${token}` };
}

// Auth Service API Calls
export async function register(fullName: string, username: string, email: string, password: string) {
  try {
    console.log(`Registering user: ${username} to ${AUTH_API}/auth/register`);
    const response = await axios.post(`${AUTH_API}/auth/register`, {
      fullName,
      username,
      email,
      password
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    console.log('✅ Register success:', response.data);
    
    // Store token after successful registration
    const token = response.data.access_token || response.data.token;
    if (token) {
      TokenManager.setToken(token);
      console.log('✅ JWT token stored after registration');
    }
    
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
    console.log(`Logging in user: ${login} to ${AUTH_API}/auth/login`);
    const response = await axios.post(`${AUTH_API}/auth/login`, {
      login, // Can be username or email
      password
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    console.log('✅ Login success:', response.data);
    
    // Extract JWT token from response
    const token = response.data.access_token || response.data.token;
    if (token) {
      TokenManager.setToken(token);
      console.log('✅ JWT token stored in cookies and localStorage');
    } else {
      console.error('❌ No access token received from server');
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
    const response = await axios.get(`${AUTH_API}/auth/me`, { 
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
    await axios.post(`${AUTH_API}/auth/logout`, {}, {
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

export async function resendVerificationEmail() {
  try {
    if (!TokenManager.isAuthenticated()) {
      throw new Error('Authentication required. Please login first.');
    }
    
    console.log('Requesting to resend verification email');
    const response = await axios.post(`${AUTH_API}/auth/resend-verification`, {}, {
      headers: authHeaders()
    });
    console.log('Verification email resend successful:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Resend verification email error:', error);
    if (error.response?.status === 401) {
      TokenManager.removeToken();
      throw new Error('Authentication expired. Please login again.');
    }
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
