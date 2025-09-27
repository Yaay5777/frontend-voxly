// Voxly TTS Service Worker for PWA functionality
const CACHE_NAME = 'voxly-tts-v1.0.0';
const RUNTIME_CACHE = 'voxly-runtime';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/favicon.svg',
  '/assets/favicon.png',
  '/assets/apple-touch-icon.png'
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching app shell');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('Service Worker installed');
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip API calls (let them go to network)
  if (url.pathname.startsWith('/api/')) {
    return;
  }
  
  // Skip external requests
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log('Serving from cache:', request.url);
        return cachedResponse;
      }
      
      return fetch(request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response for caching
        const responseToCache = response.clone();
        
        // Cache static assets
        if (shouldCache(request.url)) {
          caches.open(RUNTIME_CACHE).then((cache) => {
            console.log('Caching new resource:', request.url);
            cache.put(request, responseToCache);
          });
        }
        
        return response;
      }).catch(() => {
        // Fallback for offline navigation
        if (request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// Helper function to determine if a resource should be cached
function shouldCache(url) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  
  // Cache static assets
  if (pathname.startsWith('/assets/')) return true;
  if (pathname.endsWith('.js')) return true;
  if (pathname.endsWith('.css')) return true;
  if (pathname.endsWith('.woff2')) return true;
  if (pathname.endsWith('.svg')) return true;
  if (pathname.endsWith('.png')) return true;
  if (pathname.endsWith('.jpg')) return true;
  if (pathname.endsWith('.jpeg')) return true;
  
  return false;
}

// Handle background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Implement background sync logic if needed
  console.log('Performing background sync...');
}

// Handle push notifications (if implemented later)
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New notification from Voxly TTS',
    icon: '/assets/icon-192.png',
    badge: '/assets/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open App',
        icon: '/assets/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Voxly TTS', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
