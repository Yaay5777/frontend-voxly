/**
 * Production-safe logging utility
 * Logs only appear in development mode
 */

import { ENV } from '../config/env';

type LogLevel = 'log' | 'info' | 'warn' | 'error' | 'debug';

class Logger {
  private isDev: boolean;

  constructor() {
    this.isDev = ENV.IS_DEV;
  }

  private shouldLog(level: LogLevel): boolean {
    // Always log errors and warnings
    if (level === 'error' || level === 'warn') {
      return true;
    }
    // Other logs only in development
    return this.isDev;
  }

  log(...args: any[]) {
    if (this.shouldLog('log')) {
      console.log('[Voxly]', ...args);
    }
  }

  info(...args: any[]) {
    if (this.shouldLog('info')) {
      console.info('[Voxly]', ...args);
    }
  }

  warn(...args: any[]) {
    if (this.shouldLog('warn')) {
      console.warn('[Voxly]', ...args);
    }
  }

  error(...args: any[]) {
    if (this.shouldLog('error')) {
      console.error('[Voxly]', ...args);
    }
  }

  debug(...args: any[]) {
    if (this.shouldLog('debug')) {
      console.debug('[Voxly]', ...args);
    }
  }

  // Special method for API calls
  api(method: string, url: string, data?: any) {
    if (this.isDev) {
      console.group(`🌐 API ${method}`);
      console.log('URL:', url);
      if (data) console.log('Data:', data);
      console.groupEnd();
    }
  }

  // Special method for performance tracking
  perf(label: string, fn: () => void) {
    if (this.isDev) {
      console.time(label);
      fn();
      console.timeEnd(label);
    } else {
      fn();
    }
  }
}

// Export singleton instance
export const logger = new Logger();

// Export convenience methods
export const log = (...args: any[]) => logger.log(...args);
export const info = (...args: any[]) => logger.info(...args);
export const warn = (...args: any[]) => logger.warn(...args);
export const error = (...args: any[]) => logger.error(...args);
export const debug = (...args: any[]) => logger.debug(...args);

export default logger;
