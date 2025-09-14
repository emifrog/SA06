const CACHE_NAME = 'sa06-cache-v2';
const OFFLINE_URL = '/offline.html';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/css/mobile-menu.css',
  '/css/pwa.css',
  '/css/asa-contact.css',
  '/css/france-map.css',
  '/js/asa.js',
  '/js/mobile-menu.js',
  '/js/pwa.js',
  '/js/scroll-to-top.js',
  '/images/logo.svg',
  '/images/asa/Logo-ASA06.png',
  '/images/asa/favicon.png',
  '/images/actu/finances-scaled.jpg',
  '/images/actu/Sapeurs-pompiers.jpg',
  '/manifest.json',
  OFFLINE_URL
];

// Installation du Service Worker et mise en cache des ressources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Mise en cache des ressources statiques');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activation du nouveau Service Worker et nettoyage des anciens caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Supprimer les anciens caches
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => self.clients.claim())
  );
});

// Gestion des requêtes réseau
self.addEventListener('fetch', event => {
  // Ignorer les requêtes qui ne sont pas de type GET
  if (event.request.method !== 'GET') return;
  
  // Pour les requêtes de navigation (pages HTML), utiliser la stratégie "Network first, then cache"
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Mettre à jour le cache avec la nouvelle réponse
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then(cache => cache.put(event.request, responseToCache));
          return response;
        })
        .catch(() => {
          // En cas d'échec, essayer de récupérer depuis le cache
          return caches.match(event.request)
            .then(response => response || caches.match(OFFLINE_URL));
        })
    );
  } else {
    // Pour les autres ressources (CSS, JS, images), utiliser la stratégie "Cache first, then network"
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Retourner la réponse du cache si elle existe
          if (response) {
            return response;
          }
          
          // Sinon, faire une requête réseau
          return fetch(event.request)
            .then(response => {
              // Vérifier si nous avons reçu une réponse valide
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              // Mettre en cache la réponse pour les requêtes ultérieures
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            })
            .catch(() => {
              // Pour les images, retourner une image de remplacement si disponible
              if (event.request.headers.get('accept').includes('image')) {
                return caches.match('/images/asa/Logo-ASA06.png');
              }
              return new Response('Ressource non disponible hors ligne', {
                status: 404,
                statusText: 'Non trouvé',
                headers: new Headers({
                  'Content-Type': 'text/plain'
                })
              });
            });
        })
    );
  }
});

// Gestion des messages (pour la mise à jour des données en arrière-plan)
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
