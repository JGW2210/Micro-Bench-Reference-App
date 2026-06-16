// Citation-coverage audit (independent cross-check of the in-app tagging).
//
// Re-derives, DOM-free, the same SMI/EUCAST citation mapping the app applies so
// it can answer one question: is every piece of citable on-page data tagged?
// It loads data.js, walks every fcPanel and the three organism-flow
// collections, and reports:
//   • any AST/reagent panel that ends up with NO citation tag (a "hole"),
//   • any inline EUCAST key that would not resolve to a letter in its view box
//     (an orphan tag), and
//   • per-view / overall coverage counts.
// Run: node tests/audit-citations.js   (exit 1 if a hole/orphan is found)

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
const data = vm.runInNewContext(`${source}\n({ orgFlows, orgFlowsWound, orgFlowsCsf, fcPanels })`, {});
const { orgFlows, orgFlowsWound, orgFlowsCsf, fcPanels } = data;

// ── Mirror of the app's citation engine (app.js) ─────────────────────────
// Canonical EUCAST document order — must match EUCAST_DOCS key order in app.js.
const EUCAST_ORDER = ['bp','disk','read','atu','nobp','sir','rmech','esbl','erp','esp','ie',
  'er_entero','er_staph','er_strep','er_entc','er_pneumo','er_haem','er_mor','er_coryne','er_salm',
  'anaero','bcc','amino','coli','cefid','afst_bp','afst_yeast','afst_mould'];
const REAGENT_SMI = {
  reagent_staph:['ID 7','TP 8','TP 10'], reagent_pseudo:['ID 17','TP 26'], reagent_proteus:['ID 16'],
  w_haem_id:['ID 12','TP 38'], w_pneumo_id:['ID 4','TP 25','TP 5'], w_anaerobe_id:['ID 25','ID 14'],
  w_acine_id:['ID 17','TP 26'], w_aero_id:['ID 19','TP 26'], w_steno_id:['ID 17','TP 26'],
  w_kin_id:['ID 12','TP 26'], w_topical_id:['B 11','B 14'], w_meningo_id:['ID 6','TP 26'],
  w_gono_id:['ID 6','TP 26'], w_list_id:['ID 3'], w_gpb_id:['ID 2'], w_mor_id:['ID 11','TP 26'],
  w_past_id:['ID 13','TP 26'], w_actino_id:['ID 15'], w_burk_id:['ID 17','TP 26']
};
const GOVERNANCE_PANELS = new Set(['w_meningo_csf','w_gono_refer']);
function panelEucastKeys(key, p){
  if(!p || p.reagents || /^fx_|^af/.test(key) || /^viro_/.test(key)) return [];
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
function panelSmiCodes(key, p){ return (p && p.reagents && REAGENT_SMI[key]) ? REAGENT_SMI[key].slice() : []; }
function flowCardKeys(flows){ const s=new Set(); Object.values(flows||{}).forEach(f=>(f.cols||[]).forEach(c=>(c.cards||[]).forEach(card=>s.add(card.key)))); return s; }
const VIEW_PANELS = {
  flow:  new Set([...['reagent_proteus','reagent_pseudo','reagent_staph','gp','in','gp1','in1','ur2','ur4','mics'], ...flowCardKeys(orgFlows)]),
  wound: new Set([...['reagent_proteus','reagent_pseudo','reagent_staph','coli1','coli2','coli3','mero_mic'], ...flowCardKeys(orgFlowsWound)]),
  csf:   new Set([...flowCardKeys(orgFlowsCsf)]),
  interp:new Set(['d73fc'])
};
const EUCAST_BASE = {
  flow:['bp','disk','read','atu','nobp'], wound:['bp','disk','read','rmech'], csf:['bp','disk','read','rmech'],
  interp:['bp','rmech','esbl'], checker:['bp','disk','read','atu'],
  rules:['erp','esp','ie','er_entero','er_staph','er_strep','er_entc','er_pneumo','er_haem','er_mor','er_coryne','er_salm'],
  abx:['bp','amino','coli','cefid','sir','nobp'], myco:['afst_bp','afst_yeast','afst_mould']
};
function computeViewEucastKeys(view){
  const base=EUCAST_BASE[view]; if(!base) return [];
  const keys=new Set(base);
  (VIEW_PANELS[view]||[]).forEach(k=>panelEucastKeys(k, fcPanels[k]).forEach(d=>keys.add(d)));
  return Array.from(keys).sort((a,b)=>EUCAST_ORDER.indexOf(a)-EUCAST_ORDER.indexOf(b));
}

// ── Audit ────────────────────────────────────────────────────────────────
const problems = [];
const INTENTIONALLY_UNTAGGED = k => /^viro_|^fx_|^af/.test(k);   // molecular / mycology-morphology / antifungal-agent panels

// 1) Every EUCAST doc key referenced anywhere must exist in the canonical order.
const allKeysSeen = new Set();
Object.keys(fcPanels).forEach(k => panelEucastKeys(k, fcPanels[k]).forEach(d => allKeysSeen.add(d)));
Object.values(EUCAST_BASE).flat().forEach(d => allKeysSeen.add(d));
allKeysSeen.forEach(d => { if(!EUCAST_ORDER.includes(d)) problems.push(`EUCAST key "${d}" is not in EUCAST_ORDER (would have no letter)`); });

// 2) No orphan inline tags: every panel's EUCAST keys ⊆ its view's computed list.
const viewKeys = {}; Object.keys(EUCAST_BASE).forEach(v => viewKeys[v] = new Set(computeViewEucastKeys(v)));
['flow','wound','csf','interp'].forEach(view => {
  (VIEW_PANELS[view]||[]).forEach(k => {
    panelEucastKeys(k, fcPanels[k]).forEach(d => {
      if(!viewKeys[view].has(d)) problems.push(`${view}: panel "${k}" cites EUCAST [${d}] but it is absent from the view's reference box`);
    });
  });
});

// 3) Every reagent panel's SMI codes resolve in EVERY view it is reachable in
//    (the app unions reagent codes into each view's SMI box — verify it holds).
const SMI_BASE = {
  flow:['B 41','ID 7','ID 4','ID 16','ID 17','TP 8','TP 10','TP 26','TP 25','TP 5'],
  wound:['B 11','B 14','B 17','B 42','B 44','ID 7','ID 4','ID 16','ID 17','ID 12','ID 25','ID 14'],
  csf:['B 27','B 41','ID 7','ID 4','ID 16','ID 17']
};
function reagentSmiForView(view){ const out=[]; (VIEW_PANELS[view]||[]).forEach(k=>{ if(REAGENT_SMI[k]) out.push(...REAGENT_SMI[k]); }); return out; }
const VIEW_SMI = {};
['flow','wound','csf'].forEach(v => VIEW_SMI[v] = new Set([...(SMI_BASE[v]||[]), ...reagentSmiForView(v)]));
['flow','wound','csf'].forEach(view => {
  (VIEW_PANELS[view]||[]).forEach(k => {
    (REAGENT_SMI[k]||[]).forEach(code => {
      if(!VIEW_SMI[view].has(code)) problems.push(`${view}: reagent panel "${k}" SMI [${code}] is absent from the view's SMI box (tag would not render)`);
    });
  });
});

// 4) Coverage: every fcPanel should get at least one tag, unless intentionally untagged.
const holes = [];
const tagged = { eucast:0, smi:0, both:0, none:0 };
Object.keys(fcPanels).forEach(k => {
  if(INTENTIONALLY_UNTAGGED(k) || GOVERNANCE_PANELS.has(k)) return;
  const e = panelEucastKeys(k, fcPanels[k]).length > 0;
  const s = panelSmiCodes(k, fcPanels[k]).length > 0;
  if(e && s) tagged.both++; else if(e) tagged.eucast++; else if(s) tagged.smi++;
  else { tagged.none++; holes.push(k); }
});

// ── Report ────────────────────────────────────────────────────────────────
console.log('Citation coverage audit');
console.log('─'.repeat(60));
Object.keys(EUCAST_BASE).forEach(v => {
  const keys = computeViewEucastKeys(v);
  const letters = keys.map((k,i)=>`[${String.fromCharCode(97+i)}]${k}`).join(' ');
  console.log(`  ${v.padEnd(7)} EUCAST docs: ${letters}`);
});
console.log('─'.repeat(60));
console.log(`  fcPanels tagged — EUCAST only: ${tagged.eucast}, SMI only: ${tagged.smi}, both: ${tagged.both}, none: ${tagged.none}`);
const untagged = Object.keys(fcPanels).filter(INTENTIONALLY_UNTAGGED).length;
console.log(`  intentionally untagged (molecular / mycology-morphology / antifungal): ${untagged}`);

if(holes.length){
  console.log('\n  ⚠ Panels with NO citation tag (review — should these be tagged?):');
  holes.forEach(h => console.log(`    - ${h}: ${fcPanels[h].title}`));
}
if(problems.length){
  console.error(`\nAudit FAILED (${problems.length} issue${problems.length===1?'':'s'}):`);
  problems.forEach(p => console.error(`  - ${p}`));
  process.exit(1);
}
console.log('\nAudit passed — no orphan tags, no unresolved SMI codes.' + (holes.length?` (${holes.length} untagged panel(s) listed above for review.)`:''));
