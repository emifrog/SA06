/**
 * ⚠️ VERSION CENTRALISÉE - Modifiez uniquement cette valeur pour forcer le rafraîchissement du cache
 * Incrémentez la version après chaque modification (ex: 1.0.0 → 1.0.1)
 */
const APP_VERSION = '1.0.1';

const CACHE_NAME = 'sa06-v' + APP_VERSION;
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
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activation du service worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
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
