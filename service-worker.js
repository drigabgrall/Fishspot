// GitHub Pages-friendly relative paths
const CACHE='fishspots-v1';
const APP_ASSETS=['./','./index.html','./styles.css','./app.js','./autoheight.js','./manifest.webmanifest'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(APP_ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))))});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(APP_ASSETS.some(p=>url.pathname.endsWith(p.replace('./','/')))){
    e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request)));return;
  }
  if(url.hostname.endsWith('tile.openstreetmap.org')){
    e.respondWith((async()=>{const cache=await caches.open('tiles');const cached=await cache.match(e.request);
      const network=fetch(e.request).then(resp=>{cache.put(e.request,resp.clone());return resp;});
      return cached||network;})());return;
  }
  e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));
});