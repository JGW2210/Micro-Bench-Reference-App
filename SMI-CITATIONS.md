# UK SMI Citations — Microbiology Bench Reference App (Bacteriology)

This document maps the **bacteriology-related information** in the app (`data.js`)
to the relevant **UK Standards for Microbiology Investigations (UK SMI)** so the
content can be validated and cited for official usage.

- **Source index used:** UK SMI repository — Bacteriology (`B`) and Identification (`ID`)
  document lists at <https://uksmi.github.io/Standards-for-Microbiology-Investigations/bacteriology.html>
  and <https://uksmi.github.io/Standards-for-Microbiology-Investigations/identification.html>;
  Test Procedure (`TP`) documents on GOV.UK.
- **Prepared:** 2026-06-15.
- **Embedded in code:** these citations are also held as structured data in
  `data.js` as `smiCitations` (document catalogue + specimen/media/test maps +
  `outOfScope`) and `bactIdSmiMap` (per-organism codes, attached to each
  identification organism as `o.smi` at load time). This document is the
  human-readable companion to that data.

> ## ⚠ Read this before relying on the citations
>
> 1. **UK SMIs are an external reference, not a substitute for your validated SOP.**
>    Each citation tells you *which SMI covers a topic*; it does not certify that the
>    app's wording matches the current issue of that SMI. Before bench/clinical use,
>    open the cited document and confirm the app text against the **current issue**.
> 2. **Custody / status of UK SMIs.** UK SMIs were produced by PHE/UKHSA and were
>    **withdrawn from GOV.UK** as a live collection; maintenance has moved to the
>    Royal College of Pathologists (RCPath) / the UK SMI working groups (the
>    `uksmi.github.io` index used here). Treat issue numbers/dates as needing
>    re-verification against the current host.
> 3. **Antimicrobial susceptibility testing (AST) is NOT covered by SMI bacteriology
>    documents.** Disc panels, breakpoints, expected phenotypes, expert rules and MICs
>    in this app are **EUCAST** (and historically BSAC) content. These are flagged
>    below as *out of SMI scope* and must be cited to EUCAST, not SMI.
> 4. **Mycology, parasitology and virology** content in the app belongs to *other* SMI
>    series (or non-SMI sources such as CDC DPDx). It is listed at the end for
>    completeness but is **outside the bacteriology scope** of this request.

---

## 0. Status update — verified against the committed PDFs (2026-06-15)

The current-issue UK SMI PDFs are now committed under **`SMIs/`** (B, S and V
subfolders). The citation data in `data.js` has been reconciled to them. This
section **supersedes any older code/issue references further down**.

**Withdrawn technical B documents → now cited to their replacement Syndromic (S) doc**
(per the UK SMI strategy of retiring technical SMIs as syndromic ones publish):

| Withdrawn | When | App pathway | Now cite |
|---|---|---|---|
| B 1 (ear infections) | 2024-08-13 | ear | **S 13** Painful and/or discharging ear |
| B 2 (eye infections) | 2024-08-13 | eye / chocolate-agar | **S 11** Red or painful eye |
| B 28 (genital tract) | 2025-05-20 | genital / *Gardnerella* | **S 6** Genitourinary & reproductive |
| B 30 (faecal enteric pathogens) | 2021-05-27 | XLD/TCBS/SMAC, enteric | **S 7** Gastroenteritis |
| B 37 (blood cultures) | 2024-08-13 | blood culture | **S 12** Sepsis & systemic/disseminated infection |
| B 19 (sinus aspirate) | 2014-12-30 | sinus | merged into **B 5** |
| B 52 (intraocular/corneal) | 2014-12-30 | eye | merged into B 2 → now **S 11** |
| B 47 (Legionella) | 2012-03-09 *(recalled)* | Legionella | no SMI replacement noted |

These are encoded in `smiCitations.withdrawn` and the pathway/media/organism maps
now point at the S docs.

**Verified issue numbers/dates** (from the committed filenames + PDF headers, e.g.
B 41 confirmed Issue 8.8, 05.12.25) are recorded in `smiCitations.verifiedIssues`
(B 4 i7.3, B 5 i8.1, B 9 i9.1, B 10 i2, B 11 i6.6, B 14 i6.3, B 15 i7.1, B 17 i6.4,
B 20 i6.2, B 22 i6.2, B 25 i6.1, B 26 i6.3, B 27 i6.2, B 29 i7.1, B 31 i5.2,
B 38 i2.1, B 39 i3.2, B 40 i7.4, B 41 i8.8, B 42 i2.1, B 44 i2.2, B 51 i2.1,
B 55 i7.1, B 57 i3.5, B 58 i3.2, B 59 i4.2, B 60 i3.2, B 61 i2.3, B 62 i1.1;
S 1/2/5/12 Apr 2025, S 6 Feb 2025, S 7 Jan 2026, S 11/13 Mar 2026).

**ID + TP series now supplied and verified** (committed under `SMIs/ID` and
`SMIs/TP`). All 26 ID and 21 TP issue numbers/dates are recorded in
`smiCitations.verifiedIssues` (85 documents total). Notable updates from these PDFs:
- **ID 3** retitled to *Identification of Listeria species and other non-sporing
  Gram-positive rods except Corynebacterium* — confirmed to cover *Cutibacterium*,
  *Propionibacterium*, *Erysipelothrix* and *Lactobacillus*; the app's
  *Cutibacterium acnes* citation moved **ID 1 → ID 3**.
- **ID 22** retitled to *Identification of Shiga toxin-producing E. coli (STEC)*.
- Dedicated TPs now exist for tests previously mapped only to ID flowcharts, and the
  `tests` map was remapped accordingly: **DNase → TP 12**, **aesculin → TP 2**,
  **motility → TP 21**, **O/F (Hugh–Leifson) → TP 27**, plus new entries for
  **urease (TP 36)**, **ONPG (TP 24)**, **thermonuclease (TP 34)**, **KOH (TP 30)**,
  **porphyrin/ALA (TP 29)** and the Salmonella agglutination/phase tests (TP 3/TP 32).

**Content validation status:** an initial spot-check of `bactIdOrganisms` biochemical
profiles against the ID docs found **no contradictions** (e.g. *Moraxella*
oxidase+/DNase+/tributyrin+ vs ID 11; *Stenotrophomonas* oxidase− vs ID 17;
*Aeromonas* oxidase+/string test vs ID 19; *Pasteurella* oxidase/indole/catalase vs
ID 13; staph coagulase/DNase/novobiocin/thermonuclease vs ID 7). A full
organism-by-organism and panel-by-panel prose pass is the remaining work. (PDF text
is read here with a stdlib extractor since this environment has no `poppler`/network;
it reconstructs running text well enough for term-level validation.)

---

## 1. SMI document catalogue referenced by this app

> ⚠ The tables in this section predate the §0 reconciliation. Where they list
> B 1, B 2, B 28, B 30 or B 37 as live, use the **S-series replacement** from §0.

### Bacteriology (B) series — specimen processing / pathways
| Code | Title |
|------|-------|
| B 1  | Investigation of ear infections and associated specimens |
| B 2  | Investigation of bacterial eye infections |
| B 4  | Investigation of superficial mouth samples |
| B 5  | Investigation of nasal samples |
| B 6  | Investigation of whooping cough |
| B 9  | Investigation of throat related specimens |
| B 10 | Processing of faeces for *Clostridium difficile* |
| B 11 | Swabs from skin and superficial soft tissue infections |
| B 14 | Investigation of pus and exudates |
| B 15 | Investigation of bile |
| B 17 | Tissues and biopsies from deep-seated sites and organs |
| B 20 | Investigation of intravascular cannulae and associated specimens |
| B 25 | Investigation of continuous ambulatory peritoneal dialysis fluid |
| B 26 | Investigation of fluids from normally sterile sites |
| B 27 | Investigation of cerebrospinal fluid |
| B 28 | Investigation of genital tract and associated specimens |
| B 29 | Investigation of specimens for screening for MRSA |
| B 31 | Investigation of specimens other than blood for parasites |
| B 37 | Investigation of blood cultures (for organisms other than *Mycobacterium* species) |
| B 39 | Investigation of dermatological specimens for superficial mycoses |
| B 40 | Investigation of specimens for *Mycobacterium* species |
| B 41 | Investigation of urine |
| B 42 | Investigation of bone and soft tissue associated with osteomyelitis |
| B 44 | Investigation of orthopaedic implant associated infections |
| B 51 | Screening for *Neisseria meningitidis* |
| B 55 | Investigation of infectious causes of dyspepsia |
| B 57 | Investigation of bronchoalveolar lavage, sputum and associated specimens |
| B 58 | Detection of carriage of group B streptococci |
| B 59 | Detection of *Enterobacteriaceae* producing extended-spectrum β-lactamases (ESBL) |
| B 60 | Detection of bacteria with carbapenem-hydrolysing β-lactamases (carbapenemases) |
| B 61 | Investigation of specimens for ectoparasites |

> Note: the routine **faecal enteric pathogen** workup (Salmonella/Shigella/*E. coli* O157/
> Vibrio/Campylobacter — XLD, TCBS, SMAC plates) is covered by the SMI for
> *investigation of faecal specimens for enteric pathogens* (commonly **B 30**). This
> code was not on the fetched bacteriology index excerpt — **verify the exact code/issue**
> against the current host before citing.

### Identification (ID) series — organism identification
| Code | Title |
|------|-------|
| ID 1  | Introduction to the preliminary identification of medically important bacteria and fungi from culture |
| ID 2  | Identification of *Corynebacterium* species |
| ID 3  | Identification of *Listeria* species |
| ID 4  | Identification of *Streptococcus* species, *Enterococcus* species and morphologically similar organisms |
| ID 5  | Identification of *Bordetella* species |
| ID 6  | Identification of *Neisseria* species |
| ID 7  | Identification of *Staphylococcus* species, *Micrococcus* species and *Rothia* species |
| ID 8  | Identification of *Clostridium* species |
| ID 9  | Identification of *Bacillus* species |
| ID 10 | Identification of aerobic actinomycetes |
| ID 11 | Identification of *Moraxella* species and morphologically similar organisms |
| ID 12 | Identification of *Haemophilus* species and the HACEK group of organisms |
| ID 13 | Identification of *Pasteurella* species and morphologically similar bacteria |
| ID 14 | Identification of anaerobic cocci |
| ID 15 | Identification of anaerobic *Actinomyces* species |
| ID 16 | Identification of *Enterobacteriaceae* |
| ID 17 | Identification of *Pseudomonas* species and other non-glucose fermenters |
| ID 18 | Identification of *Legionella* species |
| ID 19 | Identification of *Vibrio* and *Aeromonas* species |
| ID 20 | Identification of *Shigella* species |
| ID 21 | Identification of *Yersinia* species |
| ID 22 | Identification of VTEC including *Escherichia coli* O157 |
| ID 23 | Identification of *Campylobacter* species |
| ID 24 | Identification of *Salmonella* species |
| ID 25 | Identification of anaerobic Gram-negative rods |
| ID 26 | Identification of *Helicobacter* species |

### Test Procedure (TP) series — bench tests (GOV.UK)
| Code | Title | URL |
|------|-------|-----|
| TP 1  | Example reference strains for UK SMI test procedures | <https://www.gov.uk/government/publications/smi-tp-1-example-reference-strains-for-uk-smi-test-procedures> |
| TP 5  | Bile solubility test | <https://www.gov.uk/government/publications/smi-tp-5-bile-solubility-test> |
| TP 8  | Catalase test | <https://www.gov.uk/government/publications/smi-tp-8-catalase-test> |
| TP 10 | Coagulase test | <https://www.gov.uk/government/publications/smi-tp-10-coagulase-test> |
| TP 19 | Indole test | <https://www.gov.uk/government/publications/smi-tp-19-indole-test> |
| TP 25 | Optochin test | <https://www.gov.uk/government/publications/smi-tp-25-optochin-test> |
| TP 26 | Oxidase test | <https://www.gov.uk/government/publications/smi-tp-26-oxidase-test> |
| TP 38 | X and V factor test | <https://www.gov.uk/government/publications/smi-tp-38-x-and-v-factor-test> |
| TP 39 | Staining procedures (incl. Gram, Ziehl–Neelsen) | <https://www.gov.uk/government/publications/smi-tp-39-staining-procedures> |
| TP 40 | MALDI-TOF MS test procedure | <https://www.gov.uk/government/publications/smi-tp-40-maldi-tof-ms-test-procedure> |

> Tests used in the app for which there is **no dedicated TP document** (DNase, PYR,
> bile-aesculin, CAMP, novobiocin, motility, tributyrin/butyrate esterase, ONPG,
> nitrocefin β-lactamase) are described **within the relevant ID document's
> identification flowchart** — cite the ID document for those (cross-referenced below).

---

## 2. Citation map by app data structure (`data.js`)

### 2.1 Specimen / organism workup flows — `orgFlows`, `orgFlowsWound`
These define which bench pathway is run for each specimen type + organism.

| App pathway (key) | Specimen context | SMI specimen citation | SMI organism-ID citation |
|---|---|---|---|
| `staph` / `w_mssa`,`w_mrsa`,`w_deep_staph`,`w_topical_staph` | Urine / wound / deep tissue / ear *S. aureus*–CoNS | B 41 (urine), B 11 (skin/soft tissue), B 14 (pus), B 17/B 42/B 44 (deep/bone/implant), B 1 (ear); MRSA screen B 29 | ID 7 |
| `strep` / `w_strep` | Urine / wound β- & α-haemolytic strep | B 41, B 11, B 14; GBS carriage B 58 | ID 4 |
| `w_pneumo*` | Wound / respiratory *S. pneumoniae* | B 11, B 57 (sputum/BAL), B 27 (CSF if invasive) | ID 4 |
| `enterococcus` / `w_esp*` | Urine / wound *Enterococcus* | B 41, B 11, B 14 | ID 4 |
| `pseudo` / `w_pseudo*` | Urine / wound *P. aeruginosa* | B 41, B 11, B 14 | ID 17 |
| `w_haem*`, `w_eye_haem` | Wound / eye / respiratory *Haemophilus* | B 2 (eye), B 57 (resp), B 11 | ID 12 (+ TP 38 X/V) |
| `w_anaerobe*` | Anaerobes (deep wound / sterile site) | B 14, B 17, B 26 | ID 14 (cocci), ID 15 (*Actinomyces*), ID 25 (GN rods), ID 8 (*Clostridium*) |
| `w_gpb*` | Corynebacterium / GPB | B 11, B 14 | ID 2; ID 9 (*Bacillus*); ID 10 (aerobic actinomycetes/*Nocardia*) |
| `w_acine*` | *Acinetobacter* | B 11, B 57 | ID 17 |
| `w_aero*` | *Aeromonas* | B 11, B 14 | ID 19 |
| `w_kin*` | *Kingella* (paediatric joint) | B 17, B 44 | ID 12 (HACEK) |
| `w_list*` | *Listeria monocytogenes* | B 26, B 27, B 37 | ID 3 |
| `w_mor*` | *Moraxella catarrhalis* | B 5, B 57, B 1 | ID 11 |
| `w_past*` | *Pasteurella* (bite wounds) | B 11, B 14 | ID 13 |
| `w_steno*` | *Stenotrophomonas maltophilia* | B 11, B 57 | ID 17 |
| `w_topical_id`,`w_ptop`,`w_ntop`,`w_eye_ext` | Topical ear/eye triage | B 1 (ear), B 2 (eye) | per organism above |

### 2.2 Plate media — `plateMedia` and colony morphology — `organisms`
| Medium (key) | Use | Primary SMI specimen citation | Organism-ID citation |
|---|---|---|---|
| `uri` Uriselect 4 (chromogenic) | Urine | B 41 | ID 16 (coliforms), ID 7, ID 4 |
| `blood` Columbia blood agar | Wound/resp/sterile | B 11, B 14, B 26, B 57 | per organism |
| `mrsa` Brilliance MRSA 2 | MRSA screen | **B 29** | ID 7 |
| `xld` XLD | Enteric (*Salmonella/Shigella*) | B 30 *(faeces — verify code)* | ID 24, ID 20 |
| `tcbs` TCBS | *Vibrio* | B 30 *(faeces — verify code)* | ID 19 |
| `smac` Sorbitol MacConkey | *E. coli* O157 screen | B 30 *(faeces — verify code)* | **ID 22** |
| `choc` Chocolate agar | *Haemophilus*/*Neisseria* | B 2, B 27, B 51, B 57 | ID 12, ID 6 |

> Colony-appearance entries in `organisms` (e.g. golden β-haemolytic *S. aureus*,
> draughtsman *S. pneumoniae*, swarming *Proteus*, hockey-puck *Moraxella*) are
> identification descriptions — cite **ID 1** (preliminary ID from culture) plus the
> organism-specific ID document. **Chromogenic media colour rules are the
> manufacturer IFU (BioRad Uriselect, Oxoid Brilliance), not SMI** — these are
> appropriately referenced to the IFU, not citable to SMI.

### 2.3 Biochemical identification dataset — `bactIdOrganisms` / `bactIdFields`
Each organism's Gram/oxidase/catalase/etc. profile. Cite **ID 1** for the overall
approach, the per-organism ID document, and the TP document for each named test.

| Organism (group) | Organism ID doc |
|---|---|
| *S. aureus*, CoNS | ID 7 |
| GAS, GBS, *S. pneumoniae*, viridans, *E. faecalis*, *E. faecium* | ID 4 |
| *Listeria monocytogenes* | ID 3 |
| *Corynebacterium* spp. | ID 2 |
| *Bacillus* spp. | ID 9 |
| *Clostridium* spp. | ID 8 |
| *Actinomyces* spp. | ID 15 |
| *Cutibacterium acnes* | ID 1 (no dedicated SMI ID; anaerobic GP rod) |
| *E. coli*, *Klebsiella*, *Enterobacter*, *Citrobacter*, *Serratia*, *Proteus*, *Morganella*, *Providencia* | ID 16 |
| *Salmonella* spp. | ID 24 |
| *Shigella* spp. | ID 20 |
| *Yersinia enterocolitica* | ID 21 |
| *Pseudomonas aeruginosa*, *Acinetobacter*, *Stenotrophomonas*, *Burkholderia cepacia* | ID 17 |
| *Aeromonas* spp., *Vibrio* spp. | ID 19 |
| *Campylobacter jejuni/coli* | ID 23 |
| *Helicobacter pylori* | ID 26 |
| *Haemophilus influenzae*, *Kingella kingae* (HACEK) | ID 12 |
| *Moraxella catarrhalis* | ID 11 |
| *Neisseria gonorrhoeae*, *N. meningitidis* | ID 6 |
| *Pasteurella multocida* | ID 13 |
| *Bacteroides fragilis* group, *Prevotella*, *Fusobacterium* | ID 25 |
| *Gardnerella vaginalis* | B 28 (genital tract) + ID 1 |

### 2.4 Bench tests / reagents — `fcPanels` (ID/reagent portions), `gramPatterns`
| App test | SMI citation |
|---|---|
| Gram stain / staining (`gramPatterns`, all `Gram stain` reagent cards) | **TP 39** |
| Catalase (`reagent_staph`) | **TP 8** |
| Coagulase / Staph latex / clumping factor (`reagent_staph`) | **TP 10** + ID 7 |
| DNase agar (`reagent_staph`, Moraxella, Serratia) | ID 7 / ID 11 (no dedicated TP) |
| Oxidase (`reagent_pseudo`, non-fermenter cards) | **TP 26** |
| Indole (`reagent_proteus`, Aeromonas/Pasteurella) | **TP 19** |
| Optochin (`w_pneumo_id`) | **TP 25** + ID 4 |
| Bile solubility (`w_pneumo_id`) | **TP 5** + ID 4 |
| X / V / XV factors (`w_haem_id`) | **TP 38** + ID 12 |
| MALDI-TOF (all `MALDI-TOF` cards) | **TP 40** |
| PYR (`esp`, enterococcus) | ID 4 (no dedicated TP) |
| Bile-aesculin (enterococcus) | ID 4 |
| CAMP test (GBS) | ID 4 |
| Novobiocin (*S. saprophyticus*) | ID 7 |
| Tributyrin / butyrate esterase (`bactIdTributyrinMap`) | ID 11 |
| Hugh–Leifson O/F (`bactIdHughLeifsonMap`) | ID 17 / ID 1 |
| Motility — tumbling (*Listeria*) | ID 3 |
| Nitrocefin β-lactamase (*Haemophilus*, *Moraxella*) | ID 12 / ID 11 (+ EUCAST) |
| Aerotolerance / anaerobic culture (`w_anaerobe_id`) | ID 14/ID 25 + B 14/B 17 |

### 2.5 Glossary — `glossary`
General bacteriology terminology and ID concepts → **ID 1** (preliminary identification
of medically important bacteria) is the anchor reference; specific organism/test
entries follow the per-topic citations above.

### 2.6 QC organisms — `qcOrganisms`
Reference/control strains → **TP 1** (example reference strains for UK SMI test
procedures) for the SMI-defined control strains; QC for AST is **EUCAST** (see below).

---

## 3. Out of SMI bacteriology scope — cite elsewhere (flagged, not SMI)

These app sections are **not** citable to SMI bacteriology documents:

| App data | Correct authority (not SMI bacteriology) |
|---|---|
| `abxClasses`, `fcPanels` disc panels, `routineSets`, `rareSets`, `oxoidDiscCodes`, `abxAliasGroups`, `d73mmDiscs`, `dconfigs`, `anaerobeMICs`, `sirBreakpoints`, `expectedPhenotypes` | **EUCAST** clinical breakpoint tables, EUCAST Expected Resistant Phenotypes, EUCAST Expert Rules; disc contents per EUCAST methodology. (`sirBreakpoints` is explicitly flagged in-code as *PLACEHOLDER — UNVALIDATED*.) MAST D-set / carbapenemase disc logic = manufacturer IFU. |
| `mycoFungi`, `mycoDiseases` (dermatophytes) | SMI **B 39** (dermatological specimens for superficial mycoses) + the SMI **Mycology** series; the app's stated source is the Adelaide mycology atlas. |
| `parasites` | SMI **B 31** (parasites, non-blood) and **B 61** (ectoparasites) + SMI **Parasitology** series; the app's stated source is **CDC DPDx**. |
| `serologyTests`, `serologyProfiles`, viro `fcPanels` (Panther/GeneXpert), `mycoFungi` antifungals | SMI **Virology** series + assay IFUs/local SOP. Bacterial-serology items (ASOT, *Helicobacter* Ag, *Bordetella*, *Brucella*, *Leptospira*, *Legionella* urinary Ag, syphilis, meningococcal Ab) relate to B 6, B 55, B 51 but are serology/molecular, not culture SMIs. |
| `bloodDisciplines`, `bloodTubes`, `bloodTests` | General pathology / phlebotomy — **not microbiology SMI** at all (except blood-culture bottles → **B 37**). |
| TB / Mycobacteria PCR cards | SMI **B 40** (specimens for *Mycobacterium* species). |

---

## 4. Discrepancies found and fixed during validation

While cross-checking the data I found and **fixed** one data-consistency defect in
`data.js` (`bactIdHughLeifsonMap`). The map is looked up by **exact organism name**
(`bactIdHughLeifsonMap[o.name]` in `app.js`), but three keys did not match any name
in `bactIdOrganisms`, so their Hugh–Leifson (oxidation/fermentation) result silently
rendered as **"not-recorded"** instead of the intended *fermentative*:

| Old key (no match) | Corrected key (matches `bactIdOrganisms`) |
|---|---|
| `Enterococcus faecalis / faecium` | split into `Enterococcus faecalis` + `Enterococcus faecium` |
| `Proteus vulgaris` | `Proteus vulgaris group` |
| `Salmonella enterica` | `Salmonella spp.` |

`node --check data.js` and the data-validation test both pass after the fix.

### Items to review (not auto-changed — need a microbiologist sign-off)
- **`sirBreakpoints`** is explicitly placeholder/unvalidated in-code and must be
  replaced with the current EUCAST table before any bench use (already flagged in the file).
- **Chromogenic media colour claims** (`plateMedia`/`organisms` for Uriselect &
  Brilliance MRSA) should be checked against the **current manufacturer IFU**, not SMI.
- **Issue numbers/dates** in `GUIDELINE_VERSIONS` (e.g. "UK SMI ID 1, Issue 4")
  should be re-verified against the current UK SMI host (RCPath), since the GOV.UK
  collection is withdrawn.
- **Faeces/enteric SMI code (B 30)** for XLD/TCBS/SMAC pathways needs its exact
  code/issue confirmed against the current index.

---

## 5. How to use this for "official usage"

For ISO 15189 / UKAS traceability, for each app view record: (a) the SMI document
code + **issue number and date** you validated against, (b) the date checked, and
(c) for AST, the EUCAST breakpoint table version. The app already has a
`GUIDELINE_VERSIONS` block designed for exactly this — populate its `reviewed`
fields and add the SMI codes from this document as you sign each view off.
