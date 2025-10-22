/**
 * Web Vitals Performance Monitoring
 * Tracks Core Web Vitals and reports to analytics
 */

import { onCLS, onFID, onFCP, onLCP, onTTFB, onINP, type Metric } from 'web-vitals';
import { logger } from '../utils/logger';
import { trackEvent } from './analytics';

class WebVitalsService {
  private metrics: Record<string, number> = {};

  /**
   * Initialize Web Vitals monitoring
   */
  init() {
    try {
      // Cumulative Layout Shift (visual stability)
      // Good: < 0.1, Needs Improvement: 0.1-0.25, Poor: > 0.25
      onCLS(this.handleMetric);

      // First Input Delay (interactivity)
      // Good: < 100ms, Needs Improvement: 100-300ms, Poor: > 300ms
      onFID(this.handleMetric);

      // First Contentful Paint (loading)
      // Good: < 1.8s, Needs Improvement: 1.8-3s, Poor: > 3s
      onFCP(this.handleMetric);

      // Largest Contentful Paint (loading)
      // Good: < 2.5s, Needs Improvement: 2.5-4s, Poor: > 4s
      onLCP(this.handleMetric);

      // Time to First Byte (server response)
      // Good: < 800ms, Needs Improvement: 800-1800ms, Poor: > 1800ms
      onTTFB(this.handleMetric);

      // Interaction to Next Paint (responsiveness) - NEW!
      // Good: < 200ms, Needs Improvement: 200-500ms, Poor: > 500ms
      onINP(this.handleMetric);

      logger.info('📊 Web Vitals monitoring initialized');
    } catch (error) {
      logger.error('Failed to initialize Web Vitals:', error);
    }
  }

  /**
   * Handle metric and report to analytics
   */
  private handleMetric = (metric: Metric) => {
    const value = Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value);
    this.metrics[metric.name] = value;

    // Determine rating
    const rating = this.getRating(metric.name, metric.value);
    const emoji = this.getEmoji(rating);

    // Log in development
    logger.debug(`${emoji} ${metric.name}: ${value}${this.getUnit(metric.name)} (${rating})`);

    // Send to analytics
    trackEvent.performanceMetric(metric.name, value, this.getUnit(metric.name));

    // Log detailed info
    if (logger) {
      logger.info(`Performance: ${metric.name}`, {
        value,
        rating,
        id: metric.id,
        navigationType: metric.navigationType,
      });
    }
  };

  /**
   * Get unit for metric
   */
  private getUnit(metricName: string): string {
    return metricName === 'CLS' ? '' : 'ms';
  }

  /**
   * Get rating for metric value
   */
  private getRating(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, [number, number]> = {
      'CLS': [0.1, 0.25],
      'FID': [100, 300],
      'FCP': [1800, 3000],
      'LCP': [2500, 4000],
      'TTFB': [800, 1800],
      'INP': [200, 500],
    };

    const [good, poor] = thresholds[name] || [0, 0];
    
    if (value <= good) return 'good';
    if (value <= poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get emoji for rating
   */
  private getEmoji(rating: string): string {
    switch (rating) {
      case 'good': return '✅';
      case 'needs-improvement': return '⚠️';
      case 'poor': return '❌';
      default: return '📊';
    }
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): Record<string, number> {
    return { ...this.metrics };
  }

  /**
   * Get performance score (0-100)
   */
  getScore(): number {
    const metrics = Object.keys(this.metrics);
    if (metrics.length === 0) return 0;

    let totalScore = 0;
    let count = 0;

    for (const name of metrics) {
      const value = this.metrics[name];
      const rating = this.getRating(name, value);
      
      let score = 0;
      if (rating === 'good') score = 100;
      else if (rating === 'needs-improvement') score = 50;
      else score = 0;
      
      totalScore += score;
      count++;
    }

    return Math.round(totalScore / count);
  }

  /**
   * Get summary report
   */
  getSummary(): string {
    const score = this.getScore();
    const metrics = this.getMetrics();
    
    let summary = `Performance Score: ${score}/100\n`;
    summary += `\nMetrics:\n`;
    
    for (const [name, value] of Object.entries(metrics)) {
      const rating = this.getRating(name, value);
      const emoji = this.getEmoji(rating);
      const unit = this.getUnit(name);
      summary += `${emoji} ${name}: ${value}${unit} (${rating})\n`;
    }
    
    return summary;
  }
}

// Export singleton instance
export const webVitals = new WebVitalsService();
export default webVitals;
