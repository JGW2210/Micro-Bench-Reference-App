const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'data.js');
const source = fs.readFileSync(dataPath, 'utf8');

const data = vm.runInNewContext(`${source}
({
  orgFlowsWound,
  orgFlowsCsf,
  orgFlows,
  fcPanels,
  dconfigs,
  d73mmDiscs,
  routineSets,
  rareSets,
  anaerobeMICs,
  qcWeeklyOrganisms,
  qcDailyOrganisms,
  parasites,
  oxoidDiscCodes,
  serologyTests,
  serologyProfiles,
  serologySampleKey,
  organisms,
  gramPatterns,
  expectedPhenotypes,
  glossary,
  organismIndexEntries,
  bactIdFields,
  bactIdOrganisms,
  GUIDELINE_VERSIONS,
  sirBreakpoints,
  eucastCitations,
  ifuCitations,
  smiCitations
})`, {}, { filename: dataPath });

// Index every file committed under EUCAST/ by basename, so citation entries can
// be checked against what actually exists on disk (ISO 15189 traceability).
const eucastDir = path.join(root, 'EUCAST');
const eucastFiles = new Set();
(function indexDir(dir) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) indexDir(full);
    else eucastFiles.add(entry.name);
  });
})(eucastDir);

const failures = [];

function fail(message) {
  failures.push(message);
}

function assert(condition, message) {
  if (!condition) fail(message);
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function valuesById(items, idProp = 'id') {
  const map = new Map();
  items.forEach((item, index) => {
    const id = item && item[idProp];
    if (!hasText(id)) fail(`Item at index ${index} is missing ${idProp}`);
    else if (map.has(id)) fail(`Duplicate ${idProp}: ${id}`);
    else map.set(id, item);
  });
  return map;
}

function validateFlowCollection(name, flows) {
  assert(isObject(flows), `${name} must be an object`);
  Object.entries(flows || {}).forEach(([flowId, flow]) => {
    assert(hasText(flow.label), `${name}.${flowId} is missing label`);
    assert(Array.isArray(flow.cols) && flow.cols.length > 0, `${name}.${flowId} must have columns`);
    (flow.cols || []).forEach((col, colIndex) => {
      assert(hasText(col.header), `${name}.${flowId}.cols[${colIndex}] is missing header`);
      assert(Array.isArray(col.cards) && col.cards.length > 0, `${name}.${flowId}.cols[${colIndex}] must have cards`);
      (col.cards || []).forEach((card, cardIndex) => {
        const where = `${name}.${flowId}.cols[${colIndex}].cards[${cardIndex}]`;
        assert(hasText(card.name), `${where} is missing name`);
        assert(hasText(card.key), `${where} is missing key`);
        if (hasText(card.key)) assert(Boolean(data.fcPanels[card.key]), `${where} references missing fcPanels.${card.key}`);
      });
    });
  });
}

function validateFcPanels() {
  assert(isObject(data.fcPanels), 'fcPanels must be an object');
  Object.entries(data.fcPanels || {}).forEach(([key, panel]) => {
    if (key.startsWith('__')) return;
    assert(hasText(panel.title), `fcPanels.${key} is missing title`);
    assert(Array.isArray(panel.abx), `fcPanels.${key}.abx must be an array`);
    (panel.abx || []).forEach((item, index) => {
      assert(hasText(item), `fcPanels.${key}.abx[${index}] must be text`);
    });
  });
}

function validateDconfigs() {
  const expectedSets = ['d68', 'd69', 'd63', 'd73'];
  expectedSets.forEach(id => assert(Boolean(data.dconfigs[id]), `dconfigs.${id} is missing`));

  Object.entries(data.dconfigs || {}).forEach(([id, cfg]) => {
    assert(Array.isArray(cfg.discs) && cfg.discs.length > 0, `dconfigs.${id}.discs must be a non-empty array`);
    assert(Array.isArray(cfg.patterns) && cfg.patterns.length > 0, `dconfigs.${id}.patterns must be a non-empty array`);

    const discLetters = new Set();
    (cfg.discs || []).forEach((disc, index) => {
      assert(hasText(disc.l), `dconfigs.${id}.discs[${index}] is missing l`);
      assert(hasText(disc.label), `dconfigs.${id}.discs[${index}] is missing label`);
      if (hasText(disc.l)) {
        assert(!discLetters.has(disc.l), `dconfigs.${id} has duplicate disc letter ${disc.l}`);
        discLetters.add(disc.l);
      }
    });

    const seenPatterns = new Set();
    (cfg.patterns || []).forEach((pattern, index) => {
      const where = `dconfigs.${id}.patterns[${index}]`;
      assert(Array.isArray(pattern.v), `${where}.v must be an array`);
      assert(pattern.v.length === cfg.discs.length, `${where}.v length must match disc count`);
      (pattern.v || []).forEach((value, valueIndex) => {
        assert(value === 'S' || value === 'R', `${where}.v[${valueIndex}] must be S or R`);
      });
      const key = (pattern.v || []).join(',');
      assert(!seenPatterns.has(key), `${where} duplicates pattern ${key}`);
      seenPatterns.add(key);
      assert(['success', 'match', 'warn', 'danger'].includes(pattern.type), `${where}.type is invalid: ${pattern.type}`);
      assert(hasText(pattern.title), `${where} is missing title`);
      assert(hasText(pattern.body), `${where} is missing body`);
    });
  });

  const d73Letters = (data.d73mmDiscs || []).map(d => d.l).join('');
  assert(d73Letters === 'ABCDE', `d73mmDiscs should contain A-E in order, got ${d73Letters || '(none)'}`);
}

function validateRoutineSets() {
  assert(Array.isArray(data.routineSets) && data.routineSets.length > 0, 'routineSets must be a non-empty array');
  data.routineSets.forEach((group, groupIndex) => {
    assert(hasText(group.section), `routineSets[${groupIndex}] is missing section`);
    assert(Array.isArray(group.sets) && group.sets.length > 0, `routineSets[${groupIndex}].sets must be non-empty`);
    (group.sets || []).forEach((set, setIndex) => {
      const where = `routineSets[${groupIndex}].sets[${setIndex}]`;
      assert(hasText(set.name), `${where} is missing name`);
      assert(Array.isArray(set.codes) && set.codes.every(hasText), `${where}.codes must be non-empty text values`);
      assert(Array.isArray(set.antibiotics) && set.antibiotics.every(hasText), `${where}.antibiotics must be non-empty text values`);
    });
  });

  assert(Array.isArray(data.rareSets), 'rareSets must be an array');
  data.rareSets.forEach((entry, index) => {
    assert(Array.isArray(entry) && entry.length === 2, `rareSets[${index}] must be [name, discs]`);
    assert(hasText(entry[0]), `rareSets[${index}] is missing name`);
    assert(Array.isArray(entry[1]), `rareSets[${index}] discs must be an array`);
  });

  [['qcWeeklyOrganisms', data.qcWeeklyOrganisms], ['qcDailyOrganisms', data.qcDailyOrganisms]].forEach(([label, list]) => {
    assert(Array.isArray(list) && list.length > 0, `${label} must be non-empty`);
    (list || []).forEach((org, index) => {
      assert(hasText(org.name), `${label}[${index}] is missing name`);
      assert(hasText(org.strain), `${label}[${index}] is missing strain`);
      assert(Array.isArray(org.plates) && org.plates.every(hasText), `${label}[${index}].plates must be non-empty text values`);
      assert(hasText(org.bcName), `${label}[${index}] is missing bcName`);
      assert(hasText(org.bcStrain), `${label}[${index}] is missing bcStrain`);
    });
  });

  const parasiteClasses = new Set(['protozoa', 'nematode', 'cestode', 'trematode', 'ectoparasite']);
  const parasiteSites = new Set(['blood', 'stool', 'urogenital', 'tissue', 'skin', 'csf', 'respiratory']);
  const parasiteMethods = new Set(['microscopy', 'serology', 'molecular']);
  const parasiteKeys = new Set();
  assert(Array.isArray(data.parasites) && data.parasites.length > 0, 'parasites must be non-empty');
  data.parasites.forEach((p, index) => {
    const where = `parasites[${index}]${p && p.disease ? ` (${p.disease})` : ''}`;
    assert(hasText(p.key), `${where} is missing key`);
    assert(!parasiteKeys.has(p.key), `${where} has duplicate key ${p.key}`);
    parasiteKeys.add(p.key);
    assert(hasText(p.name), `${where} is missing name`);
    assert(hasText(p.disease), `${where} is missing disease`);
    assert(hasText(p.note), `${where} is missing note`);
    assert(hasText(p.specimen), `${where} is missing specimen`);
    assert(parasiteClasses.has(p.cls), `${where} has invalid cls ${p.cls}`);
    assert(Array.isArray(p.site) && p.site.length > 0 && p.site.every(s => parasiteSites.has(s)), `${where}.site must be non-empty valid specimen keys`);
    assert(Array.isArray(p.dx) && p.dx.length > 0 && p.dx.every(d => parasiteMethods.has(d)), `${where}.dx must be non-empty valid method keys`);
    assert(Array.isArray(p.clues) && p.clues.every(hasText), `${where}.clues must be non-empty text values`);
    assert(/^https:\/\/www\.cdc\.gov\/dpdx\/.+\/index\.html$/.test(p.url || ''), `${where} must link to a CDC DPDx index.html page`);
  });
}

function validateIndexes() {
  assert(isObject(data.organisms), 'organisms must be an object keyed by organism id');
  const organismKeys = new Set(Object.keys(data.organisms || {}));
  (data.organismIndexEntries || []).forEach((group, groupIndex) => {
    assert(hasText(group.section), `organismIndexEntries[${groupIndex}] is missing section`);
    assert(Array.isArray(group.items), `organismIndexEntries[${groupIndex}].items must be an array`);
    (group.items || []).forEach((item, itemIndex) => {
      const where = `organismIndexEntries[${groupIndex}].items[${itemIndex}]`;
      assert(hasText(item.name), `${where} is missing name`);
      assert(hasText(item.key), `${where} is missing key`);
      if (item.type === 'organism') assert(organismKeys.has(item.key), `${where} references missing organisms key ${item.key}`);
      else assert(Boolean(data.fcPanels[item.key]), `${where} references missing fcPanels.${item.key}`);
    });
  });

  assert(Array.isArray(data.glossary) && data.glossary.length > 0, 'glossary must be non-empty');
  data.glossary.forEach((item, index) => {
    assert(hasText(item.g), `glossary[${index}] is missing group`);
    assert(hasText(item.t), `glossary[${index}] is missing term`);
    assert(hasText(item.d), `glossary[${index}] is missing definition`);
  });
}

function validateBactId() {
  assert(Array.isArray(data.bactIdFields) && data.bactIdFields.length > 0, 'bactIdFields must be non-empty');
  assert(Array.isArray(data.bactIdOrganisms) && data.bactIdOrganisms.length > 0, 'bactIdOrganisms must be non-empty');
  const runtimeFilledFields = new Set(['tributyrin', 'hughleifson']);
  data.bactIdOrganisms.forEach((org, index) => {
    assert(hasText(org.name), `bactIdOrganisms[${index}] is missing name`);
    data.bactIdFields.forEach(field => {
      if (runtimeFilledFields.has(field)) return;
      assert(Object.prototype.hasOwnProperty.call(org, field), `bactIdOrganisms[${index}] ${org.name || ''} is missing ${field}`);
    });
  });
}

function validateSerology() {
  assert(Array.isArray(data.serologyTests), 'serologyTests must be an array');
  data.serologyTests.forEach((test, index) => {
    assert(hasText(test.name), `serologyTests[${index}] is missing name`);
    assert(hasText(test.code) || hasText(test.note), `serologyTests[${index}] is missing code and routing note`);
    assert(hasText(test.sample) || hasText(test.note), `serologyTests[${index}] is missing sample and routing note`);
    assert(test.loc === 'in' || test.loc === 'send', `serologyTests[${index}].loc must be in or send`);
  });

  const testCodes = new Set(data.serologyTests.map(t => t.code));
  (data.serologyProfiles || []).forEach((profile, index) => {
    assert(hasText(profile.name), `serologyProfiles[${index}] is missing name`);
    assert(Array.isArray(profile.codes), `serologyProfiles[${index}].codes must be an array`);
    (profile.codes || []).forEach(code => assert(testCodes.has(code), `serologyProfiles[${index}] references missing code ${code}`));
  });

  assert(Array.isArray(data.serologySampleKey), 'serologySampleKey must be an array');
}

function validateSirBreakpoints() {
  assert(isObject(data.sirBreakpoints), 'sirBreakpoints must be an object');
  assert(hasText(data.sirBreakpoints.version), 'sirBreakpoints.version is missing');
  assert(Array.isArray(data.sirBreakpoints.groups) && data.sirBreakpoints.groups.length > 0, 'sirBreakpoints.groups must be non-empty');

  valuesById(data.sirBreakpoints.groups || [], 'id');
  (data.sirBreakpoints.groups || []).forEach(group => {
    assert(hasText(group.name), `sirBreakpoints.groups.${group.id} is missing name`);
    assert(Array.isArray(group.agents) && group.agents.length > 0, `sirBreakpoints.groups.${group.id}.agents must be non-empty`);
    (group.agents || []).forEach((agent, index) => {
      const where = `sirBreakpoints.groups.${group.id}.agents[${index}]`;
      assert(hasText(agent.agent), `${where} is missing agent`);
      assert(hasText(agent.disc), `${where} is missing disc`);
      assert(Number.isFinite(agent.S) && agent.S >= 0, `${where}.S must be a non-negative number`);
      assert(Number.isFinite(agent.R) && agent.R >= 0, `${where}.R must be a non-negative number`);
      assert(agent.S >= agent.R, `${where}.S must be greater than or equal to R`);
      assert(typeof agent.ok === 'boolean', `${where}.ok must be boolean`);
      // Citation record claims every agent is transcribed & signed off vs v16.0.
      assert(agent.ok === true, `${where} (${agent.agent}) is not signed off (ok:true) against EUCAST v16.0`);
      assert(typeof agent.note === 'string', `${where} (${agent.agent}).note must be a string`);
      if ('screen' in agent) assert(agent.screen === true, `${where} (${agent.agent}).screen must be true when present`);
    });
  });
}

function validateExpectedPhenotypes() {
  assert(Array.isArray(data.expectedPhenotypes) && data.expectedPhenotypes.length > 0, 'expectedPhenotypes must be a non-empty array');
  const groups = new Set(['gnr', 'nf', 'gpc', 'anaerobe']);
  valuesById(data.expectedPhenotypes || [], 'id');
  (data.expectedPhenotypes || []).forEach((o, index) => {
    const where = `expectedPhenotypes[${index}]${o && o.id ? ` (${o.id})` : ''}`;
    assert(hasText(o.name), `${where} is missing name`);
    assert(groups.has(o.group), `${where} has invalid group ${o.group}`);
    assert(Array.isArray(o.resist) && o.resist.length > 0 && o.resist.every(hasText), `${where}.resist must be non-empty text values`);
    assert(Array.isArray(o.rules) && o.rules.length > 0 && o.rules.every(hasText), `${where}.rules must be non-empty text values`);
  });
}

function validateEucastCitations() {
  const cites = data.eucastCitations;
  assert(isObject(cites), 'eucastCitations must be an object');
  assert(isObject(cites && cites.documents), 'eucastCitations.documents must be an object');
  assert(isObject(cites && cites.appliesTo), 'eucastCitations.appliesTo must be an object');

  // Every cited file (documents + agentGuidance) must exist on disk under EUCAST/.
  const citedFiles = [];
  (function collect(obj) {
    Object.entries(obj || {}).forEach(([key, value]) => {
      if (key === 'file' && typeof value === 'string') citedFiles.push(value);
      else if (isObject(value)) collect(value);
    });
  })(cites.documents);
  Object.values((cites && cites.agentGuidance) || {}).forEach(f => citedFiles.push(f));

  assert(citedFiles.length > 0, 'eucastCitations cites no files');
  citedFiles.forEach(file => {
    assert(hasText(file), 'eucastCitations has an empty file citation');
    if (hasText(file)) assert(eucastFiles.has(path.basename(file)), `eucastCitations references missing file on disk: ${file}`);
  });

  assert(isObject(cites.agentGuidance), 'eucastCitations.agentGuidance must be an object');
  Object.entries(cites.agentGuidance || {}).forEach(([label, file]) => {
    assert(hasText(label), 'eucastCitations.agentGuidance has an empty label');
    assert(hasText(file), `eucastCitations.agentGuidance.${label} is missing a file`);
  });
}

function validateIfuCitations() {
  const cites = data.ifuCitations;
  assert(isObject(cites), 'ifuCitations must be an object');
  assert(isObject(cites && cites.documents), 'ifuCitations.documents must be an object');

  // Index every file committed under IFUs/ by basename, so each cited IFU can be
  // checked against what actually exists on disk (ISO 15189 traceability).
  const ifuDir = path.join(root, 'IFUs');
  const ifuFiles = new Set();
  (function indexDir(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) indexDir(full);
      else ifuFiles.add(entry.name);
    });
  })(ifuDir);

  const docKeys = Object.keys(cites.documents || {});
  assert(docKeys.length > 0, 'ifuCitations cites no documents');
  docKeys.forEach(key => {
    const doc = cites.documents[key];
    assert(isObject(doc), `ifuCitations.documents.${key} must be an object`);
    assert(hasText(doc.code), `ifuCitations.documents.${key} is missing code`);
    assert(hasText(doc.name), `ifuCitations.documents.${key} is missing name`);
    assert(hasText(doc.file), `ifuCitations.documents.${key} is missing file`);
    if (hasText(doc.file)) assert(ifuFiles.has(path.basename(doc.file)), `ifuCitations references missing IFU on disk: ${doc.file}`);
  });
}

function validateSmiCitations() {
  const cites = data.smiCitations;
  assert(isObject(cites), 'smiCitations must be an object');
  if (!isObject(cites)) return;

  const docs = cites.documents;
  assert(isObject(docs), 'smiCitations.documents must be an object');
  if (!isObject(docs)) return;

  // documents.{B,S,ID} are code → string maps; documents.TP is code → {title}.
  // Build the set of every valid (citable) document code across all series.
  const validCodes = new Set();
  ['B', 'S', 'ID'].forEach(series => {
    assert(isObject(docs[series]), `smiCitations.documents.${series} must be an object of code → string`);
    Object.entries(docs[series] || {}).forEach(([code, title]) => {
      assert(hasText(title), `smiCitations.documents.${series}.${code} must be a non-empty string title`);
      validCodes.add(code);
    });
  });
  assert(isObject(docs.TP), 'smiCitations.documents.TP must be an object of code → {title}');
  Object.entries(docs.TP || {}).forEach(([code, entry]) => {
    assert(isObject(entry) && hasText(entry.title), `smiCitations.documents.TP.${code} must be an object with a non-empty title`);
    validCodes.add(code);
  });

  // withdrawn: code → replacement string. Withdrawn codes are intentionally NOT
  // in documents, but anything they point at should resolve (parse any
  // "→ replaced by S 6" / "merged into B 5" style code out of the text).
  const withdrawnCodes = new Set(Object.keys(cites.withdrawn || {}));
  assert(isObject(cites.withdrawn), 'smiCitations.withdrawn must be an object');
  Object.entries(cites.withdrawn || {}).forEach(([code, text]) => {
    assert(hasText(text), `smiCitations.withdrawn.${code} must be a non-empty replacement note`);
    assert(!validCodes.has(code), `smiCitations.withdrawn.${code} is also an active documents entry (withdrawn codes must not be catalogued)`);
    (String(text).match(/\b(?:B|S|ID|TP)\s+\d+\b/g) || []).forEach(ref => {
      assert(validCodes.has(ref) || withdrawnCodes.has(ref), `smiCitations.withdrawn.${code} points at ${ref} which is neither a live documents code nor a catalogued withdrawn code`);
    });
  });

  // A reference resolves if it is a live documents code OR an intentional
  // withdrawn entry (the latter is repointed to its replacement in-app).
  const resolves = code => validCodes.has(code) || withdrawnCodes.has(code);

  // verifiedIssues: every key must have a matching live documents entry.
  assert(isObject(cites.verifiedIssues), 'smiCitations.verifiedIssues must be an object');
  Object.entries(cites.verifiedIssues || {}).forEach(([code, issue]) => {
    assert(hasText(issue), `smiCitations.verifiedIssues.${code} must be a non-empty issue/date string`);
    assert(validCodes.has(code), `smiCitations.verifiedIssues.${code} has no matching documents entry`);
  });

  // Cross-reference maps: every cited code must resolve to a real documents code
  // (or an intentional withdrawn entry). Fail loudly with the offending key.
  [
    ['specimenPathways', cites.specimenPathways],
    ['mediaByKey', cites.mediaByKey],
    ['tests', cites.tests],
    ['organisms', cites.organisms]
  ].forEach(([label, map]) => {
    assert(isObject(map), `smiCitations.${label} must be an object`);
    Object.entries(map || {}).forEach(([key, codes]) => {
      assert(Array.isArray(codes) && codes.length > 0, `smiCitations.${label}.${key} must be a non-empty array of SMI codes`);
      (codes || []).forEach(code => {
        assert(resolves(code), `smiCitations.${label}.${key} references unknown SMI code ${code}`);
      });
    });
  });

  // Disk verification: index every PDF committed under SMIs/ by repo-relative
  // path, then assert each catalogued code's file: entry exists on disk
  // (ISO 15189 / UKAS traceability) — the same model used for EUCAST/ and IFUs/.
  // Every live B/S/ID/TP code must carry a file: entry, and vice-versa.
  const smiDir = path.join(root, 'SMIs');
  const smiFiles = new Set();
  (function indexDir(dir) {
    if (!fs.existsSync(dir)) return;
    fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) indexDir(full);
      else smiFiles.add(path.relative(root, full));
    });
  })(smiDir);

  const files = cites.files;
  assert(isObject(files), 'smiCitations.files must be an object keyed by series');
  const filedCodes = new Set();
  ['B', 'S', 'ID', 'TP'].forEach(series => {
    assert(isObject(files && files[series]), `smiCitations.files.${series} must be an object of code → file path`);
    Object.entries((files && files[series]) || {}).forEach(([code, file]) => {
      assert(hasText(file), `smiCitations.files.${series}.${code} must be a non-empty file path`);
      assert(validCodes.has(code), `smiCitations.files.${series}.${code} is not a real documents code`);
      filedCodes.add(code);
      if (hasText(file)) assert(smiFiles.has(file), `smiCitations references missing SMI on disk: ${file}`);
    });
  });
  // Every catalogued code must have a disk file (no code without a verified PDF).
  validCodes.forEach(code => {
    assert(filedCodes.has(code), `smiCitations.documents has code ${code} with no smiCitations.files disk entry`);
  });
}

function validateGuidelineVersions() {
  assert(isObject(data.GUIDELINE_VERSIONS), 'GUIDELINE_VERSIONS must be an object');
  Object.entries(data.GUIDELINE_VERSIONS || {}).forEach(([viewId, cfg]) => {
    if (viewId === '_meta') {
      assert(hasText(cfg.appData), 'GUIDELINE_VERSIONS._meta.appData is missing');
      assert(hasText(cfg.reviewed), 'GUIDELINE_VERSIONS._meta.reviewed is missing');
      return;
    }
    assert(Array.isArray(cfg.lines) && cfg.lines.length > 0, `GUIDELINE_VERSIONS.${viewId}.lines must be non-empty`);
    (cfg.lines || []).forEach((line, index) => {
      assert(hasText(line.label), `GUIDELINE_VERSIONS.${viewId}.lines[${index}] is missing label`);
      assert(hasText(line.version), `GUIDELINE_VERSIONS.${viewId}.lines[${index}] is missing version`);
    });
    assert(hasText(cfg.reviewed), `GUIDELINE_VERSIONS.${viewId} is missing reviewed`);
  });
}

function validateDiscContents() {
  // Canonical EUCAST v16.0 disc contents (display convention: total µg / 'unit').
  // Verified by manual sweep 2026-06-16; multi-value entries are legitimate
  // organism-group variants. Locks the loads so a future edit cannot silently
  // introduce a wrong disc strength. Unknown agents are skipped (not part of the set).
  const canonical = {
    'amikacin': ['30'], 'amoxicillin clavulanic acid': ['30', '3'], 'ampicillin': ['10', '2'],
    'aztreonam': ['30'], 'benzylpenicillin': ['1'], 'cefepime': ['30'], 'cefiderocol': ['30'],
    'cefotaxime': ['5'], 'cefoxitin': ['30'], 'cefpodoxime': ['10'], 'ceftazidime': ['10'],
    'ceftazidime avibactam': ['14'], 'ceftolozane tazobactam': ['40'], 'ceftriaxone': ['30'],
    'cefuroxime': ['30'], 'cephalexin': ['30'], 'chloramphenicol': ['30'], 'ciprofloxacin': ['5'],
    'clindamycin': ['2'], 'co trimoxazole': ['25'], 'ertapenem': ['10'], 'erythromycin': ['15'],
    'fosfomycin': ['200'], 'fusidic acid': ['10'], 'gentamicin': ['10', '30'], 'levofloxacin': ['5'],
    'linezolid': ['10'], 'mecillinam': ['10'], 'meropenem': ['10'], 'mupirocin': ['200'],
    'nalidixic acid': ['30'], 'nitrofurantoin': ['100'], 'norfloxacin': ['10'], 'novobiocin': ['5'],
    'oxacillin': ['1'], 'pefloxacin': ['5'], 'piperacillin tazobactam': ['36'], 'rifampicin': ['5'],
    'teicoplanin': ['30'], 'temocillin': ['30'], 'tetracycline': ['30'],
    'ticarcillin clavulanic acid': ['85'], 'tigecycline': ['15'], 'tobramycin': ['10'], 'vancomycin': ['5']
  };
  const aliases = {
    'augmentin': 'amoxicillin clavulanic acid', 'tazocin': 'piperacillin tazobactam',
    'septrin': 'co trimoxazole', 'fucidin': 'fusidic acid', 'penicillin': 'benzylpenicillin',
    'ticarcillin clavulanate': 'ticarcillin clavulanic acid'
  };
  const norm = name => {
    const n = name.toLowerCase().replace(/[\/\-]/g, ' ').replace(/\s+/g, ' ').trim();
    return aliases[n] || n;
  };
  const re = /^(.*?)\s+(\d[\d.\/-]*)$/;
  const check = (raw, where) => {
    if (typeof raw !== 'string') return;
    const m = raw.match(re);
    if (!m) return;
    const agent = norm(m[1]);
    if (!canonical[agent]) return;
    assert(canonical[agent].includes(m[2]),
      `${where}: ${m[1].trim()} disc load "${m[2]}" is not an accepted EUCAST value (expected ${canonical[agent].join(' or ')})`);
  };
  Object.entries(data.fcPanels || {}).forEach(([key, p]) => {
    if (key.startsWith('__') || !p || !Array.isArray(p.abx)) return;
    p.abx.forEach(a => check(a, `fcPanels.${key}.abx`));
  });
  (data.routineSets || []).forEach((g, gi) => (g.sets || []).forEach((s, si) =>
    (s.antibiotics || []).forEach(a => check(a, `routineSets[${gi}].sets[${si}]`))));
  (data.rareSets || []).forEach((r, ri) => { if (Array.isArray(r[1])) r[1].forEach(a => check(a, `rareSets[${ri}]`)); });
}

validateFcPanels();
validateFlowCollection('orgFlows', data.orgFlows);
validateFlowCollection('orgFlowsWound', data.orgFlowsWound);
validateFlowCollection('orgFlowsCsf', data.orgFlowsCsf);
validateDconfigs();
validateRoutineSets();
validateIndexes();
validateBactId();
validateSerology();
validateSirBreakpoints();
validateExpectedPhenotypes();
validateEucastCitations();
validateIfuCitations();
validateSmiCitations();
validateGuidelineVersions();
validateDiscContents();

if (failures.length) {
  console.error(`Data validation failed (${failures.length}):`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Data validation passed.');
