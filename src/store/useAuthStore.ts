import { create } from 'zustand';
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

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: (token: string, user: User) => {
    console.log('✅ Logging in user:', user.email);
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
        // Verify the token with the backend
        const response = await fetch('https://auth-service-ancient-frost-8646.fly.dev/api/auth/me', {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ Valid JWT token found, logging in user:', data.user.email);
          set({
            token: accessToken,
            user: data.user,
            isAuthenticated: true,
            isLoading: false,
          });
          return true;
        } else if (response.status === 401) {
          console.log('❌ Token expired or invalid');
          // Try to refresh token
          if (refreshToken) {
            try {
              const refreshResponse = await fetch('https://auth-service-ancient-frost-8646.fly.dev/api/auth/refresh-token', {
                method: 'POST',
                credentials: 'include',
              });

              if (refreshResponse.ok) {
                const refreshData = await refreshResponse.json();
                console.log('✅ Token refreshed successfully for user:', refreshData.user.email);
                set({
                  token: getCookie('voxly_at'), // Get new access token
                  user: refreshData.user,
                  isAuthenticated: true,
                  isLoading: false,
                });
                return true;
              }
            } catch (error) {
              console.error('❌ Token refresh failed:', error);
            }
          }
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
      // Call backend logout endpoint
      await fetch('https://auth-service-ancient-frost-8646.fly.dev/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
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

    // Try to login from cookies (this will verify tokens with backend)
    await get().loginFromCookies();
  },
}));
