/* FishSpots PWA (GitHub Pages friendly) */
const LS_KEY='fishspots_v1';let map,markers=new Map(),data=load()||seed(),editingId=null;initMap();renderAll();initUI();registerSW();
function initMap(){map=L.map('map',{zoomControl:true}).setView([48.72,-3.56],11);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; OpenStreetMap'}).addTo(map);
  let t;function addSpotAt(l){const s=newSpot(l.lat,l.lng);data.push(s);save();renderSpot(s,true);openPanel(s.id);}map.on('contextmenu',e=>addSpotAt(e.latlng));map.on('mousedown',e=>{t=setTimeout(()=>addSpotAt(e.latlng),600)});map.on('mouseup',()=>clearTimeout(t));map.on('move',()=>clearTimeout(t));}
function renderAll(){markers.forEach(m=>map.removeLayer(m));markers.clear();const {tides,lures}=getFilters();data.forEach(s=>{if(!matchFilters(s,tides,lures))return;renderSpot(s,false);});}
function renderSpot(s,pan){const m=L.marker([s.lat,s.lon],{draggable:true}).addTo(map);m.bindTooltip(`${s.name}`);m.on('click',()=>openPanel(s.id));m.on('dragend',e=>{const p=e.target.getLatLng();s.lat=p.lat;s.lon=p.lng;save();});markers.set(s.id,m);if(pan)map.panTo([s.lat,s.lon]);}
function openPanel(id){editingId=id;const s=data.find(x=>x.id===id);if(!s)return;document.getElementById('panel').classList.remove('hidden');document.getElementById('panel-title').textContent=`Spot (${s.lat.toFixed(5)}, ${s.lon.toFixed(5)})`;document.getElementById('spot-name').value=s.name;setMulti('spot-tides',s.tides);setMulti('spot-lures',s.lures);document.getElementById('spot-notes').value=s.notes||'';}
function closePanel(){document.getElementById('panel').classList.add('hidden');editingId=null;}
function initUI(){document.querySelectorAll('.tide').forEach(cb=>cb.addEventListener('change',renderAll));document.querySelectorAll('.lure').forEach(cb=>cb.addEventListener('change',renderAll));
  document.getElementById('btn-save').onclick=()=>{if(!editingId)return;const s=data.find(x=>x.id===editingId);if(!s)return;s.name=document.getElementById('spot-name').value.trim()||s.name;s.tides=getMulti('spot-tides');s.lures=getMulti('spot-lures');s.notes=document.getElementById('spot-notes').value;save();renderAll();closePanel();};
  document.getElementById('btn-delete').onclick=()=>{if(!editingId)return;const i=data.findIndex(x=>x.id===editingId);if(i>=0){const m=markers.get(data[i].id);if(m)map.removeLayer(m);data.splice(i,1);save();renderAll();closePanel();}};
  document.getElementById('btn-close').onclick=closePanel;
  document.getElementById('btn-export').onclick=()=>downloadJSON(JSON.stringify(data,null,2),'spots.json');
  document.getElementById('file-import').onchange=async e=>{const f=e.target.files[0];if(!f)return;const j=await f.text();try{data=JSON.parse(j);save();renderAll();}catch(err){alert('JSON invalide');}};
  document.getElementById('btn-center').onclick=()=>navigator.geolocation?.getCurrentPosition(p=>map.setView([p.coords.latitude,p.coords.longitude],14),()=>alert('Impossible d\'obtenir la position'));
  let d;window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();d=e;document.getElementById('btn-install').hidden=false;});document.getElementById('btn-install').onclick=()=>d?.prompt();}
function getFilters(){const tides=[...document.querySelectorAll('.tide:checked')].map(x=>x.value);const lures=[...document.querySelectorAll('.lure:checked')].map(x=>x.value);return {tides,lures};}
function matchFilters(s,tides,lures){const tideOk=!tides.length||s.tides.some(t=>tides.includes(t));const lureOk=!lures.length||s.lures.some(l=>lures.includes(l));return tideOk&&lureOk;}
function newSpot(lat,lon){return {id:crypto.randomUUID(),name:'Nouveau spot',lat,lon,tides:['Montante'],lures:['Surface'],notes:''};}
function load(){try{return JSON.parse(localStorage.getItem(LS_KEY));}catch{return null;}}
function save(){localStorage.setItem(LS_KEY,JSON.stringify(data));}
function seed(){return [{id:'dourven',name:'Pointe du Dourven',lat:48.73139,lon:-3.56444,tides:['Montante'],lures:['Souple'],notes:'Souples pleine mer/montante'},{id:'plage_dourven',name:'Plage du Dourven',lat:48.72861,lon:-3.56389,tides:['Descendante'],lures:['Surface'],notes:'Surface sur la bordure'},{id:'ste_marguerite',name:'Plage Ste-Marguerite',lat:48.68917,lon:-3.57972,tides:['Montante'],lures:['Surface','Souple'],notes:'Clapot léger'},{id:'st_michel',name:'Plage de St Michel (ruisseau)',lat:48.67806,lon:-3.57639,tides:['Descendante'],lures:['Surface'],notes:'Embouchure à BM'}];}
function setMulti(id,arr){const sel=document.getElementById(id);[...sel.options].forEach(o=>o.selected=arr.includes(o.text));}
function getMulti(id){const sel=document.getElementById(id);return [...sel.selectedOptions].map(o=>o.value);}
function downloadJSON(t,fn){const b=new Blob([t],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=fn;a.click();URL.revokeObjectURL(a.href);}
function registerSW(){if('serviceWorker'in navigator){navigator.serviceWorker.register('./service-worker.js',{scope:'./'});}}
