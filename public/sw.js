
const CACHE_NAME = 'gestion-p10-v2';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/placeholder.svg'
];

// Instalación del service worker
self.addEventListener('install', (event) => {
  console.log('SW: Installing service worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('SW: Cache opened');
        // Solo cachear recursos que sabemos que existen
        return cache.addAll(urlsToCache.filter(url => {
          // Filtrar URLs que podrían no existir
          return url === '/' || url === '/manifest.json' || url === '/placeholder.svg';
        }));
      })
      .catch((error) => {
        console.error('SW: Error adding to cache:', error);
      })
  );
  // Activar inmediatamente el nuevo service worker
  self.skipWaiting();
});

// Activación del service worker
self.addEventListener('activate', (event) => {
  console.log('SW: Activating service worker');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Tomar control inmediatamente
      return self.clients.claim();
    })
  );
});

// Interceptar requests
self.addEventListener('fetch', (event) => {
  // Solo interceptar requests GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar requests a extensiones del navegador y otros protocolos
  if (!event.request.url.startsWith('http')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Solo cachear ciertos tipos de recursos
          const url = new URL(event.request.url);
          const shouldCache = url.pathname.endsWith('.js') || 
                            url.pathname.endsWith('.css') || 
                            url.pathname.endsWith('.png') || 
                            url.pathname.endsWith('.jpg') || 
                            url.pathname.endsWith('.svg') ||
                            url.pathname === '/';

          if (shouldCache) {
            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.error('SW: Error caching response:', error);
              });
          }

          return response;
        }).catch(() => {
          // Si estamos offline y no hay cache, mostrar página offline básica
          if (event.request.destination === 'document') {
            return new Response(
              `<!DOCTYPE html>
              <html>
                <head>
                  <title>Sin conexión</title>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                    h1 { color: #333; }
                    p { color: #666; }
                  </style>
                </head>
                <body>
                  <h1>Sin conexión</h1>
                  <p>Por favor, verifica tu conexión a internet.</p>
                  <button onclick="window.location.reload()">Reintentar</button>
                </body>
              </html>`,
              { 
                headers: { 
                  'Content-Type': 'text/html',
                  'Cache-Control': 'no-cache'
                } 
              }
            );
          }
        });
      })
  );
});

// Escuchar mensajes del cliente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
