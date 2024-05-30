//asignar un nombre y versión al cache
const CACHE_NAME = 'cacheResonancia',
base = '../../',
    urlsToCache = [
        base + '.',
        base + 'views/index.html',
        base + 'assets/css/style.css',
        base + 'assets/img/logo192.png'
    ]
//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache)
                    .then(() => self.skipWaiting())
            })
            .catch(err => console.log('Falló registro de cache', err))
    )
})

self.addEventListener('activate', async (e) => {
    const cacheWhitelist = [CACHE_NAME];
    const cacheKeys = await caches.keys();
    await Promise.all(
      cacheKeys.map(cacheKey => {
        if (!cacheWhitelist.includes(cacheKey)) {
          return caches.delete(cacheKey);
        }
      })
    );
    self.clients.claim();
  });



  self.addEventListener('fetch', e => {
    e.respondWith(
      caches.match(e.request)
        .then(response => {
          return response || fetch(e.request);
        })
        .catch(err => {
          console.log('Error en el fetch:', err);
          return new Response('No se pudo cargar la página.', {
            status: 404,
            statusText: 'Not Found',
            headers: new Headers({
              'Content-Type': 'text/plain'
            })
          });
        })
    );
  });
    