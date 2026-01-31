const CACHE_NAME = 'statmaxer-v1.0.0';
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './mobile.css',
    './app-rpg.js',
    './manifest.json',
    './icon-192.png',
    './icon-512.png',
    'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&display=swap',
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js'
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
                })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => response || fetch(event.request))
    );
});

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
    event.waitUntil(self.registration.showNotification(data.title || 'StatMaxer Quest', options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const habitId = event.notification.data?.habitId;
    const habitName = event.notification.data?.habitName;
    const hardcore = event.notification.data?.hardcore;

    if (event.action === 'complete') {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
                clientList.forEach((client) => {
                    client.postMessage({ type: 'NOTIFICATION_CLICK', habitId: habitId, action: 'complete' });
                });
                if (clientList.length > 0) {
                    return clientList[0].focus();
                } else {
                    return clients.openWindow('/');
                }
            })
        );
    } else if (event.action === 'snooze') {
        if (hardcore) {
            event.waitUntil(
                clients.matchAll({ type: 'window' }).then((clientList) => {
                    clientList.forEach((client) => {
                        client.postMessage({ type: 'SNOOZE_PENALTY', xpLoss: 5, denied: true, habitName: habitName });
                    });
                })
            );
            event.waitUntil(
                self.registration.showNotification('💀 HARDCORE MODE', {
                    body: `Snooze denied for "${habitName}"! -5 XP penalty applied.`,
                    icon: '/icon-192.png',
                    badge: '/icon-192.png',
                    tag: 'hardcore-denial',
                    requireInteraction: false,
                    vibrate: [100, 50, 100]
                })
            );
        } else {
            event.waitUntil(
                clients.matchAll({ type: 'window' }).then((clientList) => {
                    clientList.forEach((client) => {
                        client.postMessage({ type: 'NOTIFICATION_CLICK', habitId: habitId, action: 'snooze' });
                    });
                })
            );
        }
    } else {
        event.waitUntil(
            clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
                if (clientList.length > 0) {
                    return clientList[0].focus();
                } else {
                    return clients.openWindow('/');
                }
            })
        );
    }
});
