// Authentication API service for Voxly
const API_BASE_URL = 'https://auth-service-ancient-frost-8646.fly.dev';

export interface RegisterData {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  login: string; // username or email
  password: string;
}

export interface AuthResponse {
  message: string;
  user?: {
    id: string;
    fullName: string;
    username: string;
    email: string;
    isVerified: boolean;
  };
  requiresVerification?: boolean;
  email?: string;
}

export interface ApiError {
  error: string;
  details?: any[];
  requiresVerification?: boolean;
  email?: string;
}

// Register new user
export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result;
};

// Login user
export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result;
};

// Resend verification email
export const resendVerification = async (email: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/resend-verification`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result;
};

// Get current user
export const getCurrentUser = async (): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result;
};

// Refresh access token
export const refreshToken = async (): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
    method: 'POST',
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result;
};

// Logout user
export const logoutUser = async (): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result;
};

// Forgot password
export const forgotPassword = async (email: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ email }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result;
};

// Reset password
export const resetPassword = async (token: string, password: string): Promise<{ message: string }> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ token, password }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result as ApiError;
  }

  return result;
};

// Google OAuth URLs
export const getGoogleAuthUrl = (): string => {
  return `${API_BASE_URL}/auth/google`;
};

// Utility function to handle API errors
export const handleApiError = (error: ApiError): string => {
  if (error.details && error.details.length > 0) {
    return error.details.map((detail: any) => detail.msg).join(', ');
  }
  return error.error || 'An unexpected error occurred';
};
