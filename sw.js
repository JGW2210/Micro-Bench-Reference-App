/*
 * Service worker for the Microbiology Bench Reference app.
 *
 * Goal: survive flaky lab Wi-Fi. The app is a static site, so we use an
 * app-shell strategy:
 *   - On install, precache the core same-origin shell.
 *   - Same-origin shell requests are served cache-first with a network
 *     fallback, tolerant of the manual "?v=" cache-bust query (we match
 *     with ignoreSearch so a version bump never causes a hard miss while
 *     offline — the precache is refreshed on the next install/update).
 *   - Cross-origin CDN font/icon assets (Google Fonts + Tabler webfont) are
 *     runtime-cached cache-first so the UI icons and fonts survive offline
 *     after the first online load.
 *
 * Bump SHELL_VERSION on every deploy that changes any shell asset (i.e.
 * whenever you bump the "?v=" cache-bust in index.html). Because shell fetches
 * are cache-first with ignoreSearch, returning installs only pick up new
 * assets when the SW itself changes — bumping SHELL_VERSION changes this file,
 * triggering the update + a fresh precache, and the activate handler deletes
 * any cache no longer in the allowlist.
 */

const SHELL_VERSION = 'v3';
const SHELL_CACHE = `mbr-shell-${SHELL_VERSION}`;
const RUNTIME_CACHE = `mbr-runtime-${SHELL_VERSION}`;
const CACHE_ALLOWLIST = [SHELL_CACHE, RUNTIME_CACHE];

// Core same-origin shell. Listed without "?v=" query strings on purpose:
// requests are matched with { ignoreSearch: true } so the versioned URLs the
// page actually requests still resolve to these cached entries.
const SHELL_ASSETS = [
  './',
  'index.html',
  'styles.css',
  'data.js',
  'app.js',
  'manifest.webmanifest',
  'icon.svg'
];

// Cross-origin hosts whose responses we runtime-cache (fonts + icon webfont).
const RUNTIME_HOSTS = [
  'fonts.googleapis.com',
  'fonts.gstatic.com',
  'cdn.jsdelivr.net'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => {
      // addAll is atomic-ish but a single 404 would reject it; add one by one
      // and tolerate individual failures so install still succeeds.
      return Promise.all(
        SHELL_ASSETS.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
        )
      );
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !CACHE_ALLOWLIST.includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;

  // Only handle GET; let the browser deal with everything else.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Same-origin: app-shell cache-first, ignoring the "?v=" query so a
  // version-bumped asset still hits the precached copy when offline.
  if (url.origin === self.location.origin) {
    event.respondWith(handleShell(request));
    return;
  }

  // Cross-origin CDN fonts/icons: cache-first runtime cache.
  if (RUNTIME_HOSTS.includes(url.hostname)) {
    event.respondWith(handleRuntime(request));
    return;
  }

  // Anything else: just go to the network (no respondWith = default behaviour).
});

function handleShell(request) {
  const matchOpts = { ignoreSearch: true };
  return caches.match(request, matchOpts).then((cached) => {
    if (cached) return cached;
    return fetch(request)
      .then((response) => {
        // Cache successful, basic (same-origin) responses for next time.
        if (response && response.ok && response.type === 'basic') {
          const copy = response.clone();
          caches.open(SHELL_CACHE).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => {
        // Offline and not precached: fall back to the app shell for
        // navigations so deep links still render.
        if (request.mode === 'navigate') {
          return caches.match('index.html', matchOpts);
        }
        return Response.error();
      });
  });
}

function handleRuntime(request) {
  return caches.open(RUNTIME_CACHE).then((cache) =>
    cache.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        // Cache opaque (cross-origin, no-CORS) and OK responses alike so the
        // font/icon files are available offline.
        if (response && (response.ok || response.type === 'opaque')) {
          cache.put(request, response.clone());
        }
        return response;
      }).catch(() => cached || Response.error());
    })
  );
}
