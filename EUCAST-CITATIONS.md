# EUCAST citation & validation record

**Prepared:** 2026-06-15 · **Revised:** 2026-06-16 (guidance-doc citations + validation coverage)
**Scope:** Antimicrobial susceptibility testing (AST) and antifungal susceptibility
testing (AFST) content of the Micro Bench Reference App — bacterial zone-diameter
breakpoints, intrinsic/expected resistance, disc-set interpretation, antibiotic-class
reference, and antifungal agent panels.
**Authority:** EUCAST (European Committee on Antimicrobial Susceptibility
Testing). AST/AFST is **EUCAST scope, not UK SMI** — the UK SMIs cover specimen
processing and identification; see the companion `SMI-CITATIONS.md`.
**Companion:** `MYCOLOGY-VIROLOGY-CITATIONS.md` covers AFST + mycology validation detail.

This document is the audit trail for ISO 15189 / UKAS traceability: it records
which committed EUCAST source each data structure is validated against, the
document version/date, and the discrepancies corrected during validation.

---

## 1. Committed EUCAST reference library

All source PDFs are committed under `EUCAST/` and mirrored as structured data in
`data.js` (`eucastCitations`). Versions/dates are taken from the official
document titles.

### Clinical Breakpoints and Interpretation
| Document | Version / date | File |
|---|---|---|
| Breakpoint tables for interpretation of MICs and zone diameters | **v16.0**, valid 2026-01-01 | `v_16.0_Breakpoint_Tables.pdf` |
| Area of Technical Uncertainty (ATU) guidance | **v4 (2024)** (v2 2020 retained for history) | `Area_of_Technical_Uncertainty_-_guidance_v4_2024.pdf` |
| Breakpoints in brackets | — | `Breakpoints_in_brackets.pdf` |
| Recent changes in S/I/R reporting (to clinical colleagues) | 2021-07-09 | `To_clinical_colleagues_..._9_July2021.pdf` |
| When there are no breakpoints | 2024-09-03 | `When_there_are_no_breakpoints_2024-09-03.pdf` |

### Expert Rules
| Organism group | Version / date | File |
|---|---|---|
| Enterobacterales | v3.3, 2024-06-30 | `ExpertRules_V3.3_20240630_Enterobacterales.pdf` |
| Staphylococcus | 2025-11-09 | `Staphylococcus_ExpertRules_20251109.pdf` |
| Streptococcus | 2025-11-09 | `Streptococcus_ExpertRules_20251109.pdf` |
| Enterococcus | 2025-11-09 | `Enterococcus_ExpertRules_20251109.pdf` |
| Pneumococcus | 2025-11-09 | `Pneumococcus_ExpertRules_20251109.pdf` |
| Haemophilus / Moraxella / Campylobacter / Corynebacterium / Salmonella | v3.2, 2019-06-13 | `*_ExpertRules_V3.2_20190613.pdf` |

### Expected phenotypes / resistance mechanisms
| Document | Version / date | File |
|---|---|---|
| Expected Resistant Phenotypes | **v1.2**, 2023-01-13 | `Expected_Resistant_Phenotypes_v1.2_20230113.pdf` |
| Expected Susceptible Phenotypes | v1.1, 2022-03-25 | `Expected_Susceptible_Phenotypes_Tables_v1.1_20220325.pdf` |
| Detection of resistance mechanisms (ESBL/AmpC/carbapenemase/MRSA) | 2017-07-11 | `EUCAST_detection_of_resistance_mechanisms_170711.pdf` |

### Methodology and Instructions
| Document | Version | File |
|---|---|---|
| Disk diffusion manual | v13.0 (2025) | `Manual_v_13.0_EUCAST_Disk_Test_2025.pdf` |
| Disk diffusion reading guide | v11.0 (2025) | `Reading_guide_v_11.0_EUCAST_Disk_Test_2025.pdf` |
| Broth microdilution reading guide | v5.0 (2024) | `Reading_guide_BMD_v_5.0_2024.pdf` |
| Media preparation | v8.0 (2026) | `Media_preparation_v_8.0_EUCAST_AST_2026.pdf` |
| QC tables (routine + extended) | v15.0 | `v_15.0_EUCAST_QC_tables_routine_and_extended_QC.pdf` |
| Anaerobe disk diffusion reading guide | v2.0 (2023) | `Disk_diffusion_Anaerobes_Reading_Guide_v_2.0_2023.pdf` |

Agent-/organism-specific **Guidance Docs** are committed under
`EUCAST/Guidance Docs/` and, as of 2026-06-16, each is **individually cited**
in `eucastCitations.documents['Guidance Docs']` (previously a single free-text
note). The set covers: aminoglycosides, aminopenicillins, colistin (clinical +
MIC determination), daptomycin (rev. 2025-12-02), tigecycline, *S. maltophilia*
(v2 2024), *B. cepacia* complex, cefiderocol, *Legionella*, oral cephalosporins,
topical agents, fosfomycin iv, ESBL confirmation, screening to detect/exclude
resistance, intrinsic resistance / expected phenotypes (IE), cephalosporins for
*S. aureus* (2026), direct testing, and the antimicrobial-abbreviations sheet.

A new **`eucastCitations.agentGuidance`** map links the specific agents in
`sirBreakpoints` and organisms in `expectedPhenotypes` to the guidance document
that backs each one (e.g. cefoxitin/cefpodoxime screening → *Screening to detect
and exclude resistance*; *S. maltophilia* → the v2 2024 guidance), giving
per-agent traceability rather than a generic pointer.

---

## 2. Zone-diameter breakpoint validation (`sirBreakpoints`)

**Source:** EUCAST Breakpoint Tables **v16.0** (valid 2026-01-01),
`v_16.0_Breakpoint_Tables.pdf`. Every agent's disc content and S≥/R< zone
breakpoint was read directly from the relevant organism table and signed off
(`ok:true`). Interpretation: zone ≥ S → S · zone < R → R · between → I.
Agents EUCAST reports only as "I" or "R" (no standard-dose S) are encoded with
**S = 50 mm** so the engine never returns "S".

### Corrections made (placeholder → v16.0)
| Group | Agent | Old (placeholder) | v16.0 validated | Source table |
|---|---|---|---|---|
| Enterobacterales | Ceftriaxone | 25 / 22 | **27 / 24** (non-meningitis) | Cephalosporins |
| Enterobacterales | Amikacin | 18 / 15 | **18 / 18** (UTI) | Aminoglycosides |
| Enterobacterales | Trimethoprim | 18 / 15 | **15 / 15** (revised in v16.0) | Miscellaneous |
| Enterobacterales | Piperacillin-tazobactam | 20 / 17 | **20 / 20** (ATU 19) | Penicillins |
| Enterobacterales | Temocillin | 20 / 20 | **50 / 17** (I or R only, UTI) | Penicillins |
| Enterobacterales | Ertapenem | 25 / 22 | **23 / 23** | Carbapenems |
| Pseudomonas | Cefepime | 50 / 19 | **50 / 21** (ATU 19-23) | Cephalosporins |
| Pseudomonas | Levofloxacin | 50 / 21 | **50 / 18** | Fluoroquinolones |
| Pseudomonas | Meropenem | 24 / 18 | **20 / 14** (*P. aeruginosa*) | Carbapenems |
| Pseudomonas | Tobramycin | 18 / 16 | **18 / 18** (UTI) | Aminoglycosides |
| Pseudomonas | Amikacin | 18 / 15 | **15 / 15** (UTI) | Aminoglycosides |
| Staphylococcus | Erythromycin | 21 / 18 | **21 / 21** | Macrolides |
| Staphylococcus | Clindamycin | 22 / 19 | **22 / 22** | Macrolides |
| Staphylococcus | Co-trimoxazole | 17 / 14 | **24 / 24** (revised in v16.0) | Miscellaneous |
| Staphylococcus | Tetracycline | 22 / 19 | **22 / 22** | Tetracyclines |
| Staphylococcus | Rifampicin | 26 / 23 | **26 / 26** (*S. aureus*; CoNS 30/30) | Miscellaneous |
| Enterococcus | Ampicillin | 10 / 8 | **10 / 10** | Penicillins |
| Enterococcus | Linezolid | 19 / 19 | **20 / 20** | Oxazolidinones |
| Streptococcus A/B/C/G | Benzylpenicillin | 18 / 18 (all) | **23 / 23** (A/C/G); **18 / 18** (group B) | Penicillins |
| Streptococcus A/B/C/G | Clindamycin | 19 / 16 | **17 / 17** | Macrolides |
| Streptococcus A/B/C/G | Tetracycline | 23 / 20 | **23 / 23** | Tetracyclines |
| Streptococcus A/B/C/G | Levofloxacin | 17 / 14 | **50 / 17** (I or R only) | Fluoroquinolones |

### Values confirmed correct (no change needed)
Ampicillin, amoxicillin-clavulanate, mecillinam, cefpodoxime, cefoxitin screen,
ciprofloxacin, gentamicin, nitrofurantoin, meropenem (Enterobacterales);
piperacillin-tazobactam, ceftazidime, ciprofloxacin (Pseudomonas); cefoxitin MRSA
screen, gentamicin, fusidic acid, linezolid, norfloxacin screen (Staphylococcus);
vancomycin, teicoplanin, high-level gentamicin screen, nitrofurantoin, norfloxacin
screen (Enterococcus); vancomycin, teicoplanin, erythromycin (Streptococcus).

**QC strains per group** (EUCAST standardised disc diffusion, MH / MH-F):
Enterobacterales — *E. coli* ATCC 25922; Pseudomonas — *P. aeruginosa* ATCC 27853;
Staphylococcus — *S. aureus* ATCC 29213; Enterococcus — *E. faecalis* ATCC 29212;
Streptococcus — *S. pneumoniae* ATCC 49619 (MH-F, 5% CO₂).

---

## 3. Expected / intrinsic resistance validation (`expectedPhenotypes`)

**Source:** EUCAST **Expected Resistant Phenotypes v1.2** (2023-01-13) +
relevant Expert Rules. All 24 entries cross-checked against Tables 1–5; the
content was found **consistent** and required no value corrections. Key checks:

- **Proteae block** (Proteus/Providencia/Morganella): polymyxins, tetracyclines,
  nitrofurantoin intrinsic R — *P. mirabilis* correctly NOT listed as ampicillin-R
  (Table 1.12); indole-positive *P. vulgaris/penneri* correctly add ampicillin +
  early cephalosporins (1.13/1.14).
- **AmpC / ESCPM group** (C. freundii, Enterobacter, K. aerogenes, Serratia,
  Morganella): ampicillin/co-amox/1st–2nd gen cephalosporins/cefoxitin (1.2/1.3/
  1.6/1.10/1.18).
- ***S. maltophilia***: carbapenems (L1 MBL), aminoglycosides, all β-lactams except
  ceftazidime-by-result; SXT the first-line report (2.8 + note 6).
- ***E. faecium*** correctly **not** intrinsically quinupristin-dalfopristin
  resistant, unlike *E. faecalis* (4.7 vs 4.9).
- **vanC organisms** (*E. gallinarum/casseliflavus*) and naturally vancomycin-R
  *Leuconostoc / Pediococcus / Lactobacillus* (4.8/4.12/4.13) — speciate before
  raising a VRE alert.

---

## 4. AFST committed library (added 2026-06-15)

Antifungal documents committed under `EUCAST/AFST/`. Full citation detail in
`MYCOLOGY-VIROLOGY-CITATIONS.md`.

| Document | Version / date | Path |
|---|---|---|
| AFST clinical breakpoints (yeasts & Aspergillus) | **v12.1**, valid 2026-04-10 | `EUCAST/AFST/Clinical Breakpoints and Interpretation/AFST_BP_v12.1.pdf` |
| AFST MIC/ECOFF overview (yeasts, moulds, dermatophytes) | **v6.0**, valid 2025-06-26 | `EUCAST/AFST/Clinical Breakpoints and Interpretation/AFST_BP-ECOFF_v6.0_...pdf` |
| E.Def 7.4 — Yeasts BMD (rev. 2023) | rev.2023 | `EUCAST/AFST/Methodology and Instructions/…` |
| E.Def 9.4 — Moulds BMD | current | `EUCAST/AFST/Methodology and Instructions/…` |
| E.Def 10.3 — Agar screening | current | `EUCAST/AFST/Methodology and Instructions/…` |
| Fluconazole / Voriconazole / Moulds technical notes | CMI 2008 | `EUCAST/AFST/Technical Notes on Antifungal Agents/…` |

---

## 5. Traceability map (data structure → EUCAST source)

| App data | Validated against |
|---|---|
| `sirBreakpoints` | Breakpoint tables v16.0 (zone diameters) — every agent `ok:true` (2026-06-15) |
| `expectedPhenotypes` | Expected Resistant Phenotypes v1.2 + relevant Expert Rules |
| `dconfigs` (D63/D68/D69/D73) | Detection of resistance mechanisms (2017) + MAST D-set IFUs |
| `fcPanels` — bacterial disc panels | Breakpoint tables v16.0 (agent selection per organism group) |
| `fcPanels` — `af_*` antifungal panels | AFST Breakpoint Tables v12.1 (valid 2026-04-10) — validated 2026-06-15 |
| `fcPanels` — `afr_*` expected antifungal resistance | AFST BP v12.1 — key resistance claims confirmed 2026-06-15 |
| `abxClasses` | Breakpoint tables v16.0 + agent-specific guidance notes |
| `routineSets` / `qcOrganisms` | QC tables v15.0 (routine + extended QC) |
| `eucastCitations.agentGuidance` | Agent/organism → committed Guidance Doc (per-agent traceability) |

Per-view version stamps live in `GUIDELINE_VERSIONS` (`data.js`) and render in the
app footer for each view.

### Automated validation coverage (`tests/validate-data.js`)

The data-validation suite now guards the EUCAST-driven structures so a future
edit cannot silently break traceability:

| Check | What it enforces |
|---|---|
| `validateSirBreakpoints` | Structure **plus** every agent `ok:true` (signed off vs v16.0), `note` is a string, and `screen` is `true` when present |
| `validateExpectedPhenotypes` | Unique `id`, valid `group` (gnr/nf/gpc/anaerobe), non-empty `resist` and `rules` |
| `validateEucastCitations` | `documents`/`appliesTo`/`agentGuidance` structure **and every cited `file` resolves to a committed PDF/sheet under `EUCAST/`** |
| `validateGuidelineVersions` | Each view has `lines` with `label`+`version` and a `reviewed` stamp |

---

## 6. Sign-off

| Item | Status |
|---|---|
| Zone breakpoints transcribed & checked vs v16.0 | ✅ Done 2026-06-15 |
| Expected resistant phenotypes checked vs v1.2 | ✅ Done 2026-06-15 |
| AFST `af_*` / `afr_*` panels checked vs v12.1 | ✅ Done 2026-06-15 |
| `af_method` version string updated v10.0 → v12.1 | ✅ Done 2026-06-15 |
| Agent-specific Guidance Docs individually cited + `agentGuidance` map added | ✅ Done 2026-06-16 |
| ATU guidance citation updated v2 (2020) → v4 (2024) | ✅ Done 2026-06-16 |
| Validation added: `expectedPhenotypes`, `eucastCitations` (on-disk file check), `GUIDELINE_VERSIONS`; `sirBreakpoints` `ok:true` enforced | ✅ Done 2026-06-16 |
| Urine + wound flowchart methodology reviewed (cards, panels, notes) | ✅ Done 2026-06-16 |
| Fixed: `reagent_staph` cefoxitin MRSA cut-off ≤19mm → ≤21mm (matched v16.0 + `cefox_mhe`/glossary) | ✅ Done 2026-06-16 |
| Corrected cefoxitin medium to EUCAST standard MH (no NaCl); clarified MH + 2% NaCl is the CLSI oxacillin screen | ✅ Done 2026-06-16 |
| Added S. epidermidis/S. lugdunensis 27/27 CoNS detail; standardised topical "Fucidin" → "Fusidic acid"; flagged mupirocin zones for re-confirmation | ✅ Done 2026-06-16 |
| Phenotypic screen selection: added per-D-set triggers (D68 cefpodoxime → D69 AmpC/cefoxitin · D63 ESBL confirm · D73 carbapenem-reduced) to urine + wound flows; tightened GP1/IN1 reflex triggers | ✅ Done 2026-06-16 |
| `data.js` syntax (`node --check`) | ✅ Pass |
| Data-validation suite (`npm test`) | ✅ Pass |
| Local microbiologist confirmation vs lab SOP | ☐ **Required before bench use** |
| Re-check on next annual EUCAST release (bacterial BP) | ☐ Recurring |
| Re-check on next EUCAST AFST update | ☐ Recurring |

> The app remains a reference aid. Before any result is released, breakpoints must
> be confirmed against the laboratory's own validated SOP, and re-checked whenever
> EUCAST issues a new breakpoint table (annually). Update the `version` string in
> `sirBreakpoints`, the `checker`/`flow`/`wound`/`interp` entries in
> `GUIDELINE_VERSIONS`, and re-confirm each `ok:true` at that time.
