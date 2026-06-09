const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const dataPath = path.join(root, 'data.js');
const source = fs.readFileSync(dataPath, 'utf8');

const data = vm.runInNewContext(`${source}
({
  orgFlowsWound,
  orgFlows,
  fcPanels,
  dconfigs,
  d73mmDiscs,
  routineSets,
  rareSets,
  anaerobeMICs,
  qcOrganisms,
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
  sirBreakpoints
})`, {}, { filename: dataPath });

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

  assert(Array.isArray(data.qcOrganisms) && data.qcOrganisms.length > 0, 'qcOrganisms must be non-empty');
  data.qcOrganisms.forEach((org, index) => {
    assert(hasText(org.name), `qcOrganisms[${index}] is missing name`);
    assert(hasText(org.strain), `qcOrganisms[${index}] is missing strain`);
    assert(Array.isArray(org.plates) && org.plates.every(hasText), `qcOrganisms[${index}].plates must be non-empty text values`);
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
    });
  });
}

validateFcPanels();
validateFlowCollection('orgFlows', data.orgFlows);
validateFlowCollection('orgFlowsWound', data.orgFlowsWound);
validateDconfigs();
validateRoutineSets();
validateIndexes();
validateBactId();
validateSerology();
validateSirBreakpoints();

if (failures.length) {
  console.error(`Data validation failed (${failures.length}):`);
  failures.forEach(message => console.error(`- ${message}`));
  process.exit(1);
}

console.log('Data validation passed.');
