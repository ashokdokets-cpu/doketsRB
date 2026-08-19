// ResumeAI Pro - Service Worker
var CACHE_NAME = 'resumeai-v2';
var ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/js/utils.js',
  '/js/cloud.js',
  '/js/auth.js',
  '/js/views.js',
  '/js/builder.js',
  '/js/mobile.js',
  '/manifest.json'
];

// Install - cache all core assets
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(function() {
      return self.skipWaiting();
    })
  );
});

// Activate - clean old caches
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE_NAME; })
            .map(function(key) { return caches.delete(key); })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch - network first, fallback to cache
self.addEventListener('fetch', function(e) {
  // Skip caching for POST requests and chrome-extension URLs
  if (e.request.method !== 'GET' || e.request.url.includes('chrome-extension://')) {
    return;
  }
  // Skip API calls and Supabase
  if (e.request.url.includes('/api/') || e.request.url.includes('supabase')) {
    return;
  }
  e.respondWith(
    fetch(e.request).then(function(response) {
      var clone = response.clone();
      caches.open(CACHE_NAME).then(function(cache) {
        cache.put(e.request, clone);
      });
      return response;
    }).catch(function() {
      return caches.match(e.request).then(function(cached) {
        return cached || new Response('You are offline. Please check your connection.', { status: 503 });
      });
    })
  );
});

// Push notification
self.addEventListener('push', function(e) {
  var data = e.data ? e.data.json() : { title: 'ResumeAI Pro', body: 'Your resume is ready!' };
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/favicon.svg',
      badge: '/favicon.svg',
      vibrate: [200, 100, 200],
      data: { url: data.url || '/' }
    })
  );
});

// Notification click
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window' }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        if (clientList[i].url === '/' && 'focus' in clientList[i]) {
          return clientList[i].focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(e.notification.data.url || '/');
      }
    })
  );
});