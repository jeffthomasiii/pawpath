(()=>{
  const BASE=document.querySelector('meta[name="pawpath-base"]')?.content||'./';
  const key='pawpath.activeCarePlan.v1';
  const now=()=>new Date().toISOString();
  const id=()=>crypto?.randomUUID?.()||`care-plan-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const emptyPlan=()=>({schemaVersion:1,id:id(),createdAt:now(),updatedAt:now(),trip:{name:'',destination:'',startDate:'',endDate:''},traveler:{petName:'',ownerPhone:'',importantNote:''},facilities:{primary:null,backup:null,routine:null}});
  function normalize(raw){
    if(!raw||typeof raw!=='object')return null;
    if(raw.schemaVersion===1&&raw.trip&&raw.traveler&&raw.facilities)return raw;
    const p=emptyPlan();
    p.id=raw.id||p.id;p.createdAt=raw.createdAt||p.createdAt;p.updatedAt=raw.updatedAt||p.updatedAt;
    p.trip={name:raw.tripName||raw.name||'',destination:raw.tripDestination||raw.destination||'',startDate:raw.tripStartDate||raw.startDate||'',endDate:raw.tripEndDate||raw.endDate||''};
    p.traveler={petName:raw.petName||'',ownerPhone:raw.ownerPhone||'',importantNote:raw.importantNote||raw.petNote||''};
    p.facilities={primary:raw.primaryFacility||raw.primary||null,backup:raw.backupFacility||raw.backup||null,routine:null};
    return p;
  }
  function readPlan(){try{return normalize(JSON.parse(localStorage.getItem(key)||'null'))}catch{return null}}
  function writePlan(plan){const normalized=normalize(plan)||emptyPlan();normalized.schemaVersion=1;normalized.updatedAt=now();if(!normalized.createdAt)normalized.createdAt=normalized.updatedAt;localStorage.setItem(key,JSON.stringify(normalized));return normalized}
  function updatePlan(mutator){const p=readPlan()||emptyPlan();mutator(p);return writePlan(p)}
  function clearPlan(){localStorage.removeItem(key)}
  window.PawPathPwa={base:BASE,key,readPlan,writePlan,updatePlan,clearPlan,emptyPlan};
  if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register(`${BASE}sw.js`).catch(()=>{}));
  document.querySelectorAll('[data-saved-summary]').forEach(el=>{const p=readPlan();if(!p||!p.trip.name||!p.trip.destination){el.innerHTML='<h3>No saved plan yet</h3><p>Choose a destination, then save Primary and Backup care options before you leave.</p>';return}const ready=p.facilities.primary&&p.facilities.backup;el.innerHTML=`<p class="pp-kicker">Your next adventure</p><h2>${escapeHtml(p.trip.name)}</h2><p>${escapeHtml(p.trip.destination)}</p><p class="pp-note">${ready?'Primary and Backup selected.':'Care selections still needed.'}</p><a class="pp-button primary" href="${BASE}saved/">Open saved plan →</a>`;});
  function escapeHtml(s){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));}
})();