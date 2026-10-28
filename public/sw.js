// Nava Bharat PWA Service Worker
const CACHE_NAME = 'navabharat-cache-v1';

// Install event: activate immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event: claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch event: required by Chrome Android for PWA installability
self.addEventListener('fetch', (event) => {
  // Pass-through fetch with network-first fallback
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
