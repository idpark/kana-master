const CACHE_NAME="kana-v1";
const STATIC_ASSETS=[
  "./index.html",
  "./manifest.json",
  "./data/kana.js",
  "./data/mnemonic-svg.js",
  "./modules/state.js",
  "./modules/tts.js",
  "./modules/quiz.js",
  "./modules/cards.js",
  "./modules/gamification.js",
  "./modules/ai.js",
  "./modules/ui.js",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(STATIC_ASSETS)));
  self.skipWaiting();
});

self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch",e=>{
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));
});
