/* app.js — extracted from Micro_Bench_Reference_v23_bact.html
   Application LOGIC: rendering, interpreters, search, view switching, init.
   Depends on the datasets defined in data.js, so MUST load after data.js. */

let curITab='d68', curView='flow';

// Hash-routing state (declared early with var so the hoisted writeHash() can
// safely short-circuit during initial module load, before the routing config
// further down is initialised). See the HASH ROUTING block at end of file.
var routingReady=false, routingApply=false;

// (Legacy S/R disc-toggle interpreters for D68/D69/D63 were removed 2026-06-16;
//  all four D-sets now use the zone-difference calculators — see interpretD73mm
//  and interpretDsetMm. dconfigs[*].patterns are retained only for the test suite.)

function setITab(id){
  curITab=id;
  document.querySelectorAll('.tab').forEach(t=>t.classList.remove('active'));
  document.querySelectorAll('.ipanel').forEach(p=>p.classList.remove('active'));
  document.getElementById('itab-'+id).classList.add('active');
  const panel=document.getElementById('ipanel-'+id);
  panel.classList.add('active','pop-in');
  panel.addEventListener('animationend',()=>panel.classList.remove('pop-in'),{once:true});
  writeHash('interp',id);
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

// ─── D68 / D69 / D63 zone-diameter calculators (zone-difference synergy, per MAST IFUs) ───
// The MAST D6x sets are interpreted by zone-diameter DIFFERENCE (inhibitor − base
// ≥ 5 mm = synergy), not by S/R category. This replaces the legacy S/R toggles
// (initDiscs/toggleDisc) with mm inputs mirroring the D73 calculator. Thresholds:
// D68C: ESBL = B−A≥5 & D−C≥5 (A≈C,B≈D); AmpC = C−A≥5 & D−B≥5 (A≈B,C≈D); both = D−C≥5 (A≈B);
//       all within 2mm = negative. D69C: AmpC = C−A≥5 & C−B≥5; within 3mm = negative.
//       D63C: ESBL = B−A≥5. (See IFUs/MAST/.)
const dsetMm = {d68:{}, d69:{}, d63:{}};
const dsetMmLastKey = {d68:null, d69:null, d63:null};
const dsetFmt = n => (n>=0?'+':'') + n.toFixed(0);

function initDsetMm(id){
  const grid = document.getElementById('discs-'+id);
  if(!grid) return;
  grid.className = 'zone-input-grid';
  grid.innerHTML = '';
  dsetMm[id] = {};
  dconfigs[id].discs.forEach(d=>{
    dsetMm[id][d.l] = null;
    const wrap = document.createElement('div');
    wrap.className = 'zone-input';
    wrap.innerHTML = `<span class="disc-letter">Disc ${d.l}</span>`+
      `<div class="zone-input-wrap"><input type="number" min="0" max="60" step="1" id="dsetmm-${id}-${d.l}" placeholder="—" inputmode="numeric" aria-label="Zone ${d.l} diameter (${d.label})" oninput="updateDsetMm('${id}','${d.l}', this.value)"><span class="zone-unit">mm</span></div>`+
      `<span class="disc-label">${d.label}</span>`;
    grid.appendChild(wrap);
  });
  buildDsetMmTable(id);
}

function updateDsetMm(id, letter, val){
  const t = String(val).trim();
  const n = t === '' ? null : parseFloat(t);
  dsetMm[id][letter] = (n === null || isNaN(n)) ? null : n;
  interpretDsetMm(id);
}

function resetDsetMm(id){
  Object.keys(dsetMm[id]).forEach(k=>{
    dsetMm[id][k] = null;
    const el = document.getElementById('dsetmm-'+id+'-'+k);
    if(el) el.value = '';
  });
  const rb = document.getElementById('res-'+id);
  rb.className = 'result-box';
  rb.innerHTML = '<span style="color:var(--color-text-tertiary);font-size:12px">Enter all zone diameters (mm) to see interpretation.</span>';
  dsetMmLastKey[id] = null;
  buildDsetMmTable(id);
  renderDsetPlate(id);
}

function interpretDsetMm(id){
  const st = dsetMm[id];
  const letters = dconfigs[id].discs.map(d=>d.l);
  const rb = document.getElementById('res-'+id);
  if(letters.some(l => st[l]===null)){
    rb.className = 'result-box';
    rb.innerHTML = '<span style="color:var(--color-text-tertiary);font-size:12px">Enter all zone diameters (mm) to see interpretation.</span>';
    dsetMmLastKey[id] = null; buildDsetMmTable(id); renderDsetPlate(id); return;
  }
  let result, key, calc = '';
  if(id === 'd68'){
    const {A,B,C,D} = st;
    const range = Math.max(A,B,C,D) - Math.min(A,B,C,D);
    const dBA=B-A, dCA=C-A, dDC=D-C, dDB=D-B;
    calc = `ΔB−A ${dsetFmt(dBA)} · ΔC−A ${dsetFmt(dCA)} · ΔD−C ${dsetFmt(dDC)} · ΔD−B ${dsetFmt(dDB)} mm`;
    if(range <= 2 && A < 18){ key='carba'; result={type:'danger', title:'No synergy — possible carbapenemase masking', body:'All four zones within 2 mm AND cefpodoxime resistant (no inhibitor restores the zone). A fully resistant profile can mask an MβL or KPC carbapenemase — proceed to D73. (D68C is not valid for Pseudomonas / Acinetobacter.)'}; }
    else if(range <= 2){ key='neg'; result={type:'success', title:'No ESBL or AmpC detected', body:'All four zones within 2 mm of each other and cefpodoxime susceptible — no ESBL or AmpC phenotype.'}; }
    else if(dBA>=5 && dDC>=5 && Math.abs(B-D)<=4 && Math.abs(A-C)<=4){ key='esbl'; result={type:'ident', title:'ESBL alone', body:'ESBL-inhibitor synergy (B−A ≥5 and D−C ≥5) with no AmpC-inhibitor effect (A≈C, B≈D). Report ESBL-positive; suppress 3GCs per local policy. Reflex UR2; confirm with D63 if required.'}; }
    else if(dDB>=5 && dCA>=5 && Math.abs(A-B)<=4 && Math.abs(C-D)<=4){ key='ampc'; result={type:'warn', title:'AmpC alone', body:'AmpC-inhibitor synergy (C−A ≥5 and D−B ≥5) with no ESBL-inhibitor effect (A≈B, C≈D). Characterise with D69. A masked ESBL cannot be excluded — confirm with D63.'}; }
    else if(dDC>=5 && Math.abs(A-B)<=4){ key='both'; result={type:'warn', title:'ESBL + AmpC combined', body:'Only the dual-inhibitor disc (D) restores the zone (D−C ≥5, A≈B). Combined ESBL + AmpC. Suppress cephalosporins; reflex UR2; confirm ESBL with D63.'}; }
    else { key='atyp'; result={type:'warn', title:'Atypical pattern — manual review', body:'Zone differences do not match a standard D68C pattern. Verify disc placement and re-measure; consider mixed culture or carbapenemase (D73).'}; }
  }
  else if(id === 'd69'){
    const {A,B,C} = st;
    const range = Math.max(A,B,C) - Math.min(A,B,C);
    const dCA=C-A, dCB=C-B, dBA=B-A;
    calc = `ΔC−A ${dsetFmt(dCA)} · ΔC−B ${dsetFmt(dCB)} · ΔB−A ${dsetFmt(dBA)} mm`;
    if(range <= 3){ key='neg'; result={type:'success', title:'AmpC negative', body:'All three zones within 3 mm — no AmpC production detected.'}; }
    else if(dCA>=5 && dCB>=5){ key='ampc'; result={type:'ident', title:'AmpC positive', body:'AmpC-inhibitor disc (C) restores the zone vs both A and B (C−A ≥5 and C−B ≥5). AmpC confirmed — do not report 3GCs susceptible even if they test S. Reflex UR2.'}; }
    else if(dCA>=5 && dBA>=5 && Math.abs(B-C)<=4){ key='other'; result={type:'warn', title:'Possible ESBL interference — use D63', body:'B and C both restore the zone vs A (B−A and C−A ≥5; B≈C). The ESBL inhibitor (B) is restoring activity — D69C CANNOT confirm ESBL (it is present only to stop ESBL masking the AmpC read). Confirm ESBL with D63.'}; }
    else { key='atyp'; result={type:'warn', title:'Atypical pattern — manual review', body:'Zone differences do not match a standard D69C pattern. Verify disc placement and re-measure.'}; }
  }
  else { // d63
    const {A,B} = st;
    const dBA = B-A;
    calc = `ΔB−A ${dsetFmt(dBA)} mm`;
    if(dBA >= 5){ key='esbl'; result={type:'ident', title:'ESBL confirmed', body:'Cefepime + clavulanate exceeds cefepime by ≥5 mm — clavulanate restores activity. Because cefepime resists AmpC, this synergy is ESBL-specific. Report ESBL-positive. Reflex UR2.'}; }
    else if(A < 21){ key='noesbl_r'; result={type:'danger', title:'Cefepime resistant — no ESBL synergy', body:'Cefepime reduced with &lt; 5 mm clavulanate enhancement. No ESBL synergy — consider high-level ESBL, AmpC + porin loss, or carbapenemase. Proceed to D73.'}; }
    else { key='neg'; result={type:'success', title:'No ESBL detected', body:'No significant clavulanate enhancement (&lt; 5 mm) and cefepime susceptible. No ESBL phenotype detectable.'}; }
  }
  rb.className = 'result-box ' + result.type;
  rb.innerHTML = `<div class="result-title ${result.type}">${result.title}</div><div class="result-body">${result.body}</div><div class="calc-readout">${calc}</div>`;
  dsetMmLastKey[id] = key;
  buildDsetMmTable(id, key);
  renderDsetPlate(id);
}

function buildDsetMmTable(id, activeKey){
  const tbody = document.getElementById('itbody-'+id);
  if(!tbody) return;
  const tag = active => active ? ' <span style="font-size:10px;color:var(--color-text-info)">← current</span>' : '';
  let rows;
  if(id === 'd68'){
    rows = [
      ['neg','No ESBL / AmpC','All four zones within 2 mm (cefpodoxime susceptible)'],
      ['esbl','ESBL alone','B−A ≥ 5 and D−C ≥ 5; A≈C and B≈D (≤ 4 mm)'],
      ['ampc','AmpC alone','C−A ≥ 5 and D−B ≥ 5; A≈B and C≈D (≤ 4 mm)'],
      ['both','ESBL + AmpC','D−C ≥ 5 and A≈B (≤ 4 mm)'],
      ['carba','Possible carbapenemase','All zones within 2 mm AND cefpodoxime resistant → D73']
    ];
  } else if(id === 'd69'){
    rows = [
      ['neg','AmpC negative','All three zones within 3 mm'],
      ['ampc','AmpC positive','C−A ≥ 5 and C−B ≥ 5'],
      ['other','ESBL interference (use D63)','C−A ≥ 5 and B−A ≥ 5; B≈C (≤ 4 mm)']
    ];
  } else {
    rows = [
      ['esbl','ESBL confirmed','B (cefepime+clav) − A (cefepime) ≥ 5 mm'],
      ['neg','No ESBL','&lt; 5 mm enhancement; cefepime susceptible'],
      ['noesbl_r','Cefepime R, no synergy','&lt; 5 mm enhancement; cefepime resistant → D73']
    ];
  }
  tbody.innerHTML = rows.map(r=>{
    const active = r[0] === activeKey;
    return `<tr${active?' class="active-row"':''}><td>${r[1]}${tag(active)}</td><td>${r[2]}</td></tr>`;
  }).join('');
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
  // D68 / D69 / D63 now read measured zone diameters (mm) from dsetMm.
  const st = (typeof dsetMm !== 'undefined' && dsetMm[id]) ? dsetMm[id] : {};
  return cfg.discs.map(d=>{
    const v = st[d.l];
    const zoneMm = (v===null || v===undefined || isNaN(v)) ? 0 : Math.max(0, Math.min(60, v));
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

['d68','d69','d63'].forEach(initDsetMm);
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
  writeHash('myco',tab);
}

// Plating-protocols view: two toggleable panes (positive blood cultures and
// sample-type → primary-plate list), mirroring the Mycology tab behaviour.
function setPlatingTab(tab){
  const tabs = ['blood','specimens'];
  if(tabs.indexOf(tab) === -1) tab = 'blood';
  tabs.forEach(t=>{
    const pane = document.getElementById('plating-pane-'+t);
    const btn  = document.getElementById('plating-tab-'+t);
    const on = (t === tab);
    if(pane) pane.classList.toggle('is-hidden', !on);
    if(btn){ btn.classList.toggle('active', on); btn.setAttribute('aria-selected', on ? 'true' : 'false'); }
  });
  writeHash('plating',tab);
}

// Faeces view: four toggleable panes (overview, investigation guide, media
// incubation, wet preparation), mirroring the Plating/Mycology tab behaviour.
function setFaecesTab(tab){
  const tabs = ['overview','guide','media','wetprep'];
  if(tabs.indexOf(tab) === -1) tab = 'overview';
  tabs.forEach(t=>{
    const pane = document.getElementById('faeces-pane-'+t);
    const btn  = document.getElementById('faeces-tab-'+t);
    const on = (t === tab);
    if(pane) pane.classList.toggle('is-hidden', !on);
    if(btn){ btn.classList.toggle('active', on); btn.setAttribute('aria-selected', on ? 'true' : 'false'); }
  });
  writeHash('faeces',tab);
}

// Faeces investigation guide: toggle between table and flowchart views.
function setGuideView(v){
  const tblView = document.getElementById('faeces-guide-table-view');
  const fcView  = document.getElementById('faeces-guide-fc-view');
  const btnT    = document.getElementById('guide-view-table');
  const btnF    = document.getElementById('guide-view-fc');
  if(!tblView || !fcView) return;
  tblView.classList.toggle('is-hidden', v !== 'table');
  fcView.classList.toggle('is-hidden',  v !== 'flowchart');
  if(btnT) btnT.classList.toggle('active', v === 'table');
  if(btnF) btnF.classList.toggle('active', v === 'flowchart');
}

function showMycoFungus(key){
  const f=mycoFungi[key]; if(!f)return;
  if(typeof pushRecent === 'function') pushRecent('fungus', key, f.name);
  setMycoTab('derm');
  const panel=document.getElementById('myco-fungus-panel'); if(!panel)return;
  const visual = f.img
    ? `<img class="myco-micro-photo" src="${f.img}" alt="${f.name} — colony / microscopy" loading="lazy" onerror="mycoImgError(this,'${f.shape}')"><div class="myco-img-cap">Reference image</div>`
    : `${mycoSvg(f.shape)}<div class="myco-img-cap">Schematic cue — open Mycology Online for photographs</div>`;
  panel.innerHTML=`<div class="myco-panel-head"><div><h3>${f.name}</h3><div class="myco-panel-sub">${f.genus} dermatophyte · ${f.reservoir}</div></div><a class="myco-source-link" href="${f.source}" target="_blank" rel="noopener"><i class="ti ti-external-link" aria-hidden="true"></i> Mycology Online (Adelaide)</a></div><div class="myco-panel-grid"><div class="myco-micro-svg${f.img?'':' is-schematic'}">${visual}</div><div class="myco-facts"><div class="myco-fact"><div class="myco-fact-title">Macroscopic culture</div><p>${f.macro}</p></div><div class="myco-fact"><div class="myco-fact-title">Microscopy pointers</div><p>${f.micro}</p></div><div class="myco-fact"><div class="myco-fact-title">Bench clues</div><ul>${f.clues.map(c=>`<li>${c}</li>`).join('')}</ul></div><div class="myco-fact"><div class="myco-fact-title">Relevant presentations</div><p>${mycoDiseases.filter(d=>d.fungi.includes(key)).map(d=>d.name).join(' · ')||'Dermatophyte infection depending on exposure and site.'}</p></div></div></div>`;
  panel.style.display='block';
  panel.style.animation='none';panel.offsetHeight;panel.style.animation='slideUp .28s cubic-bezier(.4,0,.2,1) forwards';}


// ═══════════════════════════════════════════════
// PARASITOLOGY MODULE — CDC DPDx A-Z reference
// Primary grouping by taxonomic class; secondary filters by specimen and
// diagnostic method. Each card opens a detail panel linking to its DPDx page.
// ═══════════════════════════════════════════════
const paraClassLabels = {protozoa:'Protozoa',nematode:'Nematodes (roundworms)',cestode:'Cestodes (tapeworms)',trematode:'Trematodes (flukes)',ectoparasite:'Ectoparasites'};
const paraClassOrder = ['protozoa','nematode','cestode','trematode','ectoparasite'];
const paraSiteLabels = {blood:'Blood',stool:'Stool / intestinal',urogenital:'Urogenital',tissue:'Tissue / biopsy',skin:'Skin',csf:'CSF / CNS',respiratory:'Respiratory'};
const paraDxLabels = {microscopy:'Microscopy',serology:'Serology',molecular:'Antigen / PCR'};

function paraHay(p){
  return (p.name+' '+p.disease+' '+(paraClassLabels[p.cls]||'')+' '+p.note+' '+(p.specimen||'')+' '+p.clues.join(' ')+' '+p.site.map(s=>paraSiteLabels[s]||'').join(' ')+' '+p.dx.map(d=>paraDxLabels[d]||'').join(' ')).toLowerCase();
}

function renderParasitology(){
  const q=(document.getElementById('para-search')?.value||'').trim().toLowerCase();
  const site=document.getElementById('para-site-filter')?.value||'';
  const dx=document.getElementById('para-dx-filter')?.value||'';
  const grid=document.getElementById('para-grid');
  if(!grid)return;
  const matches=parasites.filter(p=>(!site||p.site.includes(site)) && (!dx||p.dx.includes(dx)) && (!q||paraHay(p).includes(q)));
  if(!matches.length){grid.innerHTML='<div class="myco-empty">No parasites match those filters.</div>';return;}
  grid.innerHTML=paraClassOrder.filter(c=>matches.some(p=>p.cls===c)).map(c=>{
    const cards=matches.filter(p=>p.cls===c).map(p=>{
      const tags=p.site.map(s=>`<span class="myco-tag">${paraSiteLabels[s]}</span>`).join('');
      return `<div class="myco-card" onclick="showParasite('${p.key}')"><h3><i class="ti ti-bug" aria-hidden="true"></i>${p.disease}</h3><p><em>${p.name}</em></p><p>${p.note}</p><div class="myco-tag-row">${tags}</div></div>`;
    }).join('');
    return `<div class="section-title">${paraClassLabels[c]}</div><div class="myco-grid">${cards}</div>`;
  }).join('');
}

function showParasite(key){
  const p=parasites.find(x=>x.key===key); if(!p)return;
  if(typeof pushRecent === 'function') pushRecent('parasite', key, p.disease);
  const panel=document.getElementById('para-panel'); if(!panel)return;
  const siteTags=p.site.map(s=>`<span class="myco-tag">${paraSiteLabels[s]}</span>`).join('');
  const dxTags=p.dx.map(d=>`<span class="myco-tag">${paraDxLabels[d]}</span>`).join('');
  panel.innerHTML=`<div class="myco-panel-head"><div><h3>${p.disease}</h3><div class="myco-panel-sub"><em>${p.name}</em> · ${paraClassLabels[p.cls]}</div></div><a class="myco-source-link" href="${p.url}" target="_blank" rel="noopener"><i class="ti ti-external-link" aria-hidden="true"></i> CDC DPDx</a></div><div class="myco-facts"><div class="myco-fact"><div class="myco-fact-title">Overview</div><p>${p.note}</p></div><div class="myco-fact"><div class="myco-fact-title">Specimen</div><p>${p.specimen}</p><div class="myco-tag-row">${siteTags}</div></div><div class="myco-fact"><div class="myco-fact-title">Diagnostic method</div><div class="myco-tag-row">${dxTags}</div></div><div class="myco-fact"><div class="myco-fact-title">Bench clues</div><ul>${p.clues.map(c=>`<li>${c}</li>`).join('')}</ul></div></div>`;
  panel.style.display='block';
  panel.style.animation='none';panel.offsetHeight;panel.style.animation='slideUp .28s cubic-bezier(.4,0,.2,1) forwards';}


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
  if(typeof pushRecent === 'function') pushRecent('rules', id, o.name);
  const panel=document.getElementById('rules-detail'); if(!panel)return;
  panel.innerHTML = `<button class="detail-close" onclick="hideRulesOrg()" aria-label="Close" title="Close (Esc)">×</button>`+
    `<div class="rules-detail-head"><h3>${o.name}${typeof eucastCiteSup==='function'?eucastCiteSup(rulesEucastKeys(o), viewEucastIndex('rules')):''}</h3><span class="rules-grp-tag">${rulesGroupLabels[o.group]||o.group}</span></div>`+
    (o.aka?`<div class="rules-aka">${o.aka}</div>`:'')+
    `<div class="rules-detail-title"><i class="ti ti-ban" aria-hidden="true"></i> Expected resistant — never report susceptible</div>`+
    `<div class="rules-resist-grid">${o.resist.map(r=>`<span class="rules-resist-pill">${r}</span>`).join('')}</div>`+
    `<div class="rules-detail-title"><i class="ti ti-list-check" aria-hidden="true"></i> Expert / interpretive rules</div>`+
    `<ul class="rules-list">${o.rules.map(r=>`<li>${r}</li>`).join('')}</ul>`;
  panel.style.display='block';
  panel.style.animation='none';panel.offsetHeight;panel.style.animation='slideUp .28s cubic-bezier(.4,0,.2,1) forwards';}
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
  if(typeof pushRecent === 'function') pushRecent('blood', idx, t.name);
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
    views:{ flow:'Urine', wound:'Wound', csf:'CSF', interp:'D-sets', rules:'Intrinsic resistance', checker:'S/I/R checker' } },
  { id:'class-menu', triggerId:'sw-class', labelId:'class-label', prefix:'Classification',
    views:{ plate:'Colony & Gram', bactid:'Bacterial ID' } },
  { id:'disc-menu',  triggerId:'sw-disc',  labelId:'disc-label',  prefix:'Disciplines',
    views:{ virology:'Molecular', blood:'Blood Science', myco:'Mycology', parasitology:'Parasitology', faeces:'Faeces', serology:'Serology' } },
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
  closeAllDetailPanels();
  // Each view starts with the rail collapsed (full-width content) unless we're
  // mid-reopen of a previous card from the rail handle.
  if(!_openingRecent) setRailOpen(false);
  const fromEl=document.getElementById('view-'+curView);
  const toEl=document.getElementById('view-'+to);
  // crude ordering for transition direction, matching the quick-nav numbering:
  // notes < sensitivities(flow,wound,interp) < abx < classification(plate,bactid) < disciplines(virology,blood,myco) < index
  const order={notes:-1,flow:0,wound:1,csf:1.5,interp:2,rules:2.5,checker:2.7,abx:3,plating:3.5,plate:4,bactid:5,virology:6,blood:7,myco:8,parasitology:8.4,faeces:8.45,serology:8.5,index:9};
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
  writeHash(to);
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
  const labelCite = ((opts.refsNum && typeof smiCiteSup==='function')
    ? smiCiteSup(opts.labelCodes||[], opts.refsNum) : '')
    + ((opts.eucastView && typeof eucastCiteSup==='function')
      ? eucastCiteSup(['bp'], viewEucastIndex(opts.eucastView)) : '');
  let html=`<div style="border-top:0.5px solid var(--color-border-tertiary);margin-top:10px;padding-top:10px">`;
  html+=`<div style="font-size:11px;font-weight:500;color:var(--color-text-secondary);margin-bottom:8px">${flow.label}${labelCite}</div>`;
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
  renderOrgFlowGeneric({selectId:'org-select',flows:orgFlows,targetId:'org-flow',btnId:'org-go-btn',minWidth:110,refsNum:flowRefs().num,labelCodes:['B 41'],eucastView:'flow'});
}
function clearOrg(){
  clearOrgGeneric({selectId:'org-select',targetId:'org-flow',btnId:'org-go-btn'});
}
function showOrgFlowWound(){
  renderOrgFlowGeneric({selectId:'org-select-wound',flows:orgFlowsWound,targetId:'org-flow-wound',btnId:'org-go-btn-wound',minWidth:130,refsNum:woundRefs().num,labelCodes:['B 11','B 14','B 17'],eucastView:'wound'});
}
function clearOrgWound(){
  clearOrgGeneric({selectId:'org-select-wound',targetId:'org-flow-wound',btnId:'org-go-btn-wound'});
}
function showOrgFlowCsf(){
  renderOrgFlowGeneric({selectId:'org-select-csf',flows:orgFlowsCsf,targetId:'org-flow-csf',btnId:'org-go-btn-csf',minWidth:130,refsNum:csfRefs().num,labelCodes:['B 27'],eucastView:'csf'});
}
function clearOrgCsf(){
  clearOrgGeneric({selectId:'org-select-csf',targetId:'org-flow-csf',btnId:'org-go-btn-csf'});
}

// ── Reporting-logic overlay ─────────────────────────────────────────────
// SOP interpretive/reporting rules are surfaced as highlighted boxes that are
// hidden by default and revealed together by this toggle (one shared state,
// reflected on every .reporting-toggle button). Session-only, no persistence.
function toggleReportingRules(){
  const on=document.body.classList.toggle('show-reporting');
  document.querySelectorAll('.reporting-toggle').forEach(b=>{
    b.setAttribute('aria-pressed',on?'true':'false');
    const s=b.querySelector('.rt-state'); if(s)s.textContent=on?'ON':'OFF';
  });
}

function showDetail(key){
  const p=fcPanels[key];if(!p)return;
  const d=document.getElementById('detail-fc');
  document.getElementById('d-title').innerHTML=escapeAttr(p.title)+(typeof panelCiteSup==='function'?panelCiteSup(key):'');
  document.getElementById('d-sub').textContent=p.sub;
  const cls=p.reagents?'reagent-pill':'abx-pill';
  document.getElementById('d-abx').innerHTML=p.abx.map(a=>`<span class="${cls}">${a}</span>`).join('');
  document.getElementById('d-notes').innerHTML='<strong style="font-size:11px;color:var(--color-text-secondary)">Notes: </strong>'+p.notes;
  d.style.display='block';
  d.style.animation='none';d.offsetHeight;
  d.style.animation='slideUp .28s cubic-bezier(.4,0,.2,1) forwards';
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
  const cite = (typeof smiCiteSup==='function')
    ? smiCiteSup(smiCitations.mediaByKey[org.medium]||[], plateRefs().num) : '';
  info.innerHTML=`<h3>${org.name}${cite}</h3>${features}<p>${org.description}</p>`;
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
  const mcite = (typeof smiCiteSup==='function')
    ? smiCiteSup(smiCitations.mediaByKey[curMedium]||[], plateRefs().num) : '';
  note.innerHTML = plateMedia[curMedium].note + mcite;
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
  if(typeof pushRecent === 'function') pushRecent('gram', id, p.name);
  setPlateSection('gram');
  const panel=document.getElementById('gram-panel'); if(!panel)return;
  const gramLabel={pos:'Gram-positive',neg:'Gram-negative',variable:'Gram-variable'};
  panel.innerHTML=`<div class="myco-panel-head"><div><h3>${p.name}</h3><div class="myco-panel-sub"><span class="gram-tag gram-${p.gram}">${gramLabel[p.gram]}</span></div></div></div>`+
    `<div class="myco-panel-grid"><div class="gram-film-big">${gramSvg(p.id)}<div class="myco-img-cap">Schematic Gram film \u2014 not a photomicrograph</div></div>`+
    `<div class="myco-facts"><div class="myco-fact"><div class="myco-fact-title">What you see</div><p>${p.description}</p></div>`+
    `<div class="myco-fact"><div class="myco-fact-title">Typical organisms</div><p>${p.organisms.join(' · ')}</p></div>`+
    `<div class="myco-fact"><div class="myco-fact-title">Bench clues / next steps</div><ul>${p.clues.map(c=>`<li>${c}</li>`).join('')}</ul></div></div></div>`;
  panel.style.display='block';
  panel.style.animation='none';panel.offsetHeight;panel.style.animation='slideUp .28s cubic-bezier(.4,0,.2,1) forwards';}

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
  writeHash('plate',sec);
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

// When true, the donker lists show Oxoid disc codes instead of full drug names.
let routineCodeMode = false;

// Oxoid disc code for an antibiotic name (case/punctuation-insensitive,
// alias-aware), or null if none is mapped.
let _discCodeLookup = null;
function discCodeFor(name){
  if(typeof oxoidDiscCodes === 'undefined') return null;
  if(!_discCodeLookup){
    _discCodeLookup = new Map();
    Object.entries(oxoidDiscCodes).forEach(([k, v]) => _discCodeLookup.set(normAbxName(k), v));
  }
  const direct = _discCodeLookup.get(normAbxName(name));
  if(direct) return direct;
  const g = abxAliasGroupFor(name);              // resolve aliases (e.g. Co-amoxiclav → Augmentin → AMC)
  if(g){ for(const m of g){ const c = _discCodeLookup.get(normAbxName(m)); if(c) return c; } }
  return null;
}
function toggleRoutineCodes(on){ routineCodeMode = !!on; renderRoutineSets(); }

function renderRoutineSets(){
  const routineEl = document.getElementById('routine-sets');
  if(!routineEl) return;
  const filterKey = activeAbxFilter ? activeAbxFilter.key : null;   // merge key, matches all aliases

  const blocks = routineSets.map((group, index) => {
    const sets = filterKey
      ? group.sets.filter(set => set.antibiotics.some(a => abxMergeKey(parseAbxDisc(a).name) === filterKey))
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
                  const code = routineCodeMode ? discCodeFor(p.name) : null;   // null → no code known / names mode
                  if(filterKey && abxMergeKey(p.name) === filterKey){
                    // Use the single canonical label (or its disc code) across every set.
                    const label = code || activeAbxFilter.name;
                    return `<li class="routine-abx-match"><span class="routine-abx">${label}<span class="routine-conc">${formatDiscConc(p.conc) || '—'}</span></span></li>`;
                  }
                  const text = code ? `${code}${p.conc ? ' ' + p.conc : ''}` : abx;
                  return `<li><span class="routine-abx">${text}</span></li>`;
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
  // QC platings now live alongside the barcode labels (rendered by
  // renderBarcodes), so there is no standalone QC organisms table to fill here.
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

// Lazily build a lookup from every normalised alias to its full alias-row.
let _abxAliasLookup = null;
function _ensureAbxAliasLookup(){
  if(_abxAliasLookup) return _abxAliasLookup;
  _abxAliasLookup = new Map();
  if(typeof abxAliasGroups !== 'undefined'){
    abxAliasGroups.forEach(group => group.forEach(g => _abxAliasLookup.set(normAbxName(g), group)));
  }
  return _abxAliasLookup;
}
// The alias group a name belongs to (Penicillin & Benzylpenicillin share one), or null.
function abxAliasGroupFor(name){ return _ensureAbxAliasLookup().get(normAbxName(name)) || null; }
// A stable key that collapses every alias of one drug into a single bucket, so
// the disc finder merges e.g. Penicillin + Benzylpenicillin into one entry.
function abxMergeKey(name){ const g = abxAliasGroupFor(name); return g ? normAbxName(g[0]) : name.toLowerCase(); }
// Preferred finder label for specific drugs, overriding the default (bench
// spelling / alias-group canonical). Keyed by the alias-group merge key.
const ABX_DISPLAY_OVERRIDE = {
  'benzylpenicillin': 'Penicillin',                            // Penicillin / Benzylpenicillin group
  'amoxicillinclavulanicacid': 'Amoxicillin/Clavulanic acid',  // Augmentin / co-amoxiclav group
  'piperacillintazobactam': 'Piperacillin/Tazobactam'          // Tazocin / pip-taz group
};
// Synonyms for a name, excluding the name itself (for the result "a.k.a." hint).
function abxAliasText(name){
  const g = abxAliasGroupFor(name);
  if(!g) return '';
  const self = normAbxName(name);
  return g.filter(x => normAbxName(x) !== self).join(' ');
}

function buildAbxFinderIndex(){
  const map = new Map();
  routineSets.forEach(group => {
    group.sets.forEach(set => {
      set.antibiotics.forEach(entry => {
        const {name, conc} = parseAbxDisc(entry);
        const key = abxMergeKey(name);   // collapses aliases of the same drug into one bucket
        if(!map.has(key)) map.set(key, {key, group:abxAliasGroupFor(name), names:new Map(), occurrences:[]});
        const rec = map.get(key);
        const low = name.toLowerCase();
        if(!rec.names.has(low)) rec.names.set(low, name);   // remember each distinct on-disc spelling
        rec.occurrences.push({section:group.section, setName:set.name, codes:set.codes, conc, entry});
      });
    });
  });
  const out = [];
  map.forEach(rec => {
    const distinct = [...rec.names.values()];
    // Preferred override wins; else one spelling on the bench → keep it; several
    // spellings of the same drug → the alias-group canonical, so the label is
    // single across all sets.
    const name = ABX_DISPLAY_OVERRIDE[rec.key]
      || (distinct.length === 1 ? distinct[0] : (rec.group ? rec.group[0] : distinct[0]));
    out.push({ key:rec.key, name, aliases:abxAliasText(name), occurrences:rec.occurrences });
  });
  return out.sort((a, b) => a.name.localeCompare(b.name));
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

// Weekly QC labels carry a 'W' marker, daily QC a 'D' — inserted between the
// strain and the date so the two QC streams stay distinguishable on the bench.
function makeBarcode(org, iso, suffix){
  const date = formatBarcodeDate(iso);
  return org.bcName + org.bcStrain + (suffix || '') + (date ? '.' + date : '');
}

function barcodeRowsHtml(list, iso, suffix){
  return list.map(o => {
    const label = makeBarcode(o, iso, suffix);
    const escaped = label.replace(/"/g,'&quot;');
    return `<tr>
      <td><em class="qc-org">${o.name}</em></td>
      <td><code class="qc-strain">${o.strain}</code></td>
      <td>${o.plates.map(p => `<span class="qc-plate">${p}</span>`).join('')}</td>
      <td><code class="barcode-label">${label}</code></td>
      <td class="barcode-action-cell"><button class="barcode-copy-btn" type="button" data-text="${escaped}" onclick="copyBarcode(this)" aria-label="Copy ${escaped}" title="Copy"><i class="ti ti-copy" aria-hidden="true"></i></button></td>
    </tr>`;
  }).join('');
}

function renderBarcodes(){
  const iso = (document.getElementById('barcode-date') || {}).value || '';
  const weekly = document.getElementById('barcode-tbody-weekly');
  if(weekly) weekly.innerHTML = barcodeRowsHtml(qcWeeklyOrganisms, iso, 'W');
  const daily = document.getElementById('barcode-tbody-daily');
  if(daily) daily.innerHTML = barcodeRowsHtml(qcDailyOrganisms, iso, 'D');
}

function copyBarcode(btn){
  const text = btn.getAttribute('data-text');
  if(!text) return;
  copyToClipboard(text);
  showCopiedFeedback(btn, true);
}

function copyAllBarcodes(kind){
  const iso = (document.getElementById('barcode-date') || {}).value || '';
  const daily = kind === 'daily';
  const list = daily ? qcDailyOrganisms : qcWeeklyOrganisms;
  const all = list.map(o => makeBarcode(o, iso, daily ? 'D' : 'W')).join('\n');
  copyToClipboard(all);
  const btn = document.getElementById(daily ? 'barcode-copy-all-daily' : 'barcode-copy-all-weekly');
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
let serologySampleFilter = 'all'; // 'all' | sample-key abbr | '__viral' | '__nt' | '__other'
let serologyShowDisc = false;

// A few key abbreviations are also written out in full in the data — match both.
const SERO_SAMPLE_WORDS = { U: 'urine', F: 'faeces' };

// Composite sample-type categories beyond the key abbreviations.
const serologySampleGroups = [
  {value:'__viral', label:'Viral swab',                    match:s => /viral\s+swab/i.test(s)},
  {value:'__nt',    label:'Nose &amp; throat swab',        match:s => /nose|throat/i.test(s)},
  {value:'__other', label:'Other (biopsy, isolate, culture…)', match:s => serologySampleIsOther(s)}
];

// "Other" = nothing in the key or the named swab groups recognises this sample.
function serologySampleIsOther(sample){
  if(!sample) return true;
  const named = serologySampleKey.map(k => k.abbr).concat('__viral', '__nt');
  return !named.some(a => serologySampleMatches(sample, a));
}

// Match a test's free-text sample against a filter value. Key abbreviations use
// whole-token matching (so 'S' matches 'S/P' but not 'SST'), with U/F also
// matching their spelled-out word; '__viral'/'__nt'/'__other' are composite groups.
// 'S' (Serum) is treated as serum-only — S/P tests also accept plasma, so they
// fall under the 'P' (Plasma) filter instead.
function serologySampleMatches(sample, abbr){
  if(abbr === 'all') return true;
  if(abbr === '__other') return serologySampleIsOther(sample);
  if(!sample) return false;
  if(abbr === '__viral') return /viral\s+swab/i.test(sample);
  if(abbr === '__nt')    return /nose|throat/i.test(sample);
  const toks = sample.split(/[^A-Za-z0-9]+/).map(t => t.toLowerCase());
  if(abbr === 'S') return toks.includes('s') && !toks.includes('p');
  if(toks.includes(abbr.toLowerCase())) return true;
  const word = SERO_SAMPLE_WORDS[abbr];
  return word ? toks.includes(word) : false;
}

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
    if(!serologySampleMatches(t.sample, serologySampleFilter)) return false;
    if(q){
      const hay = (t.code + ' ' + t.name + ' ' + t.sample + ' ' + (t.note || '') + ' ' + (t.analyser || '') + ' ' + (t.urgent ? 'urgent' : '')).toLowerCase();
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
    const urgentTag = t.urgent ? `<span class="sero-urgent-tag">Urgent</span>` : '';
    const sample = t.sample ? highlightMatch(t.sample, q) : `<span class="sero-na">—</span>`;
    const analyser = t.loc === 'in'
      ? (t.analyser || `<span class="sero-na">[not yet listed]</span>`)
      : `<span class="sero-na">—</span>`;
    return `<tr class="${t.disc ? 'is-disc' : ''}">
      <td>${code}</td>
      <td><span class="sero-test">${highlightMatch(t.name, q)}</span>${urgentTag}${discTag}${note}</td>
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

function setSerologySampleFilter(abbr){
  serologySampleFilter = abbr || 'all';
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
  const sampleSel = document.getElementById('serology-sample-filter');
  if(sampleSel){
    sampleSel.innerHTML = '<option value="all">All sample types</option>' +
      serologySampleKey.map(k => {
        const label = k.abbr === 'S' ? `${k.abbr} — Serum only` : `${k.abbr} — ${k.label}`;
        return `<option value="${k.abbr}">${label}</option>`;
      }).join('') +
      serologySampleGroups.map(g => `<option value="${g.value}">${g.label}</option>`).join('');
    sampleSel.value = serologySampleFilter;
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
// ── Panel categorisation — single source of truth ───────────────────────────
// fcPanels mixes antibacterial, mycology, antifungal and molecular panels that
// all share the same `abx` field. Rather than scatter key-prefix regexes across
// the codebase, classify a panel here. The key-prefix convention is:
//   fx_   → 'mycology'      (morphology / fungal ID flowchart)
//   af_   → 'antifungal'    (antifungal agents)
//   afr_  → 'antifungal'    (expected antifungal resistance)
//   viro_ → 'molecular'     (molecular / virology workflows)
//   (anything else)         → 'antibacterial'
// A panel may also set an explicit `kind:'…'` to override the prefix — preferred
// for any future panel that doesn't follow the naming convention.
const PANEL_KIND_PREFIXES = [
  [/^fx_/,   'mycology'],
  [/^afr?_/, 'antifungal'],
  [/^viro_/, 'molecular'],
];
function panelKind(key, panel){
  if(panel && panel.kind) return panel.kind;             // explicit override wins
  for(const [re, kind] of PANEL_KIND_PREFIXES){ if(re.test(key)) return kind; }
  return 'antibacterial';
}

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
    // Antibacterial index only — mycology, antifungal and molecular panels hold
    // organisms / morphology / antifungal agents in their abx lists, not antibiotics.
    if(panelKind(key,p)!=='antibacterial') return;
    p.abx.forEach(a=>{
      // Some entries are like "ESP1: Ampicillin · Levofloxacin · Nitrofurantoin"
      // Split on '·' if present, else treat as one entry
      const parts = a.includes('·') ? a.split(/\s*·\s*/) : [a];
      parts.forEach(part=>{
        // Strip leading panel prefix like "ESP1: " or "Pseudo1: "
        const cleaned = part.replace(/^[A-Za-z0-9/]+\s*\d*\s*:\s*/,'').trim();
        if(!cleaned) return;
        // Some are descriptors like "Indole reagent (Kovács...)" - skip if not a known abx-looking term
        if(/reagent|test|stain|culture|MALDI|gram|haemolysis|pcr|optochin|bile|nitrocefin|pyr|camp|x factor|v factor|xv combined|species id|aerotolerance|β-lactamase test|catalase|dnase agar|staph latex|specimen type|gram stain|donker|\binhibitor\b|^penem\b/i.test(cleaned)) return;
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
  writeHash('index',id);
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
  if(typeof pushRecent === 'function' && typeof fcPanels !== 'undefined' && fcPanels[key]) pushRecent('fc', key, fcPanels[key].title || key);
  const btn = document.getElementById('d-copy');
  if(btn){btn.classList.remove('copied');btn.innerHTML='<i class="ti ti-copy" aria-hidden="true"></i> Copy panel summary';}
};
function closeDetail(){
  const d = document.getElementById('detail-fc');
  d.style.display='none';
  currentDetailKey = null;
}
// Docked detail panels are fixed to the viewport bottom, so the panels nested
// in a view stay hidden when that view is inactive (opacity:0) — but #detail-fc
// is top-level and shared across the sensitivity views, so close every detail
// panel on a view switch to stop one leaking over the next view.
function closeAllDetailPanels(){
  ['detail-fc','rules-detail','myco-fungus-panel','para-panel','gram-panel','blood-detail'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) el.style.display='none';
  });
}
// ── Collapsible detail rail (wide monitors; CSS gates the visual layout) ──────
// body.rail-open expands the right rail; absent = collapsed (handle bar only).
let _openingRecent = false;   // suppresses the view-switch collapse during openRecent
function setRailOpen(open){
  document.body.classList.toggle('rail-open', !!open);
  const h = document.getElementById('rail-handle');
  if(h){
    h.setAttribute('aria-expanded', open ? 'true' : 'false');
    h.setAttribute('aria-label', open ? 'Collapse detail panel' : 'Open detail panel');
    h.title = open ? 'Collapse detail panel' : 'Open detail panel';
  }
}
function railHasOpenPanel(){
  return ['detail-fc','rules-detail','myco-fungus-panel','para-panel','gram-panel','blood-detail']
    .some(id=>{ const e = document.getElementById(id); return e && e.style.display === 'block'; });
}
// Handle click: collapse if open; otherwise expand, reopening the previously
// viewed card (most recent) when nothing is currently docked.
function toggleRail(){
  if(document.body.classList.contains('rail-open')){ setRailOpen(false); return; }
  setRailOpen(true);
  if(!railHasOpenPanel() && Array.isArray(recentPanels) && recentPanels.length){
    const r = recentPanels[0];
    openRecent(r.kind, r.key);
  }
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

bactIdOrganisms.forEach(o=>{
  if(!Object.prototype.hasOwnProperty.call(o,'smi')){
    o.smi = bactIdSmiMap[o.name] || [];
  }
});

// ─── UK SMI numbered citations + validation footnotes ────────────────
// Renders page-local [n] reference lists from smiCitations so each
// bacteriology view shows the UK SMI document(s) its content was validated
// against (issue/date as committed under SMIs/). Spot-validated 2026-06-15.
const SMI_REVIEWED = '2026-06-15';
function smiDocTitle(code){
  if(typeof smiCitations==='undefined') return '';
  const t=(smiCitations.documents[code.split(' ')[0]]||{})[code];
  return typeof t==='string' ? t : (t&&t.title) || '';
}
function smiDocIssue(code){
  return (typeof smiCitations!=='undefined' && smiCitations.verifiedIssues && smiCitations.verifiedIssues[code]) || '';
}
function smiOrderCodes(codes){
  const rank={ID:0,TP:1,B:2,S:3};
  return Array.from(new Set((codes||[]).filter(Boolean))).sort((a,b)=>{
    const sa=a.split(' '), sb=b.split(' ');
    const ra=rank[sa[0]]??9, rb=rank[sb[0]]??9;
    return ra!==rb ? ra-rb : (parseInt(sa[1],10)-parseInt(sb[1],10));
  });
}
function smiRefIndex(codes){
  const ordered=smiOrderCodes(codes), num={};
  ordered.forEach((c,i)=>num[c]=i+1);
  return {ordered,num};
}
function smiCiteSup(codes, num){
  const ns=smiOrderCodes(codes).map(c=>num[c]).filter(Boolean);
  return ns.length ? `<sup class="smi-cite" title="UK SMI reference — see footnotes">[${ns.join(',')}]</sup>` : '';
}
function smiFootnotesHtml(idx, opts){
  opts=opts||{};
  const lis=idx.ordered.map((code,i)=>{
    const iss=smiDocIssue(code);
    return `<li><span class="smi-ref-n">[${i+1}]</span> <span class="smi-ref-code">${code}</span> ${smiDocTitle(code)}${iss?` <span class="smi-ref-iss">(${iss})</span>`:''}</li>`;
  }).join('');
  const note=opts.note ? `<p class="smi-ref-note">${opts.note}</p>` : '';
  const body=`<ol class="smi-refs">${lis}</ol>`+note
    +`<p class="smi-ref-foot">Each [n] marks the UK Standard for Microbiology Investigations the item was checked against (issue/date as committed under <code>SMIs/</code>). Guidance only — verify against the current issue before clinical use. AST panels/breakpoints are EUCAST, not SMI.</p>`;
  return collapsibleRefsHtml({
    blockClass:'smi-refs-block', ariaLabel:'UK SMI references', title:'UK SMI references',
    meta:`${idx.ordered.length} document${idx.ordered.length===1?'':'s'} · validated ${SMI_REVIEWED}`,
    bodyHtml:body
  });
}
// Shared collapsible reference box — used by both the UK SMI [n] and EUCAST [a]
// footnote lists. Native <details> so it is keyboard-accessible with no JS, and
// defaults closed to keep the pages clean (the user can expand on demand).
function collapsibleRefsHtml({blockClass, ariaLabel, title, meta, bodyHtml}){
  return `<details class="refs-collapsible ${blockClass}" aria-label="${ariaLabel}">`
    +`<summary class="refs-summary"><i class="ti ti-chevron-right refs-chev" aria-hidden="true"></i>`
    +`<span class="refs-summary-title">${title}</span>`
    +(meta?`<span class="refs-summary-meta">${meta}</span>`:'')
    +`</summary><div class="refs-body">${bodyHtml}</div></details>`;
}

// ─── EUCAST numbered citations (added v30) ───────────────────────────────
// Companion to the UK SMI [n] system, but for antimicrobial susceptibility
// testing, which is EUCAST scope. Listed the same way as the SMI documents but
// with letter markers [a],[b],[c]… to keep the two reference systems visually
// distinct. Versions/dates mirror eucastCitations + GUIDELINE_VERSIONS.
const EUCAST_REVIEWED = '2026-06-15';
const EUCAST_DOCS = {
  bp:        {name:'EUCAST Breakpoint tables (MIC & zone diameters)', ver:'v16.0 · valid 2026-01-01'},
  disk:      {name:'EUCAST disk diffusion method', ver:'v13.0 (2025)'},
  read:      {name:'EUCAST disk diffusion reading guide', ver:'v11.0 (2025)'},
  atu:       {name:'Area of Technical Uncertainty (ATU) guidance', ver:'v4 (2024)'},
  nobp:      {name:'When there are no breakpoints', ver:'2024-09-03'},
  sir:       {name:'Changes to S/I/R definitions (note to clinical colleagues)', ver:'2021-07-09'},
  rmech:     {name:'Detection of resistance mechanisms (ESBL/AmpC/carbapenemase/MRSA)', ver:'2017-07-11'},
  esbl:      {name:'Guidance document — confirmation of ESBL', ver:'—'},
  erp:       {name:'Expected Resistant Phenotypes', ver:'v1.2 (2023-01-13)'},
  esp:       {name:'Expected Susceptible Phenotypes', ver:'v1.1 (2022-03-25)'},
  ie:        {name:'Intrinsic resistance & insufficient-evidence (IE) guidance', ver:'2024-12-05'},
  er_entero: {name:'Expert Rules — Enterobacterales', ver:'v3.3 (2024-06-30)'},
  er_staph:  {name:'Expert Rules — Staphylococcus', ver:'2025-11-09'},
  er_strep:  {name:'Expert Rules — Streptococcus', ver:'2025-11-09'},
  er_entc:   {name:'Expert Rules — Enterococcus', ver:'2025-11-09'},
  er_pneumo: {name:'Expert Rules — Pneumococcus', ver:'2025-11-09'},
  er_haem:   {name:'Expert Rules — Haemophilus', ver:'v3.2 (2019-06-13)'},
  er_mor:    {name:'Expert Rules — Moraxella', ver:'v3.2 (2019-06-13)'},
  er_coryne: {name:'Expert Rules — Corynebacterium', ver:'v3.2 (2019-06-13)'},
  er_salm:   {name:'Expert Rules — Salmonella', ver:'v3.2 (2019-06-13)'},
  anaero:    {name:'Anaerobe disk diffusion reading guide', ver:'v2.0 (2023)'},
  bcc:       {name:'Burkholderia cepacia complex susceptibility testing', ver:'2019-07-13'},
  amino:     {name:'Aminoglycoside guidance document', ver:'2020-04-24'},
  coli:      {name:'Colistin MIC determination', ver:'2016-03'},
  cefid:     {name:'Cefiderocol MIC testing guidance', ver:'2024-01'},
  afst_bp:   {name:'Antifungal (AFST) clinical breakpoint tables', ver:'v12.1 · valid 2026-04-10'},
  afst_yeast:{name:'AFST E.Def 7.4 — fermentative yeasts', ver:'rev. 2023'},
  afst_mould:{name:'AFST E.Def 9.4 — moulds', ver:'rev. 2023'}
};
function eucastLetter(i){ return i<26 ? String.fromCharCode(97+i) : String.fromCharCode(97+Math.floor(i/26)-1)+String.fromCharCode(97+i%26); }
function eucastRefIndex(keys){
  const ordered=Array.from(new Set((keys||[]).filter(k=>EUCAST_DOCS[k])));
  const letter={}; ordered.forEach((k,i)=>letter[k]=eucastLetter(i));
  return {ordered, letter};
}
function eucastCiteSup(keys, idx){
  const ls=(keys||[]).map(k=>idx.letter[k]).filter(Boolean);
  return ls.length ? `<sup class="eucast-cite" title="EUCAST reference — see footnotes">[${ls.join(',')}]</sup>` : '';
}
function eucastFootnotesHtml(idx, opts){
  opts=opts||{};
  const lis=idx.ordered.map((k,i)=>{
    const d=EUCAST_DOCS[k];
    return `<li><span class="eucast-ref-n">[${eucastLetter(i)}]</span> <span class="eucast-ref-code">${d.name}</span>${d.ver&&d.ver!=='—'?` <span class="eucast-ref-iss">(${d.ver})</span>`:''}</li>`;
  }).join('');
  const note=opts.note ? `<p class="smi-ref-note">${opts.note}</p>` : '';
  const body=`<ol class="eucast-refs">${lis}</ol>`+note
    +`<p class="smi-ref-foot">Each [a] marks the EUCAST document the AST content was validated against (version/date as committed under <code>EUCAST/</code>). EUCAST revises breakpoints annually — verify against the current version before clinical use.</p>`;
  return collapsibleRefsHtml({
    blockClass:'eucast-refs-block', ariaLabel:'EUCAST references', title:'EUCAST references',
    meta:`${idx.ordered.length} document${idx.ordered.length===1?'':'s'} · validated ${EUCAST_REVIEWED}`,
    bodyHtml:body
  });
}
function appendEucastRefs(viewId, keys, opts){
  const view=document.getElementById('view-'+viewId);
  if(!view || view.querySelector(':scope > .eucast-refs-block')) return;
  view.insertAdjacentHTML('beforeend', eucastFootnotesHtml(eucastRefIndex(keys), opts));
}
// Per-view EUCAST document sets (ordered → letters). Curated to the documents
// each AST view's content is actually validated against. `base` is the floor
// (methodology/context docs); the per-view list is then expanded to the UNION
// of base + every doc cited by a panel reachable in that view (computeViewEucastKeys),
// so an inline [a] tag always resolves to a letter shown in that view's box.
const EUCAST_VIEW_REFS = {
  flow:   { base:['bp','disk','read','atu','nobp'], note:'The urine sensitivity panels and zone interpretation are EUCAST clinical breakpoints; conditional-release/reporting logic follows the local SOP.' },
  wound:  { base:['bp','disk','read','rmech'], note:'Wound/pus/deep-tissue panels are EUCAST; resistance-mechanism work (ESBL/AmpC/carbapenemase) and the expert rules drive the reflex and suppression logic.' },
  csf:    { base:['bp','disk','read','rmech'], note:'CSF panels use the EUCAST meningitis breakpoints where they differ from other sites; all CSF results are consultant-authorised.' },
  interp: { base:['bp','rmech','esbl'], note:'The D-set interpreter logic follows the EUCAST resistance-mechanism detection guidance and the MAST disc-set IFUs.' },
  checker:{ base:['bp','disk','read','atu'], note:'Zone-diameter S/I/R thresholds are transcribed from the EUCAST breakpoint tables and disk-diffusion method.' },
  rules:  { base:['erp','esp','ie','er_entero','er_staph','er_strep','er_entc','er_pneumo','er_haem','er_mor','er_coryne','er_salm'], note:'Intrinsic resistance and expected phenotypes are taken from the EUCAST Expected Phenotypes tables and the organism-specific Expert Rules.' },
  abx:    { base:['bp','amino','coli','cefid','sir','nobp'], note:'Agent breakpoints and agent-specific guidance (aminoglycosides, colistin, cefiderocol) are EUCAST.' },
  myco:   { base:['afst_bp','afst_yeast','afst_mould'], note:'Antifungal susceptibility (AFST) breakpoints and methods are EUCAST AFST; morphological identification is UK SMI / atlas-based.' }
};

// ─── Manufacturer IFU numbered citations (molecular / virology stream) ───
// Mirrors the UK SMI [n] system but for the molecular assays, which are
// validated against the manufacturer Instructions For Use (committed under
// IFUs/), not UK SMI or EUCAST. Markers use a distinct .ifu-cite colour so the
// three reference systems ([n] SMI, [a] EUCAST, [n] IFU) stay visually separate.
const IFU_REVIEWED = '2026-06-16';
function ifuDocOrder(){ return (typeof ifuCitations!=='undefined' && ifuCitations.documents) ? Object.keys(ifuCitations.documents) : []; }
function ifuRefIndex(keys){
  const order=ifuDocOrder();
  const ordered=Array.from(new Set((keys||[]).filter(k=>order.includes(k)))).sort((a,b)=>order.indexOf(a)-order.indexOf(b));
  const num={}; ordered.forEach((k,i)=>num[k]=i+1);
  return {ordered,num};
}
function ifuCiteSup(keys, num){
  const ns=(keys||[]).map(k=>num[k]).filter(Boolean);
  return ns.length ? `<sup class="ifu-cite" title="Manufacturer IFU reference — see footnotes">[${ns.join(',')}]</sup>` : '';
}
function ifuFootnotesHtml(idx, opts){
  opts=opts||{};
  const docs=(typeof ifuCitations!=='undefined' && ifuCitations.documents) || {};
  const lis=idx.ordered.map((k,i)=>{
    const d=docs[k]||{};
    return `<li><span class="ifu-ref-n">[${i+1}]</span> <span class="ifu-ref-code">${d.code||k}</span> ${d.name||''}${d.ver?` <span class="ifu-ref-iss">(${d.ver})</span>`:''}</li>`;
  }).join('');
  const note=opts.note ? `<p class="smi-ref-note">${opts.note}</p>` : '';
  const body=`<ol class="ifu-refs">${lis}</ol>`+note
    +`<p class="smi-ref-foot">Each [n] marks the manufacturer Instructions For Use (IFU) the molecular assay content was validated against (revision/date as committed under <code>IFUs/</code>). Guidance only — verify against the current IFU and local SOP before clinical use. Molecular/NAAT results are not UK SMI or EUCAST scope.</p>`;
  return collapsibleRefsHtml({
    blockClass:'ifu-refs-block', ariaLabel:'Manufacturer IFU references', title:'Manufacturer IFU references',
    meta:`${idx.ordered.length} document${idx.ordered.length===1?'':'s'} · validated ${IFU_REVIEWED}`,
    bodyHtml:body
  });
}
function appendIfuRefs(viewId, idx, opts){
  const view=document.getElementById('view-'+viewId);
  if(!view || view.querySelector(':scope > .ifu-refs-block')) return;
  view.insertAdjacentHTML('beforeend', ifuFootnotesHtml(idx, opts));
}
// All molecular IFU documents, in catalogue order — the virology view's box.
function virologyRefs(){ return virologyRefs._ || (virologyRefs._ = ifuRefIndex(ifuDocOrder())); }
// viro_* fcPanel key → IFU document key(s) (matched by stream prefix).
function ifuKeysForPanel(key){
  if(/^viro_(accept_aptima|panther|ct_|ng_|ctng|ct_ng)/.test(key)) return ['aptima_ctng'];
  if(/^viro_(accept_resp|genexpert_resp|resp_)/.test(key)) return ['xpert_resp'];
  if(/^viro_(accept_tb|tb_)/.test(key)) return ['xpert_tb'];
  if(/^viro_(accept_gi|gi_)/.test(key)) return ['xpert_gi','xpert_noro'];
  if(key==='viro_pcr_qc') return ['aptima_ctng','xpert_resp','xpert_tb','xpert_noro'];
  return [];
}

// ── Citation coverage engine ─────────────────────────────────────────────
// Single source of truth mapping any fcPanel → the EUCAST/SMI documents it
// cites, plus which panels are reachable in each view. Drives both the inline
// [a]/[n] tags and the per-view reference boxes so the two can never disagree.
const EUCAST_ORDER = Object.keys(EUCAST_DOCS);                  // canonical letter order
const canonEucast = keys => Array.from(new Set(keys)).filter(k=>EUCAST_DOCS[k])
  .sort((a,b)=>EUCAST_ORDER.indexOf(a)-EUCAST_ORDER.indexOf(b));
// Reagent / identification panels → the UK SMI ID/TP documents they rest on
// (codes taken from the bactId SMI map). Each view's SMI box is unioned with the
// codes of the reagent panels reachable in it (smiRefIndexForView), so every tag
// resolves to a number shown in that page's box.
const REAGENT_SMI = {
  reagent_staph:['ID 7','TP 8','TP 10'], reagent_pseudo:['ID 17','TP 26'], reagent_proteus:['ID 16'],
  w_haem_id:['ID 12','TP 38'], w_pneumo_id:['ID 4','TP 25','TP 5'], w_anaerobe_id:['ID 25','ID 14'],
  w_acine_id:['ID 17','TP 26'], w_aero_id:['ID 19','TP 26'], w_steno_id:['ID 17','TP 26'],
  w_kin_id:['ID 12','TP 26'], w_topical_id:['B 11','B 14'], w_meningo_id:['ID 6','TP 26'],
  w_gono_id:['ID 6','TP 26'], w_list_id:['ID 3'], w_gpb_id:['ID 2'], w_mor_id:['ID 11','TP 26'],
  w_past_id:['ID 13','TP 26'], w_actino_id:['ID 15'], w_burk_id:['ID 17','TP 26']
};
// Governance / referral cards cite the local SOP (not an SMI/EUCAST document) so
// they carry no [n]/[a] tag by design.
const GOVERNANCE_PANELS = new Set(['w_meningo_csf','w_gono_refer']);
// EUCAST AFST docs an antifungal panel (af_* agents / afr_* expected resistance)
// cites — the AFST breakpoint table always, plus the yeast/mould reference method
// per the agent's spectrum (default to both when the panel spans the spectrum).
function afstEucastKeys(key, p){
  const hay=((p.title||'')+' '+(p.sub||'')+' '+(p.notes||'')+' '+(p.abx||[]).join(' ')).toLowerCase();
  const out=new Set(['afst_bp']);
  const yeast=/yeast|candida|cryptococc|krusei|glabrata|albicans|pichia/.test(hay);
  const mould=/mould|mold|aspergill|mucor|fusari|scedosp|lomentospora|dermatoph|terbinafine|indotineae|trichophyton|hyphae|filament/.test(hay);
  if(yeast) out.add('afst_yeast');
  if(mould) out.add('afst_mould');
  if(!yeast && !mould){ out.add('afst_yeast'); out.add('afst_mould'); }
  return [...out];
}
// EUCAST docs a non-reagent (AST) panel cites — base breakpoint+method, refined
// by what the panel is actually about (resistance mechanisms, anaerobes, etc.).
// Antifungal (af_*/afr_*) panels are EUCAST AFST scope; mycology-morphology (fx_*)
// and molecular (viro_*) panels are SMI / IFU scope and carry no EUCAST tag.
function panelEucastKeys(key, p){
  if(!p || p.reagents || /^fx_/.test(key) || /^viro_/.test(key)) return [];
  if(/^af/.test(key)) return afstEucastKeys(key, p);
  const out=new Set(['bp','disk','read']);
  const hay=((p.title||'')+' '+(p.sub||'')+' '+(p.abx||[]).join(' ')+' '+(p.notes||'')).toLowerCase();
  if(/esbl|ampc|amp c|carbapenemase|\bcpe\b|d68|d69|d63|d73|metallo|\bmbl\b|porin|kpc|oxa-48|carbapenem/.test(hay) || key==='d73fc') out.add('rmech');
  if(/confirm[a-z ]*esbl|esbl[a-z ]*confirm/.test(hay)) out.add('esbl');
  if(/anaerob/.test(hay) || /anaerobe/.test(key)) out.add('anaero');
  if(/burkholderia|cepacia/.test(hay) || /^w_burk/.test(key)) out.add('bcc');
  if(/colistin/.test(hay)) out.add('coli');
  if(/cefiderocol/.test(hay) || key==='ur4') out.add('cefid');
  return [...out];
}
// SMI codes a panel cites — reagent/ID panels via REAGENT_SMI; mycology-morphology
// (fx_*) flowchart cards rest on UK SMI ID 1 (fungal morphological identification).
function panelSmiCodes(key, p){
  if(/^fx_/.test(key)) return ['ID 1'];
  return (p && p.reagents && REAGENT_SMI[key]) ? REAGENT_SMI[key].slice() : [];
}
// EUCAST docs an intrinsic-resistance (rules) organism cites: the expected-
// phenotype tables + IE guidance, plus the organism-specific Expert Rules.
function rulesEucastKeys(o){
  const out=['erp','esp','ie'];
  const n=((o.name||'')+' '+(o.aka||'')).toLowerCase();
  if(/salmonella/.test(n)) out.push('er_salm');
  else if(o.group==='gnr') out.push('er_entero');
  if(/staph/.test(n)) out.push('er_staph');
  if(/strep|pyogenes|agalactiae|viridans/.test(n)) out.push('er_strep');
  if(/enterococc/.test(n)) out.push('er_entc');
  if(/pneumonia/.test(n)) out.push('er_pneumo');
  if(/haemophilus/.test(n)) out.push('er_haem');
  if(/moraxella/.test(n)) out.push('er_mor');
  if(/coryneb/.test(n)) out.push('er_coryne');
  return out;
}

// Panels reachable in each AST view = static cards on the page + every card in
// that view's organism-flow dropdown.
function flowCardKeys(flows){ const s=new Set(); Object.values(flows||{}).forEach(f=>(f.cols||[]).forEach(c=>(c.cards||[]).forEach(card=>s.add(card.key)))); return s; }
// Mycology view's on-click cards: the morphology flowchart (fx_*) and the
// antifungal agent / expected-resistance cards (af_*, afr_*).
const mycoPanelKeys = (typeof fcPanels!=='undefined') ? Object.keys(fcPanels).filter(k=>/^fx_|^af/.test(k)) : [];
const VIEW_PANELS = {
  flow:  new Set([...['reagent_proteus','reagent_pseudo','reagent_staph','gp','in','gp1','in1','ur2','ur4','mics'], ...flowCardKeys(typeof orgFlows!=='undefined'?orgFlows:{})]),
  wound: new Set([...['reagent_proteus','reagent_pseudo','reagent_staph','coli1','coli2','coli3','mero_mic'], ...flowCardKeys(typeof orgFlowsWound!=='undefined'?orgFlowsWound:{})]),
  csf:   new Set([...flowCardKeys(typeof orgFlowsCsf!=='undefined'?orgFlowsCsf:{})]),
  myco:  new Set(mycoPanelKeys),
  interp:new Set(['d73fc'])
};
// Final per-view EUCAST key list = base ∪ (docs cited by reachable panels), canon-ordered.
function computeViewEucastKeys(view){
  const cfg=EUCAST_VIEW_REFS[view]; if(!cfg) return [];
  const keys=new Set(cfg.base);
  (VIEW_PANELS[view]||[]).forEach(k=>panelEucastKeys(k, fcPanels[k]).forEach(d=>keys.add(d)));
  return canonEucast([...keys]);
}
const EUCAST_VIEW_KEYS = {};
Object.keys(EUCAST_VIEW_REFS).forEach(v=>{ EUCAST_VIEW_KEYS[v]=computeViewEucastKeys(v); });
const _eucastIdxCache={};
function viewEucastIndex(view){ return _eucastIdxCache[view] || (_eucastIdxCache[view]=eucastRefIndex(EUCAST_VIEW_KEYS[view]||[])); }
const VIEW_SMI_INDEX = { flow:()=>flowRefs(), wound:()=>woundRefs(), csf:()=>csfRefs(), myco:()=>mycoRefs(), plate:()=>plateRefs(), bactid:()=>BACTID_REFS };
function viewSmiIndex(view){ const f=VIEW_SMI_INDEX[view]; return f?f():null; }
// Which view a panel "belongs to" — used to pick the right reference index when
// a panel is opened from a context (search/index) that has no reference box.
function panelHomeView(key){
  if(/^viro_/.test(key)) return 'virology';
  if(/^fx_|^af/.test(key)) return 'myco';
  if(EUCAST_VIEW_KEYS[curView] && (VIEW_PANELS[curView]&&VIEW_PANELS[curView].has(key))) return curView;
  if((VIEW_PANELS.csf||new Set()).has(key) || /^csf_/.test(key)) return 'csf';
  if((VIEW_PANELS.wound||new Set()).has(key) || /^coli|^w_|^mero_mic/.test(key)) return 'wound';
  if((VIEW_PANELS.flow||new Set()).has(key)) return 'flow';
  if(key==='d73fc') return 'interp';
  return 'flow';
}
// Build the combined citation markup for a panel's detail header. Molecular
// (viro_*) panels carry the IFU [n] system; everything else gets the SMI [n]
// and/or EUCAST [a] tags resolved against its home view's reference boxes.
function panelCiteSup(key){
  const p=fcPanels[key]; if(!p) return '';
  if(/^viro_/.test(key)) return ifuCiteSup(ifuKeysForPanel(key), virologyRefs().num);
  const view=panelHomeView(key);
  const smiIdx=viewSmiIndex(view), eucIdx=viewEucastIndex(view);
  const smi = smiIdx ? smiCiteSup(panelSmiCodes(key,p), smiIdx.num) : '';
  const euc = eucIdx ? eucastCiteSup(panelEucastKeys(key,p), eucIdx) : '';
  return smi+euc;
}
function appendSmiRefs(viewId, idx, opts){
  const view=document.getElementById('view-'+viewId);
  if(!view || view.querySelector(':scope > .smi-refs-block')) return;
  view.insertAdjacentHTML('beforeend', smiFootnotesHtml(idx, opts));
}
// Stable numbered index for the bact-ID finder (does not renumber on filter).
const BACTID_REFS = smiRefIndex(bactIdOrganisms.flatMap(o=>o.smi||[]));
// Per-view reference indices — shared by the inline [n] markers AND the
// footnote list on each view so the numbers line up. Hoisted, lazily cached
// functions so they are safe to call from the plate render that runs earlier.
function plateRefs(){ return plateRefs._ || (plateRefs._ = smiRefIndex(Object.values(smiCitations.mediaByKey).flat())); }
// SMI codes contributed by the reagent/ID panels reachable in a view — unioned
// into the view's base list so every reagent [n] tag resolves in the box.
function reagentSmiForView(view){
  const out=[]; (VIEW_PANELS[view]||[]).forEach(k=>{ if(REAGENT_SMI[k]) out.push(...REAGENT_SMI[k]); }); return out;
}
function flowRefs(){ return flowRefs._ || (flowRefs._ = smiRefIndex(['B 41','ID 7','ID 4','ID 16','ID 17','TP 8','TP 10','TP 26','TP 25','TP 5', ...reagentSmiForView('flow')])); }
function woundRefs(){ return woundRefs._ || (woundRefs._ = smiRefIndex(['B 11','B 14','B 17','B 42','B 44','ID 7','ID 4','ID 16','ID 17','ID 12','ID 25','ID 14', ...reagentSmiForView('wound')])); }
function csfRefs(){ return csfRefs._ || (csfRefs._ = smiRefIndex(['B 27','B 41','ID 7','ID 4','ID 16','ID 17', ...reagentSmiForView('csf')])); }
// Mycology view SMI box: ID 1 (fungal morphological identification — the
// flowchart cards) + B 39 (dermatological specimens / superficial mycoses).
function mycoRefs(){ return mycoRefs._ || (mycoRefs._ = smiRefIndex(['ID 1','B 39'])); }

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
    const cite = smiCiteSup(o.smi, BACTID_REFS.num);
    return `<article class="bactid-card"><h3>${o.name}${cite}</h3><div class="bactid-meta">${o.group}</div><div class="bactid-tags">${tags.concat(extra).map(t=>`<span class="bactid-tag">${t}</span>`).join('')}</div><div class="bactid-note">${o.note}</div></article>`;
  }).join('');
  // Numbered UK SMI footnotes for this view (rendered once, stable numbering).
  if(!document.getElementById('bactid-refs')){
    box.insertAdjacentHTML('afterend', `<div id="bactid-refs">`+smiFootnotesHtml(BACTID_REFS, {note:'Each organism is cited to its UK SMI identification (ID) document and the relevant test-procedure (TP) document(s). Spot-validated 2026-06-15 against ID 3/4/6/7/11/13/16/17/19/23 with no discrepancies found.'})+`</div>`);
  }
}

renderBactId();
renderMycology();
renderParasitology();

// UK SMI reference footnotes on the other bacteriology views (shared indices).
appendSmiRefs('plate', plateRefs(),
  {note:'Each plate/organism is marked [n] against the specimen-processing SMI for its context. Chromogenic/selective colour rules (Uriselect, Brilliance MRSA, XLD, TCBS, SMAC) are the manufacturer IFU, not SMI.'});
appendSmiRefs('flow', flowRefs(),
  {note:'Each pathway title is marked [n] against the urine specimen SMI. The sensitivity panels shown in the flows are EUCAST clinical breakpoints, not SMI.'});
appendSmiRefs('wound', woundRefs(),
  {note:'Each pathway title is marked [n] against the wound/pus/deep-tissue specimen SMIs. The sensitivity panels shown in the flows are EUCAST clinical breakpoints, not SMI.'});
appendSmiRefs('csf', csfRefs(),
  {note:'Each CSF organism pathway and its identification cards are marked [n] against the CSF specimen SMI (B 27) and the relevant ID/TP documents. Sensitivity panels use EUCAST meningitis breakpoints (see the EUCAST references box), not SMI; all CSF results are consultant-authorised.'});
appendSmiRefs('myco', mycoRefs(),
  {note:'The fungal morphology flowchart and dermatophyte cards are marked [n] against UK SMI ID 1 (fungal morphological identification) and B 39 (superficial mycoses). Antifungal susceptibility is EUCAST AFST (see the EUCAST references box); colony/microscopy images are atlas-based (Mycology Online, Adelaide) + the UKHSA Mycology Reference Laboratory handbook.'});
// Manufacturer IFU [n] reference list on the molecular (virology) view — its
// content is validated against the assay IFUs, not UK SMI or EUCAST.
appendIfuRefs('virology', virologyRefs(),
  {note:'Each molecular pathway and result card is marked [n] against the manufacturer IFU for that assay (Hologic Panther Aptima CT/NG; Cepheid GeneXpert respiratory, MTB/RIF and Norovirus GI/GII). NAAT does not provide antimicrobial susceptibility; repeat/escalation and reporting follow local SOP.'});
// EUCAST [a] reference lists on the AST-relevant views (companion to the SMI [n]
// lists; collapsed by default). Appended after the SMI blocks so they stack.
Object.entries(EUCAST_VIEW_REFS).forEach(([viewId,cfg])=>appendEucastRefs(viewId, EUCAST_VIEW_KEYS[viewId], {note:cfg.note}));
// Inline EUCAST marker on the antibiotics-view intro (the whole view is EUCAST
// breakpoint/agent-guidance data) and the mycology antifungal section.
(function(){
  const intro=document.querySelector('#view-abx .abx-class-intro');
  if(intro && typeof eucastCiteSup==='function') intro.insertAdjacentHTML('beforeend',' '+eucastCiteSup(['bp'],viewEucastIndex('abx')));
  const afst=document.querySelector('#view-myco #myco-tab-afst, #view-myco [data-myco-tab="afst"]');
  if(afst && typeof eucastCiteSup==='function') afst.insertAdjacentHTML('beforeend',' '+eucastCiteSup(['afst_bp'],viewEucastIndex('myco')));
})();
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
        if(panelKind(k,p)==='molecular' && curView !== 'virology'){
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

  // Parasitology cards (CDC DPDx)
  if(typeof parasites !== 'undefined'){
    parasites.forEach(p=>{
      out.push({kind:'parasite',key:p.key,name:p.disease+' — parasitology',snippet:p.name+' · '+p.note.slice(0,90),hay:paraHay(p),action:()=>{switchView('parasitology');setTimeout(()=>{const t=document.getElementById('para-search');if(t){t.value=p.disease;renderParasitology();}showParasite(p.key);},340);}});
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
  // Antifungal agents (panels classified as 'antifungal')
  if(typeof fcPanels !== 'undefined'){
    Object.entries(fcPanels).filter(([k,p])=>panelKind(k,p)==='antifungal').forEach(([k,p])=>{
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

  // ── Plating protocols (static reference view) ──
  out.push({
    kind:'plating',
    key:'plating_blood',
    name:'Positive blood cultures — plating protocol',
    snippet:'Gram-led media, atmosphere, drops & sensitivity set',
    hay:'plating protocol positive blood culture gram staph strep coli pseudomonas haemophilus neisseria yeast terminal subculture media atmosphere drops sensitivity class 1 msc containment level 3'.toLowerCase(),
    action:()=>{switchView('plating');setTimeout(()=>setPlatingTab('blood'),340);}
  });
  out.push({
    kind:'plating',
    key:'plating_specimens',
    name:'Sample types & primary plates — plating protocol',
    snippet:'Specimen → request code → routine plate set',
    hay:'plating protocol sample type specimen request code primary plates cba choc cled cna sab vcat mrsa baby screen wound swab sputum ear eye throat hvs penis bronchial candida auris'.toLowerCase(),
    action:()=>{switchView('plating');setTimeout(()=>setPlatingTab('specimens'),340);}
  });

  // ── Faeces (static reference view) ──
  out.push({
    kind:'faeces',
    key:'faeces_overview',
    name:'Faeces — culture & investigation overview',
    snippet:'Routine culture, microscopy, crypto, C. diff, outbreak rules',
    hay:'faeces faecal stool routine culture salmonella shigella campylobacter e coli o157 microscopy ova cysts parasites adenovirus rotavirus cryptosporidium c difficile clostridioides outbreak norovirus foreign travel vibrio aeromonas yersinia'.toLowerCase(),
    action:()=>{switchView('faeces');setTimeout(()=>setFaecesTab('overview'),340);}
  });
  out.push({
    kind:'faeces',
    key:'faeces_guide',
    name:'Faeces — investigation guide (decision matrix)',
    snippet:'Patient type → tests by sample & age',
    hay:'faeces faecal stool investigation guide decision matrix inpatient community outbreak basic culture noro c diff rota adeno crypto tcbs apw wet prep yersinia liquid semi-formed formed'.toLowerCase(),
    action:()=>{switchView('faeces');setTimeout(()=>setFaecesTab('guide'),340);}
  });
  out.push({
    kind:'faeces',
    key:'faeces_media',
    name:'Faeces — media incubation',
    snippet:'XLD, SMAC, CAMP, Selenite, YERS, TCBS, APW conditions',
    hay:'faeces faecal stool media incubation xld smac camp selenite broth yersinia yers tcbs apw atmosphere microaerophilic temperature incubation period cefsulodin irgasan novobiocin cin'.toLowerCase(),
    action:()=>{switchView('faeces');setTimeout(()=>setFaecesTab('media'),340);}
  });
  out.push({
    kind:'faeces',
    key:'faeces_wetprep',
    name:'Faeces — wet preparation & staining',
    snippet:'Direct/stained wet prep, concentrate, auramine, ZN',
    hay:'faeces faecal stool wet preparation parasitology direct stained lugol iodine saline trophozoites concentrate method formol ether auramine cryptosporidium oocysts field stain ziehl neelsen giemsa category 3 bsc salmonella typhi paratyphi shigella dysenteriae vibrio cholera'.toLowerCase(),
    action:()=>{switchView('faeces');setTimeout(()=>setFaecesTab('wetprep'),340);}
  });

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
    announceSearch('No matches for "' + q + '"');
    return;
  }
  results.innerHTML = matches.map((m,i)=>{
    const kindLabel = {panel:'Panel',organism:'Plate organism',glossary:'Glossary',pathway:'Pathway','abx-class':'Antibiotic class',antibiotic:'Antibiotic',bactid:'Bacterial ID',intrinsic:'Intrinsic resistance',antifungal:'Antifungal',gram:'Gram film',serology:'Serology test',mycology:'Mycology',fungus:'Mycology',parasite:'Parasitology'}[m.kind] || m.kind;
    const name = highlightMatch(m.name, q);
    const snip = m.snippet ? `<div class="sr-snip">${highlightMatch(m.snippet, q)}</div>` : '';
    return `<div class="search-result" data-idx="${i}" onclick="selectResult(${i})"><div class="sr-kind">${kindLabel}</div><div class="sr-name">${name}</div>${snip}</div>`;
  }).join('');
  results.classList.add('show');
  announceSearch(matches.length + ' result' + (matches.length===1?'':'s') + ' found');
}

// Polite, debounced announcement of search result counts for screen readers.
let _searchAnnounceTimer = 0;
function announceSearch(msg){
  const live = document.getElementById('search-live');
  if(!live) return;
  if(_searchAnnounceTimer) clearTimeout(_searchAnnounceTimer);
  // Debounce so each keystroke doesn't queue a separate utterance; only the
  // settled count is read out.
  _searchAnnounceTimer = setTimeout(()=>{ live.textContent = msg; }, 350);
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
  const live = document.getElementById('search-live');
  if(live) live.textContent = '';
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

// ─── Barcode failsafe ──────────────────────────────────────────────────
// Bench barcodes are entered by a scanner as a rapid keystroke burst (ending
// in Enter). Outside a text field their characters would trigger the 1-9/0
// page-switch shortcuts, flipping through pages. We recognise two shapes:
//   • agar-plate:  'C' + 11 digits            (e.g. C01234567890)
//   • specimen:    '26' + M/S/U + 8 digits    (e.g. 26M01234567)
// On a scanner-speed burst matching either shape we swallow the keystrokes so
// no navigation happens and show a dismissible alert telling the user to scan
// into Synapsys instead. The specimen barcode starts with '2' — itself a
// page-switch key — so a lone '2' keypress is held briefly and only navigates
// if no scanner-speed follow-up arrives.

function isBarcodeAlertOpen(){
  const el = document.getElementById('barcode-alert');
  return !!el && !el.hidden;
}

function showBarcodeAlert(){
  const el = document.getElementById('barcode-alert');
  if(!el) return;
  el.hidden = false;
  const box = el.querySelector('.barcode-alert-box');
  if(box) box.focus();
}

function closeBarcodeAlert(){
  const el = document.getElementById('barcode-alert');
  if(el) el.hidden = true;
}

(function barcodeFailsafe(){
  const MAX_GAP = 80;    // ms between keys to count as scanner-speed (vs human)
  const RESOLVE = 95;    // ms to hold a lone '2' before treating it as navigation
  // Number-key → view map, mirroring the page-switch handler below.
  const NAV = {'1':'flow','2':'wound','3':'interp','4':'abx','5':'plate','6':'bactid','7':'virology','8':'blood','9':'myco','0':'index'};
  let buf = '';          // characters captured in the current fast sequence
  let lastT = 0;         // timestamp of the previous captured key
  let openedAt = 0;      // when the alert was shown (guards the trailing Enter)
  let navTimer = 0;      // pending deferred-navigation timer for a lone '2'

  const clearBuf = () => { buf = ''; lastT = 0; if(navTimer){ clearTimeout(navTimer); navTimer = 0; } };
  const trap = e => { e.preventDefault(); e.stopImmediatePropagation(); };

  // A finished barcode of either shape.
  const isComplete = b => /^C\d{11}$/.test(b) || /^26[MSU]\d{8}$/.test(b);
  // A string that is still a viable prefix of some barcode (more chars could
  // complete it).
  const isViable = b =>
    /^C\d{0,11}$/.test(b) ||      // agar-plate, mid-build
    /^2$/.test(b) ||
    /^26[MSU]?$/.test(b) ||       // specimen, up to the section letter
    /^26[MSU]\d{1,8}$/.test(b);   // specimen, mid-digits

  document.addEventListener('keydown', e => {
    // While the alert is up, trap keys so a second scan can't navigate behind
    // it. Escape always closes; Enter/Space close only after a short guard so
    // the triggering scan's own trailing Enter doesn't dismiss it instantly.
    if(isBarcodeAlertOpen()){
      trap(e);
      if(e.key === 'Escape'){ closeBarcodeAlert(); return; }
      if((e.key === 'Enter' || e.key === ' ') && performance.now() - openedAt > 250){ closeBarcodeAlert(); }
      return;
    }

    // Scanning into a real input/textarea/select is the user's intent — let it
    // type normally and don't track a barcode there.
    const tag = document.activeElement && document.activeElement.tagName;
    if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'){ clearBuf(); return; }

    const now = performance.now();
    const k = e.key;

    // Continuing an in-progress scanner-speed sequence?
    if(buf && now - lastT <= MAX_GAP){
      const cand = buf + k;
      if(isComplete(cand)){ clearBuf(); trap(e); openedAt = now; showBarcodeAlert(); return; }
      if(isViable(cand)){ buf = cand; lastT = now; if(navTimer){ clearTimeout(navTimer); navTimer = 0; } trap(e); return; }
      // Sequence broke — abandon it and let this key be handled fresh below.
      clearBuf();
    } else {
      clearBuf();   // gap too large (or nothing buffered) → stale sequence
    }

    // Fresh start. 'C' has no page-switch shortcut, so just buffer it.
    if(k === 'C' || k === 'c'){ buf = 'C'; lastT = now; return; }

    // '2' both navigates and starts the specimen barcode — hold its navigation
    // briefly; if no scanner-speed key follows, perform the navigation.
    if(k === '2'){
      buf = '2'; lastT = now; trap(e);
      if(navTimer) clearTimeout(navTimer);
      navTimer = setTimeout(() => {
        const lone = buf === '2';
        clearBuf();
        if(lone) switchView(NAV['2']);
      }, RESOLVE);
      return;
    }

    // Any other key isn't a barcode start — leave it for the normal handlers.
  }, true); // capture phase: run before the page-switch keydown handler
})();

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
  if(zone >= a.S) return {cat:'s', label:'S', full:'Susceptible'};
  if(zone < a.R)  return {cat:'r', label:'R', full:'Resistant'};
  return {cat:'i', label:'I', full:'Susceptible, increased exposure'};
}
// Build the inner HTML of a .sir-result cell. A bare "S"/"I"/"R" badge is
// meaningless out of context for a screen reader, so we pair it with a visually
// hidden, agent-qualified phrase that the polite live region announces.
function sirResultHTML(agentName, c){
  if(!c) return '<span class="sir-badge empty" aria-hidden="true">—</span>'
    + `<span class="sr-only">${escapeAttr(agentName)}: no zone entered</span>`;
  return `<span class="sir-badge ${c.cat}" aria-hidden="true">${c.label}</span>`
    + `<span class="sr-only">${escapeAttr(agentName)}: ${c.full}</span>`;
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
  if(titleEl) titleEl.innerHTML = escapeAttr(g.name + ' — measured zones')
    + (typeof eucastCiteSup==='function' ? eucastCiteSup(['bp','disk'], viewEucastIndex('checker')) : '');
  host.innerHTML = g.agents.map((a,i)=>{
    const key = g.id+':'+i;
    const val = checkerZones[key];
    const hasVal = val!==undefined && val!=='' && !isNaN(val);
    let badge = sirResultHTML(a.agent, hasVal ? checkerCategory(a, Number(val)) : null);
    const bp = (a.S===a.R) ? `S/R at ${a.S} mm (binary)` : `S ≥ ${a.S} · R &lt; ${a.R} mm`;
    const tags = (a.screen?'<span class="sir-tag screen">screen</span>':'') + (a.ok?'<span class="sir-tag ok"><i class="ti ti-circle-check" aria-hidden="true"></i> verified</span>':'<span class="sir-tag unver" title="Unverified — correct S/R in data.js and set ok:true"><i class="ti ti-alert-circle" aria-hidden="true"></i> unverified</span>');
    const note = a.note ? `<div class="sir-note">${a.note}</div>` : '';
    return `<div class="sir-row${a.ok?'':' is-unverified'}">
      <div class="sir-agent"><div class="sir-agent-name">${a.agent}</div><div class="sir-agent-meta">${a.disc} · ${bp}</div>${note}</div>
      <div class="sir-tags">${tags}</div>
      <div class="sir-input">
        <div class="zone-input-wrap"><input type="number" inputmode="numeric" min="0" max="60" step="1" placeholder="--" value="${hasVal?val:''}" aria-label="Zone diameter for ${a.agent}" oninput="checkerInput('${g.id}',${i},this.value)"><span class="zone-unit">mm</span></div>
      </div>
      <div class="sir-result" aria-live="polite" aria-atomic="true">${badge}</div>
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
  if(v===undefined || v==='' || isNaN(v)){ resultEl.innerHTML = sirResultHTML(a.agent, null); return; }
  const c = checkerCategory(a, Number(v));
  resultEl.innerHTML = sirResultHTML(a.agent, c);
}
function checkerInit(){
  renderCheckerTabs();
  renderCheckerRows();
  updateCheckerProgress();
}

// ═══════════════════════════════════════════════════════════════════════
// RECENTLY-VIEWED STRIP  (added v25) — persisted to localStorage (key mbr-recents)
// ═══════════════════════════════════════════════════════════════════════
const RECENTS_MAX = 8;
const RECENTS_KEY = 'mbr-recents';
// Each entry is {kind, key, title}. kind selects which detail panel to reopen,
// so the strip can hold cards from any section, not just the sensitivity
// (fcPanels) flowcharts. key is the panel id (or array index for blood tests).
let recentPanels = loadRecents();
const recentKindIcons = {fc:'ti-file-description', fungus:'ti-microscope', parasite:'ti-bug', rules:'ti-ban', blood:'ti-droplet', gram:'ti-flask'};
function loadRecents(){
  try{
    const raw = localStorage.getItem(RECENTS_KEY);
    if(!raw) return [];
    const arr = JSON.parse(raw);
    if(!Array.isArray(arr)) return [];
    // Keep only well-formed entries and re-enforce the cap (defensive against
    // older/corrupt payloads).
    return arr
      .filter(r => r && r.kind && r.key !== undefined && r.key !== null && r.title)
      .map(r => ({kind:r.kind, key:r.key, title:r.title}))
      .slice(0, RECENTS_MAX);
  }catch(e){ return []; }
}
function saveRecents(){
  try{ localStorage.setItem(RECENTS_KEY, JSON.stringify(recentPanels)); }catch(e){/* private mode: skip */}
}
function pushRecent(kind, key, title){
  if(!kind || key === undefined || key === null || !title) return;
  recentPanels = recentPanels.filter(r => !(r.kind === kind && r.key === key));
  recentPanels.unshift({kind, key, title});
  if(recentPanels.length > RECENTS_MAX) recentPanels.length = RECENTS_MAX;
  saveRecents();
  renderRecents();
}
function openRecent(kind, key){
  // #detail-fc is global so fc panels open from any view; the discipline
  // panels live inside their view, so switch first and open after the
  // transition settles (mirrors the global-search result actions).
  // Keep the rail open across the view switch (switchView would otherwise
  // collapse it) so reopening the previous card doesn't flicker.
  _openingRecent = true;
  setRailOpen(true);
  setTimeout(()=>{ _openingRecent = false; }, 420);
  switch(kind){
    case 'fc':       showDetail(key); break;
    case 'fungus':   switchView('myco');          setTimeout(()=>showMycoFungus(key), 340); break;
    case 'parasite': switchView('parasitology');  setTimeout(()=>showParasite(key), 340); break;
    case 'rules':    switchView('rules');         setTimeout(()=>showRulesOrg(key), 340); break;
    case 'blood':    switchView('blood');         setTimeout(()=>showBloodTest(Number(key)), 340); break;
    case 'gram':     switchView('plate');         setTimeout(()=>{setPlateSection('gram');showGramPattern(key);}, 360); break;
  }
}
function clearRecents(){ recentPanels = []; saveRecents(); renderRecents(); }
function renderRecents(){
  const bar = document.getElementById('recents-bar');
  const chips = document.getElementById('recents-chips');
  if(!bar || !chips) return;
  if(!recentPanels.length){ bar.hidden = true; chips.innerHTML=''; return; }
  bar.hidden = false;
  chips.innerHTML = recentPanels.map(r=>{
    const title = r.title || String(r.key);
    const safe = title.replace(/[&<>"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
    const tip = safe.replace(/"/g,'&quot;');
    const icon = recentKindIcons[r.kind] || 'ti-file-description';
    const keyArg = (typeof r.key === 'number') ? r.key : `'${String(r.key).replace(/'/g,"\\'")}'`;
    return `<button class="recents-chip" type="button" onclick="openRecent('${r.kind}',${keyArg})" title="${tip}"><i class="ti ${icon}" aria-hidden="true"></i><span>${safe}</span></button>`;
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

// ═══════════════════════════════════════════════
// HASH ROUTING — shareable deep links (#/section/subsection)
// Static-host friendly: works on GitHub Pages with no server config because
// everything after the # is handled client-side and never sent to the server.
//   e.g.  …/Micro-Bench-Reference-App/#/mycology/dermatophytes
//         …/Micro-Bench-Reference-App/#/d-sets/d68
// ═══════════════════════════════════════════════

// Section slug ↔ internal view id.
const viewSlugs = {
  flow:'urine', wound:'wound', csf:'csf', interp:'d-sets', rules:'intrinsic-resistance',
  checker:'sir-checker', abx:'antibiotics', plating:'plating-protocols', faeces:'faeces', plate:'colony-gram', bactid:'bacterial-id',
  virology:'molecular', blood:'blood-science', myco:'mycology',
  parasitology:'parasitology', serology:'serology', index:'index', notes:'bench-notes'
};
const slugToView = {};
Object.keys(viewSlugs).forEach(v => { slugToView[viewSlugs[v]] = v; });

// Friendly subsection slugs for views whose internal tab keys aren't
// self-explanatory. Views not listed here (interp, index) use their internal
// tab id directly as the slug (e.g. d68, gloss).
const subSlugMaps = {
  myco:  { derm:'dermatophytes', flow:'flowchart', afst:'antifungals' },
  plate: { plate:'plates', gram:'gram' },
  plating: { blood:'blood-cultures', specimens:'sample-types' },
  faeces: { overview:'overview', guide:'investigation-guide', media:'media-incubation', wetprep:'wet-preparation' }
};
function subKeyToSlug(view, key){ const m = subSlugMaps[view]; return m ? (m[key] || key) : key; }
function subSlugToKey(view, slug){
  const m = subSlugMaps[view];
  if(!m) return slug;
  const hit = Object.keys(m).find(k => m[k].toLowerCase() === slug);
  return hit || slug;
}

function buildHash(view, subKey){
  let h = '#/' + (viewSlugs[view] || view);
  if(subKey) h += '/' + subKeyToSlug(view, subKey);
  return h;
}

// Called by switchView and the sub-tab setters to keep the URL in sync. Gated
// so it stays silent during initial module load and while a route is being
// applied from the URL — this prevents hashchange feedback loops.
function writeHash(view, subKey){
  if(!routingReady || routingApply) return;
  const target = buildHash(view, subKey);
  if(location.hash !== target) location.hash = target;
}

function applySubRoute(view, subSlug){
  const key = subSlugToKey(view, subSlug);
  if(view === 'myco') setMycoTab(key);
  else if(view === 'plating') setPlatingTab(key);
  else if(view === 'faeces') setFaecesTab(key);
  else if(view === 'plate') setPlateSection(key);
  else if(view === 'interp'){ if(document.getElementById('itab-' + key)) setITab(key); }
  else if(view === 'index'){ if(document.getElementById('idxtab-' + key)) setIdxTab(key); }
}

function applyRoute(){
  const raw = location.hash.replace(/^#\/?/, '').replace(/\/+$/, '');
  if(!raw) return;                       // no route → leave the current view
  const parts = raw.split('/').filter(Boolean).map(s => decodeURIComponent(s).toLowerCase());
  const view = slugToView[parts[0]];
  if(!view) return;                      // unknown section → ignore quietly
  routingApply = true;
  if(view !== curView) switchView(view);
  if(parts[1]) applySubRoute(view, parts[1]);
  routingApply = false;
}

(function initRouting(){
  routingApply = true;
  applyRoute();                          // honour a deep link present on first load
  routingApply = false;
  routingReady = true;                   // from here on, navigation updates the URL
  window.addEventListener('hashchange', () => {
    routingApply = true;
    applyRoute();
    routingApply = false;
  });
})();


// ═══════════════════════════════════════════════════════════════════════
// ACCESSIBILITY — keyboard operability + focus management for the clickable
// card-type elements (added 2026-06-18 accessibility pass).
//
// The core interaction across the app is clicking a plain <div>/<span> wired
// with onclick= to open a detail panel. These are not native controls, so they
// were mouse-only. This block:
//   1. Adds tabindex="0" + role="button" to those elements (static + the many
//      that are re-rendered via innerHTML — covered by a MutationObserver).
//   2. Adds a single delegated keydown handler so Enter / Space activate them,
//      mirroring the proven .abx-chip pattern (which relies on focusin + a
//      synthetic .click()). Space is preventDefault-ed so the page doesn't
//      scroll. It bails inside text inputs and never interferes with the
//      barcode trap (capture phase, runs first) or the number-key shortcuts.
//   3. Moves focus into a detail panel on open and restores it to the trigger
//      on close, and extends Escape to dismiss every detail panel.
// ═══════════════════════════════════════════════════════════════════════
(function cardA11y(){
  // Selectors for the non-native, onclick-wired interactive elements. Native
  // controls (<button>/<a>, e.g. .recents-chip, checker tabs) are already
  // keyboard-operable and are deliberately excluded. .abx-chip already sets its
  // own tabindex/role in markup, so it's skipped here too.
  const SELECTOR = [
    '.card[onclick]',
    '.myco-card[onclick]',
    '.rules-card[onclick]',
    '.viro-step[onclick]',
    '.viro-result-card[onclick]',
    '.viro-info-card[onclick]',
    '.dset-pill[onclick]',
    '.idx-panel-pill[onclick]',
    '.idx-row[onclick]',
    '.search-result[onclick]'
  ].join(',');

  function decorate(root){
    const scope = root && root.querySelectorAll ? root : document;
    let list = [];
    // Include the root itself if it matches (MutationObserver added-node case).
    if(scope.matches && scope.matches(SELECTOR)) list.push(scope);
    scope.querySelectorAll(SELECTOR).forEach(el=>list.push(el));
    list.forEach(el=>{
      if(!el.hasAttribute('tabindex')) el.setAttribute('tabindex','0');
      if(!el.hasAttribute('role'))     el.setAttribute('role','button');
    });
  }

  // Initial pass over the static + already-rendered markup.
  decorate(document);

  // Re-decorate on DOM mutations: most card grids are rebuilt via innerHTML, so
  // newly inserted nodes need the attributes too. Debounced to coalesce bursts.
  if(typeof MutationObserver !== 'undefined'){
    let pending = false;
    const mo = new MutationObserver(muts=>{
      if(pending) return;
      const hasAdds = muts.some(m=>m.addedNodes && m.addedNodes.length);
      if(!hasAdds) return;
      pending = true;
      // microtask-ish defer so a single render's many mutations are one pass
      Promise.resolve().then(()=>{ pending = false; decorate(document); });
    });
    mo.observe(document.body, {childList:true, subtree:true});
  }

  // Track the element that triggered a panel open, so focus can be restored to
  // it on close. Captured on both pointer and keyboard activation.
  function rememberTrigger(el){
    if(el && el.closest){ const c = el.closest(SELECTOR); if(c) lastPanelTrigger = c; }
  }
  document.addEventListener('click', e=>{ rememberTrigger(e.target); }, true);

  // Delegated keyboard activation (bubble phase — the barcode trap runs in the
  // capture phase and will have already stopped propagation for real scans).
  document.addEventListener('keydown', e=>{
    if(e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    const ae = document.activeElement;
    if(!ae) return;
    const tag = ae.tagName;
    // Never hijack typing in form fields or activation of real controls.
    if(tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' ||
       tag === 'BUTTON' || tag === 'A' || ae.isContentEditable) return;
    const card = ae.closest && ae.closest(SELECTOR);
    if(!card) return;
    e.preventDefault();          // stop Space scrolling / Enter side-effects
    rememberTrigger(card);
    card.click();
  });
})();

// ─── Detail-panel focus management ──────────────────────────────────────────
// On open we move focus to the panel's heading (made programmatically
// focusable); on close we restore focus to the element that opened it. The
// detail panels are: #detail-fc (sensitivity flowcharts, virology),
// #rules-detail (intrinsic resistance), #myco-fungus-panel (dermatophytes),
// #para-panel (parasitology), #gram-panel (Gram films) and #blood-detail
// (blood science).
let lastPanelTrigger = null;

function focusPanelHeading(panelId){
  const panel = document.getElementById(panelId);
  if(!panel) return;
  // Opening a card expands the detail rail (wide screens; no-op when narrow).
  setRailOpen(true);
  // Docked panels are position:fixed. When opened straight after a view switch
  // (search results / recents open at ~340ms, before switchView clears its
  // ~630ms slide transform), the owning view still carries an inline transform,
  // which establishes a containing block and would anchor this fixed panel to
  // the view instead of the viewport. If that transient transform is still set,
  // settle the view now so the panel docks to the bottom of the screen. No-op
  // for direct card clicks, where the view has long since settled.
  const activeView = document.querySelector('.view:not(.hidden)');
  if(activeView && activeView.style.transform){
    activeView.style.transition = 'none';
    activeView.style.transform = '';
  }
  // Defer to the next frame so the panel is displayed/laid out and any
  // scrollIntoView has been kicked off before we move focus into it.
  requestAnimationFrame(()=>{
    const target = panel.querySelector('h3') || panel.querySelector('.detail-close') || panel;
    if(!target) return;
    if(!target.hasAttribute('tabindex')) target.setAttribute('tabindex','-1');
    try{ target.focus({preventScroll:true}); }catch(_){ target.focus(); }
  });
}

function restorePanelTrigger(){
  const t = lastPanelTrigger;
  lastPanelTrigger = null;
  if(t && document.contains(t) && typeof t.focus === 'function'){
    try{ t.focus({preventScroll:true}); }catch(_){ t.focus(); }
  }
}

// Wrap the panel show/close functions to add focus handling without altering
// their existing rendering logic. (showDetail is already wrapped above for the
// recents strip; we wrap that wrapped version once more here.)
(function wirePanelFocus(){
  const wrapShow = (name, panelId) => {
    const orig = window[name];
    if(typeof orig !== 'function') return;
    window[name] = function(){
      const r = orig.apply(this, arguments);
      focusPanelHeading(panelId);
      return r;
    };
  };
  wrapShow('showDetail',     'detail-fc');
  wrapShow('showRulesOrg',   'rules-detail');
  wrapShow('showMycoFungus', 'myco-fungus-panel');
  wrapShow('showParasite',   'para-panel');
  wrapShow('showGramPattern','gram-panel');
  wrapShow('showBloodTest',  'blood-detail');

  // Restore focus to the trigger when a panel is closed via its close function.
  const wrapClose = (name) => {
    const orig = window[name];
    if(typeof orig !== 'function') return;
    window[name] = function(){
      const r = orig.apply(this, arguments);
      restorePanelTrigger();
      return r;
    };
  };
  wrapClose('closeDetail');
  wrapClose('hideRulesOrg');
  wrapClose('hideBloodTestDetail');
})();

// Escape now dismisses ALL detail panels consistently (the original global
// handler only closed #detail-fc and #rules-detail). This listener runs in
// addition to the existing keydown handlers; it only acts on the remaining
// panels so it never double-handles or conflicts with the established flows.
document.addEventListener('keydown', e=>{
  if(e.key !== 'Escape') return;
  // Don't fight the barcode alert, open nav menus, or the two panels already
  // handled by the primary keydown handler — let those win first.
  if(typeof isBarcodeAlertOpen === 'function' && isBarcodeAlertOpen()) return;
  if(typeof anyNavMenuOpen === 'function' && anyNavMenuOpen()) return;
  const dfc = document.getElementById('detail-fc');
  if(dfc && dfc.style.display === 'block') return;        // handled upstream
  const rd = document.getElementById('rules-detail');
  if(rd && rd.style.display === 'block') return;          // handled upstream
  // Remaining panels: close the first visible one and restore focus.
  const myco = document.getElementById('myco-fungus-panel');
  if(myco && myco.style.display === 'block'){ myco.style.display='none'; restorePanelTrigger(); return; }
  const para = document.getElementById('para-panel');
  if(para && para.style.display === 'block'){ para.style.display='none'; restorePanelTrigger(); return; }
  const gram = document.getElementById('gram-panel');
  if(gram && gram.style.display === 'block'){ gram.style.display='none'; restorePanelTrigger(); return; }
  const blood = document.getElementById('blood-detail');
  if(blood && blood.style.display === 'block' && typeof hideBloodTestDetail === 'function'){ hideBloodTestDetail(); return; }
});

/* ============================================================
   TEXT-SIZE CONTROL  (A- / A+ / reset)  — self-contained module
   ------------------------------------------------------------
   The UI is almost entirely px-based, so scaling html{font-size} would not
   touch px rules. Instead we drive a single `--font-scale` custom property
   that styles.css multiplies into `body{ zoom: var(--font-scale) }`. CSS
   `zoom` uniformly scales every px size, gap and font (like browser zoom)
   without rewriting individual rules, and the dropdown positioning math
   (which measures a fixed (0,0) origin in the same zoomed space) stays
   correct under it.

   Scale is clamped to [0.9, 1.4] and persisted to localStorage under
   `mbr-font-scale` (try/catch so private mode / disabled storage is safe).
   Buttons are native <button>s in index.html, so keyboard + a11y are inherent.
   ============================================================ */
(function(){
  var FS_KEY = 'mbr-font-scale';
  var FS_MIN = 0.9, FS_MAX = 1.4, FS_STEP = 0.1, FS_DEFAULT = 1;
  var fontScale = FS_DEFAULT;

  function clampScale(v){
    if(typeof v !== 'number' || isNaN(v)) return FS_DEFAULT;
    return Math.min(FS_MAX, Math.max(FS_MIN, Math.round(v * 100) / 100));
  }
  function applyFontScale(){
    document.documentElement.style.setProperty('--font-scale', String(fontScale));
    var dec = document.getElementById('fsc-dec');
    var inc = document.getElementById('fsc-inc');
    if(dec) dec.disabled = fontScale <= FS_MIN + 1e-9;
    if(inc) inc.disabled = fontScale >= FS_MAX - 1e-9;
  }
  function saveFontScale(){
    try { localStorage.setItem(FS_KEY, String(fontScale)); } catch(e){ /* private mode: ignore */ }
  }
  function setFontScale(v){
    fontScale = clampScale(v);
    applyFontScale();
    saveFontScale();
  }
  // Exposed for the inline onclick handlers in index.html.
  window.fontScaleInc = function(){ setFontScale(fontScale + FS_STEP); };
  window.fontScaleDec = function(){ setFontScale(fontScale - FS_STEP); };
  window.fontScaleReset = function(){ setFontScale(FS_DEFAULT); };

  function initFontScale(){
    var stored = null;
    try { stored = localStorage.getItem(FS_KEY); } catch(e){ /* ignore */ }
    fontScale = stored !== null ? clampScale(parseFloat(stored)) : FS_DEFAULT;
    applyFontScale();
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initFontScale);
  } else {
    initFontScale();
  }
})();

// ─── init (added v25) ───
checkerInit();
renderRecents();
stampGuidelineVersions();
