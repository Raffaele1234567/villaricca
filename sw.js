const CACHE_NAME = 'pwa-store-v1';

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll([
      './',
      './index.html',
      './manifest.json',
      './icona.png'
    ]))
  );
  // Forza il service worker ad attivarsi subito
  self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    // Strategia "Network First": prova prima a scaricare da internet
    fetch(e.request)
      .then((response) => {
        // Se ha successo, aggiorna la memoria in background e mostra la pagina
        const responseClone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, responseClone);
        });
        return response;
      })
      .catch(() => {
        // Se non c'è internet (offline), usa la memoria salvata
        return caches.match(e.request);
      })
  );
});
