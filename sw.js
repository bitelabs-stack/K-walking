/* Walk Korea service worker: offline support and app installability.
   - Pages, styles, scripts: network first (fresh whenever online), cached copy when offline.
   - Images: cached copy first, refreshed in the background.
   - Google Fonts: cache first. */
const CACHE = 'walk-korea-v1';
const CORE = [
  './',
  './index.html',
  './css/styles.css',
  './js/i18n.js',
  './js/data.js',
  './js/main.js',
  './manifest.webmanifest',
  './assets/icons/favicon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/img/camino-sunrise-720.webp',
  './assets/img/camino-meseta-960.webp',
  './assets/img/korea-coast-960.webp'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('walk-korea-') && key !== CACHE).map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request));
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (request.destination === 'image') {
    event.respondWith(staleWhileRevalidate(request, event));
    return;
  }
  event.respondWith(networkFirst(request));
});

/* Pages are cached without their query string, so ?lang=ko also works offline. */
function pageKey(request) {
  const url = new URL(request.url);
  return url.origin + url.pathname;
}

async function networkFirst(request) {
  const cache = await caches.open(CACHE);
  const isPage = request.mode === 'navigate';
  try {
    // no-cache revalidates with the server, so edits show up on the next load
    let response = await fetch(isPage ? request.url : request, { cache: 'no-cache' });
    if (response.redirected) {
      response = new Response(response.body, { status: response.status, statusText: response.statusText, headers: response.headers });
    }
    if (response.ok && response.type === 'basic') {
      await cache.put(isPage ? pageKey(request) : request, response.clone());
    }
    return response;
  } catch (error) {
    const cached = isPage
      ? (await cache.match(pageKey(request))) || (await cache.match('./')) || (await cache.match('./index.html'))
      : await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    throw error;
  }
}

async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const refresh = fetch(request)
    .then((response) => {
      if (response && response.ok) cache.put(request, response.clone());
      return response;
    })
    .catch(() => null);
  if (cached) {
    event.waitUntil(refresh);
    return cached;
  }
  return (await refresh) || Response.error();
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone());
    return response;
  } catch (error) {
    return Response.error();
  }
}
