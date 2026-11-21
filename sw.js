const C='pdd-v3',F=["./", "index.html", "q.json", "g.json", "manifest.json", "icon180.png", "icon192.png", "icon512.png", "shards/t1.json", "shards/t10.json", "shards/t11.json", "shards/t12.json", "shards/t13.json", "shards/t14.json", "shards/t15.json", "shards/t16.json", "shards/t17.json", "shards/t18.json", "shards/t19.json", "shards/t2.json", "shards/t20.json", "shards/t21.json", "shards/t22.json", "shards/t23.json", "shards/t24.json", "shards/t25.json", "shards/t26.json", "shards/t27.json", "shards/t28.json", "shards/t29.json", "shards/t3.json", "shards/t30.json", "shards/t31.json", "shards/t32.json", "shards/t33.json", "shards/t34.json", "shards/t35.json", "shards/t36.json", "shards/t37.json", "shards/t38.json", "shards/t39.json", "shards/t4.json", "shards/t40.json", "shards/t5.json", "shards/t6.json", "shards/t7.json", "shards/t8.json", "shards/t9.json"];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(C).then(c=>Promise.all(F.map(u=>c.match(u).then(h=>h||fetch(u,{cache:'reload'}).then(r=>{if(r.ok)return c.put(u,r)}).catch(()=>{}))))))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin!==location.origin)return;
const fresh=e.request.mode==='navigate'||/\/(index\.html)?$/.test(u.pathname)||/\.(json|js)$/.test(u.pathname)&&!/shards\//.test(u.pathname);
e.respondWith(caches.open(C).then(c=>{
  const cached=()=>c.match(e.request,{ignoreSearch:true}).then(r=>r||(e.request.mode==='navigate'?c.match('./'):undefined));
  if(fresh)return fetch(e.request,{cache:'no-cache'}).then(n=>{if(n.ok)c.put(e.request,n.clone());return n}).catch(()=>cached().then(r=>r||Response.error()));
  return cached().then(r=>r||fetch(e.request).then(n=>{if(n.ok)c.put(e.request,n.clone());return n}));
}))});
