const CACHE_NAME = 'nuinvest-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/auth.html',
  '/profile.html',
  '/withdraw.html',
  '/withdraw-history.html',
  '/support.html',
  '/presence.html',
  '/invest.html',
  '/invited.html',
  '/history.html',
  '/referrals.html',
  '/deposit.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }).catch(() => {
      return caches.match('/index.html');
    })
  );
});