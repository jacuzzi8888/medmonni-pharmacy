// Medomni Pharmacy Service Worker
// Provides offline support and caching for better performance

const CACHE_NAME = 'medomni-pharmacy-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/logo.png',
    '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Install');
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[ServiceWorker] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    // Take control immediately
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Activate');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[ServiceWorker] Removing old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    // Take control of all pages immediately
    self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Skip cross-origin requests
    if (!event.request.url.startsWith(self.location.origin)) return;

    // Skip API calls - always go to network
    if (event.request.url.includes('/api/') ||
        event.request.url.includes('supabase.co')) {
        return;
    }

    event.respondWith(
        // Try network first
        fetch(event.request)
            .then((response) => {
                // Clone the response before caching
                const responseClone = response.clone();

                // Cache successful responses
                if (response.status === 200) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }

                return response;
            })
            .catch(() => {
                // Network failed, try cache
                return caches.match(event.request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    // Return offline fallback for navigation requests
                    if (event.request.mode === 'navigate') {
                        return caches.match('/');
                    }

                    // Return nothing for other requests
                    return new Response('Offline', { status: 503 });
                });
            })
    );
});

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
