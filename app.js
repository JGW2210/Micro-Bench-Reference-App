/* app.js — extracted from Micro_Bench_Reference_v23_bact.html
   Application LOGIC: rendering, interpreters, search, view switching, init.
   Depends on the datasets defined in data.js, so MUST load after data.js. */

const istate={d68:[],d69:[],d63:[],d73:[]};
let curITab='d68', curView='flow';

function initDiscs(id){
  const cfg=dconfigs[id];
  istate[id]=cfg.discs.map(()=>null);
  const row=document.getElementById('discs-'+id);
  row.innerHTML='';
  cfg.discs.forEach((d,i)=>{
    const el=document.createElement('div');
    el.className='disc';
    el.innerHTML=`<span class="disc-letter">Disc ${d.l}</span><div class="disc-circle" id="dc-${id}-${i}" onclick="toggleDisc('${id}',${i})">?</div><span class="disc-label">${d.label}</span>`;
    row.appendChild(el);
  });
  buildITable(id);
}

function toggleDisc(id,i){
  const cur=istate[id][i];
  istate[id][i]=cur===null?'S':cur==='S'?'R':'S';
  const el=document.getElementById('dc-'+id+'-'+i);
  el.className='disc-circle '+(istate[id][i]==='S'?'s':'r');
  el.textContent=istate[id][i];
  interpretDiscs(id);
}

function resetDiscs(id){
  istate[id]=dconfigs[id].discs.map(()=>null);
  dconfigs[id].discs.forEach((_,i)=>{
    const el=document.getElementById('dc-'+id+'-'+i);
    el.className='disc-circle';el.textContent='?';
  });
  const rb=document.getElementById('res-'+id);
  rb.className='result-box';
  rb.innerHTML='<span style="color:var(--color-text-tertiary);font-size:12px">Set all disc results to see interpretation.</span>';
  buildITable(id);renderDsetPlate(id);
}

function interpretDiscs(id){
  const vals=istate[id];
  if(vals.some(v=>v===null)){
    const rb=document.getElementById('res-'+id);
    rb.className='result-box';
    rb.innerHTML='<span style="color:var(--color-text-tertiary);font-size:12px">Set all disc results to see interpretation.</span>';
    buildITable(id);renderDsetPlate(id);return;
  }
  let match=null;
  for(const p of dconfigs[id].patterns){if(p.v.every((v,i)=>v===vals[i])){match=p;break;}}
  const rb=document.getElementById('res-'+id);
  if(match){
    // 'match' collides with the search-highlight utility class; use 'ident' for styling
    const tcls = match.type==='match' ? 'ident' : match.type;
    rb.className='result-box '+tcls;
    rb.innerHTML=`<div class="result-title ${tcls}">${match.title}</div><div class="result-body">${match.body}</div>`;
  } else {
    rb.className='result-box warn';
    rb.innerHTML=`<div class="result-title warn">Atypical pattern</div><div class="result-body">This combination does not match a standard pattern. Verify disc placement and zone readings. Consider repeat testing, mixed culture, or molecular confirmation.</div>`;
  }
  buildITable(id);renderDsetPlate(id);
}

function buildITable(id){
  const vals=istate[id];
  const allSet=vals.every(v=>v!==null);
  const tbody=document.getElementById('itbody-'+id);
  tbody.innerHTML='';
  const seen=new Set();
  dconfigs[id].patterns.forEach(p=>{
    const key=p.v.join(',');
    if(seen.has(key))return;seen.add(key);
    const isActive=allSet&&p.v.every((v,i)=>v===vals[i]);
    const tr=document.createElement('tr');
    if(isActive)tr.className='active-row';
    let cells=p.v.map(v=>`<td><span class="disc-badge ${v.toLowerCase()}">${v}</span></td>`).join('');
    tr.innerHTML=cells+`<td>${p.title}${isActive?' <span style="font-size:10px;color:var(--color-text-info)">← current</span>':''}</td>`;
    tbody.appendChild(tr);
  });
}

function setITab(id){
  curITab=id;
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.ipanel').forEach(p=>p.classList.remove('active'));
  document.getElementById('itab-'+id).classList.add('active');
  const panel=document.getElementById('ipanel-'+id);
  panel.classList.add('active','pop-in');
  panel.addEventListener('animationend',()=>panel.classList.remove('pop-in'),{once:true});
}

// ─── D73 mm zone-diameter calculator (replaces legacy S/R toggle for D73) ─────
const d73mmState = {A:null, B:null, C:null, D:null, E:null};
let d73mmLastKey = null;   // last matched pattern key — drives porin-loss depiction in the plate preview
function initD73mm(){
  const grid = document.getElementById('d73mm-inputs');
  if(!grid) return;
  grid.innerHTML = '';
  d73mmDiscs.forEach(d=>{
    const wrap = document.createElement('div');
    wrap.className = 'zone-input';
    wrap.innerHTML = `<span class="disc-letter">Disc ${d.l}</span>`+
      `<div class="zone-input-wrap"><input type="number" min="0" max="60" step="1" id="d73mm-${d.l}" placeholder="—" inputmode="numeric" aria-label="Zone ${d.l} diameter in millimetres" oninput="updateD73mm('${d.l}', this.value)"><span class="zone-unit">mm</span></div>`+
      `<span class="disc-label">${d.label}</span>`;
    grid.appendChild(wrap);
  });
  buildD73mmTable();
}

function updateD73mm(letter, val){
  const trimmed = String(val).trim();
  const n = trimmed === '' ? null : parseFloat(trimmed);
  d73mmState[letter] = (n === null || isNaN(n)) ? null : n;
  interpretD73mm();
}

function resetD73mm(){
  Object.keys(d73mmState).forEach(k=>{
    d73mmState[k] = null;
    const el = document.getElementById('d73mm-'+k);
    if(el) el.value = '';
  });
  const rb = document.getElementById('res-d73mm');
  rb.className = 'result-box';
  rb.innerHTML = '<span style="color:var(--color-text-tertiary);font-size:12px">Enter all five zone diameters (mm) to see interpretation.</span>';
  d73mmLastKey = null;
  buildD73mmTable();
  renderDsetPlate('d73');
}

function interpretD73mm(){
  const {A,B,C,D,E} = d73mmState;
  const rb = document.getElementById('res-d73mm');

  if([A,B,C,D,E].some(v=>v===null)){
    rb.className = 'result-box';
    rb.innerHTML = '<span style="color:var(--color-text-tertiary);font-size:12px">Enter all five zone diameters (mm) to see interpretation.</span>';
    d73mmLastKey = null;
    buildD73mmTable();
    renderDsetPlate('d73');
    return;
  }

  const dBA = B - A;  // MβL inhibitor synergy
  const dCA = C - A;  // KPC inhibitor synergy
  const dDA = D - A;  // AmpC inhibitor synergy
  const rangeABCD = Math.max(A,B,C,D) - Math.min(A,B,C,D);  // strict negative criterion

  const fmt = n => (n>=0?'+':'') + n.toFixed(0);
  const calcLine = `<div class="calc-readout">ΔB−A = <strong>${fmt(dBA)} mm</strong> · ΔC−A = <strong>${fmt(dCA)} mm</strong> · ΔD−A = <strong>${fmt(dDA)} mm</strong> · range(A–D) = <strong>${rangeABCD.toFixed(0)} mm</strong> · E = <strong>${E.toFixed(0)} mm</strong></div>`;

  let result, matchKey;

  // MBL: ΔB−A ≥ 5 AND |ΔC−A| < 5 AND |ΔD−A| < 5
  if(dBA >= 5 && Math.abs(dCA) < 5 && Math.abs(dDA) < 5){
    matchKey = 'mbl';
    result = {type:'danger', title:'MBL producer (NDM / VIM / IMP)',
      body:'B−A ≥ 5 mm — MβL inhibitor restores the penem zone. C−A and D−A both &lt; 5 mm — no KPC or AmpC contribution. MBL confirmed. Ceftazidime/avibactam NOT active — do not report. Reflex UR4 (Cefiderocol). Notify infection control immediately.'};
  }
  // KPC: ΔC−A ≥ 5 AND |ΔB−A| < 5 AND |ΔD−A| < 5
  else if(dCA >= 5 && Math.abs(dBA) < 5 && Math.abs(dDA) < 5){
    matchKey = 'kpc';
    result = {type:'danger', title:'KPC producer',
      body:'C−A ≥ 5 mm — KPC inhibitor restores the penem zone. B−A and D−A both &lt; 5 mm — no MβL or AmpC contribution. KPC confirmed. Ceftazidime/avibactam IS active — report from UR2 if susceptible. Notify infection control.'};
  }
  // AmpC + porin loss: ΔC−A ≥ 5 AND ΔD−A ≥ 5 AND |ΔB−A| < 4
  else if(dCA >= 5 && dDA >= 5 && Math.abs(dBA) < 4){
    matchKey = 'ampc';
    result = {type:'warn', title:'AmpC + porin loss',
      body:'C−A ≥ 5 mm and D−A ≥ 5 mm — synergy with both KPC and AmpC inhibitors (cloxacillin restoring activity points to AmpC). B−A &lt; 4 mm — no MβL contribution. Suggests high-level AmpC + porin loss without a true carbapenemase. Ceftazidime/avibactam may still be active. Confirm with molecular testing.'};
  }
  // OXA-48-like: |ΔB−A| < 5 AND |ΔC−A| < 5 AND |ΔD−A| < 5 AND E ≤ 10
  else if(Math.abs(dBA) < 5 && Math.abs(dCA) < 5 && Math.abs(dDA) < 5 && E <= 10){
    matchKey = 'oxa';
    result = {type:'danger', title:'OXA-48-like carbapenemase suspected',
      body:'No inhibitor synergy on B, C or D (all &lt; 5 mm vs A) AND temocillin E ≤ 10 mm — classic OXA-48 pattern (temocillin resistance without any carbapenemase-inhibitor synergy). Ceftazidime/avibactam IS active against OXA-48. Confirm with PCR / MALDI-TOF. Notify infection control.'};
  }
  // Negative: Z_A, Z_B, Z_C and Z_D all differ by ≤ 2 mm AND Z_E > 10 mm
  else if(rangeABCD <= 2 && E > 10){
    matchKey = 'neg';
    result = {type:'success', title:'Negative — no carbapenemase detected',
      body:`A, B, C and D all within 2 mm of each other (range = ${rangeABCD.toFixed(0)} mm) and temocillin E &gt; 10 mm. No MβL, KPC, OXA-48 or significant AmpC contribution detected. Report carbapenem per EUCAST breakpoints.`};
  }
  // Atypical fallback
  else {
    matchKey = 'atyp';
    result = {type:'warn', title:'Atypical pattern — manual review',
      body:'This combination of zone differences does not match a standard MAST D73 pattern. Possible co-production (e.g. MβL + KPC), mixed culture, mis-set discs, swarming, or zone-edge artefact. Verify disc placement, re-measure zones, and consider repeat plate or molecular confirmation.'};
  }

  rb.className = 'result-box ' + result.type;
  rb.innerHTML = `<div class="result-title ${result.type}">${result.title}</div><div class="result-body">${result.body}</div>${calcLine}`;
  d73mmLastKey = matchKey;
  buildD73mmTable(matchKey);
  renderDsetPlate('d73');
}

function buildD73mmTable(activeKey){
  const tbody = document.getElementById('itbody-d73mm');
  if(!tbody) return;
  const diffRules = [
    {k:'mbl',  ba:'≥ 5',  ca:'&lt; 5', da:'&lt; 5', e:'—',      name:'MBL (NDM / VIM / IMP)'},
    {k:'kpc',  ba:'&lt; 5', ca:'≥ 5',  da:'&lt; 5', e:'—',      name:'KPC'},
    {k:'oxa',  ba:'&lt; 5', ca:'&lt; 5', da:'&lt; 5', e:'≤ 10', name:'OXA-48-like'},
    {k:'ampc', ba:'&lt; 4', ca:'≥ 5',  da:'≥ 5',   e:'—',      name:'AmpC + porin loss'}
  ];
  const rows = diffRules.map(r=>{
    const active = r.k === activeKey;
    const tag = active ? ' <span style="font-size:10px;color:var(--color-text-info)">← current</span>' : '';
    return `<tr${active?' class="active-row"':''}><td>${r.ba}</td><td>${r.ca}</td><td>${r.da}</td><td>${r.e}</td><td>${r.name}${tag}</td></tr>`;
  });
  // Negative is range-based (A, B, C, D all within ≤ 2 mm of each other), not difference-from-A based —
  // render across the three diff columns to make the distinction visually obvious.
  const negActive = activeKey === 'neg';
  const negTag = negActive ? ' <span style="font-size:10px;color:var(--color-text-info)">← current</span>' : '';
  rows.push(`<tr${negActive?' class="active-row"':''}><td colspan="3" style="text-align:center;font-style:italic;color:var(--color-text-secondary)">A, B, C, D all within ≤ 2 mm of each other</td><td>&gt; 10</td><td>Negative — no carbapenemase${negTag}</td></tr>`);
  tbody.innerHTML = rows.join('');
}

// ═══════════════════════════════════════════════
// D-SET PLATE PREVIEW — estimated MHA appearance, MAST hexagonal carrier
// Jumps off the plate-appearance SVG system (deterministic procedural film).
// Zones are drawn to scale: entered diameters for D73, standard S/R zones for
// the S/R sets. Porin loss is rendered as a graduated clearing with small
// breakthrough colonies that peter out toward the penem disc.
// ═══════════════════════════════════════════════
const DSET_MHA = {
  rim:'#D7CEB0', rimStroke:'#A89A72',
  agarStops:[['0%','#E8E2CD'],['60%','#DBD2B7'],['100%','#C4B996']],
  lawn:'#CDC5A6', lawnSpeck:'#B6AC88', clear:'#ECE6D2',
  disc:'#FCFBF4', discStroke:'#C9C1A6', discInk:'#56503B',
  colony:'#C6BD9B'
};
const DSET_STD = {S:27, R:7};   // standard zone diameters (mm) for S/R sets
const DSET_MM2SVG = 4;          // 180 svg units ≈ 45 mm radius
// DSET_RING: discs sit 1/3 of the way from the agar edge (r=180) toward the centre → 180 × 2/3 = 120
const DSET_C = 200, DSET_RING = 120, DSET_DISCR = 13;

// Printed disc-face codes (mimicking the real MAST discs), keyed by set + disc letter.
// Sets without an entry fall back to the single A/B/C… position letter.
const DSET_DISC_FACE = {
  d63: { A:['CPM','30'], B:['CPM','CV'] }   // Cefepime 30µg · Cefepime + clavulanate
};
function dsetDiscFaceSvg(id, p){
  const ff = `font-family="'JetBrains Mono',ui-monospace,monospace" font-weight="700" fill="${DSET_MHA.discInk}"`;
  const face = DSET_DISC_FACE[id] && DSET_DISC_FACE[id][p.l];
  if(face){
    return `<text x="${p.x.toFixed(1)}" y="${(p.y-1).toFixed(1)}" text-anchor="middle" ${ff} font-size="6.4" letter-spacing="0.2">${face[0]}</text>`+
           `<text x="${p.x.toFixed(1)}" y="${(p.y+6.1).toFixed(1)}" text-anchor="middle" ${ff} font-size="6.4" letter-spacing="0.2">${face[1]}</text>`;
  }
  return `<text x="${p.x.toFixed(1)}" y="${(p.y+3.6).toFixed(1)}" text-anchor="middle" ${ff} font-size="12">${p.l}</text>`;
}

// Returns [{l,label,zoneMm,porin}] for the given set, reading live state.
function dsetZonesFor(id){
  const cfg = dconfigs[id];
  if(id==='d73'){
    const porinKey = (typeof d73mmLastKey!=='undefined') ? d73mmLastKey : null;
    return d73mmDiscs.map(d=>{
      const v = d73mmState[d.l];
      const zoneMm = (v===null||isNaN(v)) ? 0 : Math.max(0, Math.min(60, v));
      const porin = porinKey==='ampc' && (d.l==='A'||d.l==='B') && zoneMm>0;
      return {l:d.l, label:d.label, zoneMm, porin};
    });
  }
  const vals = istate[id] || [];
  return cfg.discs.map((d,i)=>{
    const s = vals[i];
    const zoneMm = s==='S' ? DSET_STD.S : s==='R' ? DSET_STD.R : 0;
    return {l:d.l, label:d.label, zoneMm, porin:false};
  });
}

// Slot → disc mapping per set, re-orderable by drag (default identity order).
const dsetSlots = {};
function getSlots(id, n){
  if(!Array.isArray(dsetSlots[id]) || dsetSlots[id].length!==n){
    dsetSlots[id] = Array.from({length:n}, (_,i)=>i);
  }
  return dsetSlots[id];
}

// ---- drag-and-drop: swap two discs' positions on the depiction ----
let dsetDragState = null;
function dsetClientToSvg(svg, cx, cy){
  const m = svg.getScreenCTM(); if(!m) return null;
  const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy;
  const p = pt.matrixTransform(m.inverse());
  return {x:p.x, y:p.y};
}
function attachDsetDrag(id){
  const wrap = document.getElementById('dset-plate-'+id);
  const svg = wrap && wrap.querySelector('svg');
  if(!svg) return;
  svg.querySelectorAll('.dset-disc').forEach(g=>{
    g.addEventListener('pointerdown', e=>dsetDragStart(e, id, svg, g));
  });
}
function dsetNearestSlot(){
  const s = dsetDragState; if(!s || !s.cur) return null;
  let best=null, bestD=Infinity;
  s.rings.forEach(r=>{
    const dx=r.x-s.cur.x, dy=r.y-s.cur.y, d=dx*dx+dy*dy;
    if(d<bestD){bestD=d; best=r;}
  });
  return best;
}
function dsetDragStart(e, id, svg, group){
  e.preventDefault();
  const start = dsetClientToSvg(svg, e.clientX, e.clientY); if(!start) return;
  const rings = Array.from(svg.querySelectorAll('.dset-slot-ring')).map(r=>({
    slot:parseInt(r.dataset.slot,10), x:parseFloat(r.getAttribute('cx')), y:parseFloat(r.getAttribute('cy')), el:r
  }));
  dsetDragState = {id, svg, group, fromSlot:parseInt(group.dataset.slot,10), start, cur:start, rings, moved:false};
  group.classList.add('dragging');
  window.addEventListener('pointermove', dsetDragMove);
  window.addEventListener('pointerup', dsetDragEnd);
  window.addEventListener('pointercancel', dsetDragEnd);
}
function dsetDragMove(e){
  const s = dsetDragState; if(!s) return;
  e.preventDefault();
  const p = dsetClientToSvg(s.svg, e.clientX, e.clientY); if(!p) return;
  s.cur = p;
  const dx = p.x-s.start.x, dy = p.y-s.start.y;
  if(dx*dx+dy*dy > 9) s.moved = true;
  s.group.setAttribute('transform', `translate(${dx.toFixed(1)},${dy.toFixed(1)})`);
  const near = s.moved ? dsetNearestSlot() : null;
  s.rings.forEach(r=>{
    const lit = near && r.slot===near.slot && r.slot!==s.fromSlot;
    r.el.setAttribute('stroke', lit ? '#38e8d0' : 'transparent');
  });
}
function dsetDragEnd(){
  const s = dsetDragState; if(!s) return;
  window.removeEventListener('pointermove', dsetDragMove);
  window.removeEventListener('pointerup', dsetDragEnd);
  window.removeEventListener('pointercancel', dsetDragEnd);
  const near = s.moved ? dsetNearestSlot() : null;   // resolve target before clearing state
  dsetDragState = null;
  if(near && near.slot!==s.fromSlot){
    const m = getSlots(s.id, s.rings.length);
    const t = m[s.fromSlot]; m[s.fromSlot] = m[near.slot]; m[near.slot] = t;
  }
  renderDsetPlate(s.id);   // re-render: clears transforms, re-attaches handlers
}

function renderDsetPlate(id){
  const wrap = document.getElementById('dset-plate-'+id);
  if(!wrap || typeof dconfigs==='undefined' || !dconfigs[id]) return;
  const discs = dsetZonesFor(id);
  const n = discs.length;
  const C = DSET_C;
  const rng = mulberry32(hashStr('dset-'+id));
  const anyPorin = discs.some(d=>d.porin);

  // slot angles — D73 sits on five of six hexagon vertices: A bottom-left → E
  // bottom-right, running clockwise, with the bottom vertex (90°) left empty.
  // Other sets keep their evenly-spaced rosette. Positions belong to slots; the
  // disc occupying each slot is re-orderable by drag.
  const hexAngles = [150, 210, 270, 330, 30];   // [A,B,C,D,E] default slot angles
  const angleFor = (slot) => (id==='d73' && n===5) ? hexAngles[slot] : (-90 + slot*(360/n));
  const map = getSlots(id, n);                  // map[slot] = disc index
  const pos = map.map((discIdx, slot)=>{
    const ang = angleFor(slot) * Math.PI/180;
    return Object.assign({x:C + DSET_RING*Math.cos(ang), y:C + DSET_RING*Math.sin(ang), slot}, discs[discIdx]);
  });

  // ---- defs: agar, gloss, shared clean + porin zone gradients ----
  let defs = `<radialGradient id="dsetAgar-${id}" cx="38%" cy="32%" r="75%">${DSET_MHA.agarStops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}</radialGradient>`+
    `<radialGradient id="dsetGloss-${id}" cx="30%" cy="22%" r="60%"><stop offset="0%" stop-color="rgba(255,255,255,0.2)"/><stop offset="60%" stop-color="rgba(255,255,255,0)"/></radialGradient>`+
    `<radialGradient id="dsetZclean-${id}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${DSET_MHA.clear}" stop-opacity="1"/><stop offset="80%" stop-color="${DSET_MHA.clear}" stop-opacity="1"/><stop offset="92%" stop-color="${DSET_MHA.clear}" stop-opacity="0.82"/><stop offset="100%" stop-color="${DSET_MHA.clear}" stop-opacity="0"/></radialGradient>`;
  if(anyPorin){
    defs += `<radialGradient id="dsetZporin-${id}" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="${DSET_MHA.clear}" stop-opacity="1"/><stop offset="40%" stop-color="${DSET_MHA.clear}" stop-opacity="0.88"/><stop offset="72%" stop-color="${DSET_MHA.clear}" stop-opacity="0.32"/><stop offset="100%" stop-color="${DSET_MHA.clear}" stop-opacity="0"/></radialGradient>`;
  }

  let body = '';
  body += `<circle cx="${C}" cy="${C}" r="194" fill="${DSET_MHA.rim}" stroke="${DSET_MHA.rimStroke}" stroke-width="2"/>`;
  body += `<circle cx="${C}" cy="${C}" r="180" fill="url(#dsetAgar-${id})"/>`;

  // confluent lawn + fine speckle, clipped to the agar
  body += `<clipPath id="dsetClip-${id}"><circle cx="${C}" cy="${C}" r="178"/></clipPath>`;
  body += `<g clip-path="url(#dsetClip-${id})">`;
  body += `<circle cx="${C}" cy="${C}" r="178" fill="${DSET_MHA.lawn}" opacity="0.92"/>`;
  for(let k=0;k<260;k++){
    const rr=Math.sqrt(rng())*176, th=rng()*Math.PI*2;
    const sx=(C+rr*Math.cos(th)).toFixed(1), sy=(C+rr*Math.sin(th)).toFixed(1);
    body+=`<circle cx="${sx}" cy="${sy}" r="${(0.6+rng()*1.1).toFixed(1)}" fill="${DSET_MHA.lawnSpeck}" opacity="${(0.1+rng()*0.16).toFixed(2)}"/>`;
  }
  // inhibition zones (paint over the lawn)
  pos.forEach(p=>{
    if(p.zoneMm<=0) return;
    const zr = p.zoneMm*DSET_MM2SVG/2;
    const grad = p.porin ? `dsetZporin-${id}` : `dsetZclean-${id}`;
    body += `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${zr.toFixed(1)}" fill="url(#${grad})"/>`;
  });
  // porin breakthrough colonies — density increases away from the disc
  pos.forEach(p=>{
    if(!p.porin || p.zoneMm<=0) return;
    const zr = p.zoneMm*DSET_MM2SVG/2;
    const crng = mulberry32(hashStr('dset-col-'+id+'-'+p.l));
    const tries = Math.round(zr*2.6);
    for(let k=0;k<tries;k++){
      const t = crng();                              // 0 = at disc, 1 = zone edge
      if(crng() > Math.pow(t,0.7)) continue;         // peter out toward the disc
      const rad = (DSET_DISCR+2) + t*(zr-DSET_DISCR-2);
      if(rad<=DSET_DISCR) continue;
      const th = crng()*Math.PI*2;
      const cx=(p.x+rad*Math.cos(th)).toFixed(1), cy=p.y+rad*Math.sin(th);
      const cr=(1.3+crng()*1.6).toFixed(1);
      body += `<circle cx="${cx}" cy="${(cy+0.5).toFixed(1)}" r="${cr}" fill="rgba(0,0,0,0.12)"/>`;
      body += `<circle cx="${cx}" cy="${cy.toFixed(1)}" r="${cr}" fill="${DSET_MHA.colony}"/>`;
    }
  });
  body += `</g>`;

  // slot highlight rings (under discs; lit teal when a drag targets the slot)
  pos.forEach(p=>{
    body += `<circle class="dset-slot-ring" data-slot="${p.slot}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${DSET_DISCR+7}" fill="none" stroke="transparent" stroke-width="2.5"/>`;
  });
  // discs — draggable groups: shadow, body, printed face code (or position letter)
  pos.forEach(p=>{
    body += `<g class="dset-disc" data-slot="${p.slot}">`+
      `<circle cx="${p.x.toFixed(1)}" cy="${(p.y+0.9).toFixed(1)}" r="${DSET_DISCR}" fill="rgba(0,0,0,0.18)"/>`+
      `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="${DSET_DISCR}" fill="${DSET_MHA.disc}" stroke="${DSET_MHA.discStroke}" stroke-width="1"/>`+
      dsetDiscFaceSvg(id, p)+
      `</g>`;
  });

  body += `<circle cx="${C}" cy="${C}" r="180" fill="url(#dsetGloss-${id})" pointer-events="none"/>`;
  body += `<g font-family="'JetBrains Mono',ui-monospace,monospace" font-size="10" fill="rgba(70,64,46,0.72)" text-anchor="middle"><text x="${C}" y="388">Mueller\u2013Hinton agar</text></g>`;

  wrap.innerHTML = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Estimated MHA plate appearance — ${id.toUpperCase()}"><defs>${defs}</defs>${body}</svg>`;
  attachDsetDrag(id);

  const cap = document.getElementById('dset-plate-cap-'+id);
  if(cap){
    const entered = discs.filter(d=>d.zoneMm>0).length;
    let txt;
    if(id==='d73'){
      txt = entered ? `Zones drawn to entered diameters (1 mm \u2248 ${DSET_MM2SVG}px). Schematic estimate \u2014 not to clinical scale.`
                    : 'Enter zone diameters above to preview the plate. Schematic estimate \u2014 not to clinical scale.';
      if(anyPorin) txt = 'Porin-loss pattern \u2014 graduated growth with breakthrough colonies petering out toward the penem discs. ' + txt;
    } else {
      txt = entered ? 'Standard susceptible / resistant zones shown per disc result. Schematic estimate \u2014 not to clinical scale.'
                    : 'Set the disc results above to preview the plate. Schematic estimate \u2014 not to clinical scale.';
    }
    cap.innerHTML = `<span class="dset-hint">\u21C4 Drag a disc to swap its position \u2014 rearranges the depiction only, not the result.</span>${txt}`;
  }
}

['d68','d69','d63'].forEach(initDiscs);
initD73mm();
setITab('d68');
['d68','d69','d63','d73'].forEach(renderDsetPlate);

// ═══════════════════════════════════════════════
// MYCOLOGY MODULE — dermatophyte disease + microscopy cards
// ═══════════════════════════════════════════════
function mycoSvg(kind){
  const c='currentColor';
  const defs='<defs><linearGradient id="mycoBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="currentColor" stop-opacity=".10"/><stop offset="1" stop-color="currentColor" stop-opacity=".03"/></linearGradient></defs>';
  const base=(inner)=>`<svg viewBox="0 0 240 170" role="img" aria-label="schematic microscopy drawing" style="color:var(--color-text-info)">${defs}<rect x="8" y="8" width="224" height="154" rx="16" fill="url(#mycoBg)" stroke="currentColor" opacity=".9"/><g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${inner}</g></svg>`;
  if(kind==='spindle')return base('<path d="M30 84c42-30 91-30 140 2" opacity=".35"/><ellipse cx="82" cy="82" rx="45" ry="13" stroke-width="3"/><path d="M45 82h74M57 72v20M72 70v24M88 70v24M104 73v18" stroke-width="1.7"/><ellipse cx="158" cy="104" rx="38" ry="11" stroke-width="2.6" transform="rotate(-18 158 104)"/><path d="M126 104h64M143 95v18M158 94v20M174 98v14" stroke-width="1.5"/>');
  if(kind==='fusiform')return base('<ellipse cx="88" cy="72" rx="42" ry="12" stroke-width="3"/><path d="M54 72h68M69 62v20M85 60v24M102 63v18" stroke-width="1.6"/><ellipse cx="150" cy="105" rx="44" ry="13" stroke-width="3"/><path d="M114 105h72M132 94v22M150 93v24M168 97v16" stroke-width="1.6"/><path d="M34 124c35-18 76-22 145-4" opacity=".35"/>');
  if(kind==='microconidia')return base('<path d="M30 96c38-34 86-32 150-4" stroke-width="3" opacity=".5"/><g fill="currentColor" stroke="none" opacity=".72"><ellipse cx="52" cy="82" rx="6" ry="4"/><ellipse cx="75" cy="74" rx="6" ry="4"/><ellipse cx="101" cy="72" rx="6" ry="4"/><ellipse cx="128" cy="77" rx="6" ry="4"/><ellipse cx="158" cy="88" rx="6" ry="4"/></g><path d="M64 122c34-12 66-8 98 11" stroke-width="2" opacity=".35"/>');
  if(kind==='clusters')return base('<path d="M28 96c44-38 98-40 182-8" stroke-width="3" opacity=".45"/><g fill="currentColor" stroke="none" opacity=".74"><circle cx="75" cy="76" r="5"/><circle cx="85" cy="72" r="5"/><circle cx="81" cy="84" r="5"/><circle cx="120" cy="69" r="5"/><circle cx="130" cy="73" r="5"/><circle cx="123" cy="82" r="5"/><circle cx="162" cy="88" r="5"/><circle cx="171" cy="94" r="5"/></g>');
  if(kind==='rightangle')return base('<path d="M28 108c43-42 96-48 176-15" stroke-width="3" opacity=".45"/><g stroke-width="2"><path d="M70 79l-16-21M95 70l-3-27M124 72l14-25M154 82l24-18"/><ellipse cx="51" cy="55" rx="8" ry="5" fill="currentColor" stroke="none" opacity=".65"/><ellipse cx="92" cy="39" rx="7" ry="5" fill="currentColor" stroke="none" opacity=".65"/><ellipse cx="141" cy="43" rx="7" ry="5" fill="currentColor" stroke="none" opacity=".65"/><ellipse cx="182" cy="62" rx="8" ry="5" fill="currentColor" stroke="none" opacity=".65"/></g>');
  if(kind==='chains')return base('<path d="M35 108c54-36 102-26 164-8" stroke-width="3" opacity=".35"/><g fill="currentColor" stroke="none" opacity=".68"><circle cx="72" cy="70" r="8"/><circle cx="88" cy="73" r="8"/><circle cx="104" cy="77" r="8"/><circle cx="120" cy="80" r="8"/><circle cx="136" cy="82" r="8"/></g><path d="M70 70c24 2 43 9 69 12" stroke-width="1.4"/>');
  if(kind==='chandelier')return base('<path d="M118 42v86M88 68h60M92 68c0 24 10 38 26 44M144 68c0 23-10 37-26 44M78 93h80" stroke-width="4"/><path d="M58 126c42-24 86-22 128 0" opacity=".35"/>');
  if(kind==='club')return base('<g fill="currentColor" stroke="currentColor" opacity=".72"><path d="M64 70c22-22 54 0 38 25-13 20-49 14-50-12-.1-5 4-10 12-13Z"/><path d="M122 78c24-20 55 5 35 28-16 19-50 7-48-17 .4-5 5-9 13-11Z"/><path d="M89 111c24-18 53 9 31 30-17 16-49 4-46-19 .6-5 6-9 15-11Z"/></g><path d="M40 52c40-20 105-18 160 4" opacity=".25"/>');
  return base('<path d="M38 100c44-34 99-42 164-8" stroke-width="3" opacity=".45"/><ellipse cx="95" cy="80" rx="34" ry="10" stroke-width="2.6"/><ellipse cx="150" cy="105" rx="30" ry="9" stroke-width="2.4"/>');
}

function renderMycology(){
  const q=(document.getElementById('myco-search')?.value||'').trim().toLowerCase();
  const site=document.getElementById('myco-site-filter')?.value||'';
  const genus=document.getElementById('myco-genus-filter')?.value||'';
  const diseaseGrid=document.getElementById('myco-disease-grid');
  const fungusGrid=document.getElementById('myco-fungus-grid');
  if(!diseaseGrid||!fungusGrid)return;
  const diseaseMatches=mycoDiseases.filter(d=>{
    const fungi=d.fungi.map(k=>mycoFungi[k]).filter(Boolean);
    const hay=(d.name+' '+d.site+' '+d.signs+' '+d.source+' '+fungi.map(f=>f.name+' '+f.genus+' '+f.reservoir+' '+f.micro+' '+f.macro+' '+f.clues.join(' ')).join(' ')).toLowerCase();
    return (!site||d.site===site) && (!genus||fungi.some(f=>f.genus===genus)) && (!q||hay.includes(q));
  });
  diseaseGrid.innerHTML=diseaseMatches.length?diseaseMatches.map(d=>{
    const fungi=d.fungi.map(k=>mycoFungi[k]).filter(Boolean).filter(f=>!genus||f.genus===genus);
    return `<div class="myco-card card ${d.colour}" onclick="document.getElementById('myco-search').value='${d.name.replace(/'/g,'')}';renderMycology();"><h3><i class="ti ti-target-arrow" aria-hidden="true"></i>${d.name}</h3><p>${d.signs}</p><p><strong>Source:</strong> ${d.source}</p><div class="myco-tag-row">${fungi.map(f=>`<span class="myco-tag" onclick="event.stopPropagation();showMycoFungus('${Object.keys(mycoFungi).find(k=>mycoFungi[k]===f)}')">${f.name}</span>`).join('')}</div></div>`;
  }).join(''):'<div class="myco-empty">No dermatophytosis cards match those filters.</div>';
  const usedKeys=new Set(diseaseMatches.flatMap(d=>d.fungi));
  let fungi=Object.entries(mycoFungi).filter(([k,f])=>(!genus||f.genus===genus) && (!q||(f.name+' '+f.genus+' '+f.reservoir+' '+f.macro+' '+f.micro+' '+f.clues.join(' ')).toLowerCase().includes(q) || usedKeys.has(k)));
  fungusGrid.innerHTML=fungi.length?fungi.map(([k,f])=>`<div class="myco-card" onclick="showMycoFungus('${k}')"><h3><i class="ti ti-microscope" aria-hidden="true"></i><em>${f.name}</em></h3><p>${f.reservoir}</p><p>${f.micro}</p><div class="myco-tag-row">${f.clues.map(c=>`<span class="myco-tag">${c}</span>`).join('')}</div></div>`).join(''):'<div class="myco-empty">No fungi match those filters.</div>';
}

function mycoImgError(img, shape){
  const wrap = img.closest('.myco-micro-svg');
  if(wrap){ wrap.classList.add('is-schematic'); wrap.innerHTML = mycoSvg(shape) + '<div class="myco-img-cap">Schematic cue \u2014 photograph not found</div>'; }
}

function setMycoTab(tab){
  const tabs = ['derm','flow','afst'];
  if(tabs.indexOf(tab) === -1) tab = 'derm';
  tabs.forEach(t=>{
    const pane = document.getElementById('myco-pane-'+t);
    const btn  = document.getElementById('myco-tab-'+t);
    const on = (t === tab);
    if(pane) pane.classList.toggle('is-hidden', !on);
    if(btn){ btn.classList.toggle('active', on); btn.setAttribute('aria-selected', on ? 'true' : 'false'); }
  });
}

function showMycoFungus(key){
  const f=mycoFungi[key]; if(!f)return;
  setMycoTab('derm');
  const panel=document.getElementById('myco-fungus-panel'); if(!panel)return;
  const visual = f.img
    ? `<img class="myco-micro-photo" src="${f.img}" alt="${f.name} — colony / microscopy" loading="lazy" onerror="mycoImgError(this,'${f.shape}')"><div class="myco-img-cap">Reference image</div>`
    : `${mycoSvg(f.shape)}<div class="myco-img-cap">Schematic cue — open Mycology Online for photographs</div>`;
  panel.innerHTML=`<div class="myco-panel-head"><div><h3>${f.name}</h3><div class="myco-panel-sub">${f.genus} dermatophyte · ${f.reservoir}</div></div><a class="myco-source-link" href="${f.source}" target="_blank" rel="noopener"><i class="ti ti-external-link" aria-hidden="true"></i> Mycology Online (Adelaide)</a></div><div class="myco-panel-grid"><div class="myco-micro-svg${f.img?'':' is-schematic'}">${visual}</div><div class="myco-facts"><div class="myco-fact"><div class="myco-fact-title">Macroscopic culture</div><p>${f.macro}</p></div><div class="myco-fact"><div class="myco-fact-title">Microscopy pointers</div><p>${f.micro}</p></div><div class="myco-fact"><div class="myco-fact-title">Bench clues</div><ul>${f.clues.map(c=>`<li>${c}</li>`).join('')}</ul></div><div class="myco-fact"><div class="myco-fact-title">Relevant presentations</div><p>${mycoDiseases.filter(d=>d.fungi.includes(key)).map(d=>d.name).join(' · ')||'Dermatophyte infection depending on exposure and site.'}</p></div></div></div>`;
  panel.style.display='block';
  panel.style.animation='none';panel.offsetHeight;panel.style.animation='slideUp .28s cubic-bezier(.4,0,.2,1) forwards';
  panel.scrollIntoView({behavior:'smooth',block:'nearest'});
}


// ═══════════════════════════════════════════════
// EXPECTED RESISTANT PHENOTYPES / INTRINSIC RESISTANCE LOOKUP
// (EUCAST Expected Resistant Phenotypes v1.2 + Expert Rules v3.3)
// ═══════════════════════════════════════════════
const rulesGroupLabels = {gnr:'Enterobacterales', nf:'Non-fermenter', gpc:'Gram-positive', anaerobe:'Anaerobe'};

function renderRules(){
  const q=(document.getElementById('rules-search')?.value||'').trim().toLowerCase();
  const grp=document.getElementById('rules-group-filter')?.value||'';
  const grid=document.getElementById('rules-grid');
  if(!grid)return;
  const matches=expectedPhenotypes.filter(o=>{
    const hay=(o.name+' '+(o.aka||'')+' '+(rulesGroupLabels[o.group]||'')+' '+o.resist.join(' ')+' '+o.rules.join(' ')).toLowerCase();
    return (!grp||o.group===grp) && (!q||hay.includes(q));
  });
  grid.innerHTML = matches.length ? matches.map(o=>{
    const preview=o.resist.slice(0,3).join(' · ')+(o.resist.length>3?' …':'');
    return `<div class="rules-card" onclick="showRulesOrg('${o.id}')"><div class="rules-card-head"><h3>${o.name}</h3><span class="rules-grp-tag">${rulesGroupLabels[o.group]||o.group}</span></div>${o.aka?`<div class="rules-aka">${o.aka}</div>`:''}<div class="rules-card-resist"><span class="rules-resist-label">Do not report S:</span> ${preview}</div></div>`;
  }).join('') : '<div class="myco-empty">No organisms match those filters.</div>';
}

function showRulesOrg(id){
  const o=expectedPhenotypes.find(x=>x.id===id); if(!o)return;
  const panel=document.getElementById('rules-detail'); if(!panel)return;
  panel.innerHTML = `<button class="detail-close" onclick="hideRulesOrg()" aria-label="Close" title="Close (Esc)">×</button>`+
    `<div class="rules-detail-head"><h3>${o.name}</h3><span class="rules-grp-tag">${rulesGroupLabels[o.group]||o.group}</span></div>`+
    (o.aka?`<div class="rules-aka">${o.aka}</div>`:'')+
    `<div class="rules-detail-title"><i class="ti ti-ban" aria-hidden="true"></i> Expected resistant — never report susceptible</div>`+
    `<div class="rules-resist-grid">${o.resist.map(r=>`<span class="rules-resist-pill">${r}</span>`).join('')}</div>`+
    `<div class="rules-detail-title"><i class="ti ti-list-check" aria-hidden="true"></i> Expert / interpretive rules</div>`+
    `<ul class="rules-list">${o.rules.map(r=>`<li>${r}</li>`).join('')}</ul>`;
  panel.style.display='block';
  panel.style.animation='none';panel.offsetHeight;panel.style.animation='slideUp .28s cubic-bezier(.4,0,.2,1) forwards';
  panel.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function hideRulesOrg(){ const p=document.getElementById('rules-detail'); if(p)p.style.display='none'; }

// ═══════════════════════════════════════════════
// BLOOD SCIENCE MODULE — discipline/tube/test finder
// ═══════════════════════════════════════════════
let selectedBloodTestIdx=null;

function bloodDetailHTML(t,d,b){
  return `<div class="blood-detail-head"><div><h3>${t.name} <span style="font-size:11px;color:var(--color-text-tertiary);font-weight:500">${t.abbr}</span></h3><div class="blood-detail-sub">${d.name||t.discipline} · <span class="blood-tube-dot" style="--tube-col:${b.colour||'#ddd'}"></span> ${b.name||t.tube}</div></div><button class="blood-reset" type="button" onclick="event.stopPropagation();hideBloodTestDetail()"><i class="ti ti-x" aria-hidden="true"></i> Close</button></div><div class="blood-detail-grid"><div class="blood-detail-box"><div class="blood-detail-title">How / why it is used</div><p>${t.use}</p></div><div class="blood-detail-box"><div class="blood-detail-title">What it broadly reflects</div><p>${t.why}</p></div><div class="blood-detail-box"><div class="blood-detail-title">Why this tube is used</div><p>${t.explain}</p><p style="margin-top:5px"><strong>Additive:</strong> ${b.additive||'Check local handbook.'}</p></div><div class="blood-detail-box"><div class="blood-detail-title">Bench notes</div><ul>${(t.notes||[]).map(n=>`<li>${n}</li>`).join('')}</ul></div></div>`;
}

function hideBloodTestDetail(){
  selectedBloodTestIdx=null;
  const panel=document.getElementById('blood-detail');
  const view=document.getElementById('view-blood');
  if(panel){panel.style.display='none';panel.innerHTML='';panel.classList.add('blood-detail-placeholder');}
  if(view&&panel&&!view.contains(panel)) view.appendChild(panel);
  document.querySelectorAll('#view-blood .blood-test-card.selected').forEach(c=>c.classList.remove('selected'));
}

function renderBloodGuides(){
  const dWrap=document.getElementById('blood-discipline-guide');
  if(dWrap){
    dWrap.innerHTML=Object.entries(bloodDisciplines).map(([k,d])=>`<div class="blood-guide-card"><h3><i class="ti ${d.icon}" aria-hidden="true"></i>${d.name}</h3><p>${d.desc}</p></div>`).join('');
  }
  const tWrap=document.getElementById('blood-tube-guide');
  if(tWrap){
    tWrap.innerHTML=Object.entries(bloodTubes).map(([k,t])=>`<div class="blood-guide-card"><h3><span class="blood-tube-dot" style="--tube-col:${t.colour}"></span>${t.name}</h3><p><strong>Additive:</strong> ${t.additive}</p><p>${t.why}</p></div>`).join('');
  }
  const dSel=document.getElementById('blood-discipline-filter');
  if(dSel&&dSel.options.length<=1){
    Object.entries(bloodDisciplines).forEach(([k,d])=>dSel.insertAdjacentHTML('beforeend',`<option value="${k}">${d.name}</option>`));
  }
  const tSel=document.getElementById('blood-tube-filter');
  if(tSel&&tSel.options.length<=1){
    Object.entries(bloodTubes).forEach(([k,t])=>tSel.insertAdjacentHTML('beforeend',`<option value="${k}">${t.name}</option>`));
  }
}

function renderBloodScience(){
  renderBloodGuides();
  const q=(document.getElementById('blood-text')?.value||'').trim().toLowerCase();
  const disc=document.getElementById('blood-discipline-filter')?.value||'';
  const tube=document.getElementById('blood-tube-filter')?.value||'';
  const res=document.getElementById('blood-results');
  const count=document.getElementById('blood-count');
  const panel=document.getElementById('blood-detail');
  if(!res)return;
  if(panel&&panel.parentNode===res) panel.remove();
  const matches=bloodTests.filter(t=>{
    const d=bloodDisciplines[t.discipline]||{};
    const b=bloodTubes[t.tube]||{};
    const hay=(t.name+' '+t.abbr+' '+(d.name||'')+' '+(b.name||'')+' '+(b.additive||'')+' '+t.why+' '+t.use+' '+t.explain+' '+(t.notes||[]).join(' ')).toLowerCase();
    return (!disc||t.discipline===disc) && (!tube||t.tube===tube) && (!q||hay.includes(q));
  });
  if(count)count.textContent=`${matches.length} test${matches.length===1?'':'s'} shown`;
  const visibleIdxs=matches.map(t=>bloodTests.indexOf(t));
  if(selectedBloodTestIdx!==null&&!visibleIdxs.includes(selectedBloodTestIdx)) selectedBloodTestIdx=null;
  res.innerHTML=matches.length?matches.map((t,i)=>{
    const d=bloodDisciplines[t.discipline]||{};
    const b=bloodTubes[t.tube]||{};
    const idx=bloodTests.indexOf(t);
    const selected=idx===selectedBloodTestIdx?' selected':'';
    return `<div class="blood-test-card card ${d.colour||''}${selected}" data-blood-idx="${idx}" onclick="showBloodTest(${idx})"><h3><i class="ti ${d.icon||'ti-test-pipe'}" aria-hidden="true"></i>${t.name}</h3><p>${t.use}</p><p><strong>Why:</strong> ${t.why}</p><div class="blood-tag-row"><span class="blood-tag">${d.name||t.discipline}</span><span class="blood-tag"><span class="blood-tube-dot" style="--tube-col:${b.colour||'#ddd'}"></span>${b.short||b.name||t.tube}</span><span class="blood-tag">${t.abbr}</span></div></div>`;
  }).join(''):'<div class="blood-empty">No blood tests match those filters.</div>';
  if(panel){
    const selectedCard=res.querySelector(`[data-blood-idx="${selectedBloodTestIdx}"]`);
    if(selectedCard&&panel.innerHTML.trim()){
      panel.classList.remove('blood-detail-placeholder');
      selectedCard.insertAdjacentElement('afterend',panel);
      panel.style.display='block';
    }else{
      panel.style.display='none';
      panel.classList.add('blood-detail-placeholder');
      res.insertAdjacentElement('afterend',panel);
    }
  }
}

function resetBloodScienceFilters(){
  const ids=['blood-text','blood-discipline-filter','blood-tube-filter'];
  ids.forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});
  hideBloodTestDetail();
  renderBloodScience();
}

function showBloodTest(idx){
  const t=bloodTests[idx]; if(!t)return;
  const d=bloodDisciplines[t.discipline]||{};
  const b=bloodTubes[t.tube]||{};
  const panel=document.getElementById('blood-detail'); if(!panel)return;
  selectedBloodTestIdx=idx;
  panel.innerHTML=bloodDetailHTML(t,d,b);
  renderBloodScience();
  const card=document.querySelector(`#blood-results [data-blood-idx="${idx}"]`);
  if(card) card.classList.add('selected');
  panel.style.animation='none';panel.offsetHeight;panel.style.animation='slideUp .28s cubic-bezier(.4,0,.2,1) forwards';
}


// ─── Top-nav grouped dropdown menus ─────────────────────────────────────
// Sensitivities / Classification / Disciplines each collapse several views
// into one pill that reads "Prefix: current section" while one of its views
// is active (mirroring the original single sensitivities menu). One config
// drives all three so they behave identically; they share the .sens-* visual
// classes. The value after the colon is the short label shown on the trigger.
const navMenus = [
  { id:'sens-menu',  triggerId:'sw-sens',  labelId:'sens-label',  prefix:'Sensitivities',
    views:{ flow:'Urine', wound:'Wound', interp:'D-sets', rules:'Intrinsic resistance', checker:'S/I/R checker' } },
  { id:'class-menu', triggerId:'sw-class', labelId:'class-label', prefix:'Classification',
    views:{ plate:'Colony & Gram', bactid:'Bacterial ID' } },
  { id:'disc-menu',  triggerId:'sw-disc',  labelId:'disc-label',  prefix:'Disciplines',
    views:{ virology:'Molecular', blood:'Blood Science', myco:'Mycology', serology:'Serology' } },
];
function navMenuById(id){ return navMenus.find(m => m.id === id); }
function navMenuOwning(view){ return navMenus.find(m => Object.prototype.hasOwnProperty.call(m.views, view)); }

function positionNavMenu(menuId){
  const menu=document.getElementById(menuId);
  if(!menu)return;
  const trigger=menu.querySelector('.sens-trigger');
  const list=document.getElementById(menuId+'-list');
  if(!trigger||!list)return;
  /* The list is position:fixed so it escapes the horizontally-scrollable pill
     row instead of being clipped by it. Because .top-nav uses backdrop-filter,
     a fixed descendant's containing block may be .top-nav rather than the
     viewport — so we don't assume. We park the list at (0,0), measure where that
     origin actually lands in the viewport, then anchor it just below its trigger
     and nudge left/right to stay on-screen. */
  const r=trigger.getBoundingClientRect();
  list.style.minWidth=Math.max(228,Math.ceil(r.width))+'px';
  list.style.left='0px';
  list.style.top='0px';
  const origin=list.getBoundingClientRect();      // viewport coords of the fixed (0,0) origin
  let left=r.left-origin.left;
  list.style.left=left+'px';
  list.style.top=(r.bottom-origin.top+6)+'px';
  requestAnimationFrame(()=>{
    const lr=list.getBoundingClientRect();
    const overflowRight=lr.right-(window.innerWidth-10);
    const overflowLeft=10-lr.left;
    if(overflowRight>0){left-=overflowRight;list.style.left=left+'px';}
    else if(overflowLeft>0){left+=overflowLeft;list.style.left=left+'px';}
  });
}
function closeAllNavMenus(except){
  navMenus.forEach(m=>{
    if(m.id===except)return;
    const menu=document.getElementById(m.id);
    if(menu)menu.classList.remove('open');
    const list=document.getElementById(m.id+'-list');
    if(list)list.classList.remove('is-open');
    const t=document.getElementById(m.triggerId);
    if(t)t.setAttribute('aria-expanded','false');
  });
}
function setNavMenuOpen(menuId,open){
  const menu=document.getElementById(menuId);
  const trigger=menu&&menu.querySelector('.sens-trigger');
  const list=document.getElementById(menuId+'-list');
  if(!menu||!trigger||!list)return;
  if(open)closeAllNavMenus(menuId);      // only one menu open at a time
  if(open)positionNavMenu(menuId);
  menu.classList.toggle('open',!!open);  // keeps the trigger chevron state
  list.classList.toggle('is-open',!!open);
  trigger.setAttribute('aria-expanded',open?'true':'false');
  if(open)requestAnimationFrame(()=>positionNavMenu(menuId));
}
// Move each dropdown out to <body> so the horizontally-scrollable pill row (and
// .top-nav's backdrop-filter) can never clip it. Positioned via positionNavMenu.
(function portalNavMenus(){
  navMenus.forEach(m=>{
    const list=document.getElementById(m.id+'-list');
    if(list && list.parentElement!==document.body) document.body.appendChild(list);
  });
})();
function toggleNavMenu(menuId,event){
  if(event){event.preventDefault();event.stopPropagation();}
  const menu=document.getElementById(menuId);
  setNavMenuOpen(menuId,!(menu&&menu.classList.contains('open')));
}
function anyNavMenuOpen(){
  return navMenus.some(m=>{const el=document.getElementById(m.id);return el&&el.classList.contains('open');});
}
function repositionOpenNavMenus(){
  navMenus.forEach(m=>{const el=document.getElementById(m.id);if(el&&el.classList.contains('open'))positionNavMenu(m.id);});
}
function selectNavView(view){
  closeAllNavMenus();
  switchView(view);
}
function updateNavMenus(view){
  navMenus.forEach(m=>{
    const trigger=document.getElementById(m.triggerId);
    const label=document.getElementById(m.labelId);
    const owns=Object.prototype.hasOwnProperty.call(m.views,view);
    if(trigger)trigger.classList.toggle('active',owns);
    // Only relabel the menu that owns the active view; others keep their last
    // shown section (or the bare category until first used), mirroring the
    // original sensitivities menu.
    if(label&&owns)label.textContent=m.prefix+': '+m.views[view];
  });
  document.querySelectorAll('.sens-menu-item').forEach(btn=>btn.classList.remove('active'));
  const activeItem=document.getElementById('sw-'+view);
  if(activeItem&&activeItem.classList.contains('sens-menu-item'))activeItem.classList.add('active');
}

// Backward-compatible aliases for the original sensitivities-only names.
function positionSensitivityMenu(){ repositionOpenNavMenus(); }
function setSensitivityMenuOpen(open){ if(open)setNavMenuOpen('sens-menu',true); else closeAllNavMenus(); }
function toggleSensitivityMenu(event){ toggleNavMenu('sens-menu',event); }
function selectSensitivityView(view){ selectNavView(view); }
function updateSensitivityNav(view){ updateNavMenus(view); }

function switchView(to,iTabId){
  if(to===curView&&!iTabId)return;
  const fromEl=document.getElementById('view-'+curView);
  const toEl=document.getElementById('view-'+to);
  // crude ordering for transition direction, matching the quick-nav numbering:
  // notes < sensitivities(flow,wound,interp) < abx < classification(plate,bactid) < disciplines(virology,blood,myco) < index
  const order={notes:-1,flow:0,wound:1,interp:2,rules:2.5,checker:2.7,abx:3,plate:4,bactid:5,virology:6,blood:7,myco:8,serology:8.5,index:9};
  const goingRight=order[to]>order[curView];
  fromEl.style.transition='opacity .3s cubic-bezier(.4,0,.2,1),transform .3s cubic-bezier(.4,0,.2,1)';
  fromEl.style.opacity='0';
  fromEl.style.transform=goingRight?'translateX(-36px)':'translateX(36px)';
  setTimeout(()=>{
    fromEl.classList.add('hidden');
    fromEl.style.transform='';fromEl.style.opacity='';fromEl.style.transition='';
    toEl.style.opacity='0';
    toEl.style.transform=goingRight?'translateX(36px)':'translateX(-36px)';
    toEl.classList.remove('hidden');
    toEl.offsetHeight;
    toEl.style.transition='opacity .32s cubic-bezier(.4,0,.2,1),transform .32s cubic-bezier(.4,0,.2,1)';
    toEl.style.opacity='1';toEl.style.transform='translateX(0)';
    setTimeout(()=>{toEl.style.transition='';toEl.style.transform='';toEl.style.opacity='';},340);
  },290);
  // 'notes' has no corresponding sw-X tab button — guard for missing elements.
  const swFrom=document.getElementById('sw-'+curView);
  const swTo=document.getElementById('sw-'+to);
  if(swFrom && !swFrom.classList.contains('sens-menu-item')) swFrom.classList.remove('active');
  if(swTo && !swTo.classList.contains('sens-menu-item')) swTo.classList.add('active');
  updateNavMenus(to);
  closeAllNavMenus();
  // The bench-notes button lives outside .wrap; mirror its active state from here.
  const benchBtn=document.getElementById('bench-notes-btn');
  if(benchBtn) benchBtn.classList.toggle('active', to==='notes');
  // Hide the shared detail panel when switching between flow views — context-specific
  const dfc=document.getElementById('detail-fc');
  if(dfc&&to!==curView)dfc.style.display='none';
  curView=to;
  if(iTabId)setTimeout(()=>setITab(iTabId),200);
  // When entering the index view, re-apply any pending glossary highlight.
  if(to==='index' && lastSearchQuery){
    setTimeout(()=>applyGlossarySearchHighlight(lastSearchQuery, {scroll:false}),320);
  }
  // When entering the abx view, ensure the bottom-pinned panel spacer is correctly sized
  if(to==='abx'){
    setTimeout(()=>{if(typeof syncAbxSpacer==='function')syncAbxSpacer();},320);
  }
  // Hide any stuck antibiotic tooltip when leaving the abx view
  if(curView!=='abx' && typeof hideFloatTip==='function'){
    document.querySelectorAll('.abx-chip.stuck').forEach(c => c.classList.remove('stuck'));
    hideFloatTip();
  }
}

// Shared org-flow renderer used by both urine and wound dropdowns.
function renderOrgFlowGeneric(opts){
  const val=document.getElementById(opts.selectId).value;
  if(!val)return;
  const flow=opts.flows[val];
  if(!flow)return;
  const el=document.getElementById(opts.targetId);
  const ncols=flow.cols.length;
  let html=`<div style="border-top:0.5px solid var(--color-border-tertiary);margin-top:10px;padding-top:10px">`;
  html+=`<div style="font-size:11px;font-weight:500;color:var(--color-text-secondary);margin-bottom:8px">${flow.label}</div>`;
  if(ncols>1){
    html+=`<div style="display:flex;align-items:center;padding:0 ${Math.floor(100/ncols/2)}%;margin-bottom:0">`;
    for(let i=0;i<ncols;i++){
      if(i>0)html+=`<div style="flex:1;height:2px;background:var(--color-border-secondary)"></div>`;
      html+=`<div style="width:6px;height:6px;border-radius:50%;background:var(--color-border-secondary);flex-shrink:0"></div>`;
    }
    html+=`</div><div style="display:flex;gap:10px;margin-bottom:0">`;
    for(let i=0;i<ncols;i++)html+=`<div style="flex:1;display:flex;justify-content:center"><div style="width:2px;height:10px;background:var(--color-border-secondary)"></div></div>`;
    html+=`</div>`;
  }
  html+=`<div style="display:flex;gap:8px;align-items:flex-start;flex-wrap:nowrap;overflow-x:auto">`;
  flow.cols.forEach(col=>{
    html+=`<div style="flex:1;min-width:${opts.minWidth}px;display:flex;flex-direction:column;align-items:center;gap:0">`;
    html+=`<div class="branch-label" style="width:100%;text-align:center">${col.header}</div>`;
    col.cards.forEach((c,idx)=>{
      if(idx>0)html+=`<div style="width:2px;height:8px;background:var(--color-border-secondary);margin:0 auto"></div>`;
      html+=`<div class="card ${col.color}" style="width:100%" onclick="showDetail('${c.key}')"><div class="name">${c.name}</div><div class="desc">${c.desc}</div></div>`;
    });
    html+=`</div>`;
  });
  html+=`</div></div>`;
  el.innerHTML=html;el.style.display='block';
  el.style.animation='none';el.offsetHeight;
  el.style.animation='slideUp .28s cubic-bezier(.4,0,.2,1) forwards';
  document.getElementById(opts.btnId).classList.add('active');
}

function clearOrgGeneric(opts){
  document.getElementById(opts.selectId).value='';
  const el=document.getElementById(opts.targetId);
  el.style.display='none';el.innerHTML='';
  document.getElementById(opts.btnId).classList.remove('active');
}

function showOrgFlow(){
  renderOrgFlowGeneric({selectId:'org-select',flows:orgFlows,targetId:'org-flow',btnId:'org-go-btn',minWidth:110});
}
function clearOrg(){
  clearOrgGeneric({selectId:'org-select',targetId:'org-flow',btnId:'org-go-btn'});
}
function showOrgFlowWound(){
  renderOrgFlowGeneric({selectId:'org-select-wound',flows:orgFlowsWound,targetId:'org-flow-wound',btnId:'org-go-btn-wound',minWidth:130});
}
function clearOrgWound(){
  clearOrgGeneric({selectId:'org-select-wound',targetId:'org-flow-wound',btnId:'org-go-btn-wound'});
}

function showDetail(key){
  const p=fcPanels[key];if(!p)return;
  const d=document.getElementById('detail-fc');
  document.getElementById('d-title').textContent=p.title;
  document.getElementById('d-sub').textContent=p.sub;
  const cls=p.reagents?'reagent-pill':'abx-pill';
  document.getElementById('d-abx').innerHTML=p.abx.map(a=>`<span class="${cls}">${a}</span>`).join('');
  document.getElementById('d-notes').innerHTML='<strong style="font-size:11px;color:var(--color-text-secondary)">Notes: </strong>'+p.notes;
  d.style.display='block';
  d.style.animation='none';d.offsetHeight;
  d.style.animation='slideUp .28s cubic-bezier(.4,0,.2,1) forwards';
  d.scrollIntoView({behavior:'smooth',block:'nearest'});
}

// ═══════════════════════════════════════════════
// PLATE APPEARANCE MODULE
// ═══════════════════════════════════════════════

let curMedium = 'uri';
let curOrganism = 'ecoli_uri';

// deterministic RNG so each organism has a stable colony pattern
function mulberry32(seed){return function(){let t=seed+=0x6D2B79F5;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296;}}
function hashStr(s){let h=0;for(let i=0;i<s.length;i++){h=Math.imul(31,h)+s.charCodeAt(i)|0;}return h>>>0;}

function haemolysisStyle(type){
  switch(type){
    case 'beta':return {radius:2.0,fill:'#E8D9A8',opacity:0.75};
    case 'beta_wide':return {radius:3.4,fill:'#EADFB2',opacity:0.85};
    case 'beta_narrow':return {radius:1.4,fill:'#E8D9A8',opacity:0.6};
    case 'alpha':return {radius:1.9,fill:'#6F8A57',opacity:0.55};
    case 'variable':return {radius:1.5,fill:'#E8D9A8',opacity:0.35};
    default:return null;
  }
}

function renderColony(c,org){
  const sx=c.x+0.6,sy=c.y+0.8;
  let s=`<circle cx="${sx.toFixed(2)}" cy="${sy.toFixed(2)}" r="${c.r.toFixed(2)}" fill="rgba(0,0,0,0.18)"/>`;
  s+=`<circle cx="${c.x.toFixed(2)}" cy="${c.y.toFixed(2)}" r="${c.r.toFixed(2)}" fill="${org.colonyColor}"/>`;
  if(org.texture==='mucoid'){
    s+=`<ellipse cx="${(c.x-c.r*0.32).toFixed(2)}" cy="${(c.y-c.r*0.36).toFixed(2)}" rx="${(c.r*0.5).toFixed(2)}" ry="${(c.r*0.3).toFixed(2)}" fill="rgba(255,255,255,0.55)"/>`;
    s+=`<ellipse cx="${(c.x+c.r*0.25).toFixed(2)}" cy="${(c.y+c.r*0.25).toFixed(2)}" rx="${(c.r*0.25).toFixed(2)}" ry="${(c.r*0.15).toFixed(2)}" fill="${org.colonyShade}" opacity="0.5"/>`;
  } else if(org.texture==='umbilicated'){
    s+=`<circle cx="${c.x.toFixed(2)}" cy="${c.y.toFixed(2)}" r="${(c.r*0.45).toFixed(2)}" fill="${org.colonyShade}" opacity="0.7"/>`;
    s+=`<circle cx="${c.x.toFixed(2)}" cy="${c.y.toFixed(2)}" r="${(c.r*0.2).toFixed(2)}" fill="${org.colonyShade}"/>`;
  } else if(org.texture==='metallic'){
    s+=`<ellipse cx="${(c.x-c.r*0.3).toFixed(2)}" cy="${(c.y-c.r*0.3).toFixed(2)}" rx="${(c.r*0.5).toFixed(2)}" ry="${(c.r*0.35).toFixed(2)}" fill="rgba(255,255,255,0.45)"/>`;
    s+=`<ellipse cx="${(c.x+c.r*0.2).toFixed(2)}" cy="${(c.y+c.r*0.3).toFixed(2)}" rx="${(c.r*0.3).toFixed(2)}" ry="${(c.r*0.15).toFixed(2)}" fill="${org.colonyShade}" opacity="0.6"/>`;
  } else if(org.texture==='matte'){
    s+=`<circle cx="${c.x.toFixed(2)}" cy="${c.y.toFixed(2)}" r="${c.r.toFixed(2)}" fill="${org.colonyShade}" opacity="0.2"/>`;
  } else if(org.texture==='black_center'){
    s+=`<ellipse cx="${(c.x-c.r*0.22).toFixed(2)}" cy="${(c.y-c.r*0.25).toFixed(2)}" rx="${(c.r*0.38).toFixed(2)}" ry="${(c.r*0.25).toFixed(2)}" fill="rgba(255,255,255,0.28)"/>`;
    s+=`<circle cx="${c.x.toFixed(2)}" cy="${c.y.toFixed(2)}" r="${(c.r*0.48).toFixed(2)}" fill="${org.colonyShade}"/>`;
  } else {
    // smooth (default) — subtle highlight
    s+=`<ellipse cx="${(c.x-c.r*0.3).toFixed(2)}" cy="${(c.y-c.r*0.3).toFixed(2)}" rx="${(c.r*0.35).toFixed(2)}" ry="${(c.r*0.22).toFixed(2)}" fill="rgba(255,255,255,0.32)"/>`;
  }
  return s;
}

function renderPlate(orgKey){
  const org=organisms[orgKey];
  const medium=plateMedia[org.medium];
  const wrap=document.getElementById('plate-svg-wrap');

  // Defs (gradients for all configured media) — included so each SVG self-contains
  const mediumGradientDefs = Object.entries(plateMedia).map(([key,pm])=>`
    <radialGradient id="agarGrad${key.charAt(0).toUpperCase()+key.slice(1)}" cx="38%" cy="32%" r="75%">
      ${pm.agarStops.map(([o,c])=>`<stop offset="${o}" stop-color="${c}"/>`).join('')}
    </radialGradient>`).join('');
  const defs=`<defs>${mediumGradientDefs}
    <radialGradient id="dishGloss" cx="30%" cy="22%" r="60%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.22)"/>
      <stop offset="60%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>`;

  // For "note" organisms (e.g. Haemophilus on CBA — doesn't grow), render an empty plate with a label
  if(org.isNote){
    const svg=`<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${org.name} on ${medium.name}">
      ${defs}
      <circle cx="200" cy="200" r="194" fill="${medium.rimColor}" stroke="${medium.rimStroke}" stroke-width="2"/>
      <circle cx="200" cy="200" r="180" fill="${medium.agarFill}"/>
      <circle cx="200" cy="200" r="180" fill="url(#dishGloss)"/>
      <g font-family="ui-sans-serif,system-ui,sans-serif" text-anchor="middle">
        <text x="200" y="195" font-size="22" font-weight="500" fill="rgba(255,255,255,0.95)">No growth</text>
        <text x="200" y="220" font-size="13" fill="rgba(255,255,255,0.8)">on this medium</text>
      </g>
    </svg>`;
    wrap.innerHTML=svg;
    renderOrganismInfo(orgKey);
    return;
  }

  // Generate colony positions deterministically
  const rng=mulberry32(hashStr(orgKey));
  const colonies=[];
  const isSwarming=!!org.swarming;
  const targetCount=org.count;
  const maxR=isSwarming?(org.swarming==='aggressive'?60:120):165;
  let attempts=0,placed=0;
  while(placed<targetCount && attempts<targetCount*8){
    attempts++;
    const r=Math.sqrt(rng())*maxR;
    const theta=rng()*Math.PI*2;
    const x=200+r*Math.cos(theta);
    const y=200+r*Math.sin(theta);
    const sizeVar=1+(rng()-0.5)*2*org.sizeVar;
    const sz=Math.max(0.6,org.size*sizeVar);
    // avoid heavy overlap (cheap rejection sampling)
    let ok=true;
    for(const c of colonies){
      const dx=c.x-x,dy=c.y-y;
      if(dx*dx+dy*dy<(c.r+sz)*(c.r+sz)*0.45){ok=false;break;}
    }
    if(ok){colonies.push({x,y,r:sz});placed++;}
  }

  // Build SVG
  let body='';
  // Plate rim + agar
  body+=`<circle cx="200" cy="200" r="194" fill="${medium.rimColor}" stroke="${medium.rimStroke}" stroke-width="2"/>`;
  body+=`<circle cx="200" cy="200" r="180" fill="${medium.agarFill}"/>`;

  // Swarming layers
  if(isSwarming){
    const waves=org.swarming==='aggressive'?6:4;
    const maxRadius=org.swarming==='aggressive'?170:120;
    for(let i=waves;i>=1;i--){
      const r=(maxRadius/waves)*i;
      const opa=org.swarming==='aggressive'?(0.18+0.05*(waves-i)):(0.14+0.04*(waves-i));
      body+=`<circle cx="200" cy="200" r="${r.toFixed(1)}" fill="${org.colonyColor}" opacity="${opa.toFixed(2)}"/>`;
      // wave edge
      body+=`<circle cx="200" cy="200" r="${r.toFixed(1)}" fill="none" stroke="${org.colonyShade}" stroke-width="0.8" opacity="${(opa*1.3).toFixed(2)}"/>`;
    }
  }

  // Haemolysis zones (rendered before colonies so colonies sit on top)
  const haem=haemolysisStyle(org.haemolysis);
  if(haem){
    let haemSvg='<g opacity="'+haem.opacity+'">';
    const rng2=mulberry32(hashStr(orgKey)+99);
    colonies.forEach(c=>{
      // For "variable" haemolysis, only ~30% of colonies show it
      if(org.haemolysis==='variable' && rng2()>0.35)return;
      const hr=c.r*haem.radius;
      haemSvg+=`<circle cx="${c.x.toFixed(2)}" cy="${c.y.toFixed(2)}" r="${hr.toFixed(2)}" fill="${haem.fill}"/>`;
    });
    haemSvg+='</g>';
    body+=haemSvg;
  }

  // Colonies
  colonies.forEach(c=>{body+=renderColony(c,org);});

  // Dish gloss overlay
  body+=`<circle cx="200" cy="200" r="180" fill="url(#dishGloss)" pointer-events="none"/>`;
  // Plate label (medium short name, bottom)
  body+=`<g font-family="ui-sans-serif,system-ui,sans-serif" font-size="9" fill="rgba(255,255,255,0.55)" text-anchor="middle"><text x="200" y="385">${medium.name}</text></g>`;

  const svg=`<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${org.name} on ${medium.name}">${defs}${body}</svg>`;
  wrap.innerHTML=svg;
  renderOrganismInfo(orgKey);
}

function renderOrganismInfo(orgKey){
  const org=organisms[orgKey];
  const info=document.getElementById('organism-info');
  let features='';
  if(org.features){
    features='<div class="org-meta">'+
      `<span class="org-feature"><span class="swatch" style="background:${org.colonyColor}"></span>colony</span>`+
      org.features.map(f=>`<span class="org-feature">${f}</span>`).join('')+
      '</div>';
  }
  info.innerHTML=`<h3>${org.name}</h3>${features}<p>${org.description}</p>`;
}

function renderOrganismToggleRow(){
  const row=document.getElementById('organism-toggle-row');
  const note=document.getElementById('plate-note');
  const list=Object.entries(organisms).filter(([k,o])=>o.medium===curMedium);
  row.innerHTML=list.map(([k,o])=>{
    const swatch=o.isNote?'#999':o.colonyColor;
    const isActive=k===curOrganism?' active':'';
    return `<button class="org-pill${isActive}" id="opill-${k}" onclick="setPlateOrganism('${k}')"><span class="pill-swatch" style="background:${swatch}"></span>${o.name}</button>`;
  }).join('');
  note.textContent=plateMedia[curMedium].note;
}

function setPlateOrganism(key){
  if(typeof setPlateSection==='function')setPlateSection('plate');
  curOrganism=key;
  document.querySelectorAll('.org-pill').forEach(p=>p.classList.remove('active'));
  const btn=document.getElementById('opill-'+key);
  if(btn)btn.classList.add('active');
  renderPlate(key);
}

function setPlateMedium(m){
  if(curMedium===m)return;
  curMedium=m;
  document.querySelectorAll('.plate-tab').forEach(btn=>btn.classList.remove('active'));
  const tab=document.getElementById('ptab-'+m);
  if(tab)tab.classList.add('active');
  // pick the first organism for the new medium
  const first=Object.entries(organisms).find(([k,o])=>o.medium===m);
  if(first)curOrganism=first[0];
  renderOrganismToggleRow();
  renderPlate(curOrganism);
}

// Initialise plate view (idempotent — safe even though hidden initially)
renderOrganismToggleRow();
renderPlate(curOrganism);

// ═══════════════════════════════════════════════
// GRAM STAIN / MICROSCOPY MODULE — deterministic film renderer
// ═══════════════════════════════════════════════
function gramCellColour(g, rng){
  if(g==='neg') return '#cf3a6e';
  if(g==='variable') return rng()<0.5 ? '#5e3aa6' : '#cf3a6e';
  return '#5e3aa6';
}
function gramSvg(id, seed){
  const p = (typeof gramPatterns!=='undefined') ? gramPatterns.find(x=>x.id===id) : null;
  if(!p) return '';
  const W=220, H=150;
  const rng = mulberry32(hashStr(id) + (seed||0));
  const R = (a,b)=>a + rng()*(b-a);
  const col = ()=>gramCellColour(p.gram, rng);
  const cocc=(cx,cy,r,f)=>`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${r.toFixed(1)}" fill="${f}"/><circle cx="${(cx-r*0.3).toFixed(1)}" cy="${(cy-r*0.32).toFixed(1)}" r="${(r*0.3).toFixed(1)}" fill="rgba(255,255,255,.22)"/>`;
  const rod=(cx,cy,L,w,ang,f)=>`<g transform="translate(${cx.toFixed(1)} ${cy.toFixed(1)}) rotate(${ang.toFixed(1)})"><rect x="${(-L/2).toFixed(1)}" y="${(-w/2).toFixed(1)}" width="${L.toFixed(1)}" height="${w.toFixed(1)}" rx="${(w/2).toFixed(1)}" fill="${f}"/></g>`;
  let body='';
  const anchors=(n)=>{const a=[];for(let i=0;i<n;i++)a.push([R(26,W-26),R(24,H-24)]);return a;};

  if(p.form==='coccus' && p.arr==='clusters'){
    anchors(5).forEach(([ax,ay])=>{const n=4+Math.floor(rng()*4);for(let i=0;i<n;i++){body+=cocc(ax+R(-12,12),ay+R(-12,12),R(4.4,5.4),col());}});
  } else if(p.form==='coccus' && p.arr==='chains'){
    for(let c=0;c<3;c++){let x=R(26,70),y=R(30,H-30),ang=R(-25,25);const n=6+Math.floor(rng()*4);for(let i=0;i<n;i++){body+=cocc(x,y,4.8,col());const step=8.6;ang+=R(-12,12);x+=step*Math.cos(ang*Math.PI/180);y+=step*Math.sin(ang*Math.PI/180);if(x>W-24){x=W-24;}}}
  } else if(p.form==='lancet' && p.arr==='pairs'){
    anchors(7).forEach(([ax,ay])=>{const ang=R(0,180);const dx=4.6*Math.cos(ang*Math.PI/180),dy=4.6*Math.sin(ang*Math.PI/180);const f=col();[[ax-dx,ay-dy,ang],[ax+dx,ay+dy,ang]].forEach(([x,y,a])=>{body+=`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})"><ellipse cx="0" cy="0" rx="6" ry="4.4" fill="${f}"/></g>`;});});
  } else if(p.form==='coccus' && p.arr==='tetrads'){
    anchors(5).forEach(([ax,ay])=>{const f=col();[[ -4.6,-4.6],[4.6,-4.6],[-4.6,4.6],[4.6,4.6]].forEach(([dx,dy])=>{body+=cocc(ax+dx,ay+dy,4.4,f);});});
  } else if(p.form==='kidney' && p.arr==='pairs'){
    anchors(6).forEach(([ax,ay])=>{const ang=R(0,180);const f=col();const dx=5.2*Math.cos(ang*Math.PI/180),dy=5.2*Math.sin(ang*Math.PI/180);[[ax-dx,ay-dy,ang+90],[ax+dx,ay+dy,ang-90]].forEach(([x,y,a])=>{body+=`<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(1)})"><path d="M -4.6 -5 A 6 6 0 0 1 -4.6 5 A 9 9 0 0 0 -4.6 -5 Z" fill="${f}"/></g>`;});});
  } else if(p.form==='rod' && p.arr==='single'){
    for(let i=0;i<15;i++){body+=rod(R(26,W-26),R(24,H-24),R(15,19),6,R(0,180),col());}
  } else if(p.form==='coccobacillus' && p.arr==='single'){
    for(let i=0;i<16;i++){body+=rod(R(26,W-26),R(24,H-24),R(8,11),6.4,R(0,180),col());}
  } else if(p.form==='curved'){
    for(let i=0;i<11;i++){const cx=R(28,W-28),cy=R(26,H-26),ang=R(0,360),f=col();const a=ang*Math.PI/180;const len=R(16,22);const x1=cx-len/2*Math.cos(a),y1=cy-len/2*Math.sin(a),x2=cx+len/2*Math.cos(a),y2=cy+len/2*Math.sin(a);const bow=R(6,10);const mx=(x1+x2)/2 - bow*Math.sin(a), my=(y1+y2)/2 + bow*Math.cos(a);body+=`<path d="M ${x1.toFixed(1)} ${y1.toFixed(1)} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${x2.toFixed(1)} ${y2.toFixed(1)}" stroke="${f}" stroke-width="6" fill="none" stroke-linecap="round"/>`;}
  } else if(p.form==='bigrod'){
    for(let c=0;c<3;c++){let x=R(28,80),y=R(34,H-34),ang=R(-20,20);const n=2+Math.floor(rng()*3);const f=col();for(let i=0;i<n;i++){body+=rod(x,y,20,9,ang,f);if(rng()<0.5)body+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="4" ry="5.5" fill="#efe9f0"/>`;const step=21*Math.cos(ang*Math.PI/180),sy=21*Math.sin(ang*Math.PI/180);x+=step;y+=sy;ang+=R(-8,8);}}
    for(let i=0;i<3;i++){body+=rod(R(120,W-26),R(24,H-24),20,9,R(0,180),col());}
  } else if(p.form==='smallrod' && p.arr==='palisade'){
    anchors(5).forEach(([ax,ay])=>{const f=col();const base=R(0,180);for(let i=0;i<4;i++){const a=base+R(-50,50);const ox=R(-3,3),oy=R(-3,3);body+=rod(ax+ox,ay+oy,11,4.6,a,f);}});
  } else if(p.form==='branch'){
    for(let c=0;c<3;c++){let x=R(30,70),y=R(30,H-30),ang=R(-30,30);const f=col();const seg=()=>{const n=10+Math.floor(rng()*6);let cx=x,cy=y,a=ang;for(let i=0;i<n;i++){body+=`<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="2.6" fill="${f}"/>`;a+=R(-8,8);cx+=4*Math.cos(a*Math.PI/180);cy+=4*Math.sin(a*Math.PI/180);if(i===Math.floor(n/2)){let bx=cx,by=cy,ba=a+R(35,65);for(let j=0;j<6;j++){body+=`<circle cx="${bx.toFixed(1)}" cy="${by.toFixed(1)}" r="2.4" fill="${f}"/>`;ba+=R(-8,8);bx+=4*Math.cos(ba*Math.PI/180);by+=4*Math.sin(ba*Math.PI/180);}}}};seg();}
  } else if(p.form==='yeast'){
    for(let i=0;i<7;i++){const cx=R(28,W-28),cy=R(26,H-26),f=col();body+=`<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="7" ry="9" fill="${f}"/><circle cx="${(cx+6).toFixed(1)}" cy="${(cy-7).toFixed(1)}" r="4.2" fill="${f}"/><ellipse cx="${(cx-2).toFixed(1)}" cy="${(cy-2).toFixed(1)}" rx="2.6" ry="3.4" fill="rgba(255,255,255,.22)"/>`;}
    let x=R(40,70),y=H-30,a=-20,f=col();for(let i=0;i<5;i++){body+=`<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="8" ry="5" transform="rotate(${a} ${x} ${y})" fill="${f}"/>`;x+=15*Math.cos(a*Math.PI/180);y+=15*Math.sin(a*Math.PI/180);a+=R(-15,15);}
  } else if(p.arr==='cluecell'){
    // squamous epithelial cell (pale, irregular) stippled with coccobacilli
    body+=`<path d="M 70 40 Q 120 30 150 55 Q 168 80 140 110 Q 100 122 72 100 Q 55 72 70 40 Z" fill="rgba(150,120,160,.16)" stroke="rgba(120,90,140,.4)" stroke-width="1"/><circle cx="108" cy="74" r="7" fill="rgba(120,90,140,.22)"/>`;
    for(let i=0;i<60;i++){const x=R(74,148),y=R(42,112);body+=`<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${R(1.4,2.2).toFixed(1)}" fill="${gramCellColour('variable',rng)}"/>`;}
    for(let i=0;i<14;i++){body+=rod(R(20,200),R(18,H-14),R(7,10),5.4,R(0,180),gramCellColour('variable',rng));}
  } else {
    for(let i=0;i<14;i++){body+=rod(R(26,W-26),R(24,H-24),R(12,16),6,R(0,180),col());}
  }

  // faint stain stipple for texture
  let stip='';
  for(let i=0;i<26;i++){stip+=`<circle cx="${R(8,W-8).toFixed(1)}" cy="${R(8,H-8).toFixed(1)}" r="${R(0.5,1.1).toFixed(1)}" fill="rgba(150,90,130,.10)"/>`;}

  return `<svg viewBox="0 0 ${W} ${H}" class="gram-film-svg" role="img" aria-label="Gram film schematic: ${p.name}"><defs><radialGradient id="gramfield-${id}" cx="50%" cy="45%" r="75%"><stop offset="0" stop-color="#f6f1f4"/><stop offset="1" stop-color="#e7dee8"/></radialGradient></defs><rect x="0" y="0" width="${W}" height="${H}" rx="12" fill="url(#gramfield-${id})"/>${stip}${body}</svg>`;
}

function renderGram(){
  const q=(document.getElementById('gram-search')?.value||'').trim().toLowerCase();
  const gf=document.getElementById('gram-gram-filter')?.value||'';
  const grid=document.getElementById('gram-grid');
  if(!grid)return;
  const matches=gramPatterns.filter(p=>{
    const hay=(p.name+' '+p.gram+' '+p.form+' '+p.organisms.join(' ')+' '+p.clues.join(' ')+' '+p.description).toLowerCase();
    return (!gf||p.gram===gf) && (!q||hay.includes(q));
  });
  const gramLabel={pos:'Gram-positive',neg:'Gram-negative',variable:'Gram-variable'};
  grid.innerHTML = matches.length ? matches.map(p=>
    `<div class="gram-card" onclick="showGramPattern('${p.id}')"><div class="gram-card-film">${gramSvg(p.id)}</div><div class="gram-card-body"><h3>${p.name}</h3><span class="gram-tag gram-${p.gram}">${gramLabel[p.gram]}</span><p>${p.organisms.slice(0,3).join(' · ')}</p></div></div>`
  ).join('') : '<div class="myco-empty">No Gram appearances match those filters.</div>';
}

function showGramPattern(id){
  const p=gramPatterns.find(x=>x.id===id); if(!p)return;
  setPlateSection('gram');
  const panel=document.getElementById('gram-panel'); if(!panel)return;
  const gramLabel={pos:'Gram-positive',neg:'Gram-negative',variable:'Gram-variable'};
  panel.innerHTML=`<div class="myco-panel-head"><div><h3>${p.name}</h3><div class="myco-panel-sub"><span class="gram-tag gram-${p.gram}">${gramLabel[p.gram]}</span></div></div></div>`+
    `<div class="myco-panel-grid"><div class="gram-film-big">${gramSvg(p.id)}<div class="myco-img-cap">Schematic Gram film \u2014 not a photomicrograph</div></div>`+
    `<div class="myco-facts"><div class="myco-fact"><div class="myco-fact-title">What you see</div><p>${p.description}</p></div>`+
    `<div class="myco-fact"><div class="myco-fact-title">Typical organisms</div><p>${p.organisms.join(' · ')}</p></div>`+
    `<div class="myco-fact"><div class="myco-fact-title">Bench clues / next steps</div><ul>${p.clues.map(c=>`<li>${c}</li>`).join('')}</ul></div></div></div>`;
  panel.style.display='block';
  panel.style.animation='none';panel.offsetHeight;panel.style.animation='slideUp .28s cubic-bezier(.4,0,.2,1) forwards';
  panel.scrollIntoView({behavior:'smooth',block:'nearest'});
}

function setPlateSection(sec){
  const secs=['plate','gram'];
  if(secs.indexOf(sec)===-1) sec='plate';
  secs.forEach(t=>{
    const pane=document.getElementById('plate-pane-'+t);
    const btn=document.getElementById('plate-sect-'+t);
    const on=(t===sec);
    if(pane) pane.classList.toggle('is-hidden',!on);
    if(btn){ btn.classList.toggle('active',on); btn.setAttribute('aria-selected',on?'true':'false'); }
  });
}

renderGram();


// ═══════════════════════════════════════════════
// v6 — Antibiotic classes interactive reference
// ═══════════════════════════════════════════════

function renderAbxClasses(){
  const table = document.getElementById('abx-class-table');
  if(!table) return;
  table.innerHTML = abxClasses.map(c => {
    const subgroups = c.subgroups.map(sg => {
      const chips = sg.items.map(it => {
        const aka = it.aka ? ` <span style="color:var(--color-text-tertiary);font-size:10px">(${it.aka})</span>` : '';
        return `<span class="abx-chip" data-class="${c.id}" data-name="${escapeAttr(it.name)}" data-tip="${escapeAttr(it.tip)}" tabindex="0" role="button" aria-label="${escapeAttr(it.name)} — hover or tap for details">${it.name}${aka}</span>`;
      }).join('');
      return `<div class="abx-subgroup"><span class="abx-subgroup-label">${sg.label}</span><div class="abx-chip-row">${chips}</div></div>`;
    }).join('');
    // Inline detail panel — collapsed via CSS grid-template-rows: 0fr,
    // expanded to 1fr when the parent row carries the .active class.
    const detail = `<div class="abx-class-detail-inline"><div class="acd-inner"><div class="acd-content">
        <div class="acd-sub">${c.family} · target: ${c.target}</div>
        <div class="acd-section"><div class="acd-section-title">Chemistry</div><p>${c.chemistry}</p></div>
        <div class="acd-section"><div class="acd-section-title">Mechanism of action</div><p>${c.mechanism}</p></div>
        <div class="acd-section"><div class="acd-section-title">Spectrum</div><p>${c.spectrum}</p></div>
        <div class="acd-section"><div class="acd-section-title">Resistance mechanisms</div><p>${c.resistance}</p></div>
      </div></div></div>`;
    return `<div class="abx-class-row" id="abxrow-${c.id}" data-class="${c.id}">
      <div class="abx-class-head" onclick="selectAbxClass('${c.id}')">
        <span class="abx-class-swatch" style="background:${c.color}"></span>
        <span class="abx-class-name">${c.name}</span>
        <span class="abx-class-target" title="primary target">${c.target}</span>
      </div>
      <div class="abx-class-body">${subgroups}</div>
      ${detail}
    </div>`;
  }).join('');
}

// Escape user-data values for safe insertion into a double-quoted HTML attribute
function escapeAttr(s){
  return String(s).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
}

let currentAbxClass = null;
function selectAbxClass(id){
  const cls = abxClasses.find(c => c.id === id);
  if(!cls) return;
  const row = document.getElementById('abxrow-'+id);
  // Toggle: clicking the active class again collapses it
  if(currentAbxClass === id){
    if(row) row.classList.remove('active');
    currentAbxClass = null;
    return;
  }
  // Collapse any previously open class, then open this one
  document.querySelectorAll('.abx-class-row').forEach(r => r.classList.remove('active'));
  if(!row) return;
  row.classList.add('active');
  currentAbxClass = id;
  // Keep the row's header near the top of the viewport so the newly-revealed
  // chemistry/mechanism/spectrum sections sit just below it. Small delay so
  // the grid-row transition has started — scrolling before any growth has
  // happened can land the row awkwardly.
  const head = row.querySelector('.abx-class-head');
  if(head){
    setTimeout(() => head.scrollIntoView({behavior:'smooth', block:'nearest'}), 60);
  }
}

// ─── Floating tooltip (body-level, escapes overflow:hidden) ───
const floatTip = document.createElement('div');
floatTip.id = 'abx-float-tip';
floatTip.setAttribute('role','tooltip');
document.body.appendChild(floatTip);

function showFloatTip(chip){
  const tipContent = chip.getAttribute('data-tip');
  if(!tipContent) return;
  floatTip.innerHTML = tipContent;
  // Make momentarily visible off-screen to measure, then reposition
  floatTip.classList.remove('below');
  floatTip.style.left = '-9999px';
  floatTip.style.top = '0px';
  floatTip.style.setProperty('--arrow-shift','0px');
  floatTip.classList.add('show');
  // Measure & position
  const cr = chip.getBoundingClientRect();
  const tr = floatTip.getBoundingClientRect();
  const margin = 8;
  let left = cr.left + cr.width/2 - tr.width/2;
  let top = cr.top - tr.height - 8;
  let arrowShift = 0;
  // Clamp horizontally
  if(left < margin){
    arrowShift = left - margin;
    left = margin;
  } else if(left + tr.width > window.innerWidth - margin){
    arrowShift = (left + tr.width) - (window.innerWidth - margin);
    left = window.innerWidth - margin - tr.width;
  }
  // Flip below if no room above
  if(top < margin){
    top = cr.bottom + 8;
    floatTip.classList.add('below');
  }
  floatTip.style.left = left + 'px';
  floatTip.style.top = top + 'px';
  floatTip.style.setProperty('--arrow-shift', arrowShift + 'px');
}

function hideFloatTip(){
  floatTip.classList.remove('show');
}

// Hover / focus / click delegation for chips
document.addEventListener('mouseover', e => {
  const chip = e.target.closest && e.target.closest('.abx-chip');
  if(!chip) return;
  showFloatTip(chip);
});
document.addEventListener('mouseout', e => {
  const chip = e.target.closest && e.target.closest('.abx-chip');
  if(!chip) return;
  // If the chip is "stuck" (tapped), keep the tooltip visible
  if(chip.classList.contains('stuck')) return;
  // If we're just moving between children of the same chip, don't hide
  if(e.relatedTarget && e.relatedTarget.closest && e.relatedTarget.closest('.abx-chip') === chip) return;
  hideFloatTip();
});
document.addEventListener('focusin', e => {
  const chip = e.target.closest && e.target.closest('.abx-chip');
  if(chip) showFloatTip(chip);
});
document.addEventListener('focusout', e => {
  const chip = e.target.closest && e.target.closest('.abx-chip');
  if(chip && !chip.classList.contains('stuck')) hideFloatTip();
});
document.addEventListener('click', e => {
  const chip = e.target.closest && e.target.closest('.abx-chip');
  if(chip){
    // Don't re-toggle on key-triggered synthetic click (focusin already showed the tip)
    const wasStuck = chip.classList.contains('stuck');
    document.querySelectorAll('.abx-chip.stuck').forEach(c => c.classList.remove('stuck'));
    if(!wasStuck){
      chip.classList.add('stuck');
      showFloatTip(chip);
    } else {
      hideFloatTip();
    }
    return;
  }
  // Clicked outside any chip — unstick + hide
  if(document.querySelector('.abx-chip.stuck')){
    document.querySelectorAll('.abx-chip.stuck').forEach(c => c.classList.remove('stuck'));
    hideFloatTip();
  }
});
// Reposition / hide tip on scroll & resize — fixed-position tooltips need this
window.addEventListener('scroll', () => {
  const stuck = document.querySelector('.abx-chip.stuck');
  if(stuck) showFloatTip(stuck);
  else if(floatTip.classList.contains('show')) hideFloatTip();
}, {passive:true});
window.addEventListener('resize', () => {
  hideFloatTip();
  syncAbxSpacer();
});
// Escape hides the tooltip too
document.addEventListener('keydown', e => {
  if(e.key === 'Escape'){
    document.querySelectorAll('.abx-chip.stuck').forEach(c => c.classList.remove('stuck'));
    hideFloatTip();
  }
});

// Legacy stub — the bottom-anchored detail panel was replaced with inline
// accordion expansion inside each row. Existing call sites (switchView,
// resize listener, ResizeObserver) still reference this function, so it
// stays as a no-op rather than being deleted.
function syncAbxSpacer(){}

renderAbxClasses();
syncAbxSpacer();
// Observe panel resize (content changes, viewport changes) and keep spacer in sync
if(typeof ResizeObserver !== 'undefined'){
  const ro = new ResizeObserver(() => syncAbxSpacer());
  const _detail = document.getElementById('abx-class-detail');
  if(_detail) ro.observe(_detail);
}

// ═══════════════════════════════════════════════
// Bench notes — rare antibiotic sets + QC organisms
// ═══════════════════════════════════════════════

// Routine antibiotic sets from the current urine and wound bench lists.
// Antibiotic codes that don't have their own donker — for each organism, list
// which existing donker plate carries each one. Tuples: [code, donker location].
// QC reference strains and the media each should be plated to.
// bcName/bcStrain are the short forms used by the barcode label generator
// (single-letter genus + first 4 chars of species, or a known abbreviation).
function scrollNotesTo(targetId){
  // Refresh the measured sticky-stack height first so the jump clears the
  // pinned top nav + quick-nav (scroll-margin-top reads --notes-scroll-offset).
  if(typeof updateStickyOffsets === 'function') updateStickyOffsets();
  const target = document.getElementById(targetId);
  if(!target) return;
  target.scrollIntoView({behavior:'smooth',block:'start'});
}

const routineNavIds = ['notes-routine-urine','notes-routine-wound','notes-routine-ear-eye'];

// Split a disc entry such as 'Ampicillin 10', 'Vancomycin 5 (24 HR)' or
// 'Clarithromycin MIC' into its drug name and concentration/method tail. The
// concentration starts at the first numeric token (or the word "MIC").
function parseAbxDisc(entry){
  const m = /^(.+?)\s+(\d.*|MIC)$/i.exec(String(entry).trim());
  if(m) return {name:m[1].trim(), conc:m[2].trim()};
  return {name:String(entry).trim(), conc:''};
}

// Present a concentration tail for display: bare numbers gain a µg suffix,
// 'MIC' and parenthetical notes are preserved.
function formatDiscConc(conc){
  if(!conc) return '';
  if(/^\d/.test(conc)) return conc.replace(/^(\d+)/, '$1 µg');
  return conc;
}

// Currently selected disc filter for the routine (donker) sets, or null.
// Shape: {name, occurrences:[{section,setName,codes,conc,entry}]}
let activeAbxFilter = null;

function renderRoutineSets(){
  const routineEl = document.getElementById('routine-sets');
  if(!routineEl) return;
  const filterKey = activeAbxFilter ? activeAbxFilter.name.toLowerCase() : null;

  const blocks = routineSets.map((group, index) => {
    const sets = filterKey
      ? group.sets.filter(set => set.antibiotics.some(a => parseAbxDisc(a).name.toLowerCase() === filterKey))
      : group.sets;
    if(filterKey && !sets.length) return '';
    return `
      <div class="routine-block" id="${routineNavIds[index] || `notes-routine-${index + 1}`}">
        <h4 class="routine-block-title">${group.section}<span class="routine-count">${sets.length} set${sets.length === 1 ? '' : 's'}</span></h4>
        <div class="rare-grid">
          ${sets.map(set => `
            <div class="rare-card routine-card${filterKey ? ' is-filtered' : ''}">
              <div class="rare-card-head">${set.name}</div>
              <div class="routine-code-row">
                ${set.codes.map(code => `<span class="routine-code">${code}</span>`).join('')}
              </div>
              <ul class="rare-list routine-list">
                ${set.antibiotics.map(abx => {
                  const p = parseAbxDisc(abx);
                  if(filterKey && p.name.toLowerCase() === filterKey){
                    return `<li class="routine-abx-match"><span class="routine-abx">${p.name}<span class="routine-conc">${formatDiscConc(p.conc) || '—'}</span></span></li>`;
                  }
                  return `<li><span class="routine-abx">${abx}</span></li>`;
                }).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  routineEl.innerHTML = filterKey && !blocks
    ? `<div class="abx-finder-noresults">No donker sets carry that disc.</div>`
    : blocks;

  renderAbxFinderStatus();
}

function renderNotesView(){
  renderRoutineSets();
  const rareEl = document.getElementById('rare-grid');
  if(rareEl){
    rareEl.innerHTML = rareSets.map(([org, items]) => `
      <div class="rare-card">
        <div class="rare-card-head">${org}</div>
        <ul class="rare-list">
          ${items.map(([abx, donker]) =>
            `<li><span class="rare-abx">${abx}</span><span class="rare-arrow" aria-hidden="true">→</span><span class="rare-donker">${donker}</span></li>`
          ).join('')}
        </ul>
      </div>
    `).join('');
  }
  const anaEl = document.getElementById('anaerobe-list');
  if(anaEl){
    anaEl.innerHTML = anaerobeMICs.map(a => `<span class="anaerobe-pill">${a}</span>`).join('');
  }
  const qcBody = document.getElementById('qc-tbody');
  if(qcBody){
    qcBody.innerHTML = qcOrganisms.map(o => `
      <tr>
        <td><em class="qc-org">${o.name}</em></td>
        <td><code class="qc-strain">${o.strain}</code></td>
        <td>${o.plates.map(p => `<span class="qc-plate">${p}</span>`).join('')}</td>
      </tr>
    `).join('');
  }
}

// Track which view to return to when notes is toggled off
let preNotesView = null;
function toggleNotesView(){
  if(curView === 'notes'){
    switchView(preNotesView || 'flow');
    preNotesView = null;
  } else {
    preNotesView = curView;
    switchView('notes');
  }
}

// ─── Antibiotic-disc finder (bench notes → donker sets) ─────────
// Type a disc name; the dropdown lists matching discs (like the global
// search) and selecting one narrows the routine sets to every donker that
// carries it, with the concentration of the disc in each.
let abxFinderIndex = null;   // [{name, occurrences:[...]}] sorted by name
let abxFinderResults = [];   // current dropdown results
let abxFinderFocusIdx = -1;

// Normalise an antibiotic name for alias matching (case/punctuation/space-insensitive).
function normAbxName(s){ return String(s).toLowerCase().replace(/[^a-z0-9]/g, ''); }

// Lazily build a lookup from every normalised alias to its full alias-row text,
// then return the synonyms for a given antibiotic name (excluding the name itself).
let _abxAliasLookup = null;
function abxAliasText(name){
  if(typeof abxAliasGroups === 'undefined') return '';
  if(!_abxAliasLookup){
    _abxAliasLookup = new Map();
    abxAliasGroups.forEach(group => {
      group.forEach(g => _abxAliasLookup.set(normAbxName(g), group));
    });
  }
  const group = _abxAliasLookup.get(normAbxName(name));
  if(!group) return '';
  const self = normAbxName(name);
  return group.filter(g => normAbxName(g) !== self).join(' ');
}

function buildAbxFinderIndex(){
  const map = new Map();
  routineSets.forEach(group => {
    group.sets.forEach(set => {
      set.antibiotics.forEach(entry => {
        const {name, conc} = parseAbxDisc(entry);
        const key = name.toLowerCase();
        if(!map.has(key)) map.set(key, {name, aliases:abxAliasText(name), occurrences:[]});
        map.get(key).occurrences.push({section:group.section, setName:set.name, codes:set.codes, conc, entry});
      });
    });
  });
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

function abxFinderResultSnippet(item){
  const setCount = item.occurrences.length;
  const concs = [...new Set(item.occurrences.map(o => formatDiscConc(o.conc)).filter(Boolean))];
  const concStr = concs.length ? ' · ' + concs.join(' / ') : '';
  const aka = item.aliases ? ` · a.k.a. ${item.aliases}` : '';
  return `${setCount} donker${setCount === 1 ? '' : 's'}${concStr}${aka}`;
}

function runAbxFinderSearch(q){
  if(!abxFinderIndex) abxFinderIndex = buildAbxFinderIndex();
  const results = document.getElementById('abx-finder-results');
  const clear = document.getElementById('abx-finder-clear');
  if(!results) return;
  const raw = q.trim();
  const ql = raw.toLowerCase();
  if(clear) clear.classList.toggle('show', raw.length > 0);

  // Empty input while focused → browse the full alphabetical disc list.
  let matches;
  if(ql.length === 0){
    matches = abxFinderIndex.slice();
  } else {
    matches = abxFinderIndex
      .map(it => {
        const idx = it.name.toLowerCase().indexOf(ql);
        if(idx !== -1) return {it, score:idx};
        // Fall back to an alternative-name match (ranked below direct matches).
        if(it.aliases && it.aliases.toLowerCase().includes(ql)) return {it, score:1000};
        return null;
      })
      .filter(Boolean)
      .sort((a, b) => a.score - b.score || a.it.name.localeCompare(b.it.name))
      .map(x => x.it);
  }

  abxFinderResults = matches.slice(0, 60);
  abxFinderFocusIdx = -1;

  if(!abxFinderResults.length){
    const safe = raw.replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    results.innerHTML = `<div class="abx-finder-empty">No disc matches &ldquo;${safe}&rdquo;. Try a drug name or abbreviation used on the bench.</div>`;
    results.classList.add('show');
    return;
  }

  results.innerHTML = abxFinderResults.map((m, i) =>
    `<div class="search-result" data-idx="${i}" onclick="selectAbxFinder(${i})">`
    + `<div class="sr-kind">Antibiotic disc</div>`
    + `<div class="sr-name">${highlightMatch(m.name, ql)}</div>`
    + `<div class="sr-snip">${abxFinderResultSnippet(m)}</div>`
    + `</div>`
  ).join('');
  results.classList.add('show');
}

function updateAbxFinderFocus(){
  const rows = document.querySelectorAll('#abx-finder-results .search-result');
  rows.forEach((r, i) => r.classList.toggle('focus', i === abxFinderFocusIdx));
  const active = rows[abxFinderFocusIdx];
  if(active) active.scrollIntoView({block:'nearest'});
}

function closeAbxFinderDropdown(){
  const results = document.getElementById('abx-finder-results');
  if(results) results.classList.remove('show');
  abxFinderResults = [];
  abxFinderFocusIdx = -1;
}

function selectAbxFinder(i){
  const m = abxFinderResults[i];
  if(!m) return;
  activeAbxFilter = m;
  const input = document.getElementById('abx-finder-input');
  if(input) input.value = m.name;
  const clear = document.getElementById('abx-finder-clear');
  if(clear) clear.classList.add('show');
  closeAbxFinderDropdown();
  renderRoutineSets();
}

function clearAbxFinder(){
  const input = document.getElementById('abx-finder-input');
  if(input) input.value = '';
  const clear = document.getElementById('abx-finder-clear');
  if(clear) clear.classList.remove('show');
  activeAbxFilter = null;
  closeAbxFinderDropdown();
  renderRoutineSets();
}

function renderAbxFinderStatus(){
  const statusEl = document.getElementById('abx-finder-status');
  if(!statusEl) return;
  if(!activeAbxFilter){
    statusEl.hidden = true;
    statusEl.innerHTML = '';
    return;
  }
  const setCount = activeAbxFilter.occurrences.length;
  const concs = [...new Set(activeAbxFilter.occurrences.map(o => formatDiscConc(o.conc)).filter(Boolean))];
  const concStr = concs.length ? ` (${concs.join(' / ')})` : '';
  statusEl.hidden = false;
  statusEl.innerHTML =
    `<i class="ti ti-filter" aria-hidden="true"></i>`
    + `<span>Showing donker sets carrying <span class="afs-term">${activeAbxFilter.name}</span>${concStr}</span>`
    + `<span class="afs-count">${setCount} set${setCount === 1 ? '' : 's'}</span>`
    + `<button class="afs-clear" type="button" onclick="clearAbxFinder()">Clear filter</button>`;
}

(function initAbxFinder(){
  const input = document.getElementById('abx-finder-input');
  if(!input) return;
  input.addEventListener('input', e => runAbxFinderSearch(e.target.value));
  input.addEventListener('focus', e => runAbxFinderSearch(e.target.value));
  input.addEventListener('keydown', e => {
    const open = abxFinderResults.length > 0;
    if(e.key === 'ArrowDown' && open){
      e.preventDefault();
      abxFinderFocusIdx = Math.min(abxFinderFocusIdx + 1, abxFinderResults.length - 1);
      updateAbxFinderFocus();
    } else if(e.key === 'ArrowUp' && open){
      e.preventDefault();
      abxFinderFocusIdx = Math.max(abxFinderFocusIdx - 1, 0);
      updateAbxFinderFocus();
    } else if(e.key === 'Enter'){
      e.preventDefault();
      if(abxFinderFocusIdx >= 0) selectAbxFinder(abxFinderFocusIdx);
      else if(abxFinderResults.length === 1) selectAbxFinder(0);
    } else if(e.key === 'Escape'){
      if(abxFinderResults.length){ e.stopPropagation(); closeAbxFinderDropdown(); }
    }
  });
  // Close the dropdown when clicking outside the finder.
  document.addEventListener('click', e => {
    const wrap = input.closest('.abx-finder-wrap');
    if(wrap && !wrap.contains(e.target)) closeAbxFinderDropdown();
  });
})();

// ─── Barcode label generator ───────────────────
// Converts ISO date (YYYY-MM-DD from <input type=date>) to DDMMYY for labels.
function formatBarcodeDate(iso){
  if(!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return '';
  const [y,m,d] = iso.split('-');
  return d + m + y.slice(2);
}

function makeBarcode(org, iso){
  const date = formatBarcodeDate(iso);
  return org.bcName + org.bcStrain + (date ? '.' + date : '');
}

function renderBarcodes(){
  const tbody = document.getElementById('barcode-tbody');
  if(!tbody) return;
  const iso = (document.getElementById('barcode-date') || {}).value || '';
  tbody.innerHTML = qcOrganisms.map(o => {
    const label = makeBarcode(o, iso);
    const escaped = label.replace(/"/g,'&quot;');
    return `<tr>
      <td><em class="qc-org">${o.name}</em><span class="qc-strain-mini">${o.bcStrain}</span></td>
      <td><code class="barcode-label">${label}</code></td>
      <td class="barcode-action-cell"><button class="barcode-copy-btn" type="button" data-text="${escaped}" onclick="copyBarcode(this)" aria-label="Copy ${escaped}" title="Copy"><i class="ti ti-copy" aria-hidden="true"></i></button></td>
    </tr>`;
  }).join('');
}

function copyBarcode(btn){
  const text = btn.getAttribute('data-text');
  if(!text) return;
  copyToClipboard(text);
  showCopiedFeedback(btn, true);
}

function copyAllBarcodes(){
  const iso = (document.getElementById('barcode-date') || {}).value || '';
  const all = qcOrganisms.map(o => makeBarcode(o, iso)).join('\n');
  copyToClipboard(all);
  const btn = document.getElementById('barcode-copy-all');
  if(btn) showCopiedFeedback(btn, false);
}

function copyToClipboard(text){
  // Prefer the modern Clipboard API; fall back to execCommand for
  // file:// contexts or older browsers where writeText is blocked.
  if(navigator.clipboard && navigator.clipboard.writeText){
    navigator.clipboard.writeText(text).catch(() => fallbackCopy(text));
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text){
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.setAttribute('readonly','');
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  ta.style.top = '0';
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand('copy'); } catch(e) { /* swallow — user can manually copy */ }
  document.body.removeChild(ta);
}

function showCopiedFeedback(btn, iconOnly){
  const original = btn.innerHTML;
  btn.classList.add('copied');
  btn.innerHTML = iconOnly
    ? '<i class="ti ti-check" aria-hidden="true"></i>'
    : '<i class="ti ti-check" aria-hidden="true"></i> Copied';
  setTimeout(() => {
    btn.classList.remove('copied');
    btn.innerHTML = original;
  }, 1400);
}

// Initialise: default the date to today, hook change events, render once.
(function initBarcodes(){
  const inp = document.getElementById('barcode-date');
  if(!inp) return;
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  inp.value = `${y}-${m}-${d}`;
  inp.addEventListener('input', renderBarcodes);
  inp.addEventListener('change', renderBarcodes);
  renderBarcodes();
})();

renderNotesView();

// ─── Serology directory (search / filter / reference) ───────────
let serologyQuery = '';
let serologyLocFilter = 'all';   // 'all' | 'in' | 'send'
let serologyShowDisc = false;

function serologyLocBadge(loc){
  return loc === 'in'
    ? '<span class="sero-loc sero-loc-in">In-house</span>'
    : '<span class="sero-loc sero-loc-send">Sendaway</span>';
}

function renderSerology(){
  const tbody = document.getElementById('serology-tbody');
  if(!tbody) return;
  const q = serologyQuery.trim().toLowerCase();
  const rows = serologyTests.filter(t => {
    if(t.disc && !serologyShowDisc) return false;
    if(serologyLocFilter !== 'all' && t.loc !== serologyLocFilter) return false;
    if(q){
      const hay = (t.code + ' ' + t.name + ' ' + t.sample + ' ' + (t.note || '') + ' ' + (t.analyser || '')).toLowerCase();
      if(!hay.includes(q)) return false;
    }
    return true;
  });

  const countEl = document.getElementById('serology-count');
  if(countEl) countEl.textContent = `${rows.length} test${rows.length === 1 ? '' : 's'}`;

  if(!rows.length){
    tbody.innerHTML = `<tr><td colspan="5" class="sero-empty">No serology tests match — try a code, drug or organism name.</td></tr>`;
    return;
  }

  tbody.innerHTML = rows.map(t => {
    const code = t.code
      ? `<code class="sero-code">${highlightMatch(t.code, q)}</code>`
      : `<span class="sero-na">—</span>`;
    const note = t.note ? `<span class="sero-note">${t.note}</span>` : '';
    const discTag = t.disc ? `<span class="sero-disc-tag">No longer available</span>` : '';
    const sample = t.sample ? highlightMatch(t.sample, q) : `<span class="sero-na">—</span>`;
    const analyser = t.loc === 'in'
      ? (t.analyser || `<span class="sero-na">[not yet listed]</span>`)
      : `<span class="sero-na">—</span>`;
    return `<tr class="${t.disc ? 'is-disc' : ''}">
      <td>${code}</td>
      <td><span class="sero-test">${highlightMatch(t.name, q)}</span>${discTag}${note}</td>
      <td class="sero-sample">${sample}</td>
      <td>${serologyLocBadge(t.loc)}</td>
      <td class="sero-analyser">${analyser}</td>
    </tr>`;
  }).join('');
}

function setSerologyFilter(loc){
  serologyLocFilter = loc;
  ['all','in','send'].forEach(k => {
    const el = document.getElementById('sero-chip-' + k);
    if(el) el.classList.toggle('active', k === loc);
  });
  renderSerology();
}

function toggleSerologyDisc(show){
  serologyShowDisc = !!show;
  renderSerology();
}

function clearSerologySearch(){
  const input = document.getElementById('serology-search');
  if(input) input.value = '';
  serologyQuery = '';
  const clear = document.getElementById('serology-search-clear');
  if(clear) clear.classList.remove('show');
  renderSerology();
}

function renderSerologyReference(){
  const profEl = document.getElementById('serology-profiles');
  if(profEl){
    const byCode = {};
    serologyTests.forEach(t => { if(t.code && !(t.code in byCode)) byCode[t.code] = t; });
    profEl.innerHTML = serologyProfiles.map(p => `
      <div class="sero-profile">
        <div class="sero-profile-head">${p.name}${p.note ? `<span class="sero-profile-note">${p.note}</span>` : ''}</div>
        <div class="sero-profile-codes">
          ${p.codes.map(c => {
            const t = byCode[c];
            const title = t ? t.name.replace(/"/g, '&quot;') : c;
            return `<span class="sero-pill" title="${title}">${c}</span>`;
          }).join('')}
        </div>
      </div>
    `).join('');
  }
  const keyEl = document.getElementById('serology-key');
  if(keyEl){
    keyEl.innerHTML = serologySampleKey.map(k =>
      `<div class="sero-key-row"><span class="sero-key-abbr">${k.abbr}</span><span class="sero-key-label">${k.label}</span></div>`
    ).join('');
  }
}

(function initSerology(){
  const input = document.getElementById('serology-search');
  if(input){
    input.addEventListener('input', e => {
      serologyQuery = e.target.value;
      const clear = document.getElementById('serology-search-clear');
      if(clear) clear.classList.toggle('show', e.target.value.length > 0);
      renderSerology();
    });
  }
  renderSerologyReference();
  renderSerology();
})();

// ═══════════════════════════════════════════════
// v5 — Glossary, Index, Search, Keyboard, Detail polish
// ═══════════════════════════════════════════════

// Build antibiotic index from fcPanels.
// Strategy: walk every panel's abx[], normalise (strip strength/notes), accumulate panels under each normalised name.
function buildAntibioticIndex(){
  const idx={};
  // Map of canonical names — normalise variants together
  const canonicalise = (raw) => {
    let s = raw
      .replace(/\s*\([^)]*\)/g,'')           // remove parentheticals
      .replace(/\s+MIC\b.*$/i,'')             // strip "MIC ..." and trailing MIC (covers "MIC ± EDTA synergy" etc.)
      .replace(/\s+\d.*$/,'')                 // strip from first numeric token to end (strengths, disc descriptions)
      .replace(/\s+disc.*$/i,'')              // safety: strip any remaining " disc ..." tail
      .replace(/\s*\/\s*/g,'/')
      .replace(/\s+/g,' ')
      .trim();
    // Synonyms
    const syn = {
      'Augmentin':'Amoxicillin/Clavulanic acid',
      'AmoxClav':'Amoxicillin/Clavulanic acid',
      'Co-trimoxazole':'Co-trimoxazole (TMP-SMX)',
      'Sulphamethoxazole/Trimethoprim':'Co-trimoxazole (TMP-SMX)',
      'Septrin':'Co-trimoxazole (TMP-SMX)',
      'Caz/Avi':'Ceftazidime/Avibactam',
      'Ceftaz/Avi':'Ceftazidime/Avibactam',
      'Ceftol/Taz':'Ceftolozane/Tazobactam',
      'Pip/Taz':'Piperacillin/Tazobactam',
      'Ticar/Clav':'Ticarcillin/Clavulanic acid',
      'Fucidin':'Fusidic acid',
      'Fucidic acid':'Fusidic acid',
      'Cipro':'Ciprofloxacin',
      'Mero':'Meropenem',
      'Amp':'Ampicillin',
      'Gent':'Gentamicin',
      'Tobra':'Tobramycin',
      'Ami':'Amikacin',
      'Atm':'Aztreonam',
      'Fos':'Fosfomycin',
      'Tig':'Tigecycline',
      'Vanc':'Vancomycin',
      'Teico':'Teicoplanin',
      'Dapto':'Daptomycin',
      'Chlor':'Chloramphenicol',
      'Norflox':'Norfloxacin',
      'Peflox':'Pefloxacin',
      'Nalidix':'Nalidixic acid',
      'Pen':'Penicillin',
      'Benzylpen':'Benzylpenicillin',
      'Ery':'Erythromycin',
      'Clin':'Clindamycin',
      'Rif':'Rifampicin',
      'Mecillinam':'Mecillinam (pivmecillinam)'
    };
    return syn[s] || s;
  };
  Object.entries(fcPanels).forEach(([key,p])=>{
    if(!p || !p.abx || p.reagents || p.title==='') return; // skip reagent panels and sentinel
    p.abx.forEach(a=>{
      // Some entries are like "ESP1: Ampicillin · Levofloxacin · Nitrofurantoin"
      // Split on '·' if present, else treat as one entry
      const parts = a.includes('·') ? a.split(/\s*·\s*/) : [a];
      parts.forEach(part=>{
        // Strip leading panel prefix like "ESP1: " or "Pseudo1: "
        const cleaned = part.replace(/^[A-Za-z0-9/]+\s*\d*\s*:\s*/,'').trim();
        if(!cleaned) return;
        // Some are descriptors like "Indole reagent (Kovács...)" - skip if not a known abx-looking term
        if(/reagent|test|stain|culture|MALDI|gram|haemolysis|pcr|optochin|bile|nitrocefin|pyr|camp|x factor|v factor|xv combined|species id|aerotolerance|β-lactamase test|catalase|dnase agar|staph latex|specimen type|gram stain/i.test(cleaned)) return;
        const c = canonicalise(cleaned);
        if(!c) return;
        if(!idx[c]) idx[c]=new Set();
        idx[c].add(key);
      });
    });
  });
  // Convert sets to arrays
  const out=[];
  Object.keys(idx).sort((a,b)=>a.localeCompare(b)).forEach(name=>{
    out.push({name,panels:[...idx[name]]});
  });
  return out;
}

// Build organism index from orgFlows + orgFlowsWound dropdowns + plate organisms.
function renderAbxIndex(){
  const data = buildAntibioticIndex();
  const el = document.getElementById('idx-abx-list');
  el.innerHTML = data.map(row=>{
    const pills = row.panels.map(k=>{
      const t = (fcPanels[k]&&fcPanels[k].title) || k;
      return `<span class="idx-panel-pill" onclick="event.stopPropagation();showDetail('${k}')">${t}</span>`;
    }).join('');
    return `<div class="idx-row"><div class="idx-name">${row.name}</div><div class="idx-panels">${pills}</div></div>`;
  }).join('');
}

function renderOrganismIndex(){
  const el = document.getElementById('idx-org-list');
  el.innerHTML = organismIndexEntries.map(sec=>{
    const items = sec.items.map(it=>{
      const target = it.key;
      return `<div class="idx-row" onclick="showDetail('${target}')"><div class="idx-name">${it.name}</div><div class="idx-panels"><span class="idx-panel-pill">open panel ↗</span></div></div>`;
    }).join('');
    return `<div class="idx-section-title">${sec.section}</div>${items}`;
  }).join('');
}

function renderGlossary(){
  const el = document.getElementById('idx-gloss-list');
  const groups = {};
  glossary.forEach(it=>{(groups[it.g]=groups[it.g]||[]).push(it);});
  el.innerHTML = Object.entries(groups).map(([g,items])=>{
    return `<div class="idx-section-title">${g}</div>` +
      items.map(i=>`<div class="gloss-row" data-term="${i.t.toLowerCase()}"><div class="gloss-term">${i.t}</div><div class="gloss-def">${i.d}</div></div>`).join('');
  }).join('');
}

function setIdxTab(id){
  document.querySelectorAll('.idx-tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.idx-panel').forEach(p=>p.classList.remove('active'));
  document.getElementById('idxtab-'+id).classList.add('active');
  document.getElementById('idxpanel-'+id).classList.add('active');
  if(id==='gloss' && lastSearchQuery) applyGlossarySearchHighlight(lastSearchQuery, {scroll:false});
}

// Render index/glossary content once at load (idempotent — safe even though hidden)
renderAbxIndex();
renderOrganismIndex();
renderGlossary();
renderRules();

// ─── Detail panel: close + copy ────────────────
let currentDetailKey = null;
const origShowDetail = showDetail;
showDetail = function(key){
  currentDetailKey = key;
  origShowDetail(key);
  if(typeof pushRecent === 'function') pushRecent(key);
  const btn = document.getElementById('d-copy');
  if(btn){btn.classList.remove('copied');btn.innerHTML='<i class="ti ti-copy" aria-hidden="true"></i> Copy panel summary';}
};
function closeDetail(){
  const d = document.getElementById('detail-fc');
  d.style.display='none';
  currentDetailKey = null;
}
function copyDetail(){
  if(!currentDetailKey)return;
  const p = fcPanels[currentDetailKey];
  if(!p)return;
  const txt = `${p.title}\n${p.sub}\n\nAgents/items:\n${p.abx.map(a=>'  • '+a).join('\n')}\n\nNotes: ${p.notes}`;
  navigator.clipboard.writeText(txt).then(()=>{
    const btn = document.getElementById('d-copy');
    btn.classList.add('copied');
    btn.innerHTML='<i class="ti ti-check" aria-hidden="true"></i> Copied to clipboard';
    setTimeout(()=>{btn.classList.remove('copied');btn.innerHTML='<i class="ti ti-copy" aria-hidden="true"></i> Copy panel summary';},1800);
  }).catch(()=>{
    const btn = document.getElementById('d-copy');
    btn.innerHTML='<i class="ti ti-alert-circle" aria-hidden="true"></i> Copy failed';
    setTimeout(()=>{btn.innerHTML='<i class="ti ti-copy" aria-hidden="true"></i> Copy panel summary';},1800);
  });
}


// ─── Bacterial identification finder ──────────
bactIdOrganisms.forEach(o=>{
  if(!Object.prototype.hasOwnProperty.call(o,'tributyrin')){
    o.tributyrin = bactIdTributyrinMap[o.name] || 'not-recorded';
  }
});

bactIdOrganisms.forEach(o=>{
  if(!Object.prototype.hasOwnProperty.call(o,'hughleifson')){
    o.hughleifson = bactIdHughLeifsonMap[o.name] || 'not-recorded';
  }
});

function bidVal(v){return Array.isArray(v)?v:[v];}
function bidPretty(v){return bidVal(v).filter(x=>x && x !== 'not-recorded').map(x=>String(x).replace('GP','Gram +').replace('GN','Gram −').replace('GV','Gram variable').replace('co2','CO₂').replace('anaerobic','AnO₂').replace('facultative','facultative').replace('microaerophilic','microaerophilic').replace('fermentative','fermentative').replace('oxidative','oxidative').replace('asaccharolytic','asaccharolytic')).join(' / ');}
function bidMatchesValue(orgVal, wanted){
  if(!wanted) return true;
  const vals = bidVal(orgVal).filter(x=>x && x !== 'not-recorded').map(x=>String(x).toLowerCase());
  return vals.includes(wanted) || vals.includes('variable');
}
function resetBactIdFilters(){
  bactIdFields.forEach(f=>{const el=document.getElementById('bid-'+f); if(el) el.value='';});
  const t=document.getElementById('bactid-text'); if(t) t.value='';
  renderBactId();
}
function renderBactId(){
  const box=document.getElementById('bactid-results');
  if(!box) return;
  const q=(document.getElementById('bactid-text')?.value || '').trim().toLowerCase();
  const filters={};
  bactIdFields.forEach(f=>{filters[f]=(document.getElementById('bid-'+f)?.value || '').toLowerCase();});
  const activeCount = Object.values(filters).filter(Boolean).length + (q?1:0);
  const matches=bactIdOrganisms.filter(o=>{
    const traitOk = bactIdFields.every(f=>bidMatchesValue(o[f], filters[f]));
    if(!traitOk) return false;
    if(!q) return true;
    const hay = (o.name+' '+o.group+' '+(o.note||'')+' '+bactIdFields.map(f=>bidPretty(o[f])).join(' ')).toLowerCase();
    return hay.includes(q);
  }).sort((a,b)=>a.name.localeCompare(b.name));
  document.getElementById('bactid-count').textContent = `${matches.length} organism${matches.length===1?'':'s'} shown${activeCount?` · ${activeCount} active filter${activeCount===1?'':'s'}`:''}`;
  if(matches.length===0){
    box.innerHTML='<div class="bactid-empty">No organisms match that combination. Try clearing one low-confidence result or using “variable” where the reaction is uncertain.</div>';
    return;
  }
  box.innerHTML = matches.map(o=>{
    const tag = (label,val) => { const pretty = bidPretty(val); return pretty ? `${label}${pretty}` : ''; };
    const tags = [bidPretty(o.gram), bidPretty(o.shape), tag('Ox ',o.oxidase), tag('Cat ',o.catalase), tag('Ind ',o.indole), tag('Ferment ',o.fermentation), tag('Haem ',o.haemolysis), tag('Atm ',o.atmosphere)].filter(Boolean);
    const extra = [tag('Coag ',o.coagulase),tag('Aesc ',o.aesculin),tag('PYR ',o.pyr),tag('Spores ',o.spores),tag('DNase ',o.dnase),tag('Tributyrin ',o.tributyrin),tag('H&L ',o.hughleifson),tag('MR ',o.mr),tag('VP ',o.vp),tag('Citrate ',o.citrate)].filter(Boolean);
    return `<article class="bactid-card"><h3>${o.name}</h3><div class="bactid-meta">${o.group}</div><div class="bactid-tags">${tags.concat(extra).map(t=>`<span class="bactid-tag">${t}</span>`).join('')}</div><div class="bactid-note">${o.note}</div></article>`;
  }).join('');
}

renderBactId();
renderMycology();
renderBloodScience();

// ─── Global search ─────────────────────────────
// Index built once. Re-uses fcPanels, glossary, organismIndexEntries, organisms.
let searchIndex = null;
function buildSearchIndex(){
  const out = [];
  // Panels
  Object.entries(fcPanels).forEach(([k,p])=>{
    if(!p || !p.title) return;
    out.push({
      kind:'panel',
      key:k,
      name:p.title,
      snippet:p.sub || '',
      hay:(p.title+' '+(p.sub||'')+' '+(p.abx||[]).join(' ')+' '+(p.notes||'')).toLowerCase(),
      action:()=>{
        if(k.startsWith('viro_') && curView !== 'virology'){
          switchView('virology');
          setTimeout(()=>showDetail(k), 360);
        } else {
          showDetail(k);
        }
      }
    });
  });
  // Plate organisms
  Object.entries(organisms).forEach(([k,o])=>{
    if(o.isNote)return;
    out.push({
      kind:'organism',
      key:k,
      name:o.name + ' (plate)',
      snippet:(o.features||[]).join(' · '),
      hay:(o.name+' '+(o.features||[]).join(' ')+' '+(o.description||'')).toLowerCase(),
      action:()=>{
        switchView('plate');
        setTimeout(()=>{
          if(o.medium && o.medium!==curMedium) setPlateMedium(o.medium);
          setPlateOrganism(k);
        },340);
      }
    });
  });
  // Bacterial ID finder organisms
  bactIdOrganisms.forEach(o=>{
    out.push({
      kind:'bactid',
      key:o.name,
      name:o.name+' — bacterial ID',
      snippet:o.group+' · '+(o.note||'').slice(0,90),
      hay:(o.name+' '+o.group+' '+(o.note||'')+' '+bactIdFields.map(f=>bidPretty(o[f])).join(' ')).toLowerCase(),
      action:()=>{
        switchView('bactid');
        setTimeout(()=>{
          const t=document.getElementById('bactid-text');
          if(t){t.value=o.name.split(' ')[0]; renderBactId();}
        },340);
      }
    });
  });

  // Mycology disease and fungus cards
  if(typeof mycoDiseases !== 'undefined' && typeof mycoFungi !== 'undefined'){
    mycoDiseases.forEach(d=>{
      const fungi=d.fungi.map(k=>mycoFungi[k]).filter(Boolean);
      out.push({kind:'mycology',key:d.name,name:d.name+' — mycology',snippet:d.signs,hay:(d.name+' '+d.site+' '+d.signs+' '+d.source+' '+fungi.map(f=>f.name+' '+f.genus+' '+f.reservoir).join(' ')).toLowerCase(),action:()=>{switchView('myco');setTimeout(()=>{const t=document.getElementById('myco-search');if(t){t.value=d.name;renderMycology();}},340);}});
    });
    Object.entries(mycoFungi).forEach(([k,f])=>{
      out.push({kind:'fungus',key:k,name:f.name+' — microscopy',snippet:f.reservoir+' · '+f.micro.slice(0,90),hay:(f.name+' '+f.genus+' '+f.reservoir+' '+f.macro+' '+f.micro+' '+f.clues.join(' ')).toLowerCase(),action:()=>{switchView('myco');setTimeout(()=>{const t=document.getElementById('myco-search');if(t){t.value=f.name;renderMycology();}showMycoFungus(k);},340);}});
    });
  }

  // Blood Science tests
  if(typeof bloodTests !== 'undefined'){
    bloodTests.forEach((t,idx)=>{
      const d=bloodDisciplines[t.discipline]||{};
      const b=bloodTubes[t.tube]||{};
      out.push({
        kind:'blood science',
        key:t.name,
        name:t.name+' — Blood Science',
        snippet:(d.name||t.discipline)+' · '+(b.short||b.name||t.tube)+' · '+t.use.slice(0,90),
        hay:(t.name+' '+t.abbr+' '+(d.name||'')+' '+(b.name||'')+' '+(b.additive||'')+' '+t.why+' '+t.use+' '+t.explain+' '+(t.notes||[]).join(' ')).toLowerCase(),
        action:()=>{switchView('blood');setTimeout(()=>{const q=document.getElementById('blood-text');if(q){q.value=t.name;renderBloodScience();}showBloodTest(idx);},340);}
      });
    });
  }

  // Gram stain / microscopy patterns
  if(typeof gramPatterns !== 'undefined'){
    gramPatterns.forEach(p=>{
      const gl={pos:'Gram-positive',neg:'Gram-negative',variable:'Gram-variable'}[p.gram]||'';
      out.push({
        kind:'gram',
        key:p.id,
        name:p.name+' — Gram film',
        snippet:gl+' · '+p.organisms.slice(0,3).join(' · '),
        hay:(p.name+' '+gl+' '+p.form+' '+p.organisms.join(' ')+' '+p.clues.join(' ')+' gram stain microscopy '+p.description).toLowerCase(),
        action:()=>{switchView('plate');setTimeout(()=>{setPlateSection('gram');const t=document.getElementById('gram-search');if(t){t.value=p.name;renderGram();}showGramPattern(p.id);},360);}
      });
    });
  }
  // Glossary
  glossary.forEach(it=>{
    out.push({
      kind:'glossary',
      key:it.t,
      name:it.t,
      snippet:it.d.slice(0,120)+(it.d.length>120?'…':''),
      hay:(it.t+' '+it.d+' '+it.g).toLowerCase(),
      action:()=>{switchView('index');setTimeout(()=>{setIdxTab('gloss');highlightGlossaryTerm(it.t);},340);}
    });
  });
  // Expected resistant phenotypes / intrinsic resistance
  if(typeof expectedPhenotypes !== 'undefined'){
    expectedPhenotypes.forEach(o=>{
      out.push({
        kind:'intrinsic',
        key:o.id,
        name:o.name+' — intrinsic resistance',
        snippet:'Do not report S: '+o.resist.slice(0,3).join(' · '),
        hay:(o.name+' '+(o.aka||'')+' intrinsic resistance expected phenotype '+o.resist.join(' ')+' '+o.rules.join(' ')).toLowerCase(),
        action:()=>{switchView('rules');setTimeout(()=>{const t=document.getElementById('rules-search');if(t){t.value=o.name;renderRules();}showRulesOrg(o.id);},340);}
      });
    });
  }
  // Antifungal agents (panels live in fcPanels with af_/afr_ keys)
  if(typeof fcPanels !== 'undefined'){
    Object.keys(fcPanels).filter(k=>k.indexOf('af_')===0||k.indexOf('afr_')===0).forEach(k=>{
      const p=fcPanels[k];
      out.push({
        kind:'antifungal',
        key:k,
        name:p.title+' — antifungal',
        snippet:p.sub,
        hay:(p.title+' '+p.sub+' '+p.abx.join(' ')+' '+p.notes+' antifungal').toLowerCase(),
        action:()=>{switchView('myco');setTimeout(()=>{setMycoTab('afst');showDetail(k);},360);}
      });
    });
  }
  // Organism dropdown pathways (urine + wound)
  organismIndexEntries.forEach(sec=>{
    sec.items.forEach(it=>{
      out.push({
        kind:'pathway',
        key:it.key,
        name:it.name+' — '+sec.section.toLowerCase(),
        snippet:'',
        hay:(it.name+' '+sec.section).toLowerCase(),
        action:()=>showDetail(it.key)
      });
    });
  });
  // Antibiotic classes and individual chips
  abxClasses.forEach(c=>{
    const allItems = c.subgroups.flatMap(sg=>sg.items);
    out.push({
      kind:'abx-class',
      key:c.id,
      name:c.name+' — class',
      snippet:c.family+' · target: '+c.target.replace(/<[^>]+>/g,''),
      hay:(c.name+' '+c.family+' '+c.target+' '+c.chemistry+' '+c.mechanism+' '+c.spectrum+' '+c.resistance+' '+allItems.map(i=>i.name+' '+(i.aka||'')).join(' ')).toLowerCase().replace(/<[^>]+>/g,''),
      action:()=>{switchView('abx');setTimeout(()=>{selectAbxClass(c.id);document.getElementById('abxrow-'+c.id).scrollIntoView({behavior:'smooth',block:'start'});},340);}
    });
    // Also index individual antibiotics so a search for e.g. "tigecycline" surfaces the chip
    c.subgroups.forEach(sg=>{
      sg.items.forEach(it=>{
        out.push({
          kind:'antibiotic',
          key:c.id+':'+it.name,
          name:it.name+(it.aka?' ('+it.aka+')':'')+' — '+c.name.toLowerCase(),
          snippet:(it.tip||'').replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,120),
          hay:(it.name+' '+(it.aka||'')+' '+abxAliasText(it.name)+' '+(it.tip||'').replace(/<[^>]+>/g,' ')+' '+c.name+' '+sg.label).toLowerCase(),
          action:()=>{
            switchView('abx');
            setTimeout(()=>{
              selectAbxClass(c.id);
              setTimeout(()=>{
                const chip = document.querySelector(`.abx-chip[data-class="${c.id}"][data-name="${it.name}"]`);
                if(chip){
                  chip.scrollIntoView({behavior:'smooth',block:'center'});
                  // Use the floating tip system: mark stuck + show
                  document.querySelectorAll('.abx-chip.stuck').forEach(c => c.classList.remove('stuck'));
                  chip.classList.add('stuck');
                  // Wait for scroll to settle before placing the tip
                  setTimeout(()=>showFloatTip(chip), 380);
                  // auto-dismiss after a beat
                  setTimeout(()=>{
                    chip.classList.remove('stuck');
                    hideFloatTip();
                  }, 4200);
                }
              },280);
            },340);
          }
        });
      });
    });
  });

  // ── Serology tests ──
  if(typeof serologyTests !== 'undefined'){
    serologyTests.forEach(t => {
      if(t.disc) return;            // skip discontinued tests in global search
      const loc = t.loc === 'in' ? 'In-house' : 'Sendaway';
      out.push({
        kind:'serology',
        key:'serology_' + (t.code || t.name),
        name:t.name,
        snippet:[t.code, loc, t.sample].filter(Boolean).join(' · '),
        hay:(t.code + ' ' + t.name + ' ' + t.sample + ' ' + (t.note || '') + ' serology').toLowerCase(),
        action:()=>{
          switchView('serology');
          setTimeout(()=>{
            const inp = document.getElementById('serology-search');
            setSerologyFilter('all');
            if(inp){ inp.value = t.code || t.name; serologyQuery = inp.value; }
            const clr = document.getElementById('serology-search-clear');
            if(clr) clr.classList.add('show');
            renderSerology();
          }, 360);
        }
      });
    });
  }

  return out;
}

function highlightGlossaryTerm(term){
  document.querySelectorAll('.gloss-row').forEach(r=>r.style.outline='');
  const row = document.querySelector(`.gloss-row[data-term="${term.toLowerCase()}"]`);
  if(row){
    row.style.outline='2px solid var(--color-border-info)';
    row.style.outlineOffset='2px';
    row.scrollIntoView({behavior:'smooth',block:'center'});
    setTimeout(()=>{row.style.outline='';row.style.outlineOffset='';},2400);
  }
}

let searchFocusIdx = -1;
let lastResults = [];
let lastSearchQuery = '';
let glossaryCycleQuery = '';
let glossaryCycleIndex = -1;

// ─── Glossary search highlight ────────────────
function escapeRegex(s){return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}

function clearGlossaryHighlightMarks(){
  // unwrap any existing <span class="gloss-search-hl"> spans, restoring plain text
  document.querySelectorAll('#idx-gloss-list .gloss-search-hl').forEach(s=>{
    const tn = document.createTextNode(s.textContent);
    s.parentNode.replaceChild(tn,s);
  });
  document.querySelectorAll('#idx-gloss-list .gloss-row').forEach(r=>{
    r.classList.remove('has-search-match','gloss-current-match');
    r.normalize();
  });
}

function applyGlossarySearchHighlight(q, opts){
  opts = opts || {};
  const shouldScroll = opts.scroll === true;
  clearGlossaryHighlightMarks();
  const banner = document.getElementById('gloss-search-banner');
  if(!q || q.length<2){banner.classList.remove('show');return 0;}
  const re = new RegExp(escapeRegex(q),'gi');
  let matchedRows = 0;
  document.querySelectorAll('#idx-gloss-list .gloss-row').forEach(row=>{
    let rowHasMatch = false;
    row.querySelectorAll('.gloss-term, .gloss-def').forEach(el=>{
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
      const textNodes = [];
      let n;
      while((n = walker.nextNode())) textNodes.push(n);
      textNodes.forEach(node=>{
        const text = node.nodeValue;
        re.lastIndex = 0;
        if(!re.test(text)) return;
        re.lastIndex = 0;
        const frag = document.createDocumentFragment();
        let last = 0, m;
        while((m = re.exec(text))){
          if(m.index>last) frag.appendChild(document.createTextNode(text.slice(last,m.index)));
          const span = document.createElement('span');
          span.className = 'gloss-search-hl';
          span.textContent = m[0];
          frag.appendChild(span);
          last = m.index + m[0].length;
          rowHasMatch = true;
        }
        if(last<text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag,node);
      });
    });
    if(rowHasMatch){row.classList.add('has-search-match');matchedRows++;}
  });
  banner.classList.add('show');
  document.getElementById('gsb-term').textContent = q;
  document.getElementById('gsb-count').textContent =
    matchedRows===0 ? '— no entries contain this term' :
    matchedRows===1 ? '— 1 entry (press Enter)' : `— ${matchedRows} entries (press Enter to cycle)`;
  // Only scroll when explicitly requested (Enter / tab switch / view switch),
  // never on live keystroke updates — keeps the user's cursor stable while typing.
  if(shouldScroll && matchedRows>0){
    const glossPanel = document.getElementById('idxpanel-gloss');
    if(glossPanel && glossPanel.classList.contains('active')){
      const first = document.querySelector('#idx-gloss-list .gloss-row.has-search-match');
      if(first) setTimeout(()=>first.scrollIntoView({behavior:'smooth',block:'center'}),60);
    }
  }
  return matchedRows;
}

function getGlossaryMatchRows(){
  return Array.from(document.querySelectorAll('#idx-gloss-list .gloss-row.has-search-match'));
}

function cycleGlossaryMatch(q){
  if(!q || q.length < 2) return;
  applyGlossarySearchHighlight(q, {scroll:false});
  const rows = getGlossaryMatchRows();
  document.querySelectorAll('#idx-gloss-list .gloss-row.gloss-current-match').forEach(r=>r.classList.remove('gloss-current-match'));
  if(!rows.length) return;
  if(glossaryCycleQuery !== q){
    glossaryCycleQuery = q;
    glossaryCycleIndex = -1;
  }
  glossaryCycleIndex = (glossaryCycleIndex + 1) % rows.length;
  const row = rows[glossaryCycleIndex];
  row.classList.add('gloss-current-match');
  row.scrollIntoView({behavior:'smooth', block:'center'});
  const count = document.getElementById('gsb-count');
  if(count) count.textContent = rows.length === 1 ? '— 1 entry' : `— ${glossaryCycleIndex + 1} of ${rows.length} entries`;
}

function jumpToGlossaryMatches(){
  if(!lastSearchQuery || lastSearchQuery.length<2) return;
  closeSearchDropdown();
  const input = document.getElementById('global-search');
  if(input && input === document.activeElement) input.blur();
  const q = lastSearchQuery;
  if(curView !== 'index'){
    switchView('index');
    setTimeout(()=>{setIdxTab('gloss'); cycleGlossaryMatch(q);},360);
  } else {
    setIdxTab('gloss');
    setTimeout(()=>cycleGlossaryMatch(q),40);
  }
}

function clearGlossaryHighlight(){
  lastSearchQuery = '';
  glossaryCycleQuery = '';
  glossaryCycleIndex = -1;
  applyGlossarySearchHighlight('', {scroll:false});
}

function runSearch(q){
  if(!searchIndex) searchIndex = buildSearchIndex();
  const results = document.getElementById('search-results');
  const clear = document.getElementById('search-clear');
  q = q.trim().toLowerCase();
  clear.classList.toggle('show',q.length>0);
  if(q.length<2){
    results.classList.remove('show');
    results.innerHTML='';
    lastResults = [];
    searchFocusIdx = -1;
    if(q.length===0){
      // User fully cleared the input — drop the saved query and any glossary highlight.
      lastSearchQuery = '';
      glossaryCycleQuery = '';
      glossaryCycleIndex = -1;
      applyGlossarySearchHighlight('', {scroll:false});
    }
    return;
  }
  if(q !== lastSearchQuery){glossaryCycleQuery='';glossaryCycleIndex=-1;}
  lastSearchQuery = q;
  applyGlossarySearchHighlight(q, {scroll:false});
  const matches = searchIndex
    .map(it=>{
      const idx = it.hay.indexOf(q);
      if(idx===-1) return null;
      // simple ranking: name match > snippet > body
      const nameMatch = it.name.toLowerCase().indexOf(q);
      const score = (nameMatch===0?0:nameMatch>-1?1:2) + (idx/1000);
      return {it,score};
    })
    .filter(Boolean)
    .sort((a,b)=>a.score-b.score)
    .slice(0,12)
    .map(x=>x.it);
  lastResults = matches;
  searchFocusIdx = -1;
  if(matches.length===0){
    const safe = q.replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    results.innerHTML =
      '<div class="search-empty">'
      + '<i class="ti ti-search-off search-empty-icon" aria-hidden="true"></i>'
      + '<div class="search-empty-title">No matches for &ldquo;<span class="search-empty-term">'+safe+'</span>&rdquo;</div>'
      + '<div class="search-empty-hint">Searches panels, antibiotics, organisms, Gram films, blood tests, abbreviations &amp; intrinsic-resistance rules. Try a shorter term, an abbreviation (e.g. ESBL, MIC), or a drug/organism name.</div>'
      + '</div>';
    results.classList.add('show');
    return;
  }
  results.innerHTML = matches.map((m,i)=>{
    const kindLabel = {panel:'Panel',organism:'Plate organism',glossary:'Glossary',pathway:'Pathway','abx-class':'Antibiotic class',antibiotic:'Antibiotic',bactid:'Bacterial ID',intrinsic:'Intrinsic resistance',antifungal:'Antifungal',gram:'Gram film',serology:'Serology test'}[m.kind] || m.kind;
    const name = highlightMatch(m.name, q);
    const snip = m.snippet ? `<div class="sr-snip">${highlightMatch(m.snippet, q)}</div>` : '';
    return `<div class="search-result" data-idx="${i}" onclick="selectResult(${i})"><div class="sr-kind">${kindLabel}</div><div class="sr-name">${name}</div>${snip}</div>`;
  }).join('');
  results.classList.add('show');
}

function highlightMatch(text,q){
  if(!q) return text;
  const i = text.toLowerCase().indexOf(q.toLowerCase());
  if(i===-1) return text;
  return text.slice(0,i)+'<span class="highlight">'+text.slice(i,i+q.length)+'</span>'+text.slice(i+q.length);
}

function selectResult(i){
  const m = lastResults[i];
  if(!m) return;
  // Preserve lastSearchQuery so the user's chosen destination view (e.g. glossary)
  // can keep highlighting matches even after the dropdown closes.
  closeSearchDropdown();
  m.action();
}

function closeSearchDropdown(){
  document.getElementById('search-results').classList.remove('show');
  lastResults = [];
  searchFocusIdx = -1;
}

function clearSearch(){
  const input = document.getElementById('global-search');
  input.value='';
  document.getElementById('search-results').classList.remove('show');
  document.getElementById('search-clear').classList.remove('show');
  lastResults = [];
  searchFocusIdx = -1;
  // The × button is an explicit "wipe everything" — also clear the glossary highlight.
  lastSearchQuery = '';
  applyGlossarySearchHighlight('', {scroll:false});
}


document.getElementById('global-search').addEventListener('input',e=>runSearch(e.target.value));
document.getElementById('global-search').addEventListener('focus',e=>{if(e.target.value.length>=2)runSearch(e.target.value);});
document.addEventListener('click',e=>{
  const wrap = document.querySelector('.search-wrap');
  if(wrap && !wrap.contains(e.target)){
    document.getElementById('search-results').classList.remove('show');
  }
  const inAnyNavMenu = navMenus.some(m=>{
    const el=document.getElementById(m.id);
    const lst=document.getElementById(m.id+'-list');   // portaled to <body>
    return (el&&el.contains(e.target))||(lst&&lst.contains(e.target));
  });
  if(!inAnyNavMenu){
    closeAllNavMenus();
  }
});
window.addEventListener('resize',()=>{if(anyNavMenuOpen())repositionOpenNavMenus();},{passive:true});
window.addEventListener('scroll',()=>{if(anyNavMenuOpen())repositionOpenNavMenus();},{passive:true});
// The pill row scrolls horizontally on narrow screens — keep any open dropdown
// anchored to its trigger while the row slides.
(function(){const pills=document.querySelector('.switcher-pills');if(pills)pills.addEventListener('scroll',()=>{if(anyNavMenuOpen())repositionOpenNavMenus();},{passive:true});})();

// ─── Keyboard shortcuts ────────────────────────
document.addEventListener('keydown',e=>{
  const tag = document.activeElement && document.activeElement.tagName;
  const inField = tag==='INPUT' || tag==='TEXTAREA' || tag==='SELECT';

  // Esc: close detail, clear/blur search
  if(e.key==='Escape'){
    const dfc = document.getElementById('detail-fc');
    if(anyNavMenuOpen()){closeAllNavMenus();return;}
    if(dfc && dfc.style.display==='block'){closeDetail();return;}
    const rd = document.getElementById('rules-detail');
    if(rd && rd.style.display==='block'){hideRulesOrg();return;}
    if(inField && tag==='INPUT'){document.activeElement.blur();clearSearch();return;}
    document.getElementById('search-results').classList.remove('show');
    return;
  }

  // '/' focuses search (when not already in a field)
  if(e.key==='/' && !inField){
    e.preventDefault();
    document.getElementById('global-search').focus();
    return;
  }

  // Search results arrow navigation
  const results = document.getElementById('search-results');
  if(results.classList.contains('show') && lastResults.length){
    if(e.key==='ArrowDown'){e.preventDefault();searchFocusIdx=Math.min(searchFocusIdx+1,lastResults.length-1);updateSearchFocus();return;}
    if(e.key==='ArrowUp'){e.preventDefault();searchFocusIdx=Math.max(searchFocusIdx-1,0);updateSearchFocus();return;}
    if(e.key==='Enter' && searchFocusIdx>=0){e.preventDefault();selectResult(searchFocusIdx);return;}
  }

  // Enter in search input with no focused dropdown row → jump to glossary
  // matches (this is the only path that triggers auto-scroll).
  if(e.key==='Enter' && inField && document.activeElement.id==='global-search'){
    e.preventDefault();
    jumpToGlossaryMatches();
    return;
  }

  // Enter while already in the Glossary view: cycle the current search term
  // without requiring the user to scroll back to and refocus the search input.
  if(e.key==='Enter' && !inField && tag!=='BUTTON' && tag!=='A'){
    const glossPanel = document.getElementById('idxpanel-gloss');
    const onGlossary = curView === 'index' && glossPanel && glossPanel.classList.contains('active');
    if(onGlossary && lastSearchQuery && lastSearchQuery.length >= 2){
      e.preventDefault();
      cycleGlossaryMatch(lastSearchQuery);
      return;
    }
  }

  // Number keys 1-9 and 0: switch view (only when not in a field)
  if(!inField && /^[0-9]$/.test(e.key)){
    const map={'1':'flow','2':'wound','3':'interp','4':'abx','5':'plate','6':'bactid','7':'virology','8':'blood','9':'myco','0':'index'};
    if(map[e.key]) switchView(map[e.key]);
  }
  // 'N' / 'n' toggles the bench-notes view
  if(!inField && (e.key==='n' || e.key==='N')){
    e.preventDefault();
    toggleNotesView();
  }
});

function updateSearchFocus(){
  document.querySelectorAll('.search-result').forEach((el,i)=>{
    el.classList.toggle('focus',i===searchFocusIdx);
    if(i===searchFocusIdx) el.scrollIntoView({block:'nearest'});
  });
}

// ─── Sticky top-region offset measurement ──────────────────────────────
// The top nav (now including the global search row) is position:sticky at
// top:0. The bench-notes quick-nav sticks directly beneath it, and jump-to
// targets must clear both. These heights change with viewport width (wrapping)
// and after web fonts load, so measure them and expose as CSS custom
// properties consumed by styles.css:
//   --sticky-top           → top offset for the sticky quick-nav  (= nav height)
//   --notes-scroll-offset  → scroll-margin-top for jump targets   (= nav + quick-nav)
function updateStickyOffsets(){
  const root = document.documentElement;
  const nav = document.querySelector('.top-nav');
  const qnav = document.querySelector('#view-notes .notes-quick-nav');
  const navH = nav ? nav.getBoundingClientRect().height : 0;
  let qnavH = 0;
  if(qnav){
    const cs = getComputedStyle(qnav);
    if(cs.display !== 'none') qnavH = qnav.getBoundingClientRect().height;
  }
  root.style.setProperty('--sticky-top', Math.round(navH) + 'px');
  root.style.setProperty('--notes-scroll-offset', Math.round(navH + qnavH + 12) + 'px');
}
updateStickyOffsets();
window.addEventListener('resize', updateStickyOffsets, {passive:true});
window.addEventListener('load', updateStickyOffsets);
if(document.fonts && document.fonts.ready){ document.fonts.ready.then(updateStickyOffsets); }

// Sync the grouped nav triggers (labels + active states) to the initial view.
updateNavMenus(curView);




// ═══════════════════════════════════════════════════════════════════════
// ZONE-DIAMETER S/I/R CHECKER  (added v25)
// Data-driven from sirBreakpoints in data.js. Category is derived per
// EUCAST disc-diffusion logic. Validation state is read from each agent's
// `ok` flag in data.js — the only authoritative "this value is checked"
// signal — so signing a value off is a deliberate, persistent edit rather
// than a transient click. The view stays visibly unauthoritative until done.
// ═══════════════════════════════════════════════════════════════════════
let checkerGroup = null;
const checkerZones = {};   // `${groupId}:${idx}` -> entered mm (session only)

function checkerStats(){
  let total = 0, ok = 0;
  (sirBreakpoints.groups||[]).forEach(g=>g.agents.forEach(a=>{ total++; if(a.ok) ok++; }));
  return {total, ok};
}
function updateCheckerProgress(){
  const el = document.getElementById('checker-progress');
  if(!el) return;
  const {total, ok} = checkerStats();
  el.textContent = ok + ' / ' + total + ' agents validated';
  const banner = document.getElementById('checker-banner');
  if(banner) banner.classList.toggle('all-validated', total>0 && ok===total);
}
function renderCheckerTabs(){
  const wrap = document.getElementById('checker-group-tabs');
  if(!wrap) return;
  wrap.innerHTML = (sirBreakpoints.groups||[]).map(g=>{
    const okN = g.agents.filter(a=>a.ok).length;
    const active = g.id === checkerGroup;
    return `<button class="checker-tab${active?' active':''}" role="tab" aria-selected="${active}" type="button" onclick="setCheckerGroup('${g.id}')">${g.name}<span class="checker-tab-count">${okN}/${g.agents.length}</span></button>`;
  }).join('');
}
function setCheckerGroup(id){
  checkerGroup = id;
  renderCheckerTabs();
  renderCheckerRows();
}
function checkerCategory(a, zone){
  // zone ≥ S → S ; zone < R → R ; else I. (S===R ⇒ binary, no I band.)
  if(zone >= a.S) return {cat:'s', label:'S'};
  if(zone < a.R)  return {cat:'r', label:'R'};
  return {cat:'i', label:'I'};
}
function renderCheckerRows(){
  const host = document.getElementById('checker-rows');
  const titleEl = document.getElementById('checker-group-title');
  if(!host) return;
  const g = (sirBreakpoints.groups||[]).find(x=>x.id===checkerGroup);
  if(!g){
    if(titleEl) titleEl.textContent = 'Select an organism group';
    host.innerHTML = '<div class="sir-placeholder">Pick an organism group above to load its agents, then type a measured zone diameter against each one.</div>';
    return;
  }
  if(titleEl) titleEl.textContent = g.name + ' — measured zones';
  host.innerHTML = g.agents.map((a,i)=>{
    const key = g.id+':'+i;
    const val = checkerZones[key];
    const hasVal = val!==undefined && val!=='' && !isNaN(val);
    let badge = '<span class="sir-badge empty">—</span>';
    if(hasVal){ const c = checkerCategory(a, Number(val)); badge = `<span class="sir-badge ${c.cat}">${c.label}</span>`; }
    const bp = (a.S===a.R) ? `S/R at ${a.S} mm (binary)` : `S ≥ ${a.S} · R &lt; ${a.R} mm`;
    const tags = (a.screen?'<span class="sir-tag screen">screen</span>':'') + (a.ok?'<span class="sir-tag ok"><i class="ti ti-circle-check" aria-hidden="true"></i> verified</span>':'<span class="sir-tag unver" title="Unverified — correct S/R in data.js and set ok:true"><i class="ti ti-alert-circle" aria-hidden="true"></i> unverified</span>');
    const note = a.note ? `<div class="sir-note">${a.note}</div>` : '';
    return `<div class="sir-row${a.ok?'':' is-unverified'}">
      <div class="sir-agent"><div class="sir-agent-name">${a.agent}</div><div class="sir-agent-meta">${a.disc} · ${bp}</div>${note}</div>
      <div class="sir-tags">${tags}</div>
      <div class="sir-input">
        <div class="zone-input-wrap"><input type="number" inputmode="numeric" min="0" max="60" step="1" placeholder="--" value="${hasVal?val:''}" aria-label="Zone diameter for ${a.agent}" oninput="checkerInput('${g.id}',${i},this.value)"><span class="zone-unit">mm</span></div>
      </div>
      <div class="sir-result">${badge}</div>
    </div>`;
  }).join('');
}
function checkerInput(groupId, idx, raw){
  const key = groupId+':'+idx;
  if(raw==='' || raw===null){ delete checkerZones[key]; }
  else { checkerZones[key] = raw; }
  // surgical badge update without re-rendering the whole list (keeps focus)
  const g = (sirBreakpoints.groups||[]).find(x=>x.id===groupId);
  if(!g) return;
  const a = g.agents[idx];
  const rows = document.querySelectorAll('#checker-rows .sir-row');
  const row = rows[idx];
  if(!row) return;
  const resultEl = row.querySelector('.sir-result');
  const v = checkerZones[key];
  if(v===undefined || v==='' || isNaN(v)){ resultEl.innerHTML = '<span class="sir-badge empty">—</span>'; return; }
  const c = checkerCategory(a, Number(v));
  resultEl.innerHTML = `<span class="sir-badge ${c.cat}">${c.label}</span>`;
}
function checkerInit(){
  renderCheckerTabs();
  renderCheckerRows();
  updateCheckerProgress();
}

// ═══════════════════════════════════════════════════════════════════════
// RECENTLY-VIEWED STRIP  (added v25) — session-only, no storage
// ═══════════════════════════════════════════════════════════════════════
const RECENTS_MAX = 8;
let recentPanels = [];
function pushRecent(key){
  if(typeof fcPanels === 'undefined' || !fcPanels[key]) return;  // only real detail panels
  recentPanels = recentPanels.filter(k=>k!==key);
  recentPanels.unshift(key);
  if(recentPanels.length > RECENTS_MAX) recentPanels.length = RECENTS_MAX;
  renderRecents();
}
function openRecent(key){
  // #detail-fc is global (outside the view container), so the panel opens
  // from any view — no view switch needed.
  showDetail(key);
}
function clearRecents(){ recentPanels = []; renderRecents(); }
function renderRecents(){
  const bar = document.getElementById('recents-bar');
  const chips = document.getElementById('recents-chips');
  if(!bar || !chips) return;
  if(!recentPanels.length){ bar.hidden = true; chips.innerHTML=''; return; }
  bar.hidden = false;
  chips.innerHTML = recentPanels.map(k=>{
    const p = fcPanels[k];
    const title = (p && p.title) ? p.title : k;
    const safe = title.replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    const tip = safe.replace(/"/g,'&quot;');
    return `<button class="recents-chip" type="button" onclick="openRecent('${k.replace(/'/g,"\\'")}')" title="${tip}"><i class="ti ti-file-description" aria-hidden="true"></i><span>${safe}</span></button>`;
  }).join('');
}

// ═══════════════════════════════════════════════════════════════════════
// GUIDELINE-VERSION STAMPS  (added v25)
// Injects one compact metadata badge per relevant view from
// GUIDELINE_VERSIONS in data.js. Consolidates "based on / reviewed" so the
// governance trail lives in one editable place (ISO 15189 / UKAS).
// ═══════════════════════════════════════════════════════════════════════
function stampGuidelineVersions(){
  if(typeof GUIDELINE_VERSIONS === 'undefined') return;
  const meta = GUIDELINE_VERSIONS._meta || {};
  Object.keys(GUIDELINE_VERSIONS).forEach(viewId=>{
    if(viewId === '_meta') return;
    const view = document.getElementById('view-'+viewId);
    if(!view) return;
    if(view.querySelector(':scope > .guideline-stamp')) return;  // idempotent
    const cfg = GUIDELINE_VERSIONS[viewId];
    const reviewed = (cfg.reviewed && cfg.reviewed!=='—') ? cfg.reviewed : 'review date not set';
    const isPlaceholder = (cfg.lines||[]).some(l=>/placeholder|unvalidated|set version/i.test(l.version));
    const parts = (cfg.lines||[]).map(l=>`<span class="gs-item"><span class="gs-label">${l.label}</span> <span class="gs-ver">${l.version}</span></span>`);
    const stamp = document.createElement('div');
    stamp.className = 'guideline-stamp' + (isPlaceholder?' is-placeholder':'');
    stamp.setAttribute('aria-label','Guideline version information');
    stamp.innerHTML =
      `<span class="gs-mark" aria-hidden="true">⬡</span>`
      + `<span class="gs-item"><span class="gs-label">Data</span> <span class="gs-ver">${meta.appData||'—'}</span></span>`
      + parts.join('')
      + `<span class="gs-item"><span class="gs-label">Reviewed</span> <span class="gs-ver">${reviewed}</span></span>`
      + `<span class="gs-guidance">guidance only · verify against current source</span>`;
    view.appendChild(stamp);
  });
}

// ─── init (added v25) ───
checkerInit();
renderRecents();
stampGuidelineVersions();
