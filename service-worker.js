
// Simple cache-first service worker
const CACHE_NAME = 'gensafe-static-v1';
const PRECACHE_URLS = ['/', '/index.html', '/manifest.json', '/styles.css'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => 
      resp || fetch(event.request).then(resp2 => {
        return caches.open('gensafe-dynamic-v1').then(cache => {
          cache.put(event.request, resp2.clone());
          return resp2;
        });
      })
    ).catch(()=>caches.match('/offline.html'))
  );
});
