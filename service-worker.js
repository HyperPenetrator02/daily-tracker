// StatMaxer Service Worker - Offline Support
const CACHE_NAME = 'statmaxer-v1.0.0';
const urlsToCache = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/manifest.json',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            }
            )
    );
});

// Push notification event
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || 'Time to complete your quest!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        vibrate: [200, 100, 200],
        tag: 'statmaxer-notification',
        requireInteraction: data.hardcore || false,
        actions: [
            { action: 'complete', title: 'Complete Quest' },
            { action: 'snooze', title: 'Snooze (-5 XP)' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'StatMaxer Quest', options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'complete') {
        // Open app and mark as complete
        event.waitUntil(
            clients.openWindow('/')
        );
    } else if (event.action === 'snooze') {
        // Apply XP penalty
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then((clientList) => {
                clientList.forEach((client) => {
                    client.postMessage({
                        type: 'SNOOZE_PENALTY',
                        xpLoss: 5
                    });
                });
            })
        );
    }
});
