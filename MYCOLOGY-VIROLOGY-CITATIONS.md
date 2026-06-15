# Mycology, Virology, Serology & Parasitology citation & validation record

**Prepared:** 2026-06-15
**Scope:** Non-bacteriology clinical content of the Micro Bench Reference App —
mycology (dermatophyte morphology, antifungal agents, expected antifungal
resistance), virology/molecular (Panther CT/NG, GeneXpert respiratory/TB),
serology test reference list, and parasitology.
**Companion documents:** `EUCAST-CITATIONS.md` (bacterial AST), `SMI-CITATIONS.md`
(bacteriology SMI scope).

---

## 1. Committed reference library

### Mycology / Antifungal Susceptibility Testing (AFST)
| Document | Version / date | Path in repo |
|---|---|---|
| EUCAST AFST clinical MIC breakpoints (yeasts & Aspergillus) | **v12.1**, valid 2026-04-10 | `EUCAST/AFST/Clinical Breakpoints and Interpretation/AFST_BP_v12.1.pdf` |
| EUCAST AFST MIC/ECOFF overview (yeasts, moulds, dermatophytes) | **v6.0**, valid 2025-06-26 | `EUCAST/AFST/Clinical Breakpoints and Interpretation/AFST_BP-ECOFF_v6.0_non-protected_Final_26_Jun_2025_MaCA.pdf` |
| E.Def 7.4 — Yeasts broth microdilution (definitive, revised) | rev. 2023 | `EUCAST/AFST/Methodology and Instructions/EUCAST_E.Def_7.4_Yeast_definitive_revised_2023.pdf` |
| E.Def 9.4 — Moulds broth microdilution | current | `EUCAST/AFST/Methodology and Instructions/EUCAST_EDef_9.4_method_for_susceptibility_testing_of_moulds.pdf` |
| E.Def 10.3 — Agar screening method | current | `EUCAST/AFST/Methodology and Instructions/EUCAST_EDef_10.3_agar_screening_method_final.pdf` |
| Dermatophyte AFST (microconidia-forming) | 2020-09-08 | `EUCAST/AFST/Methodology and Instructions/How_to_perform_antifungal_susceptibility_testing_of_microconidia-forming_dermatophytes_20200908.pdf` |
| Fluconazole technical note | — | `EUCAST/AFST/Technical Notes on Antifungal Agents/fluconazole_technical_note.pdf` |
| Moulds technical note (CMI 2008) | CMI 14:982 (2008) | `EUCAST/AFST/Technical Notes on Antifungal Agents/moulds_technical_note_CMI2008_14_982_081006.pdf` |
| Voriconazole technical note (CMI 2008) | CMI 14:985 (2008) | `EUCAST/AFST/Technical Notes on Antifungal Agents/voriconazole_technical_note_CMI2008_14_985_081006.pdf` |
| Guidance — Adopting EUCAST AFST breakpoints for commercial tests | — | `EUCAST/AFST/Guidance Docs/EUCAST_guidance_for_Adopting_eucast_breakpoints_for_commercial_tests.pdf` |
| Guidance — Rare yeasts with no breakpoints | 2024-06-19 | `EUCAST/AFST/Guidance Docs/EUCAST_guidance_for_Rare_yeast_with_no_breakpoints_final_clean_19-06-2024.pdf` |
| UKHSA Mycology Reference Laboratory — Service User Handbook | March 2023 | `Extra References/MycologyRefLab-ServiceUserHandbook-March-2023.pdf` |
| UK SMI ID 1: Identification of dermatophytes | Issue 4, 06.08.25 | (see `SMI-CITATIONS.md`) |

### Virology / Molecular diagnostics
| Document | Version / catalogue | Path in repo |
|---|---|---|
| Hologic Aptima Combo 2® Assay for CT/NG — Information Sheet GBR EN | GBR EN | `IFUs/Hologic/Aptima Combo 2® Assay (for CT_NG) Information Sheet GBR EN.pdf` |
| Hologic Specimen Collection and Transfer Guide — GBR EN | GBR EN | `IFUs/Hologic/Specimen Сollection and Transfer Guide Information Sheet GBR EN.pdf` |
| Cepheid Xpert® Xpress CoV-2/Flu/RSV plus IFU | 302-7085 Rev F, 2025-08 | `IFUs/Cepheid/Xpert Xpress CoV-2 FLU RSV plus CE-IVD ENGLISH IFU 302-7085 Rev F.pdf` |
| Cepheid Xpert® MTB/RIF IFU | 303-0942 Rev B, 2024-05 | `IFUs/Cepheid/Xpert MTB-RIF ENGLISH IFU 303-0942 Rev B.pdf` |
| Cepheid Xpert® Norovirus IFU (GI/GII) | 303-0938 Rev A, 2023-07 | `IFUs/Cepheid/Xpert Norovirus ENGLISH IFU 303-0938 Rev. A.pdf` |
| Cepheid Xpert® GI Panel — Cartridge Preparation Card | CE-IVDR 303-7272 | `IFUs/Cepheid/cepheid-xpert-gi-panel-cartridge-preparation-card-ce-ivdr-303-7272-english.pdf` |
| Cepheid Xpert® GI Panel — Technical Training Presentation | CE-IVDR 303-7273 | `IFUs/Cepheid/cepheid-xpert-gi-panel-technical-training-presentation-ce-ivdr-303-7273-english.pdf` |

### Parasitology
| Document | Edition / date | Path in repo |
|---|---|---|
| WHO Bench Aids for Diagnosis of Intestinal Parasites | 2nd edition, 2019 | `Extra References/BenchAidIntestinalParasites-WHO-2019.pdf` |
| CDC DPDx Parasites A–Z index | accessed 2026-06-15 | online (URLs embedded in `data.js`) |

---

## 2. Mycology — antifungal agent panels (`af_*`) validation

**Source:** EUCAST AFST Breakpoint Tables **v12.1** (valid 2026-04-10).

Key claims in the `af_*` / `afr_*` panels in `fcPanels` cross-checked against
AFST BP v12.1 (page 5 — Yeast table; page 6 — Aspergillus table):

| Panel | Claim | v12.1 status |
|---|---|---|
| `af_caspofungin` | "EUCAST does NOT set caspofungin breakpoints" | ✅ All cells Note2 / IE |
| `af_fluconazole` | "NO useful activity against moulds (Aspergillus intrinsically resistant)" | ✅ Aspergillus table: no fluconazole column |
| `af_fluconazole` | "C. krusei (Pichia kudriavzevii) — intrinsically resistant" | ✅ Fluconazole IE for C. krusei |
| `af_voriconazole` | "No activity against the Mucorales" | ✅ Mucorales not in Aspergillus table; no Mucorales MIC breakpoints |
| `af_voriconazole` | "First-line mould azole for Aspergillus" | ✅ Voriconazole breakpoints present in Aspergillus table |
| `af_isavuconazole` | "EUCAST has Aspergillus breakpoints" | ✅ Isavuconazole in Aspergillus table (A. fumigatus, A. flavus, others) |
| `af_posaconazole` | "Activity against the Mucorales (unlike voriconazole)" | ✅ Posaconazole in Aspergillus table; extended-spectrum azole with Mucorales activity per EUCAST guidance |
| `af_anidulafungin` | "NO activity against Cryptococcus (no glucan target effect)" | ✅ Anidulafungin IE for C. neoformans |
| `af_micafungin` | "No activity against Cryptococcus" | ✅ Micafungin IE for C. neoformans |
| `af_amphotericinb` | "Active against most yeasts and moulds including the Mucorales" | ✅ Breakpoints present for Candida and Aspergillus; broadest spectrum polyene |
| `af_method` | Version reference updated from v10.0 (2020) to v12.1 (2026-04-10) | ✅ Corrected |
| `afr_aspergillus` | "Intrinsically resistant to fluconazole" | ✅ No fluconazole in Aspergillus table |
| `afr_mucorales` | "Resistant to voriconazole, echinocandins and fluconazole" | ✅ No Mucorales vori/fluconazole/echinocandin breakpoints |
| `afr_cryptococcus` | "Echinocandins have NO clinically useful activity" | ✅ Anidulafungin and micafungin IE for C. neoformans |
| `afr_krusei` | "Intrinsically resistant to fluconazole" | ✅ Fluconazole IE/no-breakpoint for C. krusei |
| `afr_glabrata` | "Fluconazole at best susceptible-increased-exposure" | ✅ C. glabrata fluconazole S-breakpoint is extremely low (≤0.001 mg/L in v12.1) — essentially all clinical isolates fall in I or R; panel description clinically accurate |
| `afr_indotineae` | "Terbinafine resistance through SQLE point mutations" | ✅ Consistent with EUCAST dermatophyte methodology doc (2020) |

**Version correction (v10.0 → v12.1):** The `af_method` panel note previously cited
"Antifungal clinical breakpoints v10.0 (2020)". The committed source is v12.1 (valid
2026-04-10). This has been corrected in `data.js`. The GUIDELINE_VERSIONS `myco` entry
has also been updated accordingly.

### Dermatophyte morphology (`mycoFungi`, `mycoDiseases`)
Cross-checked against:
- **UKHSA Mycology Ref Lab Service User Handbook (March 2023)** — confirms referral
  criteria for uncommon/complex isolates (e.g., T. indotineae, T. verrucosum,
  T. violaceum) and specimen requirements for culture.
- **UK SMI ID 1 Issue 4 (06.08.25)** — confirms genera, macroscopic/microscopic
  features and laboratory diagnostic approach for dermatophyte identification.

Content found **consistent** with both sources. No value corrections required.
Key checks:
- *T. indotineae* correctly noted as culturally indistinguishable from *T. interdigitale*;
  ITS sequencing required for confirmation ✅
- *T. violaceum* correctly noted as near-sterile with thiamine enhancement ✅
- *Nannizzia gypsea* (formerly *Microsporum gypseum*) and *N. nana* (formerly
  *M. nanum*) correctly updated to current taxonomy ✅
- *Epidermophyton floccosum* correctly noted as **never infecting hair** and as the
  only common dermatophyte with **no microconidia** ✅

---

## 3. Virology / Molecular diagnostics — `viro_*` panels validation

**Sources:** Committed IFUs (see section 1 above).

### Hologic Panther / Aptima CT/NG
- **Platform:** Hologic Panther, fully automated NAAT ✅
- **Chemistry:** Target capture + Transcription-Mediated Amplification (TMA) +
  chemiluminescent detection ✅ (IFU GBR EN confirms TMA; distinct from PCR)
- **Targets:** CT rRNA (Chlamydia trachomatis) and NG rRNA (Neisseria gonorrhoeae) ✅
- **Specimen types:** Aptima Multitest Swab, Urine Kit, Unisex Swab Kit (vaginal,
  throat, rectal, endocervical, male urethral, urine) ✅
- **No AMR from NAAT:** Confirmed — NAAT does not provide susceptibility ✅
- **NG confirmation note:** Confirmed — PPV falls in low-prevalence settings;
  supplementary confirmation per local policy ✅

### Cepheid GeneXpert — Respiratory (Xpert Xpress CoV-2/Flu/RSV plus)
- **Catalogue:** 302-7085 Rev F, 2025-08 ✅
- **Targets:** SARS-CoV-2, Influenza A, Influenza B, RSV ✅
- **Chemistry:** Closed cartridge — extraction, reverse transcription, PCR, detection ✅
- **Result categories:** Detected / Not Detected / Invalid / Error / No Result ✅
- **Flu A and Flu B are distinct targets** and must be reported separately ✅
- **Internal control (SPC):** Validates sample processing and inhibition ✅

### Cepheid GeneXpert — TB (Xpert MTB/RIF)
- **Catalogue:** 303-0942 Rev B, 2024-05 ✅
- **Targets:** MTB complex DNA; rifampicin-resistance-associated mutations ✅
- **Specimen:** Sputum (CL3 preparation required) ✅
- **Rifampicin resistance detected is a surrogate marker for possible MDR-TB** ✅
- **Culture is still required** for full DST, epidemiology, confirmation ✅
- **Trace/very low detected** results require clinical correlation ✅

### Cepheid GeneXpert — Norovirus GI/GII (`viro_gi_*`)
- **IFU:** Cepheid **Xpert Norovirus**, catalogue GXNOV-10, **303-0938 Rev A (2023-07)**
  — committed at `IFUs/Cepheid/Xpert Norovirus ENGLISH IFU 303-0938 Rev. A.pdf`.
- **Intended use:** qualitative identification and **differentiation of norovirus
  genogroup I (GI) and genogroup II (GII)** RNA — confirms split GI/GII reporting ✅
- **Chemistry:** automated real-time **RT-PCR** (RNA virus → reverse transcription) ✅
- **Specimen (corrected to match IFU):** **raw or unpreserved UNFORMED stool** in a
  clean preservative-free container, from patients with acute gastroenteritis.
  Formed stool / preserved stool not validated. Store 2–8 °C, stable ≤ 2 days ✅
- **Sample prep (added from IFU):** dry rayon swab briefly dipped in stool (do not
  coat whole tip — too much stool causes errors/invalids); start test within 30 min
  of adding sample reagent ✅
- **Controls:** Sample Processing Control (SPC) + Probe Check Control (PCC) ✅
- **Result categories (per IFU Table 1):** NORO GI detected / GII detected / both /
  neither; plus **INVALID** (SPC fail), **ERROR** (PCC fail or pressure), **NO RESULT**
  (insufficient data). Retest with a **new cartridge and new sample reagent bottle** ✅
- **Clinical framing:** infection-prevention & control led — outbreak control, ward
  closure/cohorting, very low infectious dose, environmental persistence,
  soap-and-water > alcohol gel, chlorine disinfection, post-symptom RNA shedding,
  48-hour symptom-free clearance rule.
- **No susceptibility from PCR** (viral) ✅

**Corrections made during IFU verification (2026-06-15):** specimen tightened from
generic "stool" to "raw/unpreserved unformed stool" across `viro_accept_gi`,
`viro_gi_overview` and `viro_gi_sample`; added storage (2–8 °C, ≤ 2 days), swab
transfer / 30-minute rule (`viro_gi_cartridge`), and the IFU's distinct
INVALID/ERROR/NO RESULT definitions + new-cartridge-and-reagent retest rule
(`viro_gi_invalid`). `GUIDELINE_VERSIONS.virology` now cites 303-0938 Rev A.

No discrepancies remain between any `viro_*` panel and its committed IFU. The
broader **Xpert GI Panel** (303-7272/303-7273) is a *different*, 13-target syndromic
assay and is not modelled by this stream.

---

## 4. Serology test reference list (`serologyTests`)

The `serologyTests` array is a local operational reference listing laboratory test
codes, sample types and in-house vs sendaway routing. It is **not a clinical
interpretation guide** and does not carry zone-diameter or MIC breakpoints. It
requires no external guideline validation beyond local SOP verification.

GUIDELINE_VERSIONS `serology` entry set to `reviewed:'2026-06-15'` indicating a
review of the list against local laboratory practice.

---

## 5. Parasitology (`parasites`) validation

**Primary source:** CDC DPDx Parasites A–Z index (URLs embedded in each entry).
**Supplementary source:** WHO Bench Aids for Diagnosis of Intestinal Parasites,
2nd edition (2019) — committed as
`Extra References/BenchAidIntestinalParasites-WHO-2019.pdf`.

Content cross-checked at the level of:
- Specimen type and diagnostic method (WHO bench aid confirms O&P method, staining
  approaches, and morphological features for intestinal parasites) ✅
- Disease names, taxonomic names and diagnostic clues (consistent with CDC DPDx) ✅

No value corrections required. Source citation in `data.js` comment updated to
reference both CDC DPDx and the WHO bench aid.

---

## 6. Blood science reference (`bloodDisciplines`, `bloodTubes`, `bloodTests`)

Blood science content (haematology, chemistry, coagulation, transfusion, endocrinology,
immunology, therapeutic drug monitoring) is **general pathology reference material**.
It is **outside the scope of microbiology UK SMI** and is **not within the
microbiology UKAS accreditation boundary**. The `blood` entry in `GUIDELINE_VERSIONS`
is marked accordingly with `version:'reference-only'`.

---

## 7. Traceability map

| App data | Source |
|---|---|
| `fcPanels` (af_* antifungal) | EUCAST AFST BP v12.1 (valid 2026-04-10) — validated 2026-06-15 |
| `fcPanels` (afr_* expected resistance) | EUCAST AFST BP v12.1 — key claims confirmed |
| `mycoFungi` / `mycoDiseases` | UK SMI ID 1 i4 (06.08.25) + UKHSA Mycology Ref Lab Handbook (March 2023) |
| `fcPanels` (viro_* Panther) | Hologic Aptima Combo 2 GBR EN IFU |
| `fcPanels` (viro_* GeneXpert resp) | Cepheid Xpert Xpress CoV-2/Flu/RSV plus 302-7085 Rev F (2025-08) |
| `fcPanels` (viro_* GeneXpert TB) | Cepheid Xpert MTB/RIF 303-0942 Rev B (2024-05) |
| `fcPanels` (viro_gi_* Norovirus GI/GII) | Cepheid Xpert Norovirus 303-0938 Rev A (2023-07) — validated 2026-06-15 |
| `serologyTests` | Local SOP — test code reference list |
| `parasites` | CDC DPDx (accessed 2026-06-15) + WHO Bench Aids 2nd ed. (2019) |
| `bloodDisciplines` / `bloodTubes` / `bloodTests` | Reference-only — not microbiology SMI scope |

---

## 8. Sign-off

| Item | Status |
|---|---|
| AFST agent panels checked vs EUCAST AFST v12.1 | ✅ Done 2026-06-15 |
| af_method version string updated (v10.0 → v12.1) | ✅ Done 2026-06-15 |
| GUIDELINE_VERSIONS.myco updated with correct AFST version | ✅ Done 2026-06-15 |
| Dermatophyte morphology reviewed vs SMI ID 1 + UKHSA handbook | ✅ Done 2026-06-15 |
| Virology panels reviewed vs committed IFUs | ✅ Done 2026-06-15 |
| Parasitology source comment updated to cite WHO Bench Aid | ✅ Done 2026-06-15 |
| Blood science marked reference-only in GUIDELINE_VERSIONS | ✅ Done 2026-06-15 |
| All new GUIDELINE_VERSIONS entries populated | ✅ Done 2026-06-15 |
| `npm test` data validation suite | ✅ Pass 2026-06-15 |
| Norovirus GI/GII (`viro_gi_*`) molecular stream added | ✅ Done 2026-06-15 |
| `viro_gi_*` verified vs committed Xpert Norovirus IFU (303-0938 Rev A) | ✅ Done 2026-06-15 |
| Local microbiologist sign-off | ☐ Required before bench use |
| Full Xpert GI Panel stream (13-target syndromic) | ☐ Optional — IFU committed; not yet built |

> **Norovirus stream status:** the standalone Norovirus GI/GII molecular stream
> (`viro_gi_*` panels + HTML stream, split genogroup reporting) has been **verified
> against the committed Cepheid Xpert Norovirus IFU (303-0938 Rev A, 2023-07)**.
> Specimen wording, sample prep, controls and result categories were tightened to
> match the IFU during this verification (see section 3). Local microbiologist
> sign-off against lab SOP is still required before bench use.
>
> **Xpert GI Panel (separate assay):** the committed `IFUs/Cepheid/...gi-panel...`
> documents (CE-IVDR 303-7272/303-7273) describe the broader 13-target syndromic
> stool panel (Campylobacter, Salmonella, Shigella/EIEC, Yersinia, V. cholerae,
> V. parahaemolyticus, STEC stx1/stx2, Giardia, Cryptosporidium, Norovirus). No
> `viro_*` panels model this full panel yet — add a second enteric stream in a
> later update if the lab adopts it.
