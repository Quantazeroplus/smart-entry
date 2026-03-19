const CACHE_NAME = "gecwc-entry-v1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./images/logo-192.png",
  "./images/logo-512.png"
];

// Install the Service Worker and Cache Assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Clean up old caches when the app updates
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Network First, Fallback to Cache (Ensures they always get the newest version)
self.addEventListener("fetch", (event) => {
  // Only cache GET requests (Ignore the POST requests sent to Google Sheets)
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});