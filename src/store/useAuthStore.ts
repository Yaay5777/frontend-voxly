import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

// Cookie utility functions
const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

const setCookie = (name: string, value: string, days = 7) => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  loginFromCookies: () => Promise<boolean>;
  logout: () => Promise<void>;
  updateUser: (user: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(persist(
  (set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: (token: string, user: User) => {
    console.log('✅ Logging in user:', user.email);
    
    // Store token in cookies
    setCookie('voxly_at', token, 7);
    
    set({
      token,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  loginFromCookies: async () => {
    const accessToken = getCookie('voxly_at');
    const refreshToken = getCookie('voxly_rt');

    if (accessToken) {
      try {
        // Verify the token with the correct backend
        const authUrl = import.meta.env.VITE_AUTH_URL || import.meta.env.NEXT_PUBLIC_AUTH_URL || 'https://yaya5777-voxly-auth.hf.space';
        const response = await fetch(`${authUrl}/auth/me`, {
          headers: {
            "Authorization": `Bearer ${accessToken}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Valid JWT token found, logging in user:', data.email);
          set({
            token: accessToken,
            user: {
              id: data.id,
              username: data.username,
              email: data.email,
              name: data.fullName,
              fullName: data.fullName,
              is_premium: data.tier === 'premium',
              created_at: data.createdAt,
              tier: data.tier || 'free',
              weekly_quota: 1000,
              weekly_used: 0,
              quota_cycle_start: new Date().toISOString(),
              isVerified: data.isVerified
            },
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } else if (response.status === 401) {
          console.log('❌ Token expired or invalid');
          // Clear invalid token
          deleteCookie('voxly_at');
          deleteCookie('voxly_rt');
        }
      } catch (error) {
        console.error('❌ Failed to verify token:', error);
      }
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    return false;
  },

  logout: async () => {
    console.log('🚪 Logging out user');

    try {
      // Call backend logout endpoint if it exists
      const authUrl = import.meta.env.VITE_AUTH_URL || import.meta.env.NEXT_PUBLIC_AUTH_URL || 'https://yaya5777-voxly-auth.hf.space';
      const token = get().token;
      if (token) {
        await fetch(`${authUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Logout request failed:', error);
    }

    // Clear cookies
    deleteCookie('voxly_at');
    deleteCookie('voxly_rt');

    // Clear state
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  updateUser: (userData: Partial<User>) => {
    const currentUser = get().user;
    if (currentUser) {
      set({
        user: { ...currentUser, ...userData },
      });
    }
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  initializeAuth: async () => {
    console.log('🔄 Initializing authentication...');
    set({ isLoading: true });

    try {
      // Try to login from cookies (this will verify tokens with backend)
      const success = await get().loginFromCookies();
      
      if (success) {
        console.log('✅ Authentication initialized successfully');
      } else {
        console.log('ℹ️ No valid session found');
      }
    } catch (error) {
      console.error('❌ Failed to initialize auth:', error);
      set({ isLoading: false });
    }
  },
}), {
  name: 'voxly-auth-storage',
  // Only persist user data, not tokens (tokens stay in cookies)
  partialize: (state) => ({ 
    user: state.user,
    isAuthenticated: state.isAuthenticated 
  }),
  // Skip hydration initially, rely on initializeAuth
  skipHydration: false,
}));
