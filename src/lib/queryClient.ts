/**
 * React Query Configuration
 * Handles API caching, background refetching, and optimistic updates
 */

import { QueryClient } from '@tanstack/react-query';
import { logger } from '../utils/logger';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Cache data for 5 minutes
      staleTime: 5 * 60 * 1000,
      
      // Keep unused data in cache for 10 minutes
      gcTime: 10 * 60 * 1000,
      
      // Retry failed requests 2 times
      retry: 2,
      
      // Retry delay (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      
      // Refetch on window focus (disabled for better UX)
      refetchOnWindowFocus: false,
      
      // Refetch on network reconnect
      refetchOnReconnect: true,
      
      // Show stale data while refetching in background
      refetchOnMount: 'always',
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      
      // Error handler
      onError: (error) => {
        logger.error('Mutation error:', error);
      },
    },
  },
});

// Query keys for easy access and type safety
export const queryKeys = {
  // Voices
  voices: ['voices'] as const,
  voice: (id: string) => ['voice', id] as const,
  voiceDemo: (id: string) => ['voice-demo', id] as const,
  
  // User
  user: ['user'] as const,
  userProfile: (id: string) => ['user', id] as const,
  
  // Audio
  audioHistory: ['audio-history'] as const,
  audioFile: (id: string) => ['audio', id] as const,
  
  // Quota
  quota: ['quota'] as const,
} as const;

export default queryClient;
