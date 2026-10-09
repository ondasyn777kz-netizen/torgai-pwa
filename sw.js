/* Cache only this application's offline screen and install assets.
   Map tiles, GPS data and remote models are not cached. */
const PREFIX = 'torgai-pwa-' + new URL(self.registration.scope).pathname + '-';
const CACHE = PREFIX + '815ecf3f9a39';
const assetPaths = ['offline.html', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
const assets = assetPaths.map(path => new URL(path, self.registration.scope).href);
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(assets)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(async () => (await caches.match(new URL('offline.html', self.registration.scope).href)) || new Response('TorgAI: Интернет байланысын тексеріңіз.', {status:503, headers:{'Content-Type':'text/plain; charset=utf-8'}})));
  } else if (assets.includes(url.href)) {
    event.respondWith(caches.match(request).then(cached => cached || fetch(request)));
  }
});
