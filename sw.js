/* Service worker do Ciclo de Estudos: abre sem internet e pega a versão nova sozinho.
   - Página (navegação): rede primeiro; sem rede, a última cópia salva.
   - Arquivos do app, fontes e SDK do Firebase: cópia salva na hora, atualizada em segundo plano.
   - Firestore e login do Google nunca passam por aqui. */
const CACHE = 'ciclo-v1';
const CORE = ['./', 'index.html', 'manifest.json', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/apple-touch-icon.png'];
const CDN = ['https://fonts.googleapis.com/', 'https://fonts.gstatic.com/', 'https://www.gstatic.com/firebasejs/'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const own = url.origin === self.location.origin;
  if (!own && !CDN.some(p => req.url.startsWith(p))) return;

  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put('index.html', copy));
      return r;
    }).catch(() => caches.match('index.html')));
    return;
  }

  e.respondWith(caches.open(CACHE).then(c => c.match(req).then(hit => {
    const net = fetch(req).then(r => {
      if (r.ok || r.type === 'opaque') c.put(req, r.clone());
      return r;
    }).catch(() => hit);
    return hit || net;
  })));
});
