/**
 * Analytics Service - PostHog Integration
 * Tracks user events, pageviews, and custom properties
 */

import posthog from 'posthog-js';
import { ENV } from '../config/env';
import { logger } from '../utils/logger';

class AnalyticsService {
  private initialized = false;

  /**
   * Initialize PostHog
   */
  init() {
    if (this.initialized) return;
    
    const apiKey = import.meta.env.VITE_POSTHOG_KEY;
    const host = import.meta.env.VITE_POSTHOG_HOST || 'https://app.posthog.com';

    if (!apiKey) {
      logger.warn('⚠️ PostHog API key not found. Analytics disabled.');
      return;
    }

    try {
      posthog.init(apiKey, {
        api_host: host,
        
        // Privacy settings
        opt_out_capturing_by_default: false,
        respect_dnt: true,
        
        // Performance
        loaded: (posthog) => {
          if (ENV.IS_DEV) {
            logger.info('✅ PostHog analytics initialized');
          }
        },
        
        // Capture settings
        capture_pageview: true,
        capture_pageleave: true,
        
        // Session recording (optional - can be disabled for privacy)
        session_recording: {
          recordCrossOriginIframes: false,
          maskAllInputs: true, // Mask sensitive inputs
          maskTextSelector: '[data-mask]', // Custom mask selector
        },
        
        // Autocapture (tracks clicks automatically)
        autocapture: true,
      });

      this.initialized = true;
      logger.info('📊 Analytics ready');
    } catch (error) {
      logger.error('Failed to initialize PostHog:', error);
    }
  }

  /**
   * Track custom event
   */
  track(eventName: string, properties?: Record<string, any>) {
    if (!this.initialized) return;
    
    try {
      posthog.capture(eventName, properties);
      logger.debug(`📊 Event tracked: ${eventName}`, properties);
    } catch (error) {
      logger.error(`Failed to track event ${eventName}:`, error);
    }
  }

  /**
   * Identify user
   */
  identify(userId: string, properties?: Record<string, any>) {
    if (!this.initialized) return;
    
    try {
      posthog.identify(userId, properties);
      logger.debug(`👤 User identified: ${userId}`);
    } catch (error) {
      logger.error('Failed to identify user:', error);
    }
  }

  /**
   * Set user properties
   */
  setUserProperties(properties: Record<string, any>) {
    if (!this.initialized) return;
    
    try {
      posthog.people.set(properties);
      logger.debug('👤 User properties updated');
    } catch (error) {
      logger.error('Failed to set user properties:', error);
    }
  }

  /**
   * Track page view
   */
  pageView(pageName?: string) {
    if (!this.initialized) return;
    
    try {
      posthog.capture('$pageview', pageName ? { page: pageName } : undefined);
      logger.debug(`📄 Page view: ${pageName || window.location.pathname}`);
    } catch (error) {
      logger.error('Failed to track page view:', error);
    }
  }

  /**
   * Reset user (on logout)
   */
  reset() {
    if (!this.initialized) return;
    
    try {
      posthog.reset();
      logger.debug('🔄 Analytics reset');
    } catch (error) {
      logger.error('Failed to reset analytics:', error);
    }
  }

  /**
   * Opt out of tracking
   */
  optOut() {
    if (!this.initialized) return;
    
    try {
      posthog.opt_out_capturing();
      logger.info('🚫 Analytics opted out');
    } catch (error) {
      logger.error('Failed to opt out:', error);
    }
  }

  /**
   * Opt in to tracking
   */
  optIn() {
    if (!this.initialized) return;
    
    try {
      posthog.opt_in_capturing();
      logger.info('✅ Analytics opted in');
    } catch (error) {
      logger.error('Failed to opt in:', error);
    }
  }

  /**
   * Start session recording
   */
  startRecording() {
    if (!this.initialized) return;
    posthog.startSessionRecording();
  }

  /**
   * Stop session recording
   */
  stopRecording() {
    if (!this.initialized) return;
    posthog.stopSessionRecording();
  }
}

// Export singleton instance
export const analytics = new AnalyticsService();

// Convenience methods for common events
export const trackEvent = {
  // Authentication
  userRegistered: (userId: string) => analytics.track('User Registered', { user_id: userId }),
  userLoggedIn: (userId: string) => analytics.track('User Logged In', { user_id: userId }),
  userLoggedOut: () => analytics.track('User Logged Out'),
  
  // Voice actions
  voiceDemoPlayed: (voiceId: string, voiceName: string) => 
    analytics.track('Voice Demo Played', { voice_id: voiceId, voice_name: voiceName }),
  
  voiceSynthesized: (voiceId: string, textLength: number, language: string) => 
    analytics.track('Voice Synthesized', { voice_id: voiceId, text_length: textLength, language }),
  
  voiceDownloaded: (voiceId: string, format: string) => 
    analytics.track('Voice Downloaded', { voice_id: voiceId, format }),
  
  // UI actions
  themeChanged: (theme: string) => 
    analytics.track('Theme Changed', { theme }),
  
  pageViewed: (pageName: string, path: string) => 
    analytics.track('Page Viewed', { page_name: pageName, path }),
  
  // Errors
  errorOccurred: (errorMessage: string, errorType: string, page: string) => 
    analytics.track('Error Occurred', { error_message: errorMessage, error_type: errorType, page }),
  
  // Performance
  performanceMetric: (metric: string, value: number, unit: string) => 
    analytics.track('Performance Metric', { metric, value, unit }),
};

export default analytics;
