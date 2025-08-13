const CACHE_NAME = 'gensafe-static-v1';
const PRECACHE_URLS = ['/', '/index.html', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', event => {
  // Only respond to GET
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cacheResp => {
      return cacheResp || fetch(event.request).then(networkResp => {
        return caches.open('gensafe-dynamic-v1').then(cache => {
          cache.put(event.request, networkResp.clone());
          return networkResp;
        });
      });
    }).catch(()=> caches.match('/index.html'))
  );
});
