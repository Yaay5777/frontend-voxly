import DOMPurify from 'dompurify';
import { Filter } from 'bad-words';

// Initialize profanity filter
const profanityFilter = new Filter();

/**
 * Sanitize user input to prevent XSS attacks
 * Removes all HTML tags and potentially dangerous content
 */
export const sanitizeInput = (text: string): string => {
  if (!text) return '';
  
  // Remove all HTML tags and attributes
  const cleaned = DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [], // No HTML tags allowed
    ALLOWED_ATTR: [], // No attributes allowed
    KEEP_CONTENT: true, // Keep text content
  });
  
  return cleaned.trim();
};

/**
 * Validate text length
 */
export const validateTextLength = (text: string, maxLength: number): { valid: boolean; error?: string } => {
  if (!text || text.trim().length === 0) {
    return { valid: false, error: 'Text cannot be empty' };
  }
  
  if (text.length > maxLength) {
    return { 
      valid: false, 
      error: `Text exceeds maximum length of ${maxLength.toLocaleString()} characters` 
    };
  }
  
  return { valid: true };
};

/**
 * Content moderation - Check for inappropriate content
 */
export const moderateContent = (text: string): { safe: boolean; reason?: string } => {
  if (!text) return { safe: false, reason: 'Empty text' };
  
  // Check for profanity
  if (profanityFilter.isProfane(text)) {
    return { 
      safe: false, 
      reason: 'Content contains inappropriate language. Please revise your text.' 
    };
  }
  
  // Check for excessive repetition (potential spam)
  const words = text.toLowerCase().split(/\s+/);
  const wordCount = new Map<string, number>();
  
  words.forEach(word => {
    wordCount.set(word, (wordCount.get(word) || 0) + 1);
  });
  
  // Flag if any word appears more than 30% of the text
  const maxRepetition = Math.floor(words.length * 0.3);
  for (const [word, count] of wordCount.entries()) {
    if (count > maxRepetition && word.length > 3) {
      return { 
        safe: false, 
        reason: 'Text contains excessive repetition. Please use varied content.' 
      };
    }
  }
  
  return { safe: true };
};

/**
 * Rate limiting helper (client-side)
 * Prevents users from making too many requests in a short time
 */
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  /**
   * Check if action is allowed
   * @param key Unique identifier (e.g., user ID or action name)
   * @param limit Max requests allowed in window
   * @param windowMs Time window in milliseconds
   */
  checkLimit(key: string, limit: number, windowMs: number): { allowed: boolean; retryAfter?: number } {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    
    // Remove old timestamps outside the window
    const validTimestamps = timestamps.filter(time => now - time < windowMs);
    
    if (validTimestamps.length >= limit) {
      const oldestRequest = Math.min(...validTimestamps);
      const retryAfter = Math.ceil((oldestRequest + windowMs - now) / 1000);
      
      return { 
        allowed: false, 
        retryAfter 
      };
    }
    
    // Add current timestamp
    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);
    
    return { allowed: true };
  }
  
  /**
   * Reset limits for a key
   */
  reset(key: string) {
    this.requests.delete(key);
  }
}

export const rateLimiter = new RateLimiter();

/**
 * Validate email format
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password: string): { 
  valid: boolean; 
  strength: 'weak' | 'medium' | 'strong';
  errors: string[];
} => {
  const errors: string[] = [];
  let score = 0;
  
  // Length check
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  } else {
    score++;
    if (password.length >= 12) score++;
  }
  
  // Uppercase check
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else {
    score++;
  }
  
  // Lowercase check
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else {
    score++;
  }
  
  // Number check
  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else {
    score++;
  }
  
  // Special character check
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  } else {
    score++;
  }
  
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 5) strength = 'strong';
  else if (score >= 3) strength = 'medium';
  
  return {
    valid: errors.length === 0,
    strength,
    errors
  };
};

/**
 * Escape special characters for safe display
 */
export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};

/**
 * Generate CSRF token (for forms)
 */
export const generateCSRFToken = (): string => {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

/**
 * Validate URL to prevent open redirect attacks
 */
export const validateRedirectUrl = (url: string, allowedDomains: string[]): boolean => {
  try {
    const parsedUrl = new URL(url);
    return allowedDomains.some(domain => 
      parsedUrl.hostname === domain || parsedUrl.hostname.endsWith(`.${domain}`)
    );
  } catch {
    // If URL parsing fails, check if it's a relative URL
    return url.startsWith('/') && !url.startsWith('//');
  }
};
