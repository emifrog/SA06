const CACHE_NAME = 'sa06-v1.0.0';
const STATIC_CACHE_URLS = [
  '/',
  '/index.html',
  '/pages/faq.html',
  '/pages/asa/contact.html',
  '/pages/asa/asa.html',
  '/pages/media.html',
  '/style.css',
  '/css/faq.css',
  '/css/asa.css',
  '/css/asa-contact.css',
  '/css/france-map.css',
  '/css/mobile-menu.css',
  '/css/reasons-style.css',
  '/css/slider-progress.css',
  '/main.js',
  '/js/asa.js',
  '/js/france-map.js',
  '/js/mobile-menu.js',
  '/js/scroll-to-top.js',
  '/js/slider.js',
  '/js/submenu-fix.js',
  '/images/logo.svg',
  '/images/favicon.ico',
  '/images/asa/Logo-ASA06.png',
  '/images/asa/favicon.png',
  '/manifest.json'
];

// Installation du service worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installation en cours...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Mise en cache des fichiers statiques');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Service Worker: Installation terminée');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Service Worker: Erreur lors de l\'installation', error);
      })
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activation en cours...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Service Worker: Suppression de l\'ancien cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker: Activation terminée');
        return self.clients.claim();
      })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-HTTP
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Ignorer les requêtes vers des domaines externes (sauf les fonts et CDN)
  const url = new URL(event.request.url);
  const isExternal = url.origin !== location.origin;
  const isFont = event.request.destination === 'font' || 
                 url.hostname.includes('fonts.googleapis.com') ||
                 url.hostname.includes('fonts.gstatic.com') ||
                 url.hostname.includes('cdnjs.cloudflare.com');

  if (isExternal && !isFont) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Si la ressource est en cache, la retourner
        if (cachedResponse) {
          return cachedResponse;
        }

        // Sinon, faire la requête réseau
        return fetch(event.request)
          .then((response) => {
            // Vérifier si la réponse est valide
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Cloner la réponse pour la mettre en cache
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                // Mettre en cache seulement les ressources de notre domaine
                if (!isExternal || isFont) {
                  cache.put(event.request, responseToCache);
                }
              });

            return response;
          })
          .catch(() => {
            // En cas d'erreur réseau, retourner une page hors ligne pour les pages HTML
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }
          });
      })
  );
});

// Gestion des messages du client
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Notification de mise à jour disponible
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});
