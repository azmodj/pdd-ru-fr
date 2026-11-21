// Hors ligne d'abord : tout est servi depuis le cache du téléphone, sans attendre le réseau.
// Si Internet est disponible, les fichiers de l'appli sont rafraîchis en arrière-plan (nouvelle version au prochain lancement).
const C='pdd-offline',OLD=/^pdd-v\d+$/,F=["./", "index.html", "q.json", "g.json", "manifest.json", "icon180.png", "icon192.png", "icon512.png", "cop/pouce.webp", "cop/saut.webp", "cop/stop.webp", "cop/accueil.webp", "shards/t1.json", "shards/t10.json", "shards/t11.json", "shards/t12.json", "shards/t13.json", "shards/t14.json", "shards/t15.json", "shards/t16.json", "shards/t17.json", "shards/t18.json", "shards/t19.json", "shards/t2.json", "shards/t20.json", "shards/t21.json", "shards/t22.json", "shards/t23.json", "shards/t24.json", "shards/t25.json", "shards/t26.json", "shards/t27.json", "shards/t28.json", "shards/t29.json", "shards/t3.json", "shards/t30.json", "shards/t31.json", "shards/t32.json", "shards/t33.json", "shards/t34.json", "shards/t35.json", "shards/t36.json", "shards/t37.json", "shards/t38.json", "shards/t39.json", "shards/t4.json", "shards/t40.json", "shards/t5.json", "shards/t6.json", "shards/t7.json", "shards/t8.json", "shards/t9.json"];
const SHELL=/\/(index\.html)?$|\/(q|g|manifest)\.json$/;
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil((async()=>{
  const c=await caches.open(C);
  // récupérer d'abord ce qui existe déjà dans les anciens caches (pas besoin d'Internet)
  for(const k of await caches.keys())if(OLD.test(k)){const o=await caches.open(k);for(const r of await o.keys())if(!await c.match(r))await c.put(r,await o.match(r))}
  // compléter ce qui manque, si Internet est disponible
  await Promise.all(F.map(u=>c.match(u).then(h=>h||fetch(u,{cache:'reload'}).then(r=>{if(r.ok)return c.put(u,r)}).catch(()=>{}))));
})())});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>OLD.test(x)).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;
  const nav=e.request.mode==='navigate';
  const key=nav?'./':e.request;
  const refresh=c=>fetch(e.request,{cache:'no-cache'}).then(n=>{if(n.ok)return c.put(key,n.clone()).then(()=>n);return n});
  e.respondWith(caches.open(C).then(async c=>{
    const hit=await c.match(key,{ignoreSearch:true})||(nav?await c.match('index.html'):undefined);
    if(hit){if(nav||SHELL.test(u.pathname))e.waitUntil(refresh(c).catch(()=>{}));return hit}
    return refresh(c);
  }));
});
