// NuInvest Service Worker com suporte offline e preload

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

const CACHE = "nuinvest-cache-v1";
const offlineFallbackPage = "offline.html";

// Mensagem para ativar imediatamente
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Instala e adiciona a página offline ao cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.add(offlineFallbackPage))
  );
});

// Ativa e assume controle dos clientes
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Habilita navigation preload se suportado
if (workbox.navigationPreload.isSupported()) {
  workbox.navigationPreload.enable();
}

// Intercepta navegações
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        // Aguarda o preloadResponse corretamente
        const preloadResp = await event.preloadResponse;
        if (preloadResp) {
          return preloadResp;
        }

        // Tenta buscar da rede
        const networkResp = await fetch(event.request);
        return networkResp;
      } catch (error) {
        // Se falhar, retorna o offline.html do cache
        const cache = await caches.open(CACHE);
        const cachedResp = await cache.match(offlineFallbackPage);
        return cachedResp;
      }
    })());
  }
});
