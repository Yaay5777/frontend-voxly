/**
 * IndexedDB Voice Preview Cache
 * Stores voice audio samples in browser for instant playback
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { logger } from '../utils/logger';

interface VoiceCacheDB extends DBSchema {
  'voice-previews': {
    key: string;
    value: {
      voiceId: string;
      audioBlob: Blob;
      timestamp: number;
      size: number;
    };
  };
}

class VoiceCacheService {
  private dbName = 'voxly-voice-cache';
  private storeName = 'voice-previews';
  private db: IDBPDatabase<VoiceCacheDB> | null = null;
  private maxCacheSize = 50 * 1024 * 1024; // 50MB max cache
  private maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

  async init() {
    try {
      this.db = await openDB<VoiceCacheDB>(this.dbName, 1, {
        upgrade(db) {
          if (!db.objectStoreNames.contains('voice-previews')) {
            db.createObjectStore('voice-previews', { keyPath: 'voiceId' });
          }
        },
      });
      logger.info('✅ Voice cache initialized');
      
      // Clean old entries on init
      await this.cleanOldEntries();
    } catch (error) {
      logger.error('Failed to initialize voice cache:', error);
    }
  }

  /**
   * Store voice preview in cache
   */
  async set(voiceId: string, audioBlob: Blob): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) return;

    try {
      const entry = {
        voiceId,
        audioBlob,
        timestamp: Date.now(),
        size: audioBlob.size,
      };

      await this.db.put('voice-previews', entry);
      logger.debug(`🎵 Cached voice preview: ${voiceId} (${(audioBlob.size / 1024).toFixed(1)}KB)`);

      // Check cache size and clean if needed
      await this.enforCacheSizeLimit();
    } catch (error) {
      logger.error(`Failed to cache voice ${voiceId}:`, error);
    }
  }

  /**
   * Get voice preview from cache
   */
  async get(voiceId: string): Promise<Blob | null> {
    if (!this.db) await this.init();
    if (!this.db) return null;

    try {
      const entry = await this.db.get('voice-previews', voiceId);
      
      if (!entry) {
        logger.debug(`❌ Voice not in cache: ${voiceId}`);
        return null;
      }

      // Check if entry is too old
      const age = Date.now() - entry.timestamp;
      if (age > this.maxAge) {
        logger.debug(`⏰ Voice cache expired: ${voiceId}`);
        await this.delete(voiceId);
        return null;
      }

      logger.debug(`✅ Voice loaded from cache: ${voiceId}`);
      return entry.audioBlob;
    } catch (error) {
      logger.error(`Failed to get voice ${voiceId}:`, error);
      return null;
    }
  }

  /**
   * Delete voice preview from cache
   */
  async delete(voiceId: string): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) return;

    try {
      await this.db.delete('voice-previews', voiceId);
      logger.debug(`🗑️ Deleted voice from cache: ${voiceId}`);
    } catch (error) {
      logger.error(`Failed to delete voice ${voiceId}:`, error);
    }
  }

  /**
   * Clear all cached voices
   */
  async clear(): Promise<void> {
    if (!this.db) await this.init();
    if (!this.db) return;

    try {
      await this.db.clear('voice-previews');
      logger.info('🗑️ Voice cache cleared');
    } catch (error) {
      logger.error('Failed to clear voice cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{ count: number; size: number }> {
    if (!this.db) await this.init();
    if (!this.db) return { count: 0, size: 0 };

    try {
      const entries = await this.db.getAll('voice-previews');
      const count = entries.length;
      const size = entries.reduce((total, entry) => total + entry.size, 0);
      
      return { count, size };
    } catch (error) {
      logger.error('Failed to get cache stats:', error);
      return { count: 0, size: 0 };
    }
  }

  /**
   * Clean old entries (older than maxAge)
   */
  private async cleanOldEntries(): Promise<void> {
    if (!this.db) return;

    try {
      const entries = await this.db.getAll('voice-previews');
      const now = Date.now();
      let cleaned = 0;

      for (const entry of entries) {
        const age = now - entry.timestamp;
        if (age > this.maxAge) {
          await this.delete(entry.voiceId);
          cleaned++;
        }
      }

      if (cleaned > 0) {
        logger.info(`🧹 Cleaned ${cleaned} old voice previews`);
      }
    } catch (error) {
      logger.error('Failed to clean old entries:', error);
    }
  }

  /**
   * Enforce cache size limit by removing oldest entries
   */
  private async enforCacheSizeLimit(): Promise<void> {
    if (!this.db) return;

    try {
      const stats = await this.getStats();
      
      if (stats.size > this.maxCacheSize) {
        logger.warn(`⚠️ Cache size ${(stats.size / 1024 / 1024).toFixed(1)}MB exceeds limit, cleaning...`);
        
        // Get all entries sorted by timestamp
        const entries = await this.db.getAll('voice-previews');
        entries.sort((a, b) => a.timestamp - b.timestamp);
        
        // Delete oldest entries until under limit
        let currentSize = stats.size;
        for (const entry of entries) {
          if (currentSize <= this.maxCacheSize * 0.8) break; // Clean to 80% of limit
          
          await this.delete(entry.voiceId);
          currentSize -= entry.size;
        }
        
        logger.info(`✅ Cache cleaned to ${(currentSize / 1024 / 1024).toFixed(1)}MB`);
      }
    } catch (error) {
      logger.error('Failed to enforce cache size limit:', error);
    }
  }
}

// Export singleton instance
export const voiceCache = new VoiceCacheService();
export default voiceCache;
