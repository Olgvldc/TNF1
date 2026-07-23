// Minimal service worker — just enough to satisfy browsers' "installable PWA" requirement
// and give a basic offline fallback for the app shell.
//
// Strategy: NETWORK-FIRST for our own files. While developing/updating the app, this is
// important — a cache-first strategy would keep serving an old cached index.html forever,
// even after uploading a new version, until the cache name changes. Network-first always
// tries to fetch the freshest copy first, and only falls back to the cached copy if the
// device is offline.
//
// IMPORTANT: bump CACHE_NAME (e.g. 'guagua-v2', 'guagua-v3'...) whenever you want to force
// every visitor's old cache to be discarded — otherwise it just keeps refreshing itself
// naturally via the network-first strategy below.
const CACHE_NAME = 'guagua-v3';
const APP_SHELL = [
  './index.html',
  './stops-data.js',
  './patterns-data.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const isOwnFile = url.origin === self.location.origin;
  if(!isOwnFile) return; // let API/tile/geocoding requests go straight to the network, always

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Got a fresh copy from the network — use it, and update the cache for next time
        // we're offline.
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request)) // offline: fall back to whatever we have cached
  );
});
