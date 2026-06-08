/* data.js — extracted from Micro_Bench_Reference_v23_bact.html
   BASE REFERENCE DATA ONLY (organism flows, plate media, organisms, antibiotic
   classes, glossary, bench-ID datasets, etc.). No logic. Verbatim, original order.
   LOAD ORDER: data.js  ->  app.js  ->  effects.js  (data must load before app). */

const orgFlowsWound = {
  w_staph:{label:'Staphylococcus aureus / CoNS — wound pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'Catalase test',desc:'Staph vs Strep / Entero',key:'reagent_staph'},
      {name:'Staph latex',desc:'S. aureus vs CoNS',key:'reagent_staph'},
      {name:'DNase agar',desc:'S. aureus confirmation',key:'reagent_staph'}
    ]},
    {header:'MRSA screen first',color:'coral',cards:[
      {name:'Cefoxitin (MHE)',desc:'Plated separately — defines MSSA / MRSA branch',key:'cefox_mhe'}
    ]},
    {header:'MSSA branch',color:'amber',cards:[
      {name:'MSSA panel',desc:'Staph 1 + Cefoxitin',key:'w_mssa'}
    ]},
    {header:'MRSA branch',color:'amber',cards:[
      {name:'MRSA panel',desc:'Staph 1 + Staph 2 + Cefoxitin',key:'w_mrsa'}
    ]},
    {header:'Deep wound',color:'pink',cards:[
      {name:'Deep wound staph',desc:'Staph 1 + Staph 2 + Cefoxitin + Vanc/Teico/Dapto MICs',key:'w_deep_staph'}
    ]},
    {header:'Topical (ear)',color:'blue',cards:[
      {name:'Topical ear staph',desc:'PTOP + Cefoxitin',key:'w_topical_staph'}
    ]}
  ]},
  w_strep:{label:'Streptococcus spp. (BHS / AHS) — wound pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'Catalase −',desc:'Confirms Strep/Entero',key:'reagent_staph'},
      {name:'Haemolysis',desc:'β (BHS) vs α (AHS) vs γ',key:'w_strep'},
      {name:'Lancefield / CAMP',desc:'Group A / B / C / G typing',key:'w_strep'}
    ]},
    {header:'Primary panel',color:'coral',cards:[
      {name:'Strep Donker',desc:'Same panel for BHS (EU_BHS) and AHS (EU_AHS)',key:'w_strep'}
    ]},
    {header:'Penicillin / glycopeptide MICs',color:'pink',cards:[
      {name:'MIC reflex',desc:'Pen / Vanco / Teico MIC for invasive isolates or atypical zones',key:'w_strep_mics'}
    ]}
  ]},
  w_pneumo:{label:'Streptococcus pneumoniae — wound / respiratory pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'Optochin',desc:'S. pneumoniae sensitive (zone ≥14mm)',key:'w_pneumo_id'},
      {name:'Bile solubility',desc:'Confirms pneumococcus',key:'w_pneumo_id'}
    ]},
    {header:'Primary panel',color:'coral',cards:[
      {name:'Pneumo Donker',desc:'EU_PNEUMO1 — oxacillin screen + first-line oral agents',key:'w_pneumo1'}
    ]},
    {header:'Reflex on resistance',color:'blue',cards:[
      {name:'Pneumo Extras',desc:'EU_PNEUMO2 — second-line agents',key:'w_pneumo2'}
    ]},
    {header:'β-lactam MICs',color:'pink',cards:[
      {name:'Pen / Cefotaxime MIC',desc:'Mandatory if oxacillin zone <20mm or invasive site',key:'w_pneumo_mic'}
    ]}
  ]},
  w_entero:{label:'Enterococcus spp. — wound pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'PYR / Bile esculin',desc:'Entero confirmation',key:'esp'},
      {name:'Species ID',desc:'E. faecalis vs E. faecium (MALDI)',key:'esp'}
    ]},
    {header:'Primary (run together)',color:'coral',cards:[
      {name:'ESP1 Donker',desc:'Ampicillin · Gentamicin (HLAR) · Linezolid · Tigecycline',key:'w_esp1'},
      {name:'ESP2 Donker',desc:'Teicoplanin · Vancomycin (VRE screen)',key:'w_esp2'}
    ]}
  ]},
  w_pseudo:{label:'Pseudomonas aeruginosa — wound pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'Oxidase +',desc:'Non-fermenter confirmation',key:'reagent_pseudo'},
      {name:'Colony morphology',desc:'Pigment, metallic sheen',key:'reagent_pseudo'}
    ]},
    {header:'Primary panel',color:'coral',cards:[
      {name:'Pseudo Donker',desc:'EU_PSE1 — Ceftaz · Cipro · Ceftol/Taz · Meropenem · Tobramycin · Pip/Taz',key:'w_pseudo1'}
    ]},
    {header:'Reflex (MDR)',color:'amber',cards:[
      {name:'Pseudo Extras',desc:'EU_PSE2 — Amikacin · Aztreonam · Cefepime · Ticar/Clav',key:'w_pseudo2'}
    ]},
    {header:'Complex cases — MICs',color:'pink',cards:[
      {name:'Imipenem MIC (MBL)',desc:'MBL screen for carbapenem-reduced isolates',key:'w_pseudo_mbl'},
      {name:'Meropenem MIC',desc:'Quantitative confirmation',key:'mero_mic'}
    ]}
  ]},
  w_haem:{label:'Haemophilus spp. — wound / respiratory pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'X + V factor',desc:'H. influenzae requires both; H. parainfluenzae V only',key:'w_haem_id'},
      {name:'MALDI-TOF',desc:'Species ID',key:'w_haem_id'}
    ]},
    {header:'Primary (run together)',color:'coral',cards:[
      {name:'Haem 1 Donker',desc:'EU_HAEM1 — Augmentin · Cipro · Cefuroxime · Levofloxacin',key:'w_haem1'},
      {name:'Haem 2 Donker',desc:'EU_HAEM2 — Benzylpenicillin · Septrin · Tetracycline',key:'w_haem2'}
    ]},
    {header:'Eye Haem only',color:'pink',cards:[
      {name:'Gentamicin MIC',desc:'Done alongside Haem panels for all eye isolates',key:'w_eye_haem'}
    ]}
  ]},
  w_anaerobe:{label:'Anaerobes — Brucella agar MIC pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'Anaerobic culture',desc:'No growth aerobically; growth on anaerobic blood agar',key:'w_anaerobe_id'},
      {name:'Gram stain',desc:'GP vs GN — drives Vancomycin inclusion',key:'w_anaerobe_id'},
      {name:'MALDI-TOF',desc:'Species ID (Bacteroides / Clostridium / Cutibacterium etc.)',key:'w_anaerobe_id'}
    ]},
    {header:'MIC panel (all isolates)',color:'coral',cards:[
      {name:'Anaerobe MICs',desc:'Augmentin · Clindamycin · Meropenem · Metronidazole · Penicillin · Pip/Taz — all MICs on Brucella agar',key:'w_anaerobe_mics'}
    ]},
    {header:'GP anaerobes only',color:'pink',cards:[
      {name:'Vancomycin MIC',desc:'Added when Gram-positive (Clostridium, Cutibacterium, etc.)',key:'w_anaerobe_vanc'}
    ]}
  ]},
  w_gpb:{label:'Gram-positive bacilli (Corynebacterium etc.) — wound pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'Gram stain',desc:'GP rods, club-shaped (Corynebacterium)',key:'w_gpb_id'},
      {name:'Catalase / MALDI',desc:'Species ID',key:'w_gpb_id'}
    ]},
    {header:'Primary (Corynebacterium)',color:'coral',cards:[
      {name:'GPB 1 Donker',desc:'EU_GPB1 — Cipro · Clindamycin · Penicillin · Vancomycin',key:'w_gpb1'}
    ]},
    {header:'Reflex',color:'blue',cards:[
      {name:'GPB 2 Donker',desc:'EU_GPB2 — Linezolid · Rifampicin · Tetracycline',key:'w_gpb2'}
    ]}
  ]},
  w_acine:{label:'Acinetobacter spp. — wound pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'Oxidase −, GNR',desc:'Non-fermenter, oxidase-negative',key:'w_acine_id'},
      {name:'MALDI-TOF',desc:'A. baumannii complex ID',key:'w_acine_id'}
    ]},
    {header:'Primary panel',color:'coral',cards:[
      {name:'Acinetobacter Donker',desc:'EU_ACI — Cipro · Gentamicin · Meropenem · Septrin',key:'w_acine'}
    ]},
    {header:'CRAB escalation',color:'amber',cards:[
      {name:'D73 + Coli 3 reflex',desc:'If meropenem reduced → D73 carbapenemase typing',key:'d73fc'}
    ]}
  ]},
  w_aero:{label:'Aeromonas spp. — wound pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'Oxidase +, GNR',desc:'Fermenter, oxidase-positive',key:'w_aero_id'},
      {name:'MALDI-TOF',desc:'A. hydrophila / caviae / veronii',key:'w_aero_id'}
    ]},
    {header:'Primary panel',color:'coral',cards:[
      {name:'Aeromonas Donker',desc:'EU_AERO — Aztreonam · Ceftazidime · Cipro · Cefepime · Levofloxacin · Septrin',key:'w_aero'}
    ]}
  ]},
  w_kin:{label:'Kingella spp. — wound / joint pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'HACEK group',desc:'Fastidious GN rod / coccobacillus',key:'w_kin_id'},
      {name:'MALDI-TOF',desc:'K. kingae confirmation',key:'w_kin_id'}
    ]},
    {header:'Primary panel',color:'coral',cards:[
      {name:'Kingella Donker',desc:'EU_KIN — Cipro · Cefotaxime · Meropenem · Benzylpen · Rifampicin · Septrin',key:'w_kin'}
    ]}
  ]},
  w_list:{label:'Listeria monocytogenes — wound / invasive pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'GP rod, β-haem',desc:'Tumbling motility at room temp',key:'w_list_id'},
      {name:'MALDI-TOF',desc:'L. monocytogenes confirmation',key:'w_list_id'}
    ]},
    {header:'Primary panel',color:'coral',cards:[
      {name:'Listeria Donker',desc:'EU_LIS — Ampicillin · Erythromycin · Meropenem · Penicillin · Septrin',key:'w_list'}
    ]}
  ]},
  w_mor:{label:'Moraxella catarrhalis — wound / respiratory pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'GN diplococcus',desc:'Oxidase +, DNase +',key:'w_mor_id'},
      {name:'β-lactamase',desc:'Nitrocefin — usually positive',key:'w_mor_id'}
    ]},
    {header:'Primary panel',color:'coral',cards:[
      {name:'Moraxella Donker',desc:'EU_MOR — Augmentin · Cipro · Cefuroxime · Levofloxacin · Septrin · Tetracycline',key:'w_mor'}
    ]}
  ]},
  w_past:{label:'Pasteurella spp. — wound / bite pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'GN coccobacillus',desc:'Oxidase +, indole +',key:'w_past_id'},
      {name:'MALDI-TOF',desc:'P. multocida / canis confirmation',key:'w_past_id'}
    ]},
    {header:'Primary panel',color:'coral',cards:[
      {name:'Pasteurella Donker',desc:'EU_PAS — Augmentin · Cipro · Cefotaxime · Nalidixic · Penicillin · Tetracycline',key:'w_past'}
    ]}
  ]},
  w_steno:{label:'Stenotrophomonas maltophilia — wound pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'Oxidase −, GNR',desc:'Non-fermenter, lavender colonies',key:'w_steno_id'},
      {name:'MALDI-TOF',desc:'S. maltophilia confirmation',key:'w_steno_id'}
    ]},
    {header:'Primary panel',color:'coral',cards:[
      {name:'Stenotrophomonas Donker',desc:'EU_STENO — Septrin (intrinsic R to most agents — Septrin is first-line)',key:'w_steno'}
    ]},
    {header:'Septrin-resistant',color:'pink',cards:[
      {name:'Levofloxacin / Minocycline MIC',desc:'Alternatives if Septrin resistant or contraindicated',key:'w_steno_mic'}
    ]}
  ]},
  w_topical:{label:'Topical isolates — ear / eye',cols:[
    {header:'Site / Gram',color:'green',cards:[
      {name:'Ear vs Eye',desc:'Determines extras panel applicability',key:'w_topical_id'},
      {name:'GP vs GN',desc:'Drives PTOP vs NTOP selection',key:'w_topical_id'}
    ]},
    {header:'Gram-positive topical',color:'coral',cards:[
      {name:'PTOP Donker',desc:'Chloramphenicol · Fucidin · Gentamicin · Norfloxacin (EAR_SAU, EYE_SAU, EYE_BHS, EYE_PNEUMO)',key:'w_ptop'}
    ]},
    {header:'Gram-negative topical',color:'coral',cards:[
      {name:'NTOP Donker',desc:'Chloramphenicol · Cipro · Gentamicin · Nalidixic · Pefloxacin · Tobramycin (EAR_PSE, EYE_PSE, EAR_COLI, EYE_COLI, EYE_HAEM, EYE_MOR)',key:'w_ntop'}
    ]},
    {header:'Eye extras',color:'pink',cards:[
      {name:'Eye Extras',desc:'Amikacin · Ceftazidime · Clarithromycin MIC · Vancomycin MIC (EU_EYE_EXT)',key:'w_eye_ext'}
    ]}
  ]}
};

const orgFlows = {
  staph:{label:'Staphylococcus spp. pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'Catalase test',desc:'Staph vs Strep / Entero',key:'reagent_staph'},
      {name:'Staph latex',desc:'S. aureus vs CoNS',key:'reagent_staph'},
      {name:'DNase agar',desc:'S. aureus confirmation',key:'reagent_staph'}
    ]},
    {header:'Primary',color:'coral',cards:[
      {name:'Staph Donker',desc:'Amp · Nitrofurantoin · Norfloxacin · Trimethoprim · Novobiocin',key:'staph'}
    ]},
    {header:'MRSA screen',color:'amber',cards:[
      {name:'Cefoxitin disc',desc:'On MHE agar (separately plated)',key:'reagent_staph'}
    ]},
    {header:'Reflex panels',color:'blue',cards:[
      {name:'Staph1 Donker',desc:'Clindamycin · Erythromycin · Fusidic acid · Rifampicin · Tetracycline · Trimethoprim',key:'staph1'},
      {name:'Staph2 Donker',desc:'Gentamicin · Linezolid · Mupirocin · Norfloxacin · Co-trimoxazole · Tigecycline',key:'staph2'}
    ]},
    {header:'Decolonisation',color:'pink',cards:[
      {name:'Mupirocin standalone',desc:'MRSA screen / recurrent carriage',key:'mupirocin'}
    ]}
  ]},
  strep:{label:'Streptococcus spp. pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'Catalase test',desc:'Catalase − confirms Strep/Entero',key:'reagent_staph'},
      {name:'Haemolysis pattern',desc:'β / α / γ on blood agar',key:'strep'},
      {name:'CAMP test',desc:'GBS confirmation',key:'strep'}
    ]},
    {header:'Primary sensitivity',color:'coral',cards:[
      {name:'Strep Donker',desc:'Pen · Amp · Levofloxacin · Nitrofurantoin · Teicoplanin · Vancomycin',key:'strep'}
    ]}
  ]},
  enterococcus:{label:'Enterococcus spp. pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'Catalase test',desc:'Catalase −',key:'reagent_staph'},
      {name:'PYR test',desc:'Entero PYR+ vs Strep PYR−',key:'esp'},
      {name:'Species ID',desc:'E. faecalis vs E. faecium',key:'esp'}
    ]},
    {header:'Primary',color:'coral',cards:[
      {name:'ESP1',desc:'Amp · Levofloxacin · Nitrofurantoin',key:'esp'}
    ]},
    {header:'VRE screen',color:'amber',cards:[
      {name:'ESP2',desc:'Vancomycin on MHA',key:'esp'}
    ]},
    {header:'Complex resist.',color:'blue',cards:[
      {name:'ESP3',desc:'Gentamicin HLAR · Linezolid · Tigecycline',key:'esp'}
    ]}
  ]},
  pseudo:{label:'Pseudomonas aeruginosa pathway',cols:[
    {header:'Reagent ID',color:'green',cards:[
      {name:'Oxidase test',desc:'Oxidase + confirms non-fermenter',key:'reagent_pseudo'},
      {name:'Colony morphology',desc:'Pigment, metallic sheen',key:'reagent_pseudo'}
    ]},
    {header:'Primary',color:'coral',cards:[
      {name:'Pseudo1',desc:'Cipro · Ceftazidime · Cefepime · Tobramycin · Pip/Taz · Meropenem',key:'pseudo'}
    ]},
    {header:'MDR reflex',color:'amber',cards:[
      {name:'Pseudo2',desc:'Amikacin · Ceftolozane/Tazobactam',key:'pseudo'},
      {name:'D73 set',desc:'If carbapenem R',key:'d73fc'}
    ]}
  ]}
};

const fcPanels = {
  reagent_proteus:{title:'Proteus spp. — Indole test',sub:'Performed on all Proteus isolates to guide species-level ID and antibiotic reporting.',abx:['Indole reagent (Kovács or equivalent)'],reagents:true,notes:'Indole-negative: P. mirabilis — most common urinary Proteus, broader susceptibility. Indole-positive: P. vulgaris / P. penneri — intrinsically resistant to ampicillin, cephalexin, and colistin. All Proteus spp. are intrinsically resistant to nitrofurantoin, polymyxins, and tetracycline regardless of disc result.'},
  reagent_pseudo:{title:'Pseudomonas spp. — Oxidase test',sub:'Trigger for Pseudo1 donker pathway instead of GP/IN cascade.',abx:['Oxidase reagent (tetramethyl-p-phenylenediamine)'],reagents:true,notes:'Oxidase-positive in a non-fermenting GNR is strongly supportive of P. aeruginosa. Acinetobacter is typically oxidase-negative. P. aeruginosa is intrinsically resistant to ampicillin, amoxicillin/clavulanate, cephalexin, trimethoprim, nitrofurantoin, and temocillin — none of these should be reported.'},
  reagent_staph:{title:'Staphylococcus spp. — Latex · Catalase · DNase · Cefoxitin',sub:'Cascade of confirmatory tests for gram-positive cocci in clusters.',abx:['Catalase test','Staph latex agglutination (e.g. Pastorex Staph Plus)','DNase agar','Cefoxitin disc on MHE — MRSA screen'],reagents:true,notes:'Catalase distinguishes Staphylococcus (+) from Streptococcus/Enterococcus (−). Staph latex: S. aureus agglutinates, CoNS do not. DNase agar: S. aureus produces DNase (clear halo). Cefoxitin on MHE: EUCAST mecA/MRSA surrogate — zone ≤19mm = MRSA. Result classifies all β-lactams as resistant and triggers IC flags. Novobiocin on Staph donker further distinguishes S. saprophyticus (resistant) from other CoNS.'},
  gp:{title:'GP Donker — primary community panel',sub:'EUCAST-guided first-line for GP/community isolates.',abx:['Ampicillin','Amoxicillin/Clavulanic acid','Cefpodoxime','Nitrofurantoin','Cephalexin','Trimethoprim'],notes:'Cefpodoxime resistance is the primary trigger for D68 ESBL/AmpC screen. Nitrofurantoin and trimethoprim are EUCAST first-line urinary agents. All agents are GP-prescribable, ensuring a clinically actionable report without reflexing to GP1 in straightforward cases.'},
  gp1:{title:'GP1 Donker — community reflex / extended panel',sub:'Reflexed when GP Donker shows resistance or organism/clinical context warrants.',abx:['Ciprofloxacin','Gentamicin','Ertapenem','Fosfomycin','Temocillin','Mecillinam'],notes:'Mecillinam (pivmecillinam) is EUCAST-recommended oral option for uncomplicated UTI. Temocillin useful for ESBL producers. Ertapenem signals carbapenem requirement. Fosfomycin for simple UTI in ESBL-E. Gentamicin for complex presentations potentially treated with single-dose IV.'},
  in:{title:'IN Donker — primary inpatient panel',sub:'EUCAST-guided first-line for inpatient isolates.',abx:['Mecillinam','Amoxicillin/Clavulanic acid','Cefpodoxime','Gentamicin','Nitrofurantoin','Trimethoprim'],notes:'Gentamicin replaces Cephalexin vs GP donker, reflecting inpatient IV access. Mecillinam included as primary agent. Cefpodoxime serves as ESBL trigger.'},
  in1:{title:'IN1 Donker — inpatient reflex / extended panel',sub:'Reflexed on inpatient isolates with resistance or where epidemiology warrants.',abx:['Ciprofloxacin','Ampicillin','Temocillin','Ertapenem','Fosfomycin','Piperacillin/Tazobactam'],notes:'Piperacillin/tazobactam is inpatient-specific (IV only). Ertapenem and temocillin address ESBL-E empirically. Fosfomycin IV for complex ESBL/MDR UTI.'},
  staph:{title:'Staph Donker — Staphylococcus spp. primary panel',sub:'Applied to all Staphylococcus isolates. Cefoxitin on MHE plated separately for MRSA detection.',abx:['Ampicillin','Nitrofurantoin','Norfloxacin','Trimethoprim','Novobiocin','Cefoxitin (MHE — plated separately)'],notes:'Novobiocin distinguishes S. saprophyticus (resistant) from other CoNS — critical for UTI context. Cefoxitin on MHE is the EUCAST-recommended mecA/MRSA surrogate — not reported as a sensitivity; classifies all β-lactam results and flags MRSA. EUCAST breakpoints for S. saprophyticus differ from S. aureus — species ID via latex/DNase is essential before interpretation.'},
  staph1:{title:'Staph1 Donker — skin/soft tissue/systemic reflex panel',sub:'Reflexed for non-urinary Staphylococcus isolates (skin, wound, respiratory, blood) or complex UTI with treatment failure.',abx:['Clindamycin','Erythromycin','Fusidic acid','Rifampicin','Tetracycline','Trimethoprim'],notes:'Clindamycin and erythromycin: report together — inducible clindamycin resistance (iMLSb) must be detected by D-zone test (erythromycin disc adjacent to clindamycin disc; flattening of clindamycin zone = positive D-zone = inducible resistance). A positive D-zone means clindamycin should not be reported susceptible despite appearing so in isolation. Fusidic acid: topical/oral agent for SSTI; resistance emerging in community MRSA — EUCAST breakpoints available. Rifampicin: never report as susceptible as a standalone agent — always used in combination (e.g. with daptomycin or linezolid for biofilm/foreign body infections) to prevent rapid resistance emergence. Tetracycline: useful oral option for MRSA SSTI; doxycycline is preferred clinically. Trimethoprim: oral option for MRSA UTI and SSTI per some guidelines.'},
  staph2:{title:'Staph2 Donker — complex/resistant Staphylococcus reflex panel',sub:'Reflexed for MRSA, multi-resistant CoNS, invasive isolates, or decolonisation-context strains where Staph1 shows resistance.',abx:['Gentamicin','Linezolid','Mupirocin (disc)','Norfloxacin','Sulphamethoxazole/Trimethoprim (co-trimoxazole)','Tigecycline'],notes:'Gentamicin: low-level resistance (MIC 4–16 mg/L) may still allow synergy in combination for endocarditis; high-level resistance eliminates synergy entirely. Linezolid: reserve agent for MRSA and VRE — should be reported with caution and only with clinical indication to limit resistance pressure. Mupirocin disc in Staph2 distinguishes low-level (MIC 8–256 mg/L) from high-level resistance (MIC >256 mg/L, plasmid-mediated mupA gene) — high-level resistance renders decolonisation protocols ineffective; see standalone Mupirocin card. Co-trimoxazole: preferred oral combination for MRSA SSTI; note trimethoprim alone may appear susceptible but the sulphamethoxazole component provides important synergy. Tigecycline: broad reserve agent — EUCAST has no validated S. aureus breakpoints for tigecycline; interpret using PK/PD non-species-specific breakpoints or ECOFF with caution and consultant input.'},
  mupirocin:{title:'Mupirocin standalone disc — MRSA decolonisation / recurrent carriage',sub:'Applied to MRSA or recurrent Staphylococcus isolates where nasal or skin decolonisation is planned.',abx:['Mupirocin disc (200 µg)'],notes:'Mupirocin is the primary topical agent for MRSA nasal decolonisation (combined with chlorhexidine body wash in most protocols). Zone interpretation: susceptible (zone ≥18mm, MIC ≤1 mg/L) — decolonisation likely effective. Intermediate (zone 11–17mm, MIC 4–256 mg/L) — low-level resistance, decolonisation may still succeed but efficacy is reduced; clinical judgement required. Resistant (zone ≤10mm, MIC >256 mg/L) — high-level resistance due to mupA gene (plasmid-mediated isoleucyl-tRNA synthetase); mupirocin decolonisation will fail. For high-level resistance, consider alternative decolonisation agents (e.g. chlorhexidine alone, or retapamulin where available per local guidelines). This disc is separate from the Staph2 panel to allow targeted reflexing in decolonisation pathways without running the full second panel in every case.'},
  strep:{title:'Strep Donker — Streptococcus spp.',sub:'Applied to Streptococcus isolates (GBS, GAS, viridans group) from urine.',abx:['Penicillin','Ampicillin','Levofloxacin','Nitrofurantoin','Teicoplanin','Vancomycin'],notes:'Levofloxacin replaces ciprofloxacin for streptococci (better in vitro activity; EUCAST breakpoints available). CAMP test confirms GBS before sensitivity reporting. Nitrofurantoin included as a urinary-specific agent, though GBS susceptibility is variable.'},
  esp:{title:'ESP1 / ESP2 / ESP3 — Enterococcus spp.',sub:'Three-donker cascade. PYR test used to distinguish from Streptococcus before donker selection.',abx:['ESP1: Ampicillin · Levofloxacin · Nitrofurantoin','ESP2: Vancomycin (MHA — plated separately)','ESP3: Gentamicin (HLAR) · Linezolid · Tigecycline'],notes:'PYR test (pyrrolidonyl arylamidase): Enterococcus PYR-positive, most Streptococcus PYR-negative. ESP2 vancomycin plated separately on MHA to detect VRE including hetero-resistance. Gentamicin in ESP3 for HLAR screening. Speciation to E. faecalis vs E. faecium is essential — different intrinsic resistances and breakpoints.'},
  pseudo:{title:'Pseudo1 / Pseudo2 — Pseudomonas aeruginosa',sub:'Pseudo1 primary (triggered by oxidase-positive non-fermenter); Pseudo2 reflexed for MDR.',abx:['Pseudo1: Ciprofloxacin · Ceftazidime · Cefepime · Tobramycin · Pip/Taz · Meropenem','Pseudo2: Amikacin · Ceftolozane/Tazobactam'],notes:'Ceftolozane/tazobactam (Pseudo2) for MDR/XDR Pseudomonas — active against overexpressed AmpC strains and porin-loss mutants. MBL-producing Pseudomonas (NDM, VIM, IMP) requires D73 — Caz/Avi is not active. Intrinsic resistances must not be reported.'},
  d73fc:{title:'D73 — Carbapenemase typing (from Pseudo pathway)',sub:'Reflexed from Pseudo pathway when carbapenem resistance detected. Switch to D-set interpreter for full disc-by-disc logic.',abx:['Penem alone','Penem + MBL inhibitor','Penem + KPC inhibitor','Penem + AmpC inhibitor','Temocillin + MBL inhibitor'],notes:'Switch to the D-set interpreter view for full pattern-based interpretation of D73 disc combinations.'},
  ur2:{title:'UR2 Donker — highly resistant / ESBL-E / MDR',sub:'Applied to isolates showing ESBL phenotype, MDR Enterobacterales, or carbapenem escalation being considered.',abx:['Meropenem','Cefepime','Amikacin','Ceftolozane/Tazobactam','Ceftazidime','Ceftazidime/Avibactam'],notes:'Caz/Avi active against KPC and OXA-48 but NOT MBL — D73 drives this decision. Ceftolozane/tazobactam retains activity in some OXA-48/ESBL producers. Amikacin covers tobramycin-resistant organisms via modifying enzymes.'},
  ur4:{title:'UR4 Donker — Cefiderocol',sub:'Siderophore cephalosporin for XDR/PDR isolates.',abx:['Cefiderocol'],notes:'Active against most CRE including NDM/VIM/IMP, OXA-48, KPC, Acinetobacter, and Pseudomonas. Requires iron-depleted medium (CAMHB-ID) — standard CAMHB gives falsely susceptible results. Last-resort step after UR2 and D73.'},
  mics:{title:'Standalone MICs — quantitative breakpoint confirmation',sub:'Used for phenotypic confirmation, treatment optimisation, and IC flagging.',abx:['Fosfomycin MIC','Vancomycin MIC','Teicoplanin MIC'],notes:'Fosfomycin MIC: requires glucose-6-phosphate supplementation per EUCAST. Vancomycin and teicoplanin MICs critical for GISA/hGISA detection and VRE treatment planning — EUCAST differentiates VanA (van/tei resistant) from VanB (van resistant, tei susceptible).'},

  // ═══ WOUND PANEL ENTRIES ═══
  coli1:{title:'Coli 1 Donker — primary Enterobacterales panel (wound)',sub:'Run preliminarily alongside Coli 2 on all wound coliforms before any organism-specific reflexing.',abx:['Ampicillin 10','Amoxicillin/Clavulanic acid 30','Cefpodoxime 10','Ciprofloxacin 5','Gentamicin 10','Piperacillin/Tazobactam 36'],notes:'EUCAST EU_COLI1 disc set. Cefpodoxime is the primary ESBL/AmpC trigger — resistance reflexes to D68. Ampicillin and AmoxClav give first-line community options. Gentamicin and Pip/Taz cover the inpatient / sepsis use case. Ciprofloxacin reporting is restricted in many trusts for stewardship reasons — interpret per local policy.'},
  coli2:{title:'Coli 2 Donker — cephalosporin / carbapenem screen (wound)',sub:'Run preliminarily alongside Coli 1 — provides the second-line / IV options and the carbapenem screen.',abx:['Ceftriaxone 30','Ertapenem 10','Cefoxitin 30','Meropenem 10','Co-trimoxazole 25','Temocillin 30'],notes:'EUCAST EU_COLI2 disc set. Ceftriaxone confirms ESBL phenotype seen on cefpodoxime. Ertapenem is the most sensitive carbapenem for picking up OXA-48 and reduced-susceptibility carbapenemases — reduced zone triggers D73. Cefoxitin (here on MH, not MHE) helps flag AmpC overproduction. Temocillin retained activity is suggestive of OXA-48 in the right context.'},
  coli3:{title:'Coli 3 Donker — MDR / CRE escalation reflex (wound)',sub:'Reflexed alongside D73 (or D68 for ESBL escalation) when Coli 1/2 show MDR phenotype or carbapenem-reduced isolates.',abx:['Amikacin 30','Aztreonam 30','Ceftolozane/Tazobactam 40','Fosfomycin 200','Tigecycline 15'],notes:'EUCAST EU_COLI3 disc set. Aztreonam is preserved against MBL producers (does not hydrolyse aztreonam) — useful in NDM/VIM/IMP isolates, though usually paired with avibactam in vivo. Ceftol/Taz active against some ESBL and AmpC producers. Fosfomycin: report only on confirmed UTI context — wound use uncommon. Tigecycline: reserve agent; no validated EUCAST breakpoints for some Enterobacterales — interpret with caution. Add Meropenem MIC for quantitative confirmation in CRE escalation.'},
  mero_mic:{title:'Meropenem MIC — quantitative carbapenem confirmation',sub:'Optional MIC alongside Coli 3 / D73 in carbapenem-reduced Enterobacterales or Pseudomonas.',abx:['Meropenem MIC (gradient strip / broth microdilution)'],notes:'EUCAST breakpoints (2026): S ≤2 / R >8 mg/L for Enterobacterales; S ≤2 / R >8 mg/L for Pseudomonas (with high-dose regimen reportable up to 8). MICs in the 2–8 range often correspond to OXA-48-like or porin-loss + AmpC mechanisms rather than classic MBL/KPC. Always pair with D73 phenotype where available.'},
  cefox_mhe:{title:'Cefoxitin on MHE — MRSA screen',sub:'Performed on every Staphylococcus aureus isolate. Plated separately on Mueller-Hinton + 2% NaCl.',abx:['Cefoxitin 30 µg disc on MHE'],notes:'EUCAST mecA surrogate. S. aureus: zone ≥22mm = MSSA; ≤21mm = MRSA. Coagulase-negative staph: zone ≥25mm = MS-CoNS; ≤24mm = MR-CoNS. A positive screen classifies ALL β-lactams as resistant (excluding ceftaroline and ceftobiprole, where breakpoints exist). Defines the MSSA vs MRSA branching downstream.'},
  w_mssa:{title:'MSSA — wound panel',sub:'Methicillin-susceptible S. aureus from a wound specimen.',abx:['Staph 1 Donker','Cefoxitin (MHE)'],notes:'Staph 1 covers Clindamycin, Erythromycin, Fusidic acid, Rifampicin, Tetracycline, Trimethoprim. The D-zone test (erythromycin disc adjacent to clindamycin) must be inspected — flattening = inducible MLSb resistance, do not report clindamycin as susceptible. Rifampicin never reported as monotherapy. Staph 2 is NOT routinely required for MSSA — only run if Staph 1 shows broad resistance or invasive site.'},
  w_mrsa:{title:'MRSA — wound panel',sub:'Methicillin-resistant S. aureus from a wound specimen.',abx:['Staph 1 Donker','Staph 2 Donker','Cefoxitin (MHE)'],notes:'Full Staph 1 + Staph 2 panel for MRSA — Staph 2 adds Gentamicin, Linezolid, Mupirocin, Norfloxacin, Co-trimoxazole, Tigecycline. All β-lactams suppressed in report (cefoxitin defines them as R), with exception of ceftaroline/ceftobiprole if MIC done separately. Add a standalone Mupirocin disc for decolonisation context. Vancomycin / Teicoplanin not routinely added unless invasive (see Deep wound).'},
  w_deep_staph:{title:'Deep wound Staph — full escalation panel',sub:'Applied to S. aureus from a deep wound, surgical site, prosthetic joint, abscess, or invasive specimen.',abx:['Staph 1 Donker','Staph 2 Donker','Cefoxitin (MHE)','Vancomycin MIC','Teicoplanin MIC','Daptomycin MIC'],notes:'Glycopeptide MICs (Vanc + Teico) are mandatory in deep wound staph for hVISA / GISA / VISA detection — EUCAST Vancomycin: S ≤2 / R >2 mg/L for S. aureus. A creep into 1.5–2 mg/L warrants discussion with the consultant microbiologist for prosthetic / endocarditis cases. Daptomycin MIC required for bacteraemic / right-sided endocarditis / line infection contexts — surface lung use contraindicated (surfactant inactivation). Cefoxitin on MHE still required even if invasive — establishes mecA status.'},
  w_topical_staph:{title:'Topical (ear) Staph — limited panel',sub:'Applied to S. aureus / CoNS from ear specimens where systemic agents would be inappropriate.',abx:['PTOP Donker','Cefoxitin (MHE)'],notes:'PTOP = Chloramphenicol, Fucidin, Gentamicin, Norfloxacin — all available as topical preparations. Cefoxitin retained on MHE to establish MRSA status (relevant if eardrops contain a β-lactam or if topical fails and systemic therapy needed). Full Staph 1 / Staph 2 panel suppressed for topical isolates to avoid prompting inappropriate systemic prescribing — see "Topical isolates" pathway for the Gram-negative equivalent (NTOP).'},
  w_strep:{title:'Strep Donker — Streptococcus spp. (wound)',sub:'Applied to BHS (EU_BHS) and AHS (EU_AHS) — same disc panel for both.',abx:['Clindamycin 2','Erythromycin 15','Penicillin 1','Teicoplanin 30','Tetracycline 30','Vancomycin 5'],notes:'D-zone test (Ery adjacent to Clin) required for all β-haemolytic strep — inducible MLSb same as in staph. Penicillin remains first-line for almost all strep — only report higher agents on penicillin allergy or invasive isolates. Group A: report Pen + Clin only for non-invasive isolates in some labs. AHS includes viridans group — alpha-haem isolates from sterile sites may need MIC confirmation (especially endocarditis).'},
  w_strep_mics:{title:'Streptococcus MICs — invasive / atypical zones',sub:'Reflexed for invasive isolates (blood, joint, deep wound) or atypical penicillin / glycopeptide zones.',abx:['Penicillin MIC','Vancomycin MIC','Teicoplanin MIC'],notes:'EUCAST penicillin S ≤0.25 / R >2 mg/L for non-pneumococcal Strep — but breakpoints differ for endocarditis. Pen MIC mandatory in viridans group endocarditis. Vanc/Teico MIC for confirmed pen-allergic invasive cases or tolerance investigation.'},
  w_pneumo_id:{title:'S. pneumoniae — identification',sub:'Differentiates pneumococcus from viridans streptococci.',abx:['Optochin disc','Bile solubility'],reagents:true,notes:'Optochin sensitive (zone ≥14mm) + bile soluble = S. pneumoniae. Viridans strep are optochin-resistant and bile-insoluble. MALDI-TOF confirms quickly but optochin remains standard. Once confirmed, Pneumo Donker replaces standard Strep Donker.'},
  w_pneumo1:{title:'Pneumo Donker — S. pneumoniae primary panel',sub:'EU_PNEUMO1 — first-line oral agents plus oxacillin penicillin screen.',abx:['Chloramphenicol 30','Clindamycin 2','Erythromycin 15','Levofloxacin 5','Oxacillin 1','Tetracycline 30'],notes:'Oxacillin 1 µg disc is the EUCAST screen for penicillin susceptibility in S. pneumoniae: zone ≥20mm = penicillin susceptible (all indications); zone <20mm MANDATES a penicillin (and usually cefotaxime/ceftriaxone) MIC — never report penicillin S based on disc alone. D-zone test required between clindamycin and erythromycin. Levofloxacin for atypical respiratory cover and pen-allergic. Tetracycline / chloramphenicol useful in specific allergy / resistance contexts.'},
  w_pneumo2:{title:'Pneumo Extras Donker — reflex panel',sub:'EU_PNEUMO2 — reserve / second-line agents reflexed on resistance.',abx:['Linezolid 10','Rifampicin 5','Teicoplanin 30','Vancomycin 5'],notes:'Reflexed where Pneumo Donker shows broad macrolide / β-lactam resistance, or for invasive pen-allergic disease. Linezolid: alternative for MDR pneumococcus / meningitis with confirmed allergy. Vanc + Rifampicin: empirical combination for pen-allergic meningitis pending sensitivities. Rifampicin never reported as monotherapy.'},
  w_pneumo_mic:{title:'Penicillin / Cefotaxime MIC — S. pneumoniae',sub:'MANDATORY whenever oxacillin disc zone <20mm, and for all invasive (CSF, blood, deep wound) pneumococcal isolates.',abx:['Penicillin MIC','Cefotaxime MIC (or Ceftriaxone MIC)'],notes:'EUCAST breakpoints depend on indication. Meningitis: penicillin S ≤0.06 / R >0.06; cefotaxime S ≤0.5 / R >2. Non-meningitis: penicillin S ≤0.06 / R >2 (with high-dose option up to 2 reportable). For oral therapy, lower-tier breakpoints apply. The disc zone is a SCREEN ONLY — clinical reporting requires MIC.'},
  w_esp1:{title:'ESP1 Donker — Enterococcus primary',sub:'EU_ESP — run together with ESP2 on every Enterococcus from wound.',abx:['Ampicillin 2','Gentamicin 30 (HLAR)','Linezolid 10','Tigecycline 15'],notes:'High-level aminoglycoside resistance (HLAR) screen at gentamicin 30 µg — required to assess synergy potential for combination therapy in endocarditis. Linezolid for VRE / penicillin-allergic invasive. Tigecycline reserve only — no oral form. Speciation to E. faecalis vs E. faecium critical — E. faecium intrinsically resistant to ampicillin in most cases (suppress amp report if faecium).'},
  w_esp2:{title:'ESP2 Donker — Enterococcus VRE screen',sub:'EU_ESP2 — run with ESP1 on all enterococci. Vancomycin plated to detect VRE.',abx:['Teicoplanin 30','Vancomycin 5'],notes:'Vancomycin disc must be incubated full 24h before reading — hetero-resistant VanB strains may show 18h zone falsely large. VanA = both Vanc and Teico resistant. VanB = Vanc R, Teico S (but treatment failure described — confirm phenotype with MIC if planning teico therapy). VanC (E. gallinarum, E. casseliflavus) = intrinsic low-level vanc R, teico S — speciation essential to avoid false VRE alerts.'},
  w_pseudo1:{title:'Pseudo Donker — Pseudomonas primary (wound)',sub:'EU_PSE1 — applied to all P. aeruginosa from wound.',abx:['Ceftazidime 10','Ciprofloxacin 5','Ceftolozane/Tazobactam 40','Meropenem 10','Tobramycin 10','Piperacillin/Tazobactam 36'],notes:'Front-line panel covering all main anti-pseudomonal classes. Ceftol/Taz included up-front in wound (unlike urine where it sits in Pseudo2) — many MDR P. aeruginosa in wound require this even initially. Intrinsic resistances must be suppressed: ampicillin, AmoxClav, cephalexin, cefuroxime, ertapenem, trimethoprim, nitrofurantoin, tetracycline. Reduced meropenem zone → reflex Pseudo Extras + MIC.'},
  w_pseudo2:{title:'Pseudo Extras Donker — Pseudomonas reflex',sub:'EU_PSE2 — reflexed for MDR / XDR / treatment failure isolates.',abx:['Amikacin 30','Aztreonam 30','Cefepime 30','Ticarcillin/Clavulanic acid 85'],notes:'Amikacin retains activity against tobramycin-resistant strains via aminoglycoside-modifying enzyme profiles. Aztreonam preserved against MBL (NDM/VIM/IMP) producers. Cefepime alternative if ceftazidime resistant and Ceftol/Taz unavailable. Ticar/Clav rarely first-line but retains a niche.'},
  w_pseudo_mbl:{title:'Imipenem MBL screen — complex Pseudomonas',sub:'Performed when carbapenem zones are reduced and MBL is in the differential (CRPA, travel history, ICU outbreak setting).',abx:['Imipenem MIC ± EDTA synergy','Meropenem MIC'],notes:'Imipenem is the most sensitive substrate for MBL detection in P. aeruginosa. EDTA synergy: marked decrease in MIC with EDTA chelator = MBL phenotype. Alternative: combined disc test or commercial MBL detection. Confirmatory: PCR for NDM/VIM/IMP. MBL-producing Pseudomonas requires UR4 (cefiderocol) — Caz/Avi and Ceftol/Taz are NOT active. Notify infection control immediately.'},
  w_haem_id:{title:'Haemophilus spp. — identification',sub:'X (haemin) and V (NAD) factor requirements differentiate species.',abx:['X factor disc','V factor disc','XV combined disc'],reagents:true,notes:'H. influenzae: requires both X + V. H. parainfluenzae: V only. H. haemolyticus: both, β-haemolytic on horse blood. MALDI-TOF has largely replaced factor testing for routine ID but factors remain useful for confirmation. Β-lactamase test (nitrocefin) on all isolates — positive predicts ampicillin / amoxicillin resistance independent of disc.'},
  w_haem1:{title:'Haem 1 Donker — Haemophilus primary',sub:'EU_HAEM1 — run together with Haem 2 preliminarily on every Haemophilus isolate.',abx:['Amoxicillin/Clavulanic acid 3','Ciprofloxacin 5','Cefuroxime 30','Levofloxacin 5'],notes:'AmoxClav at 3 µg disc is the EUCAST Haemophilus-specific concentration — not interchangeable with the 30 µg used for Enterobacterales. Cefuroxime for oral cephalosporin reporting. Fluoroquinolones for atypical respiratory cover or pen-allergic. All testing on HTM agar (Haemophilus Test Medium) — standard MH does not support growth.'},
  w_haem2:{title:'Haem 2 Donker — Haemophilus secondary',sub:'EU_HAEM2 — run with Haem 1. Provides oral first-line + alternatives.',abx:['Benzylpenicillin 1','Co-trimoxazole 25','Tetracycline 30'],notes:'Benzylpenicillin is the EUCAST screen for β-lactam susceptibility — pen R predicts amoxicillin R independent of β-lactamase status (suggests altered PBP / BLNAR phenotype). Co-trimoxazole oral option. Tetracycline (doxycycline preferred clinically) for atypical respiratory infection cover.'},
  w_eye_haem:{title:'Eye Haemophilus — Gentamicin MIC',sub:'MANDATORY for every Haemophilus isolate from an eye specimen, run alongside Haem 1 + Haem 2.',abx:['Gentamicin MIC (gradient strip on HTM agar)'],notes:'Gentamicin is a mainstay of topical ophthalmic antibacterial therapy. Disc zones on Haemophilus are unreliable for aminoglycosides because EUCAST disc breakpoints do not exist for this species — MIC is required. The MIC is reported alongside the standard Haem 1 + 2 result so clinicians can choose topical gentamicin with confidence. No EUCAST clinical breakpoint exists — interpret against ECOFF (wild-type ≤4 mg/L) and the clinical context.'},
  w_anaerobe_id:{title:'Anaerobes — identification',sub:'Two-day aerotolerance plus MALDI-TOF on anaerobic blood agar.',abx:['Anaerobic blood agar','Gram stain','Aerotolerance test','MALDI-TOF'],reagents:true,notes:'Confirm strict anaerobe by failure to grow aerobically after 48h on chocolate / blood agar. Gram stain drives the panel: GP isolates (Clostridium, Cutibacterium, Peptoniphilus, Finegoldia) get Vancomycin added. GN isolates (Bacteroides, Prevotella, Fusobacterium) do not. MALDI-TOF speciation essential for B. fragilis group (highest resistance rates) vs other Bacteroides.'},
  w_anaerobe_mics:{title:'Anaerobe MIC panel — Brucella agar',sub:'Performed on every clinically significant anaerobic isolate. All MICs — no disc method validated by EUCAST for anaerobes.',abx:['Augmentin MIC','Clindamycin MIC','Meropenem MIC','Metronidazole MIC','Penicillin MIC','Piperacillin/Tazobactam MIC'],notes:'EUCAST anaerobe testing requires supplemented Brucella blood agar — standard MHE/MHA does not support reliable growth. Gradient strip method validated. Metronidazole: standard for most anaerobes but increasing resistance in B. fragilis group (notably nimE-positive strains). Carbapenem resistance emerging in B. fragilis — meropenem MIC mandatory for blood / sterile site isolates. Clindamycin: 30–40% resistance in B. fragilis group — never empirical without sensitivity. Augmentin good for non-fragilis anaerobes but β-lactamase common in fragilis group.'},
  w_anaerobe_vanc:{title:'Vancomycin MIC — Gram-positive anaerobes',sub:'Added to the standard anaerobe MIC panel when Gram stain shows Gram-positive morphology.',abx:['Vancomycin MIC (Brucella agar gradient strip)'],notes:'Vancomycin first-line for severe Clostridium difficile (oral) and serious Cutibacterium acnes / Finegoldia / Peptoniphilus infections (especially device-related). C. difficile testing in this lab is usually separate (toxin / GDH / PCR) — this MIC applies to other Gram-positive anaerobes. No standard breakpoint for most GP anaerobes — interpret against ECOFF (≤2 mg/L wild-type) and clinical context.'},
  w_gpb_id:{title:'Gram-positive bacilli — identification',sub:'Differentiates Corynebacterium and other GPB before donker selection.',abx:['Gram stain morphology','Catalase','MALDI-TOF'],reagents:true,notes:'Club-shaped GP rods in palisades / Chinese letters = Corynebacterium. Branching filamentous = Actinomyces / Nocardia (separate pathway). Spore-forming aerobic = Bacillus. MALDI-TOF essential for speciation — C. striatum, C. amycolatum, C. jeikeium have differing susceptibilities. C. diphtheriae must be flagged and notified.'},
  w_gpb1:{title:'GPB 1 Donker — Corynebacterium primary',sub:'EU_GPB1 — reserved primarily for Corynebacterium spp. May also be applied to other GPB on a case-by-case basis.',abx:['Ciprofloxacin 5','Clindamycin 2','Penicillin 1','Vancomycin 5'],notes:'Vancomycin retains activity against essentially all Corynebacterium — useful confirmation. Penicillin variable: C. diphtheriae generally susceptible; C. striatum, C. jeikeium often resistant. Clindamycin: substantial resistance in C. jeikeium and C. amycolatum. Ciprofloxacin: variable. Speciation drives interpretation more than disc result for this group.'},
  w_gpb2:{title:'GPB 2 Donker — reflex panel',sub:'EU_GPB2 — reflexed when GPB 1 shows broad resistance, for invasive / device-related infections, or for species with known MDR (C. jeikeium, C. urealyticum).',abx:['Linezolid 10','Rifampicin 5','Tetracycline 30'],notes:'Linezolid: reliably active across Corynebacterium spp. — second-line for vancomycin alternatives. Rifampicin never as monotherapy — used in combination for device / biofilm infections. Tetracycline (doxycycline preferred clinically) — variable activity, useful oral option where susceptible.'},
  w_acine_id:{title:'Acinetobacter — identification',sub:'Distinguishes from other oxidase-negative non-fermenters.',abx:['Oxidase test','MALDI-TOF'],reagents:true,notes:'Oxidase-negative, non-motile, non-fermenting GN coccobacillus / rod. MALDI-TOF speciates A. baumannii / calcoaceticus / pittii / nosocomialis complex — A. baumannii sensu stricto has the highest MDR / CRAB rates. Differentiate from Stenotrophomonas (oxidase negative, lavender colonies on blood agar) and Burkholderia (oxidase positive in most species).'},
  w_acine:{title:'Acinetobacter Donker',sub:'EU_ACI — primary panel for all Acinetobacter isolates.',abx:['Ciprofloxacin 5','Gentamicin 10','Meropenem 10','Co-trimoxazole 25'],notes:'Limited panel reflects intrinsic resistance to most β-lactams in A. baumannii. Reduced meropenem zone → CRAB suspected → reflex to D73 carbapenemase typing (OXA-23/24/58 are the dominant CRAB carbapenemases — distinct from Enterobacterales OXA-48). Add Coli 3 for amikacin / tigecycline. Cefiderocol (UR4) may be the only remaining option for true XDR-AB.'},
  w_aero_id:{title:'Aeromonas — identification',sub:'Oxidase-positive, indole-positive GNR — differentiates from Vibrio (string test) and Enterobacterales (oxidase neg).',abx:['Oxidase test','Indole','MALDI-TOF'],reagents:true,notes:'Most commonly A. hydrophila, A. caviae, A. veronii — all clinically similar handling. Strong association with freshwater wound exposure. Always check for travel / water exposure in history.'},
  w_aero:{title:'Aeromonas Donker',sub:'EU_AERO — primary panel for all Aeromonas isolates.',abx:['Aztreonam 30','Ceftazidime 10','Ciprofloxacin 5','Cefepime 30','Levofloxacin 5','Co-trimoxazole 25'],notes:'Aeromonas spp. produce inducible chromosomal cephalosporinases — DO NOT report cephalosporins as susceptible without verifying with cefepime (more stable) or MIC if planning therapy. Ampicillin and AmoxClav intrinsically resistant (suppress in report). Fluoroquinolones and co-trimoxazole are reliable mainstays. Carbapenems usually active but emerging carbapenemase production in A. hydrophila reported — meropenem MIC if severe infection.'},
  w_kin_id:{title:'Kingella — identification',sub:'Fastidious HACEK group GN coccobacillus / rod, common in paediatric joint infection.',abx:['MALDI-TOF','PCR (often required from joint fluid)'],reagents:true,notes:'K. kingae often does not grow on solid media from joint fluid — direct PCR or inoculation into blood culture bottles dramatically improves yield. Slow-growing, β-haemolytic on blood agar.'},
  w_kin:{title:'Kingella Donker',sub:'EU_KIN — primary panel.',abx:['Ciprofloxacin 5','Cefotaxime 5','Meropenem 10','Benzylpenicillin 1','Rifampicin 5','Co-trimoxazole 25'],notes:'Kingella is generally susceptible across the board — β-lactamase production rare but increasing (5–10% in some series). Penicillin / cefotaxime remain first-line for paediatric septic arthritis. Rifampicin only in combination. Disc-based testing on HTM or MH-F (fastidious) agar.'},
  w_list_id:{title:'Listeria — identification',sub:'GP rod, β-haemolytic, motile at room temp ("tumbling motility").',abx:['Gram stain','Motility (room temp vs 37°C)','MALDI-TOF'],reagents:true,notes:'Catalase-positive GP rod — easy to confuse with diphtheroids on Gram stain. Tumbling motility at 25°C with NO motility at 37°C is classic. CAMP test positive (synergistic β-haemolysis with S. aureus). Always flag to infection control — notifiable disease in many jurisdictions, especially perinatal or food-source cases.'},
  w_list:{title:'Listeria Donker',sub:'EU_LIS — primary panel. Listeria intrinsically R to cephalosporins (all of them).',abx:['Ampicillin 2','Erythromycin 15','Meropenem 10','Penicillin 1','Co-trimoxazole 25'],notes:'Treatment standard: ampicillin (or penicillin) + gentamicin for synergy in invasive disease — gentamicin MIC may be added if endocarditis / neonatal. Co-trimoxazole is the pen-allergic alternative. CEPHALOSPORINS (all generations) MUST BE SUPPRESSED IN REPORT — intrinsic resistance, clinical failures documented even when in vitro testing falsely appears susceptible. Meropenem activity in vitro but clinical data limited.'},
  w_mor_id:{title:'Moraxella catarrhalis — identification',sub:'GN diplococcus, oxidase positive, DNase positive, β-lactamase usually positive.',abx:['Oxidase','DNase','β-lactamase (nitrocefin)','MALDI-TOF'],reagents:true,notes:'>90% of clinical isolates produce BRO-1 or BRO-2 β-lactamase — penicillin / ampicillin should NOT be reported as susceptible. AmoxClav restores activity. Differentiate from Neisseria spp. — MALDI rapid and definitive.'},
  w_mor:{title:'Moraxella Donker',sub:'EU_MOR — primary panel.',abx:['Amoxicillin/Clavulanic acid 3','Ciprofloxacin 5','Cefuroxime 30','Levofloxacin 5','Co-trimoxazole 25','Tetracycline 30'],notes:'AmoxClav 3 µg disc (same Haemophilus-style breakpoint). Cefuroxime: useful oral cephalosporin. Macrolides generally active but not in this panel — add separately on request. Fluoroquinolones reserve, useful for chronic bronchitis exacerbation cover.'},
  w_past_id:{title:'Pasteurella — identification',sub:'GN coccobacillus, oxidase+ , indole+. Bite-wound association.',abx:['Oxidase','Indole','MALDI-TOF'],reagents:true,notes:'P. multocida (cat / dog bites) and P. canis most common. Grows on blood agar but not MacConkey. Strong clinical clue: rapidly progressive cellulitis post-bite, especially cat bite. Always flag bite-wound isolates to clinical team.'},
  w_past:{title:'Pasteurella Donker',sub:'EU_PAS — primary panel.',abx:['Amoxicillin/Clavulanic acid 3','Ciprofloxacin 5','Cefotaxime 5','Nalidixic acid 30','Penicillin 1','Tetracycline 30'],notes:'Penicillin / AmoxClav are FIRST-LINE for Pasteurella — bite wound prophylaxis and treatment. AmoxClav added for polymicrobial bite cover (anaerobes / staph). Doxycycline (tetracycline disc as proxy) for pen-allergic. Nalidixic acid is a fluoroquinolone screening disc (reduced zone predicts ciprofloxacin reduced susceptibility). Cefotaxime/ceftriaxone reserved for severe / parenteral therapy.'},
  w_steno_id:{title:'Stenotrophomonas maltophilia — identification',sub:'Oxidase-negative non-fermenter; lavender / yellow pigmented colonies on blood agar.',abx:['Oxidase test','Colony pigmentation','MALDI-TOF'],reagents:true,notes:'Often confused with Pseudomonas at first plate read — oxidase test critical (Pseudomonas oxidase+, Stenotrophomonas oxidase−). Intrinsically resistant to virtually all β-lactams including meropenem and imipenem (L1 metallo-β-lactamase + L2 serine β-lactamase). Carbapenems must be SUPPRESSED in report regardless of disc result — common cause of pseudo-CRE alerts if missed.'},
  w_steno:{title:'Stenotrophomonas Donker',sub:'EU_STENO — minimal panel reflecting intrinsic resistance.',abx:['Co-trimoxazole 25 (first-line)'],notes:'Co-trimoxazole is the EUCAST-validated first-line and only routinely-reported agent in this donker. Resistance emerging but still uncommon (<10% in most UK series). Aztreonam, cefepime, ceftazidime ALL intrinsically resistant — do not report. If co-trimoxazole resistant or contraindicated, see Levofloxacin / Minocycline MIC card.'},
  w_steno_mic:{title:'Stenotrophomonas — second-line MICs',sub:'Reflexed for co-trimoxazole resistant or contraindicated cases (sulpha allergy, G6PD).',abx:['Levofloxacin MIC','Minocycline MIC'],notes:'Levofloxacin: validated EUCAST breakpoint; resistance increasing — must be MIC, not disc. Minocycline: traditional second-line, very limited UK availability. Tigecycline and ceftazidime/avibactam-aztreonam combination are research / case-report level evidence. Always discuss with infection consultant.'},
  w_topical_id:{title:'Topical (ear / eye) isolates — site and Gram triage',sub:'Site determines applicability of Eye Extras; Gram determines PTOP vs NTOP.',abx:['Specimen type (ear swab vs eye swab)','Gram stain'],reagents:true,notes:'Ear isolates: PTOP (GP) or NTOP (GN) only — eye extras not relevant. Eye isolates: PTOP or NTOP PLUS Eye Extras (Amikacin, Ceftazidime, Clarithromycin MIC, Vancomycin MIC) — these are agents available in fortified topical / intravitreal preparations for severe keratitis / endophthalmitis. The intent of these donkers is to direct topical therapy ONLY — full systemic panels should be added on top if invasive disease, immunocompromise, or topical failure.'},
  w_ptop:{title:'PTOP Donker — Gram-positive topical (ear / eye)',sub:'Applied to S. aureus, β-haemolytic strep, S. pneumoniae from ear and eye specimens (EAR_SAU, EYE_SAU, EYE_BHS, EYE_PNEUMO).',abx:['Chloramphenicol 30','Fucidin 10','Gentamicin 10','Norfloxacin 10'],notes:'All four agents available as topical preparations (drops / ointment). Chloramphenicol is first-line for bacterial conjunctivitis in the UK. Fucidic acid for staphylococcal lid / external infection. Gentamicin drops for broader cover including Gram-negative. Norfloxacin / ofloxacin drops for resistant / severe cases. For S. aureus, ALSO run Cefoxitin (MHE) — see Topical (ear) Staph card.'},
  w_ntop:{title:'NTOP Donker — Gram-negative topical (ear / eye)',sub:'Applied to Pseudomonas, coliforms, Haemophilus, Moraxella from ear and eye specimens (EAR_PSE, EYE_PSE, EAR_COLI, EYE_COLI, EYE_HAEM, EYE_MOR).',abx:['Chloramphenicol 30','Ciprofloxacin 5','Gentamicin 10','Nalidixic acid 30','Pefloxacin 5','Tobramycin 10'],notes:'Nalidixic acid acts as a fluoroquinolone screen (reduced zone predicts cipro / pefloxacin reduced activity even where disc zones look adequate). Tobramycin and ciprofloxacin are mainstays for Pseudomonas keratitis. Gentamicin and chloramphenicol broad cover. Pefloxacin: alternative topical fluoroquinolone. For eye specimens add Eye Extras alongside. For eye Haemophilus, also add Gentamicin MIC.'},
  w_eye_ext:{title:'Eye Extras — severe ophthalmic infection panel',sub:'EU_EYE_EXT — added to PTOP / NTOP for all EYE specimens (not ear). Covers agents used in fortified topical and intravitreal preparations.',abx:['Amikacin 30','Ceftazidime 10','Clarithromycin MIC','Vancomycin MIC'],notes:'Amikacin: intravitreal aminoglycoside for endophthalmitis prophylaxis / treatment. Ceftazidime: intravitreal cover for Gram-negative endophthalmitis (paired with vancomycin for GP cover). Vancomycin MIC: required for intravitreal use (no validated disc breakpoint at intravitreal concentrations — MIC interpretation against systemic breakpoints with caveats). Clarithromycin MIC: relevant for atypical mycobacterial keratitis when suspected — long-term oral / topical therapy.'},


  // ═══ VIROLOGY PANEL ENTRIES ═══
  viro_accept_aptima:{title:'Sample acceptance — Aptima CT/NG NAAT',sub:'First bench check for Panther CT/NG requests before loading.',abx:['Accept: locally validated Aptima swab / transport tube','Check: identifiers · specimen site · request/test match · expiry · volume','Reject / discuss: unlabelled, mislabelled, leaking, wrong container or unsafe sample','Escalate: unusual site, medicolegal context, test-of-cure complexity'],reagents:true,notes:'Confirm the patient identifiers, request, specimen site and Aptima collection system before loading. The specimen site matters for clinical interpretation and partner notification. Reject or seek senior advice for unlabelled or mislabelled samples, leaking containers, wrong transport systems, expired kits, inadequate volume outside local tolerance, duplicate/conflicting sites, or any sample that cannot be safely handled. Document any acceptance override according to local SOP.'},
  viro_accept_resp:{title:'Sample acceptance — respiratory GeneXpert PCR',sub:'First bench check for RSV / Flu A&B / SARS‑CoV‑2 testing.',abx:['Accept: universal viral swab container or locally validated respiratory sample','Check: identifiers · collection date/time · leakage · sample volume','Reject / discuss: dry swab, wrong container, leaking sample or unclear request','Escalate: urgent ward / outbreak / high-risk patient requests'],reagents:true,notes:'Check that the request matches the specimen type and that there is enough viral transport medium for cartridge loading and possible repeat. Respiratory PCR performance depends on timing and sampling quality; late or poorly collected samples can be falsely negative. Leaking, unlabelled, mislabelled or unsafe samples should not be processed without senior review and local incident documentation.'},
  viro_accept_tb:{title:'Sample acceptance — TB sputum for GeneXpert',sub:'Safety and suitability check before CL3 preparation.',abx:['Accept: leak-proof sputum container with clear TB PCR request','Check: identifiers · sputum quality · transport bag · leakage · volume','Do not open outside CL3','Reject / discuss: leaking, unsafe, mislabelled or insufficient material'],reagents:true,notes:'Treat all TB PCR sputum as potentially infectious until the validated inactivation workflow is complete. Confirm that the container is intact and suitable for safe CL3 handover before opening. Saliva-only or scanty samples may reduce sensitivity, but suitability decisions should follow local SOP and clinical urgency. Any leaking or externally contaminated container should be escalated before manipulation.'},
  viro_panther_overview:{title:'Hologic Panther — Aptima CT/NG NAAT overview',sub:'Sexual health NAAT / TMA workflow for Chlamydia trachomatis and Neisseria gonorrhoeae from Aptima collection systems.',abx:['Platform: Hologic Panther','Assay: Aptima Combo 2 / local CT-GC NAAT','Specimen: Aptima swab transport tube','Targets: CT rRNA · NG rRNA'],reagents:true,notes:'The Panther is a fully automated NAAT platform; Aptima CT/NG uses target capture, transcription-mediated amplification (TMA) and chemiluminescent detection. Use for genital, rectal, throat or other locally validated Aptima specimens. Verify patient identifiers, collection device, transport volume, leakage, expiry and request/test match before loading. A detected result indicates target nucleic acid is present; it does not provide antimicrobial susceptibility.'},
  viro_panther_sample:{title:'Aptima swab receipt — CT/NG',sub:'Pre-analytical checks before Panther loading.',abx:['Aptima swab transport tube','Correct request for CT/NG NAAT','Adequate fill / no leakage','Correct patient and specimen identifiers'],reagents:true,notes:'Accept only locally validated Aptima collection systems and specimen sites. Reject or seek senior advice for unlabelled/mislabelled specimens, leaking tubes, wrong container, expired kit, obvious under/overfill outside local tolerance, or mismatch between request and sample type. Mixed sampling sites should be clearly identified because site affects clinical interpretation and follow-up.'},
  viro_panther_loading:{title:'Panther loading — CT/NG NAAT / TMA',sub:'Instrument workflow after receipt checks.',abx:['Scan sample barcode','Load into Panther rack','Check assay reagents / fluids / waste','Review worklist before run start'],reagents:true,notes:'Load Aptima tubes upright with readable barcodes and sufficient volume. Confirm reagent packs, calibrators/controls if due, pipette tips, wash fluid and waste capacity. Avoid uncapping errors and sample splashes. The instrument performs extraction/target capture, amplification and detection automatically; failed internal controls or instrument flags require repeat according to local SOP.'},
  viro_panther_result:{title:'CT/NG result handling',sub:'Interpreting Panther NAAT output.',abx:['Chlamydia trachomatis: detected / not detected / invalid','Neisseria gonorrhoeae: detected / not detected / invalid','Repeat if invalid or inhibited','Escalate unexpected NG positives per local confirmatory pathway'],reagents:true,notes:'Report CT and NG targets separately. Positive NG NAATs may require supplementary confirmation depending on prevalence, site and local policy, because positive predictive value falls in low-prevalence settings. Gonorrhoea NAAT does not provide susceptibility: culture is still needed where viable sample is available, especially for treatment failure, sexual assault, antimicrobial resistance surveillance or test-of-cure complexity.'},
  viro_genexpert_resp_overview:{title:'Cepheid GeneXpert — RSV / Flu A&B / SARS‑CoV‑2 overview',sub:'Rapid multiplex PCR from universal viral swab transport medium.',abx:['Platform: Cepheid GeneXpert','Assay: Xpert Xpress CoV‑2/Flu/RSV or local equivalent','Specimen: Universal viral swab container','Targets: RSV · Influenza A · Influenza B · SARS‑CoV‑2'],reagents:true,notes:'The GeneXpert cartridge combines extraction, reverse transcription, PCR amplification and detection in a closed cartridge. It is suitable for urgent respiratory diagnosis, infection-control cohorting and antiviral decisions. Results are target-specific, so co-detection can occur and should be reported rather than assumed to be contamination.'},
  viro_resp_sample:{title:'Universal viral swab receipt — respiratory PCR',sub:'Specimen checks before GeneXpert testing.',abx:['Universal viral transport medium','Nasopharyngeal / throat / nose swab as locally validated','Correct patient identifiers','Leakage and volume check'],reagents:true,notes:'Use universal viral swab containers or other locally validated respiratory sample types. Check collection date/time, clinical urgency, leakage, insufficient volume and sample quality. Respiratory PCR sensitivity depends heavily on timing and sampling quality: a negative result does not fully exclude infection if clinical suspicion remains high or sampling was late/poor.'},
  viro_resp_cartridge:{title:'GeneXpert respiratory cartridge setup',sub:'Closed-cartridge workflow for RSV / Flu A&B / SARS‑CoV‑2.',abx:['Mix sample gently','Transfer required volume into cartridge sample chamber','Scan cartridge and sample ID','Start run on GeneXpert module'],reagents:true,notes:'Follow the cartridge IFU and local SOP for exact sample volume and biosafety handling. Avoid bubbles, overfilling and contamination of the cartridge exterior. The closed-cartridge format reduces amplicon contamination risk, but pre-amplification sample handling still requires clean technique and separation from positive material.'},
  viro_resp_result:{title:'Respiratory multiplex PCR result handling',sub:'Reporting target-specific GeneXpert outputs.',abx:['RSV detected / not detected','Influenza A detected / not detected','Influenza B detected / not detected','SARS‑CoV‑2 detected / not detected','Invalid / error / no result → repeat pathway'],reagents:true,notes:'Report each viral target independently. Flu A and Flu B are distinct targets; RSV and SARS‑CoV‑2 may co-detect with influenza or each other. Invalid, error or no-result calls should be repeated if sample volume allows; persistent inhibition or cartridge failure requires a new specimen or senior review. Urgent positives may require immediate infection-control notification according to local policy.'},
  viro_tb_overview:{title:'GeneXpert TB PCR overview',sub:'M. tuberculosis complex PCR from sputum prepared in CL3.',abx:['Specimen: sputum','Preparation: CL3 section','Platform: GeneXpert TB cartridge','Outputs: MTB complex detected / not detected · rifampicin-resistance marker'],reagents:true,notes:'TB PCR is a rapid molecular test for M. tuberculosis complex DNA and rifampicin-resistance-associated mutations. It complements, but does not replace, microscopy and culture: culture is still required for full susceptibility testing, epidemiology and confirmation. Because sputum may contain viable M. tuberculosis, opening and initial processing must occur in CL3 using local containment SOPs; do not open or manipulate sputum outside approved containment before validated inactivation.'},
  viro_tb_cl3:{title:'CL3 sputum preparation — TB PCR',sub:'Containment-controlled pre-analytical step.',abx:['CL3 room / cabinet controls','Respiratory PPE per local risk assessment','Aerosol-minimising technique','Decontaminate work area after processing'],reagents:true,notes:'Treat sputum for TB PCR as potentially containing viable M. tuberculosis until inactivated by the validated sample reagent/process. Open containers and perform manipulations only in the CL3 workflow defined by local SOP; do not assume the sample is safe to handle outside containment until the validated sample reagent/contact-time process is complete. Minimise aerosol generation, check lids and seals before transport out of containment, and ensure waste and spill procedures are followed.'},
  viro_tb_cartridge:{title:'GeneXpert TB cartridge setup',sub:'Loading prepared sputum material after CL3 processing.',abx:['Prepared / inactivated sputum material','TB cartridge sample chamber','Scan sample and cartridge','Run in GeneXpert module'],reagents:true,notes:'After the validated sample reagent contact time and mixing, load the required volume into the TB cartridge according to IFU. Ensure the cartridge is externally clean and properly closed before leaving containment workflow if applicable locally. Cartridge errors, invalids or probe-check failures require repeat testing if sufficient prepared material remains.'},
  viro_tb_result:{title:'TB PCR result handling',sub:'Interpreting MTB complex and rifampicin-resistance outputs.',abx:['MTB not detected','MTB detected — very low / low / medium / high where reported','Rifampicin resistance detected / not detected / indeterminate','Urgent notification pathway'],reagents:true,notes:'MTB detected is clinically urgent and should trigger same-day communication to the requesting team and infection-control/TB service according to local policy. Rifampicin-resistance detected is a surrogate marker for possible MDR-TB and requires urgent confirmatory testing and reference-laboratory follow-up. A negative PCR does not exclude TB, especially with paucibacillary disease, poor sputum quality or extrapulmonary infection.'},
  viro_ct_detected:{title:'CT detected — Panther Aptima',sub:'Chlamydia trachomatis target detected by NAAT / TMA.',abx:['Report CT detected','Check specimen site and identifiers','Sexual-health notification pathway','No susceptibility from NAAT'],reagents:true,notes:'A detected CT result indicates Chlamydia trachomatis target nucleic acid is present in the submitted specimen. Report according to the requested site and local STI pathway. NAAT positivity does not distinguish viable from non-viable organism, so recent treatment/test-of-cure timing matters. Escalate discordant demographics/site issues or unexpected repeat positives for senior review.'},
  viro_ng_detected:{title:'NG detected — Panther Aptima',sub:'Neisseria gonorrhoeae target detected by NAAT / TMA.',abx:['Report NG detected','Consider supplementary confirmation per local policy','Culture required for susceptibility where possible','Escalate treatment-failure / TOC complexity'],reagents:true,notes:'A detected NG result is clinically significant and should be reported through the local STI pathway. In low-prevalence settings, extragenital sites, legal/forensic contexts, treatment failure, or test-of-cure complexity, supplementary confirmation may be required according to local policy. NAAT does not provide antimicrobial susceptibility; gonococcal culture remains important for resistance surveillance and treatment-failure investigation.'},
  viro_ctng_both_detected:{title:'CT and NG detected — dual positivity',sub:'Both Chlamydia trachomatis and Neisseria gonorrhoeae targets detected.',abx:['Report both targets separately','Check site/request match','Follow CT and NG pathways','Culture NG where possible for susceptibility'],reagents:true,notes:'Dual positivity can be genuine and should not be collapsed into a single STI-positive comment. Ensure both targets are reported separately with the specimen site. NG susceptibility cannot be inferred from NAAT; advise/trigger culture where local policy supports it, especially before or after treatment failure investigation.'},
  viro_ctng_negative:{title:'CT/NG not detected — valid negative',sub:'Valid Panther run with CT and NG targets not detected.',abx:['CT not detected','NG not detected','Internal control acceptable','Interpret with timing and site'],reagents:true,notes:'A valid negative result reduces the likelihood of CT/NG infection at the sampled site, but does not exclude infection if sampling was too early, from the wrong anatomical site, after poor collection, or outside the validated specimen type. Repeat testing should be clinically driven rather than automatic.'},
  viro_ctng_invalid:{title:'CT/NG invalid or inhibited — repeat guide',sub:'Panther invalid, inhibition or failed control result.',abx:['Review instrument flag','Repeat same sample if volume/stability allow','Do not dilute unless SOP allows','Persistent invalid → new specimen / senior review'],reagents:true,notes:'Invalid results may reflect inhibitors, insufficient sample, tube/volume issues or instrument flags. Repeat from the same Aptima tube only if local stability, volume and SOP criteria are met. If repeat remains invalid, request a new specimen or seek senior review rather than repeatedly re-running.'},

  viro_resp_sars_detected:{title:'SARS‑CoV‑2 detected — respiratory GeneXpert',sub:'SARS‑CoV‑2 target detected in a valid multiplex PCR run.',abx:['Report SARS‑CoV‑2 detected','Check for co-detected targets','Infection-control pathway','Clinical context for residual positivity'],reagents:true,notes:'Report SARS‑CoV‑2 detected as a target-specific positive. PCR can remain positive after infectiousness has declined, so clinical context, onset date and local infection-control rules matter. If other targets are also detected, report each target rather than assuming contamination.'},
  viro_resp_flu_a_detected:{title:'Influenza A detected — respiratory GeneXpert',sub:'Influenza A target detected.',abx:['Report Influenza A detected','Antiviral window / risk group relevance','Cohorting / outbreak relevance','Check for co-detection'],reagents:true,notes:'Influenza A positivity is clinically time-sensitive because antivirals are most useful early and in high-risk patients. Report as Influenza A, not generic influenza. Ward/outbreak cohorting may be needed according to local infection-control policy.'},
  viro_resp_flu_b_detected:{title:'Influenza B detected — respiratory GeneXpert',sub:'Influenza B target detected.',abx:['Report Influenza B detected','Do not combine with Flu A wording','Antiviral / cohorting relevance','Check for co-detection'],reagents:true,notes:'Influenza B should be reported as its own target. It can cause significant outbreaks and severe disease, particularly in vulnerable groups. Co-detection with RSV or SARS‑CoV‑2 is possible and should be reported target-by-target.'},
  viro_resp_rsv_detected:{title:'RSV detected — respiratory GeneXpert',sub:'Respiratory syncytial virus target detected.',abx:['Report RSV detected','Paediatric / elderly risk relevance','Cohorting / outbreak relevance','Check for co-detection'],reagents:true,notes:'RSV is especially important in infants, elderly patients, cardiopulmonary disease and immunocompromised patients. It may trigger cohorting or outbreak control procedures. PCR detects nucleic acid and should be interpreted with symptoms and sampling time.'},
  viro_resp_codetection:{title:'Respiratory PCR co-detection',sub:'More than one respiratory target detected in the same valid run.',abx:['Report each detected target','Do not suppress a valid co-detection','Review clinical context','Escalate unusual clusters'],reagents:true,notes:'Co-detections can be genuine, particularly during respiratory season or in immunocompromised patients. Report each target independently. Unexpected repeated multi-target positives or clusters should prompt review of sampling, work area, cartridge handling and epidemiology.'},
  viro_resp_invalid:{title:'Respiratory GeneXpert invalid / error / no result',sub:'Repeat and troubleshooting pathway for respiratory cartridges.',abx:['Review error type / SPC','Repeat with fresh cartridge if sample allows','Check bubbles / cartridge fill / module issue','Persistent failure → new specimen or senior review'],reagents:true,notes:'Invalid, error or no-result outcomes may reflect sample inhibition, transfer volume issues, cartridge problems, bubbles, probe-check failure or module faults. Repeat with a fresh cartridge if sample remains suitable. Log repeated cartridge/module errors and avoid repeated automatic re-runs without investigating.'},

  viro_tb_mtb_rif_not_detected:{title:'MTB detected; rifampicin resistance not detected',sub:'MTB complex DNA detected with no rifampicin-resistance marker detected by the assay.',abx:['Urgent TB / infection-control communication','Culture still required','RIF resistance not detected ≠ fully susceptible','Document smear/culture linkage'],reagents:true,notes:'This is an urgent positive result. Notify the clinical team, TB service and infection-control route according to local policy. Rifampicin resistance not detected is reassuring for the tested marker but does not replace full culture and susceptibility testing, especially for isoniazid or second-line drugs.'},
  viro_tb_rif_detected:{title:'MTB detected; rifampicin resistance detected',sub:'Possible rifampicin-resistant / MDR-TB marker detected.',abx:['Urgent consultant escalation','Reference laboratory confirmation','Infection-control / TB service notification','Do not wait for culture to communicate'],reagents:true,notes:'Rifampicin-resistance detected is a high-impact result and a surrogate marker for possible MDR-TB. Escalate immediately to a senior microbiologist/consultant, TB team and reference-laboratory pathway according to local SOP. Culture and confirmatory susceptibility testing remain mandatory.'},
  viro_tb_trace_detected:{title:'MTB trace / very low detected',sub:'Low-burden MTB complex DNA signal.',abx:['Treat as potentially significant','Review clinical details and sample quality','Ensure culture/referral pathway','Consider repeat sample if advised'],reagents:true,notes:'Trace or very-low positives may occur with paucibacillary disease, early disease, partially treated TB or residual DNA. They require careful clinical correlation but should not be dismissed. Ensure culture and TB notification/escalation pathways are followed according to local policy.'},
  viro_tb_not_detected:{title:'MTB not detected — valid TB PCR negative',sub:'No MTB complex DNA detected in a valid run.',abx:['MTB not detected','Does not exclude TB','Culture still required if requested/clinically indicated','Repeat only if clinically driven'],reagents:true,notes:'A negative TB PCR lowers the probability of pulmonary TB but does not exclude it, particularly in smear-negative, paucibacillary, poor-quality sputum, treated, paediatric or extrapulmonary disease. Culture and clinical review remain important where suspicion persists.'},
  viro_tb_invalid:{title:'TB GeneXpert invalid / error / no result',sub:'Repeat guide for TB cartridges and prepared sputum.',abx:['Review SPC/probe-check/error message','Repeat prepared material if sufficient and SOP-compliant','Maintain CL3/inactivation chain','Persistent failure → senior/reference advice'],reagents:true,notes:'TB PCR repeat handling must preserve containment and chain-of-custody rules. Repeat only from prepared/inactivated material or primary sputum according to the validated CL3 SOP. Cartridge/probe errors should be documented; persistent failures require senior review and may need a repeat specimen or reference-lab pathway.'},

  viro_ct_ng_info:{title:'Molecular note — CT/NG NAAT background',sub:'Why molecular testing is used for Chlamydia and Gonorrhoea.',abx:['Chlamydia trachomatis: obligate intracellular bacterium','Neisseria gonorrhoeae: fastidious diplococcus','NAAT: high sensitivity compared with culture','Culture still needed for gonococcal susceptibility'],reagents:true,notes:'Although CT and NG are bacteria rather than viruses, they sit within many molecular/virology workflows because they are detected by high-throughput NAAT. Chlamydia culture is rarely used diagnostically; gonorrhoea culture remains important for susceptibility and treatment-failure investigation. Interpret positives with specimen site, symptoms, treatment history and test-of-cure timing.'},
  viro_resp_info:{title:'Molecular note — respiratory virus background',sub:'Key points for RSV, influenza A/B and SARS‑CoV‑2 PCR.',abx:['RSV: bronchiolitis / outbreaks in vulnerable wards','Influenza A/B: antiviral and cohorting relevance','SARS‑CoV‑2: infection-control and clinical-risk relevance','PCR detects nucleic acid, not necessarily viable virus'],reagents:true,notes:'PCR is most sensitive early in illness when viral load is higher. Influenza A and B are separate lineages/targets and should not be collapsed into a generic flu result. RSV is particularly important in infants, older adults and immunocompromised patients. SARS‑CoV‑2 PCR may remain positive after infectiousness has declined, so clinical context and local infection-control guidance matter.'},
  viro_tb_info:{title:'Molecular note — TB molecular background',sub:'How TB PCR relates to smear and culture.',abx:['PCR: rapid MTB complex DNA detection','Smear: acid-fast bacilli burden, not species-specific','Culture: viability, full ID and drug susceptibility','Rifampicin marker: resistance screen, not full DST'],reagents:true,notes:'TB PCR can be positive when smear is negative because it is more analytically sensitive, but very low positives require cautious interpretation. Smear-positive/PCR-negative results raise the possibility of non-tuberculous mycobacteria or inhibitors. Culture remains essential for full susceptibility testing, including isoniazid and second-line agents.'},
  viro_pcr_qc:{title:'PCR quality points — all molecular workflows',sub:'Common quality checks for Panther and GeneXpert molecular testing.',abx:['Internal control must pass','Use unidirectional clean technique','Prevent carryover contamination','Repeat invalid / inhibited runs per SOP','Document instrument errors and repeats'],reagents:true,notes:'PCR assays are vulnerable to inhibition, sampling failure and contamination. Internal controls help distinguish true negatives from failed reactions. Closed systems reduce, but do not eliminate, contamination risk. Repeated low-level positives, discordant clinical pictures, invalid repeats or unexpected clusters should be escalated for senior review and possible environmental/process investigation.'},

  // ── MYCOLOGY FLOWCHART (UK SMI Algorithm 6 — morphological characteristics of fungi) ──
  fx_fungi:{title:'Fungi — first morphological split',sub:'Macroscopic + microscopic appearance directs the workup',abx:['Filamentous growth → moulds','Pasty / creamy growth → yeasts'],notes:'The first bench decision is mould versus yeast. Moulds form filamentous (hyphal) colonies and are then split by whether the hyphae are aseptate/pauci-septate or regularly septate. Yeasts form smooth pasty colonies and are split by colony colour/texture and simple physiological tests. This algorithm is for guidance and to support validation of MALDI-TOF MS and commercial ID systems — it does not replace them.'},
  fx_moulds:{title:'Moulds (filamentous)',sub:'Branch on hyphal septation',abx:['Aseptate / pauci-septate','Septate hyphae'],notes:'Examine a lactophenol cotton blue or sticky-tape mount. Broad, ribbon-like, sparsely septate hyphae point to the Mucorales / Entomophthorales group. Regular, evenly septate hyphae point to the large septate-mould group, which is then subdivided by whether the fungus is monomorphic or thermally dimorphic.'},
  fx_mucorales:{title:'Aseptate / pauci-septate — Mucoraceous moulds & relatives',sub:'Broad ribbon-like hyphae; rapid growers',abx:['Mucor','Rhizopus','Lichtheimia','Rhizomucor','Cunninghamella','Apophysomyces elegans complex','Saksenaea vasiformis','Syncephalastrum racemosum','Cokeromyces recurvatus','Mortierella','Basidiobolus ranarum','Conidiobolus coronatus'],notes:'Wide (6–25 µm), thin-walled, ribbon-like hyphae with few or no septa and often right-angle branching. Typically very fast lid-lifting growers. Agents of mucormycosis (Mucorales) and, for Basidiobolus / Conidiobolus, subcutaneous entomophthoramycosis. The aseptate morphology is fragile — handle mounts gently as the hyphae crush easily.'},
  fx_monomorphic:{title:'Septate hyphae — Monomorphic moulds',sub:'Regular septate hyphae; same form at 25°C and 37°C',abx:['Fusarium','Aspergillus','Microsporum','Trichophyton','Epidermophyton floccosum','Phialophora','Cladosporium','Madurella','Acremonium','Scedosporium','Cladophialophora bantiana #','Rhinocladiella mackenziei #'],notes:'Regularly septate hyphae with no yeast phase. Includes hyaline moulds (Aspergillus, Fusarium, Acremonium, Scedosporium), the dermatophytes (Microsporum, Trichophyton, Epidermophyton) and dematiaceous / melanised moulds (Cladosporium, Phialophora, Madurella, Cladophialophora, Rhinocladiella). Identify on conidial morphology and pigment. # Cladophialophora bantiana and Rhinocladiella mackenziei are Hazard Group 3 (neurotropic) — handle in CL3.'},
  fx_dimorphic:{title:'Septate hyphae — Dimorphic fungi',sub:'Mould at 25°C, yeast / spherule at 37°C — mostly HG3',abx:['Histoplasma #','Blastomyces #','Paracoccidioides #','Coccidioides #','Talaromyces marneffei #','Sporothrix schenckii','Emergomyces #'],notes:'Thermally dimorphic: filamentous at 25–30°C and converting to a yeast (or a spherule, for Coccidioides) at 37°C. Most are systemic / endemic pathogens — suspect with relevant travel or residence history. With the exception of Sporothrix schenckii, these are Hazard Group 3 and must be handled in a CL3 laboratory; never open suspicious slow-growing mould plates on the open bench. # = Hazard Group 3.'},
  fx_yeasts:{title:'Yeasts',sub:'Branch on colony colour / texture',abx:['Cream / white','Mucoid','Pink / red','Lipid-dependent','Black'],notes:'Smooth pasty colonies. First sort by colony appearance: cream/white (most Candida and relatives), mucoid (capsule — Cryptococcus), pink/red (Rhodotorula), lipid-dependent growth (Malassezia) and black (melanised yeast-like fungi). Cream/white yeasts are then triaged with a germ-tube test.'},
  fx_gt_pos:{title:'Cream/white → Germ-tube positive',sub:'Germ tube formed in serum at 2–3 h',abx:['Candida albicans','Candida dubliniensis','Candida africana'],notes:'A true germ tube — no constriction at its base, which distinguishes it from a pseudohypha — after 2–3 h in serum at 37°C gives a presumptive identification of Candida albicans. C. dubliniensis and C. africana are also germ-tube positive and are separated by MALDI-TOF, chromogenic agar colour and growth at 42–45°C. Read at 2–3 h; longer incubation produces pseudohyphae and false positives.'},
  fx_gt_neg:{title:'Cream/white → Germ-tube negative',sub:'Read morphology on cornmeal / Dalmau plate',abx:['Chlamydoconidia + blastospores + pseudohyphae','Blastospores + pseudohyphae','Arthrospores + blastospores','Arthrospores only','Blastospores only'],notes:'Germ-tube-negative cream yeasts are subcultured onto cornmeal-Tween 80 (Dalmau plate) and read for microscopic structures. The combination of chlamydoconidia, blastospores, pseudohyphae and arthrospores present narrows the field as shown in the branches below. Confirm to species with MALDI-TOF or chromogenic agar.'},
  fx_gtn_chlamydo:{title:'Chlamydoconidia + blastospores + pseudohyphae',sub:'Cornmeal (Dalmau) morphology',abx:['Candida albicans'],notes:'Terminal thick-walled chlamydoconidia together with blastospores and pseudohyphae on cornmeal agar is the classic pattern of Candida albicans (and occasionally C. dubliniensis). Useful as a cross-check on a positive germ tube.'},
  fx_gtn_pseudo:{title:'Blastospores + pseudohyphae',sub:'Cornmeal (Dalmau) morphology',abx:['Non-albicans Candida spp.'],notes:'Blastospores with pseudohyphae but no chlamydoconidia suggest a non-albicans Candida (e.g. C. tropicalis, C. parapsilosis; the C. glabrata complex shows mainly blastospores). Speciate by MALDI-TOF / chromogenic agar — relevant for azole and echinocandin choices.'},
  fx_gtn_arthro_blasto:{title:'Arthrospores + blastospores',sub:'Cornmeal (Dalmau) morphology',abx:['Trichosporon sp','Geotrichum sp'],notes:'Arthroconidia (rectangular, from hyphal fragmentation) together with blastospores point to Trichosporon. Trichosporon is urease-positive and an important cause of invasive infection in the immunocompromised.'},
  fx_gtn_arthro:{title:'Arthrospores only',sub:'Cornmeal (Dalmau) morphology',abx:['Geotrichum sp'],notes:'Arthroconidia alone, without blastospores, point to Geotrichum (and the related Saprochaete / Magnusiomyces). Hyphae fragment into barrel-shaped arthroconidia; no blastospores or true germ tubes are formed.'},
  fx_gtn_blasto:{title:'Blastospores only',sub:'Cornmeal (Dalmau) morphology',abx:['Candida sp','Cryptococcus sp','Rhodotorula sp','Saccharomyces sp','Hansenula (Wickerhamomyces) sp'],notes:'Budding blastospores with no pseudohyphae, arthrospores or chlamydoconidia is a broad group spanning several genera. Use colony colour, capsule, urease and MALDI-TOF to separate Candida (e.g. C. glabrata), Cryptococcus, Rhodotorula, Saccharomyces and Hansenula / Wickerhamomyces.'},
  fx_mucoid:{title:'Mucoid colonies → capsule',sub:'India-ink / capsule positive',abx:['Cryptococcus sp'],notes:'Glistening mucoid colonies with a demonstrable polysaccharide capsule (India ink or cryptococcal antigen) indicate Cryptococcus. C. neoformans and C. gattii are urease-positive and grow at 37°C; confirm with CrAg and MALDI-TOF. Always treat as significant in CSF or blood.'},
  fx_pinkred:{title:'Pink / red colonies → capsule',sub:'Carotenoid pigment',abx:['Rhodotorula sp'],notes:'Salmon-pink to coral colonies from carotenoid pigment, with a small capsule. Rhodotorula is usually an environmental contaminant but can cause line-associated fungaemia — correlate with the sample type and clinical context before reporting.'},
  fx_lipid:{title:'Grows only on lipid-containing agar',sub:'Lipophilic / lipid-dependent',abx:['Malassezia sp (except M. pachydermatis)'],notes:'Most Malassezia species are lipid-dependent and grow only when the medium carries a long-chain fatty-acid source — an olive-oil overlay or Dixon / Leeming-Notman agar. M. pachydermatis is the exception and grows on routine media. Agent of pityriasis versicolor, seborrhoeic dermatitis and neonatal line-associated sepsis (lipid infusions).'},
  fx_black:{title:'Black colonies',sub:'Melanised (dematiaceous) yeast-like fungi',abx:['Exophiala sp','Cladophialophora sp'],notes:'Olive-grey to black colonies indicate melanised (dematiaceous) fungi. Exophiala begins as a black yeast and develops annellidic conidiogenesis with age; Cladophialophora forms branching chains of conidia. Associated with phaeohyphomycosis and chromoblastomycosis.'},

  // ── ANTIFUNGAL SUSCEPTIBILITY (EUCAST AFST) + expected antifungal resistance ──
  af_fluconazole:{title:'Fluconazole',sub:'Triazole · narrow',abx:['Candida (not C. krusei)','Cryptococcus','NOT moulds'],notes:'Narrow triazole: good against most Candida and Cryptococcus, NO useful activity against moulds (Aspergillus intrinsically resistant) or C. krusei (Pichia kudriavzevii). C. glabrata shows dose-dependent / increased-exposure susceptibility only. EUCAST sets species-specific breakpoints; report susceptible / susceptible-increased-exposure (I) / resistant.'},
  af_voriconazole:{title:'Voriconazole',sub:'Triazole · broad / mould-active',abx:['Aspergillus','Candida','Scedosporium apiospermum','NOT Mucorales'],notes:'Broad triazole and a first-line mould azole for Aspergillus. No activity against the Mucorales — a key separation when imaging/clinical picture suggests mucormycosis. Therapeutic drug monitoring is usual. Watch for azole-resistant A. fumigatus (cyp51A mutations, environmental TR34/L98H).'},
  af_itraconazole:{title:'Itraconazole',sub:'Triazole · mould-active',abx:['Aspergillus','dermatophytes','dimorphic fungi'],notes:'Mould-active triazole; also used for dermatophyte and dimorphic infections. EUCAST has Candida and Aspergillus breakpoints. Absorption is variable — TDM recommended.'},
  af_posaconazole:{title:'Posaconazole',sub:'Triazole · extended-spectrum',abx:['Aspergillus','Mucorales','Candida'],notes:'Extended-spectrum triazole with activity against the Mucorales (unlike voriconazole) — used in prophylaxis and salvage. EUCAST Aspergillus breakpoints apply; the modern tablet/IV formulations give more reliable exposure than the old suspension.'},
  af_isavuconazole:{title:'Isavuconazole',sub:'Triazole · extended-spectrum',abx:['Aspergillus','Mucorales','Candida'],notes:'Broad triazole licensed for invasive aspergillosis and mucormycosis. EUCAST has Aspergillus breakpoints (introduced via technical note). Favourable exposure and tolerability; fewer interactions than voriconazole.'},
  af_anidulafungin:{title:'Anidulafungin',sub:'Echinocandin',abx:['Candida (incl. glabrata)','NOT Cryptococcus','NOT Mucorales'],notes:'Echinocandin: inhibits β1,3-glucan synthase. First-line for invasive candidiasis, including many azole-resistant C. glabrata. NO activity against Cryptococcus (no glucan target effect) or the Mucorales. EUCAST uses anidulafungin (and micafungin) as the class breakpoint markers. Watch FKS-mutation echinocandin resistance, especially in C. glabrata.'},
  af_micafungin:{title:'Micafungin',sub:'Echinocandin',abx:['Candida','NOT Cryptococcus'],notes:'Echinocandin with the same target/spectrum as anidulafungin and EUCAST breakpoints for the major Candida species. Note C. parapsilosis has naturally higher echinocandin MICs. No activity against Cryptococcus.'},
  af_caspofungin:{title:'Caspofungin',sub:'Echinocandin (no EUCAST breakpoint)',abx:['Candida (clinically)','NOT for AFST'],notes:'Clinically an echinocandin like anidula/micafungin, BUT EUCAST does NOT set caspofungin breakpoints because of unacceptable inter-laboratory MIC variation. Use anidulafungin or micafungin as the surrogate for echinocandin susceptibility, then report the class.'},
  af_amphotericinb:{title:'Amphotericin B',sub:'Polyene',abx:['Candida','Cryptococcus','Aspergillus','Mucorales'],notes:'Broadest-spectrum antifungal (binds ergosterol): active against most yeasts and moulds including the Mucorales. Resistance is uncommon but seen in Aspergillus terreus, Scedosporium and some Candida. Liposomal formulations reduce nephrotoxicity. EUCAST has Candida and Aspergillus breakpoints.'},
  af_flucytosine:{title:'Flucytosine (5-FC)',sub:'Pyrimidine analogue',abx:['Candida','Cryptococcus (with amphotericin)'],notes:'Pyrimidine analogue, almost always used in combination (classically with amphotericin B for cryptococcal meningitis) because monotherapy rapidly selects resistance. EUCAST has breakpoints for Candida; monitor levels to avoid marrow toxicity.'},
  af_terbinafine:{title:'Terbinafine',sub:'Allylamine',abx:['dermatophytes','NOT routine Candida'],notes:'Allylamine (squalene epoxidase inhibitor), the oral agent of choice for dermatophyte nail and skin infection. Emerging terbinafine resistance via SQLE mutations defines Trichophyton indotineae — confirm by MIC / sequencing where treatment fails. EUCAST dermatophyte methodology and breakpoints are developing.'},
  af_method:{title:'Method & categories (EUCAST AFST)',sub:'Reference · how it is done',abx:['Broth microdilution (reference)','Gradient MIC strips','Yeast disk diffusion (some agents)'],notes:'EUCAST reference methods: E.Def 7.4 for yeasts and E.Def 9.4 for moulds (broth microdilution, read by eye). Categories follow the 2019 revision — S = susceptible, I = susceptible increased exposure (formerly intermediate), R = resistant — plus the Area of Technical Uncertainty (ATU) for problematic MIC ranges. Antifungal clinical breakpoints v10.0 (2020) with later technical-note updates; always check the current EUCAST table.'},
  afr_krusei:{title:'Candida krusei (Pichia kudriavzevii)',sub:'Expected resistant',abx:['Fluconazole (intrinsic)','reduced flucytosine'],notes:'Intrinsically resistant to fluconazole — never report fluconazole susceptible. Use an echinocandin or amphotericin B; voriconazole retains activity. Flucytosine susceptibility is reduced.'},
  afr_glabrata:{title:'Candida glabrata (Nakaseomyces glabratus)',sub:'Expected reduced azole',abx:['Fluconazole S-increased-exposure only','rising echinocandin resistance'],notes:'Reduced azole susceptibility — fluconazole at best susceptible-increased-exposure, never plain susceptible. Echinocandins are first line, but FKS-mediated echinocandin resistance is increasing, so test rather than assume.'},
  afr_cryptococcus:{title:'Cryptococcus spp.',sub:'Expected resistant',abx:['Echinocandins (no activity)'],notes:'Echinocandins have NO clinically useful activity against Cryptococcus — never use or report them. Treat with amphotericin B plus flucytosine (induction) then fluconazole.'},
  afr_aspergillus:{title:'Aspergillus spp.',sub:'Expected resistant',abx:['Fluconazole (no mould activity)'],notes:'Intrinsically resistant to fluconazole. Use a mould-active azole (voriconazole, isavuconazole, posaconazole) or amphotericin B; screen A. fumigatus for environmental azole resistance (TR34/L98H, cyp51A).'},
  afr_mucorales:{title:'Mucorales (Rhizopus, Mucor, Lichtheimia…)',sub:'Expected resistant',abx:['Voriconazole','Echinocandins','Fluconazole'],notes:'Resistant to voriconazole, echinocandins and fluconazole. Active options are amphotericin B (liposomal) and the extended-spectrum azoles isavuconazole and posaconazole, alongside surgical debridement.'},
  afr_scedosporium:{title:'Scedosporium / Lomentospora prolificans',sub:'Expected resistant',abx:['Amphotericin B (often)','multi-azole (L. prolificans)'],notes:'Scedosporium apiospermum often resists amphotericin B; voriconazole is usually the best option. Lomentospora prolificans is multi-resistant (azoles, amphotericin, echinocandins) — essentially pan-resistant, so identify it precisely.'},
  afr_indotineae:{title:'Trichophyton indotineae',sub:'Expected resistant (emerging)',abx:['Terbinafine (SQLE mutation)'],notes:'Emerging terbinafine resistance through squalene epoxidase (SQLE) point mutations — the reason this species was split out. Confirm by MIC/sequencing in non-responding tinea; itraconazole is the usual alternative.'},

  // sentinel — keep this last entry comma-terminated free
  __wound_end:{title:'',sub:'',abx:[],notes:''}
};

const dconfigs = {
  d68:{discs:[{l:'A',label:'Cefpodoxime'},{l:'B',label:'Cefpodoxime + ESBL inhibitor'},{l:'C',label:'Cefpodoxime + AmpC inhibitor'},{l:'D',label:'Cefpodoxime + ESBL + AmpC inhibitor'}],patterns:[
    {v:['S','S','S','S'],type:'success',title:'No resistance detected',body:'All discs susceptible. No ESBL or AmpC phenotype identified. No escalation required from cefpodoxime results alone.'},
    {v:['R','S','S','S'],type:'match',title:'ESBL producer likely',body:'Cefpodoxime resistant; ESBL inhibitor (B) restores susceptibility. AmpC inhibitor (C) alone has no effect. Classic ESBL pattern — typically CTX-M, SHV, or TEM. Report as ESBL-positive. Reflex UR2. Suppress 3GC reporting per EUCAST.'},
    {v:['R','R','S','S'],type:'warn',title:'AmpC producer — possible ESBL masked',body:'No ESBL inhibitor synergy (AmpC masking); AmpC inhibitor (C) restores susceptibility. Suggests AmpC masking ESBL. Proceed to D69 for AmpC characterisation and D63 for ESBL confirmation.'},
    {v:['R','R','R','S'],type:'warn',title:'AmpC + ESBL combined',body:'Only dual inhibitor disc (D) restores susceptibility. Combined ESBL + AmpC production confirmed. Reflex UR2. Confirm with D63. Suppress cephalosporin reporting.'},
    {v:['R','S','R','S'],type:'match',title:'ESBL (AmpC inhibitor non-contributory)',body:'Synergy with ESBL inhibitor (B and D) but not AmpC inhibitor (C) alone. Consistent with ESBL without significant AmpC. Report as ESBL-positive.'},
    {v:['R','R','R','R'],type:'danger',title:'No inhibitor synergy — carbapenemase or complex MDR',body:'No inhibitor rescue across any disc. Suggests carbapenemase, very high-level AmpC, or complex MDR. Proceed to D73. Reflex UR2. Do not report cephalosporins.'}
  ]},
  d69:{discs:[{l:'A',label:'Cefpodoxime + AmpC inducer'},{l:'B',label:'+ ESBL inhibitor'},{l:'C',label:'+ ESBL + AmpC inhibitor'}],patterns:[
    {v:['R','R','R'],type:'danger',title:'Derepressed AmpC — no ESBL',body:'All discs resistant. AmpC fully induced and overproduced; no inhibitor rescues. Consistent with derepressed chromosomal AmpC (Enterobacter, Citrobacter, Serratia). Do not report 3GCs even if susceptible in vitro. Reflex UR2.'},
    {v:['R','S','S'],type:'match',title:'ESBL confirmed in context of AmpC induction',body:'AmpC induced (A resistant); ESBL inhibitor (B) restores susceptibility. ESBL confirmed despite AmpC induction. Report ESBL-positive. Suppress 3GCs. Reflex UR2.'},
    {v:['R','R','S'],type:'warn',title:'AmpC induced — ESBL masked, confirm with D63',body:'A and B resistant (high-level AmpC masking ESBL synergy in B); C susceptible (AmpC inhibitor removes masking). Suggests ESBL masked by induced AmpC. Confirm with D63. Treat as ESBL+AmpC pending confirmation.'},
    {v:['S','S','S'],type:'success',title:'No significant AmpC induction or ESBL',body:'Susceptible across all discs despite AmpC inducer. Low-level or non-inducible AmpC; no ESBL. Susceptibility likely genuine.'},
    {v:['R','S','R'],type:'warn',title:'Unusual pattern — verify disc placement',body:'Inconsistent result (B susceptible but C resistant). Check disc placement and repeat. May indicate zone reading artefact or mixed culture.'}
  ]},
  d63:{discs:[{l:'A',label:'Cefepime'},{l:'B',label:'Cefepime + Clavulanic acid'}],patterns:[
    {v:['S','S'],type:'success',title:'No ESBL — cefepime susceptible',body:'No ESBL phenotype detectable. Cefepime may be reportable per EUCAST PK/PD breakpoints.'},
    {v:['R','S'],type:'match',title:'ESBL confirmed',body:'Cefepime resistant (A); clavulanic acid restores susceptibility (B, zone enhancement ≥5mm). ESBL confirmed. Cefepime is a poor AmpC substrate — this synergy is specific for ESBL. Report ESBL-positive. Reflex UR2.'},
    {v:['R','R'],type:'danger',title:'Cefepime resistant — no ESBL synergy',body:'No synergy with ESBL inhibitor. Possible very high-level ESBL overwhelming inhibition, carbapenemase masking, or porin loss + AmpC combination. Proceed to D73. Reflex UR2.'}
  ]},
  d73:{discs:[{l:'A',label:'Penem alone'},{l:'B',label:'Penem + MBL inhibitor'},{l:'C',label:'Penem + KPC inhibitor'},{l:'D',label:'Penem + AmpC inhibitor'},{l:'E',label:'Temocillin + MBL inhibitor'}],patterns:[
    {v:['S','S','S','S','S'],type:'success',title:'No carbapenemase detected',body:'Penem susceptible across all discs. No MBL, KPC, or significant AmpC contribution. Report carbapenem per EUCAST breakpoints.'},
    {v:['R','S','R','R','S'],type:'danger',title:'MBL producer (NDM / VIM / IMP)',body:'MBL inhibitor (B) restores susceptibility. KPC and AmpC inhibitors ineffective. Temocillin + MBL inhibitor (E) susceptible confirms MBL. Ceftazidime/avibactam NOT active — do not report. Reflex UR4 (Cefiderocol). Notify infection control immediately.'},
    {v:['R','R','S','R','R'],type:'danger',title:'KPC producer',body:'KPC inhibitor (C) restores penem susceptibility. MBL inhibitor no synergy. KPC confirmed. Ceftazidime/avibactam IS active — report from UR2 if susceptible. Notify infection control.'},
    {v:['R','R','R','S','R'],type:'warn',title:'AmpC contribution to carbapenem resistance',body:'AmpC inhibitor (D) restores penem susceptibility. MBL and KPC inhibitors ineffective. Suggests high-level AmpC + porin loss without true carbapenemase. Ceftazidime/avibactam may still be active. Confirm with molecular testing.'},
    {v:['R','R','R','R','R'],type:'danger',title:'OXA-type carbapenemase suspected',body:'No inhibitor synergy across all discs. OXA-48-like carbapenemases show no synergy with EDTA (MBL) or phenylboronic acid (KPC) — classic exclusion pattern. Confirm with PCR/MALDI-TOF. Caz/Avi IS active against OXA-48. Notify infection control.'},
    {v:['R','S','S','R','S'],type:'danger',title:'MBL + KPC co-production (rare)',body:'Synergy with both MBL (B) and KPC (C) inhibitors. Very rare — verify with molecular testing. Reflex UR4 (Cefiderocol). Notify infection control urgently.'},
    {v:['R','R','R','R','S'],type:'warn',title:'Possible OXA-48 with temocillin retained',body:'No penem inhibitor synergy; temocillin + MBL inhibitor (E) susceptible — MBL absent, temocillin may retain activity. OXA-48 pattern. Caz/Avi may be active. Confirm OXA-48 by PCR.'}
  ]}
};

const d73mmDiscs = [
  {l:'A', label:'Penem alone'},
  {l:'B', label:'Penem + MβL inh.'},
  {l:'C', label:'Penem + KPC inh.'},
  {l:'D', label:'Penem + AmpC inh.'},
  {l:'E', label:'Temocillin + MβL inh.'}
];

const mycoFungi = {
  // Trichophyton — microconidia present (separates from Epidermophyton); macroconidia often few/absent
  t_rubrum:{name:'Trichophyton rubrum',genus:'Trichophyton',reservoir:'Anthropophilic — the most widespread human dermatophyte',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/trichophyton',macro:'Slow to moderate growth; flat white-to-cream downy or cottony surface. Reverse develops a deep wine-red to blood-red pigment (best shown on PDA); some strains stay yellow-brown.',micro:'Slender septate hyphae bearing tear-drop (clavate to pyriform) microconidia laterally along their length. Macroconidia are scarce, thin-walled and pencil/cigar-shaped.',clues:['Red reverse pigment','Teardrop microconidia along hyphae','Hair perforation negative'],shape:'microconidia',img:''},
  t_interdigitale:{name:'Trichophyton interdigitale',genus:'Trichophyton',reservoir:'Anthropophilic — T. mentagrophytes complex',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/trichophyton',macro:'White to cream, flat, powdery to downy surface with a tan to pale-brown reverse; moderate growth.',micro:'Abundant round (globose) microconidia in dense grape-like clusters; spiral hyphae may be seen. Macroconidia are rare, thin-walled and cigar-shaped.',clues:['Round microconidia in clusters','Spiral hyphae','Urease positive (vs T. indotineae)'],shape:'clusters',img:''},
  t_mentagrophytes:{name:'Trichophyton mentagrophytes',genus:'Trichophyton',reservoir:'Zoophilic — rodents, rabbits and other animals',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/trichophyton',macro:'Cream to buff, flat, granular to powdery surface with a buff to brownish reverse; moderately rapid.',micro:'Numerous globose microconidia in clusters with frequent spiral (coiled) hyphae; occasional thin-walled cigar-shaped macroconidia.',clues:['Zoophilic — inflammatory lesions','Spiral hyphae','Hair perforation positive'],shape:'clusters',img:''},
  t_indotineae:{name:'Trichophyton indotineae',genus:'Trichophyton',reservoir:'Anthropophilic — emerging, terbinafine-resistant',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/trichophyton',macro:'Flat white-to-cream, powdery to granular surface with a pale yellow-brown reverse — culturally indistinguishable from T. interdigitale.',micro:'Dense clusters of spherical microconidia; slide morphology overlaps completely with T. interdigitale and cannot separate the two.',clues:['Terbinafine resistance','Urease often negative at 7 days','ITS sequencing needed to confirm'],shape:'clusters',img:''},
  t_tonsurans:{name:'Trichophyton tonsurans',genus:'Trichophyton',reservoir:'Anthropophilic — scalp-to-scalp spread',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/trichophyton',macro:'Folded suede-like to powdery colony; surface buff, yellow or mahogany; reverse yellow to reddish-brown.',micro:'Variable balloon-shaped to elongate microconidia borne at right angles on short stalks (match-stick arrangement); swollen forms common. Macroconidia rare.',clues:['Endothrix tinea capitis','Black-dot alopecia','Right-angle microconidia'],shape:'rightangle',img:''},
  t_violaceum:{name:'Trichophyton violaceum',genus:'Trichophyton',reservoir:'Anthropophilic',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/trichophyton',macro:'Slow, glabrous, heaped colony with a deep violet to port-wine surface and reverse; growth enhanced by thiamine.',micro:'Scant sporulation — usually only distorted septate hyphae and chlamydospores; conidia are rarely seen.',clues:['Endothrix capitis','Violet colony','Near-sterile microscopy'],shape:'scant',img:''},
  t_soudanense:{name:'Trichophyton soudanense',genus:'Trichophyton',reservoir:'Anthropophilic — common in Africa',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/trichophyton',macro:'Slow, flat, apricot to deep yellow-orange colony with a characteristic fringed, star-shaped margin; apricot reverse.',micro:'Reflexive (zig-zag) branching hyphae are the classic clue; microconidia and macroconidia are usually absent.',clues:['African tinea capitis','Reflexive branching hyphae','Fringed colony margin'],shape:'general',img:''},
  t_verrucosum:{name:'Trichophyton verrucosum',genus:'Trichophyton',reservoir:'Zoophilic — cattle and farm animals',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/trichophyton',macro:'Very slow, small, glabrous heaped white-to-cream colony. Thiamine and inositol dependent; growth and sporulation enhanced at 37°C.',micro:'Usually sterile; chains of chlamydospores (string-of-beads) and occasional antler-like hyphae. Rat-tailed macroconidia are rare.',clues:['Cattle ringworm / kerion','Chlamydospore chains','Better growth at 37°C'],shape:'chains',img:''},
  t_equinum:{name:'Trichophyton equinum',genus:'Trichophyton',reservoir:'Zoophilic — horse-associated',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/trichophyton',macro:'White to pale yellow flat downy colony with a yellow-brown reverse; requires nicotinic acid for growth.',micro:'Clavate to pyriform microconidia borne along the hyphae, a little larger than those of T. rubrum; macroconidia rare.',clues:['Horse contact','Nicotinic acid requirement','Pyriform microconidia'],shape:'general',img:''},
  t_schoenleinii:{name:'Trichophyton schoenleinii',genus:'Trichophyton',reservoir:'Anthropophilic — agent of favus',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/trichophyton',macro:'Slow, waxy and glabrous, heaped and highly convoluted off-white colony that often cracks the agar.',micro:'Antler-like favic chandelier hyphal tips and swollen chlamydospores are the classic clue; conidia are usually absent.',clues:['Favus with scutula','Favic chandeliers','Agar cracking'],shape:'chandelier',img:''},
  t_concentricum:{name:'Trichophyton concentricum',genus:'Trichophyton',reservoir:'Anthropophilic — agent of tinea imbricata',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/trichophyton',macro:'Slow, white-cream, heaped and folded glabrous to velvety colony that cracks the agar; some strains thiamine-enhanced.',micro:'Usually sterile; antler/favic-like branching hyphae and chlamydospores predominate; conidia are absent.',clues:['Tinea imbricata (concentric rings)','Pacific / SE Asia','Sterile microscopy'],shape:'general',img:''},
  // Microsporum — only three species in current taxonomy; spindle macroconidia with rough thick walls
  m_canis:{name:'Microsporum canis',genus:'Microsporum',reservoir:'Zoophilic — cats and dogs',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/microsporum',macro:'Rapid growth; white to pale-yellow woolly/cottony surface with a bright lemon-yellow to orange reverse.',micro:'Numerous large, thick rough-walled spindle macroconidia (typically 6+ cells) with a hooked, asymmetric apical knob. Microconidia are few and clavate.',clues:['Ectothrix tinea capitis','Wood’s lamp fluoresces green','Spindle macroconidia with apical knob'],shape:'spindle',img:''},
  m_audouinii:{name:'Microsporum audouinii',genus:'Microsporum',reservoir:'Anthropophilic — epidemic scalp infections',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/microsporum',macro:'Slow, flat, suede-like to downy greyish-white surface with a salmon to brown reverse; sporulation is poor.',micro:'Usually sterile — terminal chlamydospores and pectinate (comb-like) hyphae. Macroconidia are rare and bizarre; microconidia rare.',clues:['Epidemic tinea capitis in children','Poor growth on rice grains','Wood’s lamp positive'],shape:'general',img:''},
  m_ferrugineum:{name:'Microsporum ferrugineum',genus:'Microsporum',reservoir:'Anthropophilic — Asia, Africa, eastern Europe',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/microsporum',macro:'Slow, waxy and heaped, rust-coloured (ferruginous) to cream folded glabrous colony.',micro:'Characteristic bamboo hyphae with prominent septa and cytoplasmic granulation; conidia are generally absent.',clues:['Ectothrix tinea capitis','Bamboo hyphae','Near-sterile colony'],shape:'general',img:''},
  // Nannizzia — formerly Microsporum; geophilic, symmetrical fusiform macroconidia
  m_gypseum:{name:'Nannizzia gypsea',genus:'Nannizzia',reservoir:'Geophilic — soil; formerly Microsporum gypseum',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/nannizzia',macro:'Rapid growth; flat, powdery to granular cinnamon-buff surface with a pale to brownish reverse.',micro:'Abundant symmetrical thin rough-walled fusiform/ellipsoidal macroconidia (usually 4–6 cells) with rounded ends; clavate microconidia are moderate.',clues:['Soil exposure (gardeners, rural)','Abundant symmetrical macroconidia','Ectothrix, non-fluorescent'],shape:'fusiform',img:''},
  n_nana:{name:'Nannizzia nana',genus:'Nannizzia',reservoir:'Geophilic / zoophilic — soil and pigs; formerly Microsporum nanum',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/nannizzia',macro:'Flat, cream to buff, suede-like to powdery surface; young colonies are brownish-orange, deepening to reddish-brown with age.',micro:'Small ovoid to pyriform two-celled (occasionally one to three) macroconidia with a thin wall; microconidia are few.',clues:['Pig-associated and soil','Small two-celled macroconidia','Rarely infects humans'],shape:'club',img:''},
  // Epidermophyton — no microconidia (key separator); club macroconidia in clusters
  e_floccosum:{name:'Epidermophyton floccosum',genus:'Epidermophyton',reservoir:'Anthropophilic — humans only',source:'https://mycology.adelaide.edu.au/fungal-descriptions-and-antifungal-susceptibility/dermatophytes/epidermophyton',macro:'Olive-khaki to greenish-brown suede-like surface with radial folds and a brownish reverse; readily pleomorphs to sterile white tufts on subculture.',micro:'Smooth, thin-walled, club- to beavertail-shaped macroconidia borne in clusters of two or three directly off the hyphae. Microconidia are ABSENT — the key separator from Trichophyton and Microsporum.',clues:['No microconidia','Club macroconidia in clusters','Cruris/pedis/unguium — never hair'],shape:'club',img:''}
};

const mycoDiseases = [
  {name:'Tinea capitis',site:'hair',colour:'purple',fungi:['m_canis','m_audouinii','m_ferrugineum','m_gypseum','t_equinum','t_verrucosum','t_tonsurans','t_violaceum','t_soudanense','t_schoenleinii'],signs:'Scalp and hair infection. Ectothrix invasion places arthroconidia outside the hair shaft (often fluorescent), endothrix invasion stays within the shaft (non-fluorescent, black-dot type), and favus produces crusts/scutula with scarring hair loss.',source:'Humans, animals, contaminated soil or fomites depending on species.'},
  {name:'Tinea corporis',site:'skin',colour:'teal',fungi:['t_rubrum','t_interdigitale','t_mentagrophytes','t_indotineae','m_gypseum','m_canis'],signs:'Red, raised, ring-like lesions on trunk or limbs with central clearing; may spread from another body site or follow soil/animal exposure. Extensive recalcitrant cases raise suspicion of T. indotineae.',source:'Autoinoculation, human contact, contaminated soil or animals.'},
  {name:'Tinea imbricata',site:'skin',colour:'teal',fungi:['t_concentricum'],signs:'Distinctive concentric, overlapping scaly rings forming a lace-like pattern over large skin areas; chronic and often familial.',source:'Anthropophilic; endemic to the Pacific, SE Asia and parts of Central/South America.'},
  {name:'Tinea unguium / onychomycosis',site:'nail',colour:'pink',fungi:['t_rubrum','t_interdigitale','e_floccosum'],signs:'Superficial white patches/pits or invasive distal yellowing, thickening and crumbling of the nail plate.',source:'Human reservoir; commonly associated with chronic tinea pedis.'},
  {name:'Tinea cruris',site:'groin',colour:'coral',fungi:['t_rubrum','t_interdigitale','t_indotineae','e_floccosum'],signs:'Red, raised, pruritic lesions across the groin and buttocks; frequently recurrent while a foot reservoir persists.',source:'Usually spreads from the feet or via contaminated clothing/towels.'},
  {name:'Tinea pedis',site:'feet',colour:'blue',fungi:['t_rubrum','t_interdigitale','t_mentagrophytes','e_floccosum'],signs:'Interdigital maceration, scaling and fissuring with raised lesions around toes and soles; web spaces are heavily colonised and act as the main body reservoir.',source:'Human reservoirs in toe-web skin flakes; showers, carpets and footwear maintain infected keratin.'}
];

const bloodDisciplines = {
  haematology:{name:'Haematology',colour:'purple',icon:'ti-droplet',desc:'Cell counts, blood film morphology, anaemia screens and inflammatory cell-pattern clues. Mostly whole blood because the analyser needs intact cells rather than serum.'},
  coagulation:{name:'Coagulation',colour:'blue',icon:'ti-clock-heart',desc:'Clotting pathway tests, anticoagulant monitoring and bleeding/thrombosis investigations. Correct citrate fill is critical because clotting assays depend on a fixed blood-to-anticoagulant ratio.'},
  chemistry:{name:'Clinical chemistry',colour:'teal',icon:'ti-flask',desc:'Electrolytes, renal/liver/bone profiles, cardiac markers, proteins and many routine biochemical measurements, usually on serum or plasma after cell separation.'},
  immunology:{name:'Immunology / serology',colour:'blue',icon:'ti-shield',desc:'Antibodies, immune proteins, allergy markers and autoimmune screens. Many tests use serum because antibodies and soluble proteins remain stable after clotting.'},
  endocrinology:{name:'Endocrinology',colour:'green',icon:'ti-chart-line',desc:'Hormones and endocrine feedback tests. Tube choice depends on analyte stability and whether serum, plasma or rapid separation is needed.'},
  transfusion:{name:'Transfusion',colour:'pink',icon:'ti-heart-handshake',desc:'Blood group, antibody screen and crossmatch compatibility testing. Requires strict patient identification and usually EDTA whole blood/plasma to preserve red cell antigen testing.'},
  tox:{name:'Therapeutic drugs / toxicology',colour:'amber',icon:'ti-pill',desc:'Drug levels, overdose screens and selected trace/toxicology assays. Tube choice is highly assay-dependent because gels/additives may interfere with some measurements.'}
};

const bloodTubes = {
  sst:{name:'Yellow / gold SST',short:'Yellow SST',colour:'#F2C94C',additive:'Clot activator + serum-separator gel',why:'Blood clots, then serum separates from cells during centrifugation. Useful for many chemistry, immunology and serology assays where serum is the required matrix.'},
  edta:{name:'Purple EDTA',short:'Purple EDTA',colour:'#7F77DD',additive:'K₂/K₃ EDTA anticoagulant',why:'EDTA chelates calcium to prevent clotting and preserves cellular morphology, making it ideal for FBC, blood film and HbA1c-type whole-blood tests.'},
  citrate:{name:'Light blue citrate',short:'Blue citrate',colour:'#85B7EB',additive:'Buffered sodium citrate',why:'Citrate reversibly binds calcium. Coagulation analysers recalcify the sample, so the tube must be filled correctly for accurate clotting times.'},
  heparin:{name:'Green lithium heparin',short:'Green heparin',colour:'#5DCAA5',additive:'Lithium heparin ± plasma separator gel',why:'Heparin prevents clotting while allowing rapid plasma chemistry testing, useful where fast turnaround is needed or clotting delay is undesirable.'},
  fluoride:{name:'Grey fluoride oxalate',short:'Grey fluoride',colour:'#B7BDC7',additive:'Sodium fluoride + potassium oxalate',why:'Fluoride inhibits glycolysis and oxalate anticoagulates, helping preserve glucose/lactate-type analytes after collection.'},
  pink:{name:'Pink EDTA transfusion',short:'Pink EDTA',colour:'#ED93B1',additive:'EDTA anticoagulant, transfusion-labelled tube',why:'Used for group-and-save/crossmatch workflows where patient identity, sample age and EDTA plasma/red cells are critical.'},
  black:{name:'Black citrate ESR',short:'Black ESR',colour:'#2F343B',additive:'Sodium citrate for ESR ratio',why:'Designed for erythrocyte sedimentation rate testing with a defined anticoagulant ratio and tube geometry.'},
  culture:{name:'Blood culture bottles',short:'Blood cultures',colour:'#D85A30',additive:'Aerobic/anaerobic culture media',why:'Collects blood directly into culture broth to recover bacteria/yeasts from bloodstream infection; normally drawn before routine blood tubes.'},
  trace:{name:'Royal/dark blue trace metal',short:'Trace metal',colour:'#244B9B',additive:'Trace-element controlled tube, additive varies',why:'Minimises contamination for trace metals such as zinc, copper, lead or mercury; check the exact local tube for each assay.'}
};

const bloodTests = [
  {name:'Full blood count (FBC)',abbr:'FBC',discipline:'haematology',tube:'edta',why:'Quantifies haemoglobin, red cells, white cells and platelets.',use:'Screens anaemia, infection/inflammation patterns, thrombocytopenia/thrombocytosis and many acute presentations.',explain:'The analyser needs unclotted whole blood with intact cells, so EDTA is used to preserve morphology and prevent clotting.',notes:['Invert gently after collection','Clots can falsely lower platelet/WBC counts','Blood film may be reflexed from the same tube']},
  {name:'Blood film',abbr:'Film',discipline:'haematology',tube:'edta',why:'Microscopic review of red cells, white cells, platelets and parasites/abnormal cells where indicated.',use:'Clarifies anaemia morphology, blasts, haemolysis features, platelet clumping and atypical lymphocytes.',explain:'EDTA preserves cellular morphology long enough for a smear, but films are best made promptly to avoid artefact.',notes:['Useful with abnormal FBC flags','Do not interpret in isolation from clinical context']},
  {name:'Reticulocyte count',abbr:'Retics',discipline:'haematology',tube:'edta',why:'Measures immature red cells released from marrow.',use:'Assesses marrow response in anaemia, haemolysis or post-treatment recovery.',explain:'Requires intact anticoagulated red cells, so EDTA whole blood is appropriate.',notes:['High retics suggest increased production/loss','Low retics suggest underproduction']},
  {name:'ESR',abbr:'ESR',discipline:'haematology',tube:'black',why:'Measures how quickly red cells settle in a standardised tube.',use:'Non-specific inflammation marker used in temporal arteritis/PMR, chronic infection, autoimmune disease and malignancy workups.',explain:'A citrate ESR tube maintains a defined anticoagulant ratio and geometry for sedimentation measurement.',notes:['Very non-specific','Affected by anaemia, pregnancy and immunoglobulins']},
  {name:'HbA1c',abbr:'HbA1c',discipline:'chemistry',tube:'edta',why:'Measures glycated haemoglobin as an estimate of average glycaemia over prior weeks.',use:'Diagnosis/monitoring of diabetes depending on local pathways and clinical setting.',explain:'The measurand is haemoglobin inside red cells, so whole blood in EDTA is used rather than serum.',notes:['Can be misleading with haemoglobin variants or altered red-cell turnover','Not for acute glucose changes']},
  {name:'PT / INR',abbr:'INR',discipline:'coagulation',tube:'citrate',why:'Assesses the extrinsic/common clotting pathway; INR standardises PT for warfarin monitoring.',use:'Warfarin monitoring, liver synthetic function, bleeding screen and pre-procedure assessment where indicated.',explain:'Citrate anticoagulates reversibly; the analyser adds calcium back to measure clot formation. Underfilling changes the ratio and can invalidate results.',notes:['Fill to line','Haemolysis/clots/underfill may reject','Heparin/DOACs can interfere depending on assay']},
  {name:'APTT',abbr:'APTT',discipline:'coagulation',tube:'citrate',why:'Assesses intrinsic/common clotting pathway.',use:'Bleeding screen, unfractionated heparin monitoring in some protocols, factor deficiency/inhibitor investigation.',explain:'Requires correctly filled citrate plasma so clotting can be triggered under controlled conditions.',notes:['Sensitive to sample fill and contamination','Interpret with PT, fibrinogen, platelet count and clinical context']},
  {name:'Fibrinogen',abbr:'FIB',discipline:'coagulation',tube:'citrate',why:'Quantifies functional fibrinogen contribution to clot formation.',use:'DIC, major bleeding, liver disease, obstetric haemorrhage and thrombolysis contexts.',explain:'Performed on citrated plasma with controlled clotting activation.',notes:['Acute phase reactant','Low levels may support consumptive coagulopathy']},
  {name:'D-dimer',abbr:'DD',discipline:'coagulation',tube:'citrate',why:'Detects fibrin degradation products.',use:'Used in validated VTE exclusion pathways when pre-test probability is low/intermediate; also rises in infection, cancer, pregnancy and inflammation.',explain:'Citrated plasma is used for coagulation immunoassay methods and stable clotting-factor handling.',notes:['High sensitivity but low specificity','Never use alone to diagnose PE/DVT']},
  {name:'Urea and electrolytes',abbr:'U&E',discipline:'chemistry',tube:'sst',why:'Measures sodium, potassium, urea, creatinine and related renal/electrolyte markers.',use:'Renal function, dehydration, AKI, electrolyte disturbance and medication monitoring.',explain:'Serum gel tubes separate serum from cells, reducing ongoing cellular exchange after centrifugation.',notes:['Haemolysis can falsely raise potassium','Urgent potassium may use local plasma gas/rapid chemistry pathway']},
  {name:'Liver function tests',abbr:'LFT',discipline:'chemistry',tube:'sst',why:'Panel including bilirubin, ALT/AST, ALP, GGT, albumin and/or total protein depending on local profile.',use:'Hepatocellular injury, cholestasis, synthetic/protein status and monitoring drug or alcohol-related liver disease.',explain:'Serum is suitable for most routine enzyme/protein chemistry assays.',notes:['Patterns matter more than one value','Haemolysis may affect AST and other analytes']},
  {name:'Bone profile',abbr:'Bone',discipline:'chemistry',tube:'sst',why:'Measures calcium/phosphate/ALP/albumin combinations depending on local profile.',use:'Calcium disorders, renal bone disease, malignancy, vitamin D/PTH workup support.',explain:'Serum gel is routinely used for stable chemistry measurement after separation.',notes:['Interpret calcium with albumin or ionised calcium where relevant','EDTA contamination can cause falsely low calcium/high potassium']},
  {name:'CRP',abbr:'CRP',discipline:'chemistry',tube:'sst',why:'C-reactive protein is an acute-phase inflammatory marker.',use:'Supports assessment/monitoring of infection, inflammation and response to treatment.',explain:'CRP is a soluble serum protein, so SST serum is appropriate for routine measurement.',notes:['Non-specific','Trend is often more useful than a single result']},
  {name:'Troponin',abbr:'Tn',discipline:'chemistry',tube:'heparin',why:'Detects cardiac myocyte injury using high-sensitivity assay pathways.',use:'Acute coronary syndrome rule-in/rule-out protocols alongside symptoms and ECG.',explain:'Many urgent pathways use lithium-heparin plasma for faster processing because no clotting time is required; follow local assay tube rules.',notes:['Rise/fall pattern matters','Not specific to plaque rupture; renal failure/sepsis/myocarditis may raise levels']},
  {name:'Glucose',abbr:'Glucose',discipline:'chemistry',tube:'fluoride',why:'Measures blood glucose concentration.',use:'Diabetes diagnosis/monitoring support, hypoglycaemia investigation and metabolic assessment.',explain:'Fluoride inhibits glycolysis so cells do not continue consuming glucose after sampling; oxalate prevents clotting.',notes:['Capillary/POC glucose is a different pathway','Delay/separation rules affect accuracy']},
  {name:'Lactate',abbr:'Lactate',discipline:'chemistry',tube:'fluoride',why:'Measures lactate as a marker of tissue hypoperfusion, sepsis physiology or metabolic disturbance.',use:'Sepsis/critical care triage and monitoring where locally indicated.',explain:'Fluoride/oxalate helps stabilise glycolytic analytes, but urgent lactate is often performed on blood gas syringes depending on local SOP.',notes:['Process quickly','Venous stasis and delayed handling can affect results']},
  {name:'Thyroid function tests',abbr:'TFT',discipline:'endocrinology',tube:'sst',why:'Usually TSH with reflex/free T4 and sometimes free T3 depending on pathway.',use:'Hypo-/hyperthyroidism screening and treatment monitoring.',explain:'Serum is used for immunoassays of circulating hormones and pituitary feedback markers.',notes:['Biotin and heterophile antibodies may interfere in some assays','Interpret with pregnancy/illness/medication context']},
  {name:'Cortisol',abbr:'Cortisol',discipline:'endocrinology',tube:'sst',why:'Measures adrenal glucocorticoid level.',use:'Adrenal insufficiency/Cushing workups and dynamic tests such as Synacthen where locally performed.',explain:'Serum is a common matrix for cortisol immunoassay; timing is critical because cortisol is diurnal.',notes:['Record collection time','Dynamic testing has strict timed samples']},
  {name:'Ferritin',abbr:'Ferritin',discipline:'chemistry',tube:'sst',why:'Reflects iron stores but also behaves as an acute-phase reactant.',use:'Iron deficiency/overload assessment and anaemia workup with iron studies/FBC.',explain:'Ferritin is a soluble serum protein measured by immunoassay.',notes:['Inflammation can raise ferritin despite iron deficiency','Interpret with CRP/transferrin saturation where relevant']},
  {name:'Vitamin B12 / folate',abbr:'B12/Folate',discipline:'chemistry',tube:'sst',why:'Assesses nutritional and absorption-related causes of macrocytosis/anaemia or neuropathy symptoms.',use:'Anaemia workup and selected neurological/nutritional assessments.',explain:'Serum gel is routinely used for these immunoassay/chemistry methods.',notes:['Folate handling may be light/time sensitive locally','Interpret with FBC and clinical features']},
  {name:'Immunoglobulins',abbr:'IgG/IgA/IgM',discipline:'immunology',tube:'sst',why:'Quantifies major antibody classes.',use:'Immune deficiency, chronic infection/inflammation, liver disease and paraprotein workups.',explain:'Serum contains soluble immunoglobulins after clotting and separation.',notes:['Often paired with electrophoresis/free light chains if paraprotein suspected']},
  {name:'Autoimmune screen',abbr:'ANA/ENA etc.',discipline:'immunology',tube:'sst',why:'Detects autoantibodies depending on requested panel.',use:'Supports autoimmune connective tissue/liver/vasculitis workups when pre-test probability is appropriate.',explain:'Autoantibodies are measured in serum; SST provides separated serum for immunology assays.',notes:['Positive screens can occur in healthy people','Request targeted tests where possible']},
  {name:'Allergy IgE / specific IgE',abbr:'IgE',discipline:'immunology',tube:'sst',why:'Measures total or allergen-specific IgE sensitisation.',use:'Supports allergy assessment alongside history and exposure pattern.',explain:'Serum is used for immunoassay detection of IgE antibodies.',notes:['Sensitisation does not always equal clinical allergy','Clinical history drives interpretation']},
  {name:'Complement C3/C4',abbr:'C3/C4',discipline:'immunology',tube:'sst',why:'Measures complement protein concentrations.',use:'SLE/immune-complex disease activity, complement deficiency and some infection/inflammation contexts.',explain:'Serum is suitable for routine complement protein assays, but handling requirements may apply locally.',notes:['Consumption lowers levels; acute phase response can raise levels','Use with autoantibodies and clinical picture']},
  {name:'Group and save',abbr:'G&S',discipline:'transfusion',tube:'pink',why:'Determines ABO/Rh group and screens for red-cell antibodies.',use:'Pre-transfusion compatibility planning before surgery, bleeding risk or possible transfusion.',explain:'EDTA prevents clotting and preserves red cells/plasma for antigen typing and antibody screening; transfusion samples require strict ID rules.',notes:['Sample validity window depends on recent transfusion/pregnancy policy','Mislabelled samples are usually rejected']},
  {name:'Crossmatch',abbr:'XM',discipline:'transfusion',tube:'pink',why:'Checks compatibility between patient sample and donor units.',use:'Required when blood is likely to be transfused or antibodies require serological matching.',explain:'Uses EDTA transfusion sample for patient red cell group/antibody testing and compatibility work.',notes:['Positive antibody screen may delay provision','Emergency release follows separate policy']},
  {name:'Gentamicin / vancomycin levels',abbr:'TDM',discipline:'tox',tube:'sst',why:'Measures antibiotic concentration for therapeutic drug monitoring.',use:'Dose adjustment to balance efficacy and toxicity, especially renal impairment or prolonged therapy.',explain:'Serum is commonly used for drug concentration assays, but timing relative to dose is more important than almost anything else.',notes:['Record dose time and sample time','Peak/trough requirements differ by protocol']},
  {name:'Paracetamol level',abbr:'Paracetamol',discipline:'tox',tube:'sst',why:'Measures serum paracetamol concentration after overdose.',use:'Risk stratification for N-acetylcysteine treatment using timed nomogram/local toxicology protocol.',explain:'Serum gel is commonly accepted for drug level measurement; sample timing after ingestion is essential.',notes:['Record exact/estimated ingestion time','Treat clinically if timing is unclear per policy']},
  {name:'Trace metals',abbr:'Trace metals',discipline:'tox',tube:'trace',why:'Measures low-level metals where contamination would distort results.',use:'Zinc/copper/lead/mercury-type investigations depending on request and local laboratory.',explain:'Trace-element tubes reduce background contamination from tube components; ordinary tubes may be unsuitable.',notes:['Check exact metal and local tube','Avoid contamination from needles/environment']},
  {name:'Blood cultures',abbr:'BC',discipline:'chemistry',tube:'culture',why:'Detects viable bacteria or yeasts in bloodstream infection.',use:'Sepsis, endocarditis, line infection, pyrexia of unknown origin or before antimicrobials where indicated.',explain:'Blood is inoculated into aerobic/anaerobic culture media to maximise organism recovery; draw before routine tubes and before antibiotics where possible.',notes:['Skin antisepsis is critical','Adequate volume improves yield','Not a chemistry test, but included because it is a key coloured-container blood workflow']}
];

const plateMedia = {
  uri: {
    name: 'Uriselect 4',
    longName: 'Uriselect 4 chromogenic agar (BioRad)',
    agarFill: 'url(#agarGradUri)',
    agarStops: [['0%','#FAF5E1'],['70%','#F0E8C8'],['100%','#D9CCA0']],
    rimColor:'#E8DFC1', rimStroke:'#B5A87E',
    note: 'Chromogenic medium for urinary tract isolates — colours generated by β-D-galactosidase, β-D-glucuronidase, β-D-glucosidase and tryptophan deaminase activity.'
  },
  blood: {
    name: 'Columbia Blood Agar',
    longName: 'Columbia agar + 5% horse blood',
    agarFill: 'url(#agarGradBlood)',
    agarStops: [['0%','#9C2832'],['60%','#7A1F26'],['100%','#561217']],
    rimColor:'#5A1A20', rimStroke:'#3D1015',
    note: 'Routine non-selective rich medium for wound, respiratory, deep-tissue and sterile-site cultures. Haemolysis patterns (α / β / γ) are a key identification feature.'
  },
  mrsa: {
    name: 'Brilliance MRSA 2',
    longName: 'Oxoid Brilliance MRSA 2 Agar (Thermo Fisher)',
    agarFill: 'url(#agarGradMrsa)',
    agarStops: [['0%','#F4EFE2'],['66%','#E7DDC7'],['100%','#D4C7AC']],
    rimColor:'#DCD0B5', rimStroke:'#A8966E',
    note: 'Selective chromogenic medium for MRSA screening (Oxoid Brilliance MRSA 2). MRSA grows as distinctive blue colonies against the light-coloured, opaque background; a pink counter-stain makes any non-target breakthrough growth read pink rather than blue. Methicillin-susceptible staphylococci and most other organisms are inhibited. Colony appearance is a screen only — confirm with local SOP, latex/MALDI and the cefoxitin/mecA pathway.'
  },
  xld: {
    name: 'XLD agar',
    longName: 'Xylose Lysine Deoxycholate agar',
    agarFill: 'url(#agarGradXld)',
    agarStops: [['0%','#E74235'],['65%','#C8202C'],['100%','#8D1020']],
    rimColor:'#A81622', rimStroke:'#5E0B14',
    note: 'Enteric selective/differential medium. Xylose/lactose/sucrose fermentation turns colonies/yellow zones acid; lysine decarboxylation restores red; H₂S producers form black centres.'
  },
  tcbs: {
    name: 'TCBS agar',
    longName: 'Thiosulfate Citrate Bile Salts Sucrose agar',
    agarFill: 'url(#agarGradTcbs)',
    agarStops: [['0%','#2CA85A'],['62%','#15824C'],['100%','#0B5938']],
    rimColor:'#1A7448', rimStroke:'#0A3E27',
    note: 'Highly selective medium for Vibrio spp. Sucrose fermenters produce yellow colonies; non-sucrose fermenters remain green/blue-green. Halophilic Vibrios may require salt tolerance context.'
  },
  smac: {
    name: 'Sorbitol MacConkey',
    longName: 'Sorbitol MacConkey agar (SMAC)',
    agarFill: 'url(#agarGradSmac)',
    agarStops: [['0%','#ECA8C0'],['68%','#D77FA6'],['100%','#B95282']],
    rimColor:'#C86B94', rimStroke:'#8A355E',
    note: 'MacConkey variant using sorbitol instead of lactose. Sorbitol-fermenters turn pink; non-sorbitol-fermenting E. coli O157 classically remains pale/colourless.'
  },
  choc: {
    name: 'Chocolate agar',
    longName: 'Heated blood / chocolate agar',
    agarFill: 'url(#agarGradChoc)',
    agarStops: [['0%','#7D4B2E'],['62%','#5E351F'],['100%','#3D2114']],
    rimColor:'#4A2A19', rimStroke:'#26120A',
    note: 'Enriched medium where heating blood releases X factor (haemin) and V factor (NAD). Supports fastidious organisms such as Haemophilus and Neisseria; incubate in CO₂ where required.'
  }
};

const organisms = {
  // ─── URISELECT (urine) ───
  ecoli_uri:{name:'Escherichia coli',medium:'uri',colonyColor:'#C6346A',colonyShade:'#7D1C42',
    size:5,sizeVar:0.3,count:34,texture:'smooth',haemolysis:null,
    features:['Pink → magenta','2–3 mm','Smooth','Discrete'],
    description:'Pink to deep magenta colonies, 2–3 mm, smooth and mostly discrete. The chromogenic β-D-galactosidase substrate is cleaved by E. coli, producing the characteristic pink. Strong lactose fermenter — one of the most distinctive appearances on Uriselect 4. Indole positive on subculture.'},
  klebsiella_uri:{name:'Klebsiella spp.',medium:'uri',colonyColor:'#2761B8',colonyShade:'#143E83',
    size:8,sizeVar:0.25,count:14,texture:'mucoid',haemolysis:null,
    features:['Metallic blue','3–5 mm','Mucoid','Confluent tendency'],
    description:'Metallic blue to blue-green, large mucoid colonies that often run together. Combined β-D-galactosidase and β-D-glucuronidase activities give the blue colour; the polysaccharide capsule produces the wet, glistening, mucoid appearance. K. pneumoniae and K. oxytoca are indistinguishable here — MALDI required for speciation.'},
  enterobacter_uri:{name:'Enterobacter / Citrobacter',medium:'uri',colonyColor:'#1F7A4C',colonyShade:'#0F4528',
    size:5,sizeVar:0.3,count:26,texture:'smooth',haemolysis:null,
    features:['Green → teal','2–3 mm','Smooth','Less mucoid than Klebsiella'],
    description:'Blue-green to dark green, 2–3 mm, smooth and noticeably drier than Klebsiella. Enterobacter cloacae and Citrobacter freundii share this appearance — MALDI speciation is essential as Enterobacter has higher AmpC inducibility relevant to therapy.'},
  proteus_uri:{name:'Proteus spp.',medium:'uri',colonyColor:'#9C6B2E',colonyShade:'#5E3D14',
    size:3,sizeVar:0.4,count:8,texture:'smooth',haemolysis:null,swarming:'mild',
    features:['Tan / brown halo','Variable','Swarming (mild)','TDA halo'],
    description:'Tan-brown colonies with a diffuse brown halo (tryptophan deaminase activity). Swarming is dampened on Uriselect compared to blood agar but still visible as concentric waves of growth. Useful for picking up Proteus in mixed cultures without losing isolation. Indole positive (P. vulgaris) or negative (P. mirabilis) on subculture.'},
  enterococcus_uri:{name:'Enterococcus spp.',medium:'uri',colonyColor:'#1FB89A',colonyShade:'#0E6855',
    size:2.5,sizeVar:0.2,count:42,texture:'smooth',haemolysis:null,
    features:['Turquoise','≤ 1 mm','Pinpoint','Discrete'],
    description:'Small turquoise colonies, ≤ 1 mm, pinpoint and discrete. β-D-glucosidase activity gives the colour. The marked size difference vs coliform colonies is a useful first-pass clue. E. faecalis and E. faecium look identical on Uriselect — distinguish by MALDI and by ampicillin sensitivity downstream.'},
  pseudomonas_uri:{name:'Pseudomonas aeruginosa',medium:'uri',colonyColor:'#B6A878',colonyShade:'#7E7349',
    size:5,sizeVar:0.4,count:18,texture:'matte',haemolysis:null,
    features:['Cream → tan','2–4 mm','Matte','Variable pigment'],
    description:'Cream to tan colonies, sometimes with a subtle greenish tint where pyocyanin / pyoverdin diffuses partially through the chromogenic medium. Slightly mucoid in many clinical isolates. Distinctive grape-like / corn-tortilla odour. Confirm oxidase positive — Uriselect colour alone is not diagnostic.'},
  staph_sapro_uri:{name:'Staphylococcus saprophyticus',medium:'uri',colonyColor:'#F9E5EB',colonyShade:'#D4789A',
    size:3.5,sizeVar:0.35,count:30,texture:'smooth',haemolysis:null,
    features:['White / pale pink','1–2 mm','Smooth','Variable pink hue'],
    description:'White to pale pink colonies, 1–2 mm, smooth and slightly raised, with a characteristic variably expressed pink chromogenic hue across the plate — the result of β-D-glucosidase substrate cleavage on Uriselect 4. Colony-to-colony colour intensity varies, giving a distinctly mottled pinkish-white appearance overall. Particularly relevant in young women with dysuria. Confirm with novobiocin disc — S. saprophyticus is resistant, separating it from other coagulase-negative staphylococci that are susceptible.'},
  candida_uri:{name:'Candida spp.',medium:'uri',colonyColor:'#F7F1DC',colonyShade:'#C8BC97',
    size:4,sizeVar:0.3,count:18,texture:'matte',haemolysis:null,
    features:['Cream → off-white','2–3 mm','Matte / dry','Yeast on Gram'],
    description:'Cream to off-white, 2–3 mm, smooth, slightly raised colonies. Yeast morphology confirmed on Gram stain. Speciation requires chromogenic Candida agar or MALDI. Always assess clinical significance against catheterisation, immunosuppression, and pure vs mixed growth before reporting.'},

  // ─── COLUMBIA BLOOD AGAR (wound) ───
  saureus_blood:{name:'Staphylococcus aureus',medium:'blood',colonyColor:'#E8AE3F',colonyShade:'#9C6E17',
    size:5,sizeVar:0.2,count:22,texture:'smooth',haemolysis:'beta',
    features:['Golden','2–3 mm','Smooth','β-haemolytic'],
    description:'Golden yellow ("aureus") smooth colonies, 2–3 mm, with most strains producing clear β-haemolysis on horse blood. Carotenoid pigment (staphyloxanthin) deepens after 24 h. CoNS by contrast are cream/white and non-haemolytic. Cefoxitin MHE done in parallel for MRSA screening.'},
  cons_blood:{name:'Coagulase-negative staph',medium:'blood',colonyColor:'#F2EBD8',colonyShade:'#B8AE91',
    size:4,sizeVar:0.25,count:26,texture:'smooth',haemolysis:'none',
    features:['White / cream','2–3 mm','Smooth','Non-haemolytic'],
    description:'Cream-white to grey, smooth, 2–3 mm, no haemolysis. Coagulase negative on tube test. Usually skin / mucosal contaminants — significance depends on specimen type, pure vs mixed growth, and repeat isolation. S. lugdunensis is the exception: clinically S. aureus-like and DNase positive — speciate by MALDI.'},
  gas_blood:{name:'Group A Strep (S. pyogenes)',medium:'blood',colonyColor:'#E5DEC4',colonyShade:'#807A60',
    size:1.5,sizeVar:0.15,count:60,texture:'smooth',haemolysis:'beta_wide',
    features:['Greyish','0.5–1 mm','Pinpoint','Wide β-haem'],
    description:'Pinpoint (0.5–1 mm), greyish colonies surrounded by a WIDE clear zone of β-haemolysis often several times the colony diameter — visually striking and a key clue. Bacitracin sensitive, PYR positive, Lancefield group A. Always notify clinical teams promptly: invasive GAS is a sepsis emergency.'},
  gbs_blood:{name:'Group B Strep (S. agalactiae)',medium:'blood',colonyColor:'#EBE4CA',colonyShade:'#998E70',
    size:2.5,sizeVar:0.2,count:34,texture:'smooth',haemolysis:'beta_narrow',
    features:['Cream-grey','1–2 mm','Smooth','Narrow β-haem'],
    description:'Cream-grey, 1–2 mm, with a NARROW zone of β-haemolysis (absent in 1–2 % of strains). CAMP test positive — characteristic arrowhead synergy with S. aureus β-haemolysin. Major neonatal pathogen and increasingly important in adult skin / soft-tissue and diabetic foot infections.'},
  spneumo_blood:{name:'Streptococcus pneumoniae',medium:'blood',colonyColor:'#CFD4B1',colonyShade:'#82876A',
    size:2,sizeVar:0.2,count:32,texture:'umbilicated',haemolysis:'alpha',
    features:['Grey-green α-haem','1–2 mm','Draughtsman','Umbilicated'],
    description:'Greyish, 1–2 mm colonies surrounded by α-haemolysis (green discolouration from H₂O₂-driven oxidation of haemoglobin). Older colonies develop the classic central depression giving the "draughtsman" / checker-piece morphology. Optochin sensitive, bile soluble — distinguishes from viridans group.'},
  viridans_blood:{name:'Viridans Strep group',medium:'blood',colonyColor:'#DCD8B8',colonyShade:'#8C8866',
    size:1.5,sizeVar:0.2,count:46,texture:'smooth',haemolysis:'alpha',
    features:['Grey-green α-haem','0.5–1 mm','Smooth','Optochin R'],
    description:'Pinpoint to small (0.5–1 mm), grey-green α-haemolytic colonies. Optochin resistant — separates from pneumococcus. Common oral / GI flora; clinical significance depends on site (always significant from blood / valve tissue in endocarditis context, less so from superficial swabs).'},
  efaecalis_blood:{name:'Enterococcus faecalis',medium:'blood',colonyColor:'#E0D6BA',colonyShade:'#9C9070',
    size:2.5,sizeVar:0.2,count:36,texture:'smooth',haemolysis:'none',
    features:['Cream / grey','1–2 mm','Smooth','γ-haem (usually)'],
    description:'Cream to grey, 1–2 mm, smooth, γ-haemolytic (no haemolysis) — though weak α-haemolysis occurs in some strains. Bile-esculin and PYR positive. Grows on bile-tolerant selective media (e.g. MacConkey, CLED). MALDI separates E. faecalis from E. faecium — clinically critical because of differing intrinsic resistances.'},
  pseudo_blood:{name:'Pseudomonas aeruginosa',medium:'blood',colonyColor:'#6EA378',colonyShade:'#3F6647',
    size:6,sizeVar:0.4,count:18,texture:'metallic',haemolysis:'beta',
    features:['Green / metallic','3–5 mm','Sheen','Grape odour'],
    description:'Variable: cream through to vivid green-blue from pyocyanin pigment, often with a metallic sheen on confluent growth. β-haemolysis common. Distinctive grape-like / corn-tortilla odour. Mucoid morphotypes typical in chronic CF / bronchiectasis isolates. Oxidase positive — confirms diagnosis at the bench.'},
  ecoli_blood:{name:'Escherichia coli',medium:'blood',colonyColor:'#CCC4AC',colonyShade:'#827B66',
    size:5,sizeVar:0.3,count:22,texture:'smooth',haemolysis:'variable',
    features:['Grey-cream','2–4 mm','Smooth','~30% β-haem'],
    description:'Grey to cream, 2–4 mm, smooth, sometimes slightly mucoid. UPEC / ExPEC strains commonly show β-haemolysis (around 30 % of wound and urinary isolates). Far less distinctive than on Uriselect — confirm species by MALDI / biochemistry; combine with MacConkey for lactose fermentation.'},
  proteus_blood:{name:'Proteus spp.',medium:'blood',colonyColor:'#A6AB95',colonyShade:'#5F6553',
    size:2.5,sizeVar:0.5,count:6,texture:'smooth',haemolysis:'none',swarming:'aggressive',
    features:['Grey-tan','Swarming','Concentric waves','Fishy odour'],
    description:'Striking concentric "Dienes" swarming waves often covering the entire plate within 24 h, obliterating discrete colonies. Makes mixed-culture quantitation nearly impossible — subculture onto CLED or Uriselect to recover isolated colonies. Characteristic fishy / putrid odour. Indole differentiates P. mirabilis (−) from P. vulgaris (+).'},
  steno_blood:{name:'Stenotrophomonas maltophilia',medium:'blood',colonyColor:'#B5A8C4',colonyShade:'#736890',
    size:4,sizeVar:0.3,count:22,texture:'matte',haemolysis:'none',
    features:['Lavender','2–3 mm','Slightly rough','Ammonia odour'],
    description:'Pale lavender to light yellow-pigmented colonies, 2–3 mm, slightly rough / dry surface. Subtle ammonia-like odour. Oxidase negative — instantly separates from Pseudomonas. Critical reminder: intrinsically resistant to ALL carbapenems regardless of disc zone — never report carbapenems as susceptible.'},
  acineto_blood:{name:'Acinetobacter spp.',medium:'blood',colonyColor:'#D8CFB8',colonyShade:'#8E876D',
    size:3,sizeVar:0.25,count:28,texture:'smooth',haemolysis:'none',
    features:['Cream / grey','1–2 mm','Smooth, domed','Non-motile'],
    description:'Cream to grey, smooth, slightly domed, 1–2 mm. Non-haemolytic. Oxidase negative GN coccobacillus. A. baumannii complex (the clinically dominant group) often has reduced carbapenem susceptibility — reflex D73 and Coli 3. Differentiate from Stenotrophomonas (lavender pigment) and Burkholderia (oxidase positive in most species).'},
  haem_note:{name:'Haemophilus spp. (note)',medium:'blood',isNote:true,
    description:'Haemophilus does NOT grow on Columbia Blood Agar — it requires X (haemin) and V (NAD) factors that are unavailable in intact horse erythrocytes. Always plate Chocolate Agar or HTM (Haemophilus Test Medium) in parallel with CBA whenever Haemophilus is in the differential (respiratory, eye, paediatric). On chocolate: small, grey, glistening, non-haemolytic colonies; satellite around S. aureus streak on a co-inoculated CBA.'},

  // ─── BRILLIANCE MRSA 2 PLATE ───
  mrsa_saureus:{name:'MRSA / presumptive S. aureus',medium:'mrsa',colonyColor:'#2F6FBF',colonyShade:'#173E78',
    size:4.8,sizeVar:0.25,count:20,texture:'smooth',haemolysis:null,
    features:['Distinctive blue','2–3 mm','Selective growth','Confirm MRSA'],
    description:'On Brilliance MRSA 2 agar, presumptive MRSA target colonies are a distinctive blue, easily read against the light, opaque background. The medium inhibits methicillin-susceptible staphylococci and most other competing organisms. Colony colour is a screen only — always confirm against local SOP with latex/MALDI and the cefoxitin/mecA pathway.'},
  mrsa_mssa_suppressed:{name:'MSSA / mixed flora suppressed',medium:'mrsa',colonyColor:'#E0A6BC',colonyShade:'#AE6883',
    size:2.4,sizeVar:0.4,count:10,texture:'matte',haemolysis:null,
    features:['No growth or non-target','Pink (counter-stained) if present','Selective inhibition'],
    description:'Methicillin-susceptible S. aureus and background skin flora are largely inhibited on Brilliance MRSA 2. Any non-target organism that does break through is rendered pink by the counter-stain in the medium rather than blue, aiding differentiation from true MRSA. Never treat pink or pale breakthrough growth as MRSA without confirmatory testing.'},

  // ─── XLD AGAR ───
  salmonella_xld:{name:'Salmonella spp.',medium:'xld',colonyColor:'#C91825',colonyShade:'#0F0F0F',
    size:4.2,sizeVar:0.25,count:24,texture:'black_center',haemolysis:null,
    features:['Red colonies','Black centres','H₂S positive','Lysine decarboxylation'],
    description:'Typical Salmonella colonies on XLD are red with black centres from H₂S production. Early acid from xylose fermentation is reversed by lysine decarboxylation, restoring the red alkaline appearance. Non-H₂S Salmonella may lack black centres, so suspicious red colonies still require confirmation.'},
  shigella_xld:{name:'Shigella spp.',medium:'xld',colonyColor:'#D94B55',colonyShade:'#8B1C26',
    size:3.2,sizeVar:0.22,count:28,texture:'smooth',haemolysis:null,
    features:['Red / pink','No black centre','Non-H₂S','Non-lactose fermenter'],
    description:'Shigella usually forms red to pink colonies without black centres on XLD. It does not ferment xylose in the usual way and does not produce H₂S. Colonies can be small and easily overgrown, so stool culture interpretation should use selective plates together.'},
  ecoli_xld:{name:'E. coli / coliforms',medium:'xld',colonyColor:'#F2C04E',colonyShade:'#A66D17',
    size:4.8,sizeVar:0.3,count:24,texture:'smooth',haemolysis:null,
    features:['Yellow colonies','Acid reaction','Lactose/sucrose fermenter'],
    description:'Many commensal coliforms ferment lactose and/or sucrose on XLD, producing yellow colonies and yellowing of the local medium. This helps separate background flora from red Salmonella/Shigella-like colonies.'},
  proteus_xld:{name:'Proteus spp.',medium:'xld',colonyColor:'#B32128',colonyShade:'#111111',
    size:4.5,sizeVar:0.35,count:14,texture:'black_center',haemolysis:null,
    features:['Red colonies','Black centres possible','H₂S mimic','Swarming inhibited'],
    description:'Proteus may produce red colonies with black centres and can mimic Salmonella on XLD. Swarming is inhibited by the selective medium, but biochemical or MALDI confirmation is needed for any H₂S-positive suspicious colony.'},

  // ─── TCBS AGAR ───
  vcholerae_tcbs:{name:'Vibrio cholerae',medium:'tcbs',colonyColor:'#FFD44F',colonyShade:'#BA8123',
    size:5,sizeVar:0.22,count:24,texture:'smooth',haemolysis:null,
    features:['Yellow','Sucrose fermenter','2–4 mm','Oxidase +'],
    description:'V. cholerae classically forms large smooth yellow colonies on TCBS due to sucrose fermentation. Yellow colonies are not diagnostic by themselves — confirm with oxidase, MALDI/serology and local public-health escalation where relevant.'},
  vparahaem_tcbs:{name:'Vibrio parahaemolyticus',medium:'tcbs',colonyColor:'#1F8E72',colonyShade:'#0E4F42',
    size:4.2,sizeVar:0.25,count:26,texture:'smooth',haemolysis:null,
    features:['Green / blue-green','Non-sucrose fermenter','Halophilic'],
    description:'V. parahaemolyticus usually forms green to blue-green colonies on TCBS because it does not ferment sucrose. Seafood exposure and salt tolerance are useful context. Confirm with oxidase and identification testing.'},
  vvulnificus_tcbs:{name:'Vibrio vulnificus',medium:'tcbs',colonyColor:'#5FAE67',colonyShade:'#2C6E3B',
    size:4.5,sizeVar:0.3,count:20,texture:'smooth',haemolysis:null,
    features:['Green or variable','Often non-sucrose','Halophilic','Wound/sepsis risk'],
    description:'V. vulnificus commonly appears green on TCBS, though reactions may vary by strain and medium. It is clinically important in seawater-associated wound infections and severe sepsis in liver disease; suspicious isolates should be escalated promptly.'},
  valginolyticus_tcbs:{name:'Vibrio alginolyticus',medium:'tcbs',colonyColor:'#F6C94F',colonyShade:'#B67C1A',
    size:5.2,sizeVar:0.25,count:22,texture:'smooth',haemolysis:null,
    features:['Yellow','Sucrose fermenter','Marine exposure'],
    description:'V. alginolyticus usually produces yellow colonies on TCBS due to sucrose fermentation and is associated with marine exposure, ear infections and wound infections. Differentiate from V. cholerae by full identification rather than colony colour alone.'},

  // ─── SORBITOL MACCONKEY AGAR ───
  ecoli_o157_smac:{name:'E. coli O157 / NSF E. coli',medium:'smac',colonyColor:'#F6EAF0',colonyShade:'#B98DA1',
    size:4,sizeVar:0.25,count:30,texture:'smooth',haemolysis:null,
    features:['Pale / colourless','Non-sorbitol fermenter','O157 screen'],
    description:'Classical E. coli O157:H7 does not ferment sorbitol rapidly, so colonies remain pale or colourless on SMAC. This is a screening appearance only — confirm with O157 latex/serology and Shiga-toxin testing according to local stool pathway.'},
  ecoli_smac:{name:'Sorbitol-fermenting E. coli',medium:'smac',colonyColor:'#D93C7B',colonyShade:'#8A1E4B',
    size:4.5,sizeVar:0.28,count:28,texture:'smooth',haemolysis:null,
    features:['Pink','Sorbitol fermenter','Common background E. coli'],
    description:'Most non-O157 E. coli ferment sorbitol and form pink colonies on SMAC. Sorbitol fermentation does not exclude all STEC, but it makes classical O157 less likely.'},
  klebsiella_smac:{name:'Klebsiella / Enterobacter',medium:'smac',colonyColor:'#C84B86',colonyShade:'#7E2553',
    size:6.5,sizeVar:0.25,count:16,texture:'mucoid',haemolysis:null,
    features:['Pink','Mucoid','Sorbitol fermenter'],
    description:'Klebsiella and Enterobacter often appear as large pink mucoid sorbitol-fermenting colonies. Capsule production gives the wet, glistening, spreading appearance.'},
  proteus_smac:{name:'Proteus spp.',medium:'smac',colonyColor:'#F3DDE5',colonyShade:'#A56E7E',
    size:3.4,sizeVar:0.45,count:16,texture:'matte',haemolysis:null,
    features:['Pale','Usually non-sorbitol','Swarming inhibited'],
    description:'Proteus may appear pale or colourless on SMAC and swarming is inhibited by the bile salts/crystal violet system. It can therefore resemble non-sorbitol-fermenting E. coli at first glance; confirm by odour, urease/indole, MALDI or biochemical tests.'},

  // ─── CHOCOLATE AGAR ───
  haemophilus_choc:{name:'Haemophilus influenzae',medium:'choc',colonyColor:'#CFC9BC',colonyShade:'#81786A',
    size:2.2,sizeVar:0.22,count:46,texture:'smooth',haemolysis:null,
    features:['Small grey','Translucent','Requires X + V','CO₂ enhanced'],
    description:'Small, smooth, grey to translucent colonies on chocolate agar after incubation in CO₂. Heating releases X and V factors, allowing growth that is absent on ordinary blood agar. H. parainfluenzae may look similar but requires V factor only.'},
  ngon_choc:{name:'Neisseria gonorrhoeae',medium:'choc',colonyColor:'#DCD8CC',colonyShade:'#8F897B',
    size:1.6,sizeVar:0.2,count:42,texture:'smooth',haemolysis:null,
    features:['Tiny grey','Translucent','Oxidase +','Capnophilic'],
    description:'Tiny grey, translucent, convex colonies on chocolate agar in CO₂. Growth may be delicate and is easily lost if transport or incubation is suboptimal. Use appropriate selective gonococcal media where available and confirm with oxidase plus definitive identification.'},
  nmen_choc:{name:'Neisseria meningitidis',medium:'choc',colonyColor:'#E0DDD2',colonyShade:'#8D887A',
    size:2.8,sizeVar:0.22,count:30,texture:'smooth',haemolysis:null,
    features:['Grey','Moist','Oxidase +','Capnophilic'],
    description:'Smooth grey, moist colonies on chocolate agar, usually larger and more robust than N. gonorrhoeae. Oxidase positive Gram-negative diplococci from sterile sites require urgent escalation.'},
  moraxella_choc:{name:'Moraxella catarrhalis',medium:'choc',colonyColor:'#E8E0D2',colonyShade:'#9E907D',
    size:3.2,sizeVar:0.25,count:28,texture:'matte',haemolysis:null,
    features:['Opaque grey-white','Brittle','Hockey-puck colony','Oxidase +'],
    description:'Opaque grey-white colonies that are firmer/brittle and can be pushed intact across the plate — the classic hockey-puck sign. Oxidase positive, DNase positive and tributyrin/butyrate esterase positive.'},
  spneumo_choc:{name:'Streptococcus pneumoniae',medium:'choc',colonyColor:'#D0C7B5',colonyShade:'#7F7465',
    size:2.4,sizeVar:0.22,count:34,texture:'umbilicated',haemolysis:null,
    features:['Grey','Flattened/umbilicated','No visible α-haem on CHOC'],
    description:'Pneumococci grow as small grey colonies on chocolate agar, often becoming centrally depressed with age. The α-haemolysis clue is much less visible on chocolate than on blood agar, so compare with CBA when available and confirm with optochin/bile solubility.'}
};

const abxClasses = [
  {
    id:'penicillins',
    name:'Penicillins',
    family:'β-lactams',
    color:'#AFA9EC',
    target:'PBPs / cell wall synthesis',
    chemistry:'A four-membered β-lactam ring fused to a five-membered thiazolidine ring (penam nucleus). The strained β-lactam carbonyl is highly reactive: it acylates the active-site serine of penicillin-binding proteins (PBPs), mimicking the natural D-Ala–D-Ala substrate. Side-chain modifications at the 6-position tune spectrum, β-lactamase stability, and pharmacokinetics.',
    mechanism:'Acylate PBPs → block the transpeptidation step of peptidoglycan cross-linking → cell-wall instability and autolysin-mediated lysis. Bactericidal, time-dependent killing (T>MIC is the PK/PD driver).',
    spectrum:'Highly variable by subgroup — natural penicillins cover streptococci and oral anaerobes; aminopenicillins extend to some Enterobacterales and Enterococcus; antipseudomonals cover P. aeruginosa; the anti-staphylococcal sub-class is reserved for MSSA.',
    resistance:'Hydrolysis by β-lactamases (penicillinases, ESBLs, AmpC, carbapenemases); altered PBPs (PBP2a in MRSA via mecA/mecC; PBP-3 alterations in BLNAR H. influenzae); porin loss and efflux in Gram-negatives.',
    subgroups:[
      {label:'Natural', items:[
        {name:'Benzylpenicillin', aka:'Pen G', tip:'<strong>Benzylpenicillin (Penicillin G)</strong>The original natural penicillin. IV/IM only — acid-labile. <em>Spectrum:</em> S. pyogenes (uniformly S), S. pneumoniae (MIC-dependent), Neisseria meningitidis, T. pallidum, oral anaerobes, Pasteurella. <em>Resistance:</em> β-lactamases (most S. aureus).'},
        {name:'Phenoxymethylpenicillin', aka:'Pen V', tip:'<strong>Phenoxymethylpenicillin (Penicillin V)</strong>Acid-stable oral form. Same spectrum as Pen G but lower serum levels. Used for streptococcal pharyngitis, rheumatic-fever prophylaxis.'}
      ]},
      {label:'Aminopenicillins', items:[
        {name:'Ampicillin', tip:'<strong>Ampicillin</strong>Adds an amino group at the 6-position → extends spectrum to some Enterobacterales (E. coli, Proteus mirabilis, Salmonella) and Enterococcus faecalis. Hydrolysed by class-A β-lactamases (TEM-1) → high resistance in modern E. coli.'},
        {name:'Amoxicillin', tip:'<strong>Amoxicillin</strong>Oral aminopenicillin with better absorption than ampicillin. Identical microbiological spectrum. First-line for community streptococcal infections; not active against staphylococci unless paired with clavulanate.'},
        {name:'Amoxicillin/Clavulanic acid', aka:'Augmentin / AmoxClav', tip:'<strong>Amoxicillin + Clavulanate</strong>Clavulanate is a suicide β-lactamase inhibitor (irreversible acylation of the BLA active site). Restores activity against TEM/SHV producers, MSSA, anaerobes including Bacteroides. <em>Not</em> active against ESBLs, AmpC or carbapenemases.'}
      ]},
      {label:'Anti-staph (BL-stable)', items:[
        {name:'Flucloxacillin', tip:'<strong>Flucloxacillin</strong>Isoxazolyl penicillin. The bulky 6-side-chain sterically blocks staphylococcal penicillinase. <em>First-line for MSSA</em>; inactive against MRSA (PBP2a binds it poorly) and against Gram-negatives.'},
        {name:'Methicillin', tip:'<strong>Methicillin</strong>Historic — no longer in clinical use, but defines the MRSA/MSSA divide. Surrogate testing is now done with cefoxitin on Mueller-Hinton + 2% NaCl (MHE).'},
        {name:'Oxacillin', tip:'<strong>Oxacillin</strong>BL-stable penicillin used in MIC testing for staphylococci and S. pneumoniae (oxacillin disc screens penicillin susceptibility in pneumococcus).'}
      ]},
      {label:'Antipseudomonal', items:[
        {name:'Piperacillin/Tazobactam', aka:'Pip/Taz', tip:'<strong>Piperacillin + Tazobactam</strong>Ureidopenicillin with extended Gram-negative reach (incl. P. aeruginosa) + tazobactam BLI. Workhorse empirical agent for hospital infections. Inactive against most ESBLs at high inoculum; never reliable against carbapenemases.'},
        {name:'Ticarcillin/Clavulanic acid', aka:'Ticar/Clav', tip:'<strong>Ticarcillin + Clavulanate</strong>Older antipseudomonal carboxypenicillin + BLI combination. Limited use today — largely superseded by Pip/Taz; retains a niche for Stenotrophomonas maltophilia.'}
      ]},
      {label:'Other', items:[
        {name:'Mecillinam', aka:'pivmecillinam (oral)', tip:'<strong>Mecillinam</strong>An amidinopenicillin — preferentially binds PBP-2, causing spheroplast formation rather than filamentation. Oral pivmecillinam is a urinary-tract-specific aminopenicillin alternative; often retains activity against ESBL-E in uncomplicated cystitis.'},
        {name:'Temocillin', tip:'<strong>Temocillin</strong>6-α-methoxy substitution sterically blocks most β-lactamases including ESBLs and AmpC. Narrow Gram-negative-only spectrum (no Pseudomonas, no anaerobes). Used as a carbapenem-sparing agent in ESBL-E bacteraemia/UTI.'}
      ]}
    ]
  },
  {
    id:'cephalosporins',
    name:'Cephalosporins',
    family:'β-lactams',
    color:'#5DCAA5',
    target:'PBPs / cell wall synthesis',
    chemistry:'β-lactam ring fused to a six-membered dihydrothiazine ring (7-aminocephalosporanic acid / 7-ACA nucleus). Substituents at the 7-position determine spectrum and BLA stability; the 3-position side chain governs pharmacokinetics and intrinsic activity. The wider ring system is sterically less reactive than the penam, giving the class greater intrinsic β-lactamase stability.',
    mechanism:'Same as penicillins — acylate PBPs and block transpeptidation. Bactericidal, time-dependent killing.',
    spectrum:'Generational expansion: 1G ≈ Gram-positive cocci; 2G adds H. influenzae and some Enterobacterales; 3G adds wider Enterobacterales and (ceftazidime) Pseudomonas; 4G adds AmpC stability; 5G adds MRSA.',
    resistance:'ESBLs hydrolyse 3G/4G cephalosporins. AmpC hydrolyses cefoxitin and 3G but spares 4G. Carbapenemases hydrolyse all (except ceftazidime/avibactam covers KPC and OXA-48 but not MBLs).',
    subgroups:[
      {label:'1st gen', items:[
        {name:'Cephalexin', tip:'<strong>Cephalexin</strong>Oral 1G — narrow Gram-positive spectrum (MSSA, streptococci) plus E. coli, Proteus, Klebsiella. Common UTI / skin and soft tissue choice. Not active against Enterococcus (intrinsic).'},
        {name:'Cefazolin', tip:'<strong>Cefazolin</strong>IV 1G — primary surgical prophylaxis; first-line for MSSA bacteraemia/endocarditis when flucloxacillin is unsuitable.'}
      ]},
      {label:'2nd gen', items:[
        {name:'Cefuroxime', tip:'<strong>Cefuroxime</strong>True 2G — adds H. influenzae and Moraxella, more stable to staph penicillinase. IV and oral (cefuroxime axetil) forms available.'},
        {name:'Cefoxitin', tip:'<strong>Cefoxitin</strong>A <em>cephamycin</em> — 7-α-methoxy substituent confers stability against most ESBLs but <em>not</em> against AmpC. Two key bench uses: (1) AmpC screen in Enterobacterales (resistant = AmpC clue); (2) surrogate for MRSA detection on MHE (zone ≤21 mm = MRSA).'}
      ]},
      {label:'3rd gen', items:[
        {name:'Cefpodoxime', tip:'<strong>Cefpodoxime</strong>Oral 3G — used as the EUCAST ESBL screening disc on Enterobacterales. Resistance triggers the D-set workflow (D68/D63).'},
        {name:'Ceftriaxone', tip:'<strong>Ceftriaxone</strong>Long half-life 3G with excellent Enterobacterales activity, S. pneumoniae, N. meningitidis, N. gonorrhoeae. <em>Not</em> reliable for Pseudomonas.'},
        {name:'Cefotaxime', tip:'<strong>Cefotaxime</strong>3G similar to ceftriaxone but shorter half-life; preferred in neonates (no biliary sludging risk).'},
        {name:'Ceftazidime', tip:'<strong>Ceftazidime</strong>3G with anti-pseudomonal activity (high PBP-3 affinity in P. aeruginosa). Weak against Gram-positives. Hydrolysed by ESBLs and most AmpC.'}
      ]},
      {label:'4th gen', items:[
        {name:'Cefepime', tip:'<strong>Cefepime</strong>Zwitterionic 4G — rapid OmpF porin penetration, poor AmpC substrate (the bench rationale for the D63 cefepime/clavulanate ESBL confirmation). Anti-pseudomonal; reduced activity against ESBLs (varies with inoculum).'}
      ]},
      {label:'5th gen (anti-MRSA)', items:[
        {name:'Ceftaroline', tip:'<strong>Ceftaroline</strong>5G — binds PBP2a of MRSA (the only β-lactams that do, alongside ceftobiprole). Used in MRSA bacteraemia / pneumonia. Not anti-pseudomonal.'},
        {name:'Ceftobiprole', tip:'<strong>Ceftobiprole</strong>5G with both PBP2a affinity (MRSA) and some anti-pseudomonal activity. Newer in clinical use; availability varies by country.'}
      ]},
      {label:'+ BLI', items:[
        {name:'Ceftolozane/Tazobactam', aka:'Ceftol/Taz', tip:'<strong>Ceftolozane + Tazobactam</strong>Anti-pseudomonal cephalosporin paired with tazobactam BLI. Excellent against MDR P. aeruginosa (including porin/efflux mutants) and ESBL-E. <em>Not</em> active against carbapenemases.'},
        {name:'Ceftazidime/Avibactam', aka:'Caz/Avi', tip:'<strong>Ceftazidime + Avibactam</strong>Avibactam is a non-β-lactam diazabicyclooctane BLI — reversibly inhibits class A (incl. KPC), class C (AmpC), and class D (OXA-48). <em>Inactive</em> against class B MBLs (NDM/VIM/IMP).'}
      ]}
    ]
  },
  {
    id:'carbapenems',
    name:'Carbapenems',
    family:'β-lactams',
    color:'#F0997B',
    target:'PBPs (broader affinity than penicillins / cephalosporins)',
    chemistry:'β-lactam fused to a five-membered ring with an unsaturated carbapen-2-em backbone, replacing the penam sulfur with a methylene group. A <em>trans</em>-hydroxyethyl side chain at C-6 (rather than the typical cis-acyl) confers steric protection against most serine β-lactamases — the hallmark feature of the class.',
    mechanism:'Acylate multiple PBPs (1, 2, 3) with very high affinity → rapid bactericidal effect with no filamentation. Penetrate the OM via OmpD2 / OprD porins (Pseudomonas).',
    spectrum:'The broadest β-lactams in clinical use. Cover ESBL/AmpC Enterobacterales, anaerobes (incl. Bacteroides), and most Pseudomonas (except ertapenem). <em>Not</em> active against MRSA, VRE, Stenotrophomonas, or atypicals.',
    resistance:'Carbapenemases (KPC, NDM, VIM, IMP, OXA-48). Non-enzymatic — porin loss (OprD in Pseudomonas, OmpK35/36 in Klebsiella) combined with ESBL/AmpC hyperproduction can produce carbapenem resistance without a carbapenemase.',
    subgroups:[
      {label:'Carbapenems', items:[
        {name:'Meropenem', tip:'<strong>Meropenem</strong>Workhorse carbapenem — excellent CNS penetration, good Pseudomonas activity. The reference D73 disc for phenotypic carbapenemase typing (with/without EDTA, boronic acid, cloxacillin).'},
        {name:'Ertapenem', tip:'<strong>Ertapenem</strong>Long half-life, <em>no</em> Pseudomonas / Acinetobacter activity (poor OprD binding). Most sensitive carbapenem to porin-loss + ESBL/AmpC mechanisms — reduced ertapenem zone with normal meropenem zone is the classic AmpC + porin-loss clue.'},
        {name:'Imipenem/Cilastatin', tip:'<strong>Imipenem + Cilastatin</strong>The first carbapenem. Cilastatin inhibits renal dehydropeptidase-1 (DHP-1), preventing imipenem inactivation in the kidney. CNS pro-convulsant — meropenem preferred for meningitis.'},
        {name:'Doripenem', tip:'<strong>Doripenem</strong>Lower availability than meropenem in many countries; comparable spectrum.'}
      ]}
    ]
  },
  {
    id:'monobactams',
    name:'Monobactams',
    family:'β-lactams',
    color:'#85B7EB',
    target:'PBP-3 in Gram-negatives',
    chemistry:'A <em>monocyclic</em> β-lactam — no fused second ring. The sulfonate group on the nitrogen activates the β-lactam carbonyl. The unique geometry escapes recognition by metallo-β-lactamases (MBLs), but the molecule still binds Gram-positive PBPs poorly because of the lack of bulk at the 3-position.',
    mechanism:'Selective PBP-3 binding in aerobic Gram-negatives → filamentation and lysis.',
    spectrum:'Strict aerobic Gram-negative: Enterobacterales and Pseudomonas. No activity against Gram-positives, no activity against anaerobes.',
    resistance:'Hydrolysed by ESBLs and most AmpC. <em>Not</em> hydrolysed by class B MBLs — hence its use as a partner with avibactam (aztreonam/avibactam) against NDM/VIM Enterobacterales.',
    subgroups:[
      {label:'Monobactams', items:[
        {name:'Aztreonam', tip:'<strong>Aztreonam</strong>Only monobactam in clinical use. Useful for Gram-negative coverage in penicillin-allergic patients (minimal cross-allergy except with ceftazidime — they share the same side chain). Empirically combined with ceftazidime/avibactam to cover MBLs.'}
      ]}
    ]
  },
  {
    id:'siderophore',
    name:'Siderophore cephalosporins',
    family:'β-lactams',
    color:'#EF9F27',
    target:'PBP-3 (uptake via iron-transport receptors)',
    chemistry:'A cephalosporin (cefiderocol structurally resembles cefepime and ceftazidime hybrid) bearing a <em>catechol</em> moiety that chelates Fe³⁺. The drug–iron complex hijacks bacterial TonB-dependent siderophore receptors (PiuA, CirA, Fiu) on the Gram-negative outer membrane — the so-called "Trojan horse" uptake.',
    mechanism:'Active uptake bypasses porin-loss resistance. Once inside the periplasm, the cephalosporin acylates PBP-3 (and PBP-1a/1b). Stable to all four Ambler classes of β-lactamase (A, B, C, D) under most conditions.',
    spectrum:'Multi-drug-resistant aerobic Gram-negatives — including carbapenem-resistant Enterobacterales (all carbapenemase classes), MDR P. aeruginosa, Stenotrophomonas maltophilia, and CR-Acinetobacter baumannii. Often the last-resort agent (UR4 donker).',
    resistance:'Mutations in siderophore receptor genes; PBP-3 insertions in NDM-producing E. coli (YRIN/YRIK inserts); chromosomal AmpC variants in P. aeruginosa.',
    subgroups:[
      {label:'Siderophore', items:[
        {name:'Cefiderocol', tip:'<strong>Cefiderocol</strong>The only marketed siderophore cephalosporin. <em>Bench note:</em> EUCAST MIC testing requires <strong>iron-depleted CAMHB (CAMHB-ID)</strong> — standard CAMHB gives falsely low MICs (susceptible) because iron sufficiency masks siderophore-mediated uptake.'}
      ]}
    ]
  },
  {
    id:'glycopeptides',
    name:'Glycopeptides',
    family:'Cell-wall agents (non-β-lactam)',
    color:'#ED93B1',
    target:'D-Ala–D-Ala terminus of lipid II',
    chemistry:'Large, rigid heptapeptide scaffold decorated with sugars (vancomycin has a vancosamine-glucose disaccharide). Multiple hydrogen bonds with the terminal D-Ala–D-Ala dipeptide of the peptidoglycan pentapeptide sequester the substrate from PBPs and transglycosylases.',
    mechanism:'Bind D-Ala–D-Ala — sterically block both transpeptidation and transglycosylation. Slowly bactericidal against Gram-positives. Too large to cross the Gram-negative outer membrane (intrinsic Gram-negative resistance).',
    spectrum:'Gram-positives only — MRSA, MSSA, streptococci, Enterococcus (most), Clostridioides difficile (oral vancomycin), corynebacteria. Inactive against Gram-negatives, mycobacteria, atypicals.',
    resistance:'VRE: <em>van</em> operons (VanA/B/D/E/G) re-program the precursor to terminate in D-Ala–D-Lac (1000× reduced binding) or D-Ala–D-Ser (~7× reduced). VISA/hVISA: thickened cell wall sequesters drug in false binding sites.',
    subgroups:[
      {label:'Glycopeptides', items:[
        {name:'Vancomycin', aka:'Vanc', tip:'<strong>Vancomycin</strong>The reference glycopeptide. EUCAST uses MIC (not disc) for S. aureus deep infection and for Enterococcus to detect VISA/VRE. AUC/MIC ≥400 is the PK/PD target.'},
        {name:'Teicoplanin', aka:'Teico', tip:'<strong>Teicoplanin</strong>Larger fatty-acid–anchored glycopeptide. Once-daily dosing; less nephrotoxic than vancomycin. <em>Variable</em> activity against VanB VRE (some VanB strains are teicoplanin S, vancomycin R).'},
        {name:'Dalbavancin', tip:'<strong>Dalbavancin</strong>A <em>lipoglycopeptide</em> — semi-synthetic teicoplanin analog with a 14-day half-life. Single-dose treatment for ABSSSI. Active against MRSA, retains some activity against VanB VRE.'},
        {name:'Telavancin', tip:'<strong>Telavancin</strong>Lipoglycopeptide with dual mechanism: D-Ala–D-Ala binding + membrane depolarisation via the lipophilic decylaminoethyl tail.'}
      ]}
    ]
  },
  {
    id:'aminoglycosides',
    name:'Aminoglycosides',
    family:'Protein synthesis inhibitors',
    color:'#97C459',
    target:'30S ribosomal subunit (16S rRNA, A-site)',
    chemistry:'Polycationic aminocyclitol core (2-deoxystreptamine in most clinical agents) decorated with amino sugars. The polycationic nature explains both the rapid binding to the negatively charged outer membrane LPS and the renal tubular accumulation responsible for toxicity.',
    mechanism:'Bind the A-site of the 16S rRNA → misreading of mRNA codons → production of aberrant membrane proteins → outer-membrane disruption and rapid bactericidal effect. Concentration-dependent killing with a long post-antibiotic effect (PAE) — once-daily dosing rationale.',
    spectrum:'Aerobic Gram-negatives (Enterobacterales, Pseudomonas, Acinetobacter). Synergy with cell-wall agents against streptococci/enterococci (unless HLAR). No activity against anaerobes (oxygen-dependent uptake) or intracellular pathogens.',
    resistance:'Aminoglycoside-modifying enzymes (AMEs) — acetyltransferases (AAC), phosphotransferases (APH), nucleotidyltransferases (ANT). Substrate profiles differ — amikacin is the most stable. Ribosomal 16S methyltransferases (ArmA, RmtB) cause pan-aminoglycoside resistance.',
    subgroups:[
      {label:'Aminoglycosides', items:[
        {name:'Gentamicin', aka:'Gent', tip:'<strong>Gentamicin</strong>The reference aminoglycoside; ubiquitous on UTI / wound / blood panels. Synergy disc for HLAR screening in Enterococcus uses a high-content (30 µg) disc.'},
        {name:'Tobramycin', aka:'Tobra', tip:'<strong>Tobramycin</strong>Slightly higher activity against Pseudomonas than gentamicin. Inhaled formulation for CF airway colonisation.'},
        {name:'Amikacin', aka:'Ami', tip:'<strong>Amikacin</strong>Semi-synthetic — the L-HABA (L-hydroxyaminobutyryl) side chain blocks most AMEs. Reserved for MDR Gram-negatives and as a fall-back when other aminoglycosides are resistant.'},
        {name:'Streptomycin', tip:'<strong>Streptomycin</strong>Original aminoglycoside (1944). Used in TB regimens and for Enterococcus high-level synergy testing (1000 mg/L screen).'},
        {name:'Neomycin', tip:'<strong>Neomycin</strong>Topical / oral (bowel decontamination) only — not systemically absorbed; too toxic IV.'}
      ]}
    ]
  },
  {
    id:'fluoroquinolones',
    name:'Fluoroquinolones',
    family:'DNA synthesis inhibitors',
    color:'#7F77DD',
    target:'DNA gyrase (GyrA/B) and Topoisomerase IV (ParC/E)',
    chemistry:'Bicyclic quinolone or naphthyridone core with a fluorine at C-6 (the defining 1980s modification — boosted Gram-negative potency 10–100×) and a piperazinyl or pyrrolidinyl substituent at C-7 governing spectrum and PK.',
    mechanism:'Trap the topoisomerase–DNA cleavage complex → DNA double-strand breaks → bactericidal. Primary target in most Gram-negatives is DNA gyrase (gyrA); in Gram-positives it is topoisomerase IV (parC). Concentration-dependent killing.',
    spectrum:'Broad — Enterobacterales, Pseudomonas, atypicals (Legionella, Mycoplasma, Chlamydia), some Gram-positives (newer agents). Used to treat anthrax, plague, and TB (second-line).',
    resistance:'Target-site mutations in the quinolone-resistance-determining regions (QRDR) of gyrA / parC; plasmid-mediated qnr genes (low-level); efflux (e.g. AcrAB-TolC); aac(6′)-Ib-cr (an aminoglycoside acetyltransferase variant that <em>also</em> acetylates ciprofloxacin).',
    subgroups:[
      {label:'Quinolones (1st gen)', items:[
        {name:'Nalidixic acid', tip:'<strong>Nalidixic acid</strong>Original quinolone — no fluorine. Urinary tract only. Now mainly used as a phenotypic marker: nalidixic-R + ciprofloxacin-S signals an emerging gyrA mutation in Salmonella.'}
      ]},
      {label:'Fluoroquinolones', items:[
        {name:'Ciprofloxacin', aka:'Cipro', tip:'<strong>Ciprofloxacin</strong>The reference Gram-negative fluoroquinolone. Excellent Pseudomonas activity; modest Gram-positive activity (S. aureus, but resistance develops rapidly on monotherapy).'},
        {name:'Levofloxacin', aka:'Levo', tip:'<strong>Levofloxacin</strong>L-isomer of ofloxacin. "Respiratory fluoroquinolone" — enhanced S. pneumoniae activity. Better oral bioavailability than ciprofloxacin.'},
        {name:'Moxifloxacin', tip:'<strong>Moxifloxacin</strong>Methoxy at C-8 plus C-7 azabicyclo group → activity against anaerobes and good Gram-positive cover. Concerns over QT prolongation and hepatotoxicity have narrowed use.'},
        {name:'Norfloxacin', aka:'Norflox', tip:'<strong>Norfloxacin</strong>Topical / urinary-only fluoroquinolone with poor systemic levels. Common in topical donkers (PTOP/NTOP).'},
        {name:'Pefloxacin', aka:'Peflox', tip:'<strong>Pefloxacin</strong>Topical fluoroquinolone — bench surrogate for Salmonella ciprofloxacin susceptibility (more reproducible disc zones than cipro itself for low-level resistance).'}
      ]}
    ]
  },
  {
    id:'macrolides',
    name:'Macrolides',
    family:'Protein synthesis inhibitors (50S)',
    color:'#AFA9EC',
    target:'50S ribosomal subunit (23S rRNA, peptide exit tunnel)',
    chemistry:'Macrocyclic lactone ring (14-, 15-, or 16-membered) decorated with neutral and amino-sugars. The desosamine sugar contacts the A2058/A2059 nucleotides of 23S rRNA — the methylation target of erm methyltransferases that produces MLSb resistance.',
    mechanism:'Bind the nascent-peptide exit tunnel of the 50S subunit → premature peptide dissociation → bacteriostatic against most species, bactericidal at high concentration against streptococci.',
    spectrum:'Streptococci, atypicals (Mycoplasma, Chlamydia, Legionella), upper-airway H. influenzae (azithromycin), Bordetella pertussis, Helicobacter pylori (clarithromycin), Campylobacter.',
    resistance:'<em>erm</em> 23S rRNA methylation (constitutive or inducible MLSb — detected by D-zone test); <em>mef</em> efflux (lower-level, M phenotype); 23S rRNA mutations (Mycoplasma, Helicobacter).',
    subgroups:[
      {label:'Macrolides', items:[
        {name:'Erythromycin', aka:'Ery', tip:'<strong>Erythromycin</strong>The first macrolide (14-membered). Used in the D-zone test (placed 12–20 mm from a clindamycin disc) to detect inducible MLSb resistance in staphylococci and streptococci.'},
        {name:'Clarithromycin', tip:'<strong>Clarithromycin</strong>6-O-methyl erythromycin — better acid stability and PK. First-line for H. pylori eradication (with PPI + amoxicillin). Major CYP3A4 inhibitor.'},
        {name:'Azithromycin', tip:'<strong>Azithromycin</strong>15-membered azalide (nitrogen inserted in the macrolactone). Massive tissue accumulation → 5-day course covers 10-day exposure. Used in genital chlamydia, MAC, traveller\'s diarrhoea.'}
      ]}
    ]
  },
  {
    id:'lincosamides',
    name:'Lincosamides',
    family:'Protein synthesis inhibitors (50S)',
    color:'#F0997B',
    target:'50S ribosomal subunit (overlapping macrolide site)',
    chemistry:'An amino-acid (4-propyl-L-proline) linked via amide to a sulfur-containing octose. Not a macrolide — but binds at the overlapping A2058 site, hence the macrolide / lincosamide cross-resistance.',
    mechanism:'Blocks the peptidyl transferase reaction (P-site / A-site interface). Bacteriostatic generally; inhibits production of staphylococcal toxins (PVL, TSST-1) at sub-MIC — clinically relevant in necrotising fasciitis and toxic shock.',
    spectrum:'Gram-positive cocci (incl. some CA-MRSA), oral anaerobes, Bacteroides (variable). No reliable Gram-negative aerobic activity.',
    resistance:'Cross-resistance with macrolides via <em>erm</em>; inducible MLSb missed by routine disc testing — flagged only by the D-zone test.',
    subgroups:[
      {label:'Lincosamides', items:[
        {name:'Clindamycin', aka:'Clin', tip:'<strong>Clindamycin</strong>Excellent oral bioavailability, bone and abscess penetration. Suppresses toxin production. <em>Critical caveat:</em> never report S without checking the D-zone (erythromycin / clindamycin pairing) — inducible MLSb fails clindamycin therapy.'},
        {name:'Lincomycin', tip:'<strong>Lincomycin</strong>The parent natural product (clindamycin is its 7-chloro-deoxy derivative). Limited modern use.'}
      ]}
    ]
  },
  {
    id:'tetracyclines',
    name:'Tetracyclines &amp; glycylcyclines',
    family:'Protein synthesis inhibitors (30S)',
    color:'#EF9F27',
    target:'30S ribosomal subunit (A-site)',
    chemistry:'Four linearly-fused six-membered rings (naphthacene core) with multiple hydroxyl, methyl, and dimethylamino substituents. Glycylcyclines (tigecycline) add a bulky 9-tert-butylglycylamido side chain that blocks tet-efflux pumps and tet-ribosomal-protection proteins.',
    mechanism:'Reversibly bind the 30S A-site → block aminoacyl-tRNA entry → bacteriostatic. Tigecycline binds the same site with ~5× higher affinity than tetracycline and is unaffected by classical tet resistance.',
    spectrum:'Broad: Gram-positives (incl. MRSA for tigecycline), most Gram-negatives, atypicals (Mycoplasma, Chlamydia, Rickettsia, Borrelia), Stenotrophomonas (minocycline), anaerobes.',
    resistance:'Efflux (<em>tetA-E</em>); ribosomal protection proteins (<em>tetM, tetO</em>); enzymatic inactivation (<em>tetX</em> — broad oxygen-dependent oxidoreductase that can degrade tigecycline too).',
    subgroups:[
      {label:'Tetracyclines', items:[
        {name:'Tetracycline', aka:'Tet', tip:'<strong>Tetracycline</strong>The first-generation parent. Largely replaced clinically by doxycycline (better PK).'},
        {name:'Doxycycline', aka:'Doxy', tip:'<strong>Doxycycline</strong>Lipophilic, 18 h half-life, excellent oral bioavailability. First-line for CAP atypicals, Lyme, rickettsioses, MRSA SSTI.'},
        {name:'Minocycline', tip:'<strong>Minocycline</strong>Even more lipophilic than doxycycline — CNS penetration. Retained activity against Stenotrophomonas, Acinetobacter, and some tet-efflux mutants.'}
      ]},
      {label:'Glycylcyclines', items:[
        {name:'Tigecycline', aka:'Tig', tip:'<strong>Tigecycline</strong>9-tert-butylglycylamido derivative of minocycline. Active against MDR Enterobacterales (incl. carbapenemase producers), MRSA, VRE, Bacteroides. <em>Not</em> active against Pseudomonas or Proteus. Sub-therapeutic serum levels — avoid in primary bloodstream infection.'}
      ]}
    ]
  },
  {
    id:'folate',
    name:'Folate pathway inhibitors',
    family:'Antimetabolites',
    color:'#85B7EB',
    target:'DHPS (sulfonamides) &amp; DHFR (trimethoprim)',
    chemistry:'Sulfonamides — para-aminobenzenesulfonamide scaffolds that mimic <em>p</em>-aminobenzoic acid (pABA). Diaminopyrimidines (trimethoprim) mimic the pteridine portion of dihydrofolate. Sequential blockade of folate biosynthesis = synergistic bactericidal effect (the rationale for the co-trimoxazole combination).',
    mechanism:'Sulfonamides competitively inhibit dihydropteroate synthase (DHPS) → block tetrahydrofolate precursor. Trimethoprim inhibits dihydrofolate reductase (DHFR) → block THF regeneration → no thymidylate → no DNA replication.',
    spectrum:'Co-trimoxazole — broad activity against Enterobacterales (UTI workhorse), Stenotrophomonas (drug of choice), Pneumocystis jirovecii, Nocardia, Listeria, MRSA (some strains), MSSA.',
    resistance:'Sulfonamides: <em>sul1/2/3</em> plasmid-borne DHPS variants. Trimethoprim: <em>dfrA</em> alternative DHFR (over-expressed, low-affinity for TMP). Often co-located on integrons → joint resistance.',
    subgroups:[
      {label:'Sulfonamides', items:[
        {name:'Sulfamethoxazole', tip:'<strong>Sulfamethoxazole</strong>Sulfonamide partner of co-trimoxazole. Rarely used alone today. Half-life chosen to match trimethoprim for synergistic dosing.'}
      ]},
      {label:'Diaminopyrimidines', items:[
        {name:'Trimethoprim', aka:'Trim', tip:'<strong>Trimethoprim</strong>UK first-line oral UTI agent. Selectively inhibits bacterial DHFR (≈10⁵× more avid than human DHFR — hence the wide therapeutic window).'}
      ]},
      {label:'Combination', items:[
        {name:'Co-trimoxazole', aka:'TMP-SMX / Septrin', tip:'<strong>Co-trimoxazole (TMP/SMX 1:5)</strong>Sequential folate blockade → synergistic bactericidal effect. First-line for Pneumocystis (PCP) prophylaxis and treatment, and for Stenotrophomonas maltophilia infections.'}
      ]}
    ]
  },
  {
    id:'nitroheterocycles',
    name:'Nitroheterocycles',
    family:'Multi-target prodrugs',
    color:'#5DCAA5',
    target:'Multiple — DNA, ribosomes, pyruvate metabolism',
    chemistry:'Nitrofurans (5-nitrofuran ring) and nitroimidazoles (5-nitroimidazole ring). The nitro group is reduced intracellularly to highly reactive nitroso/hydroxylamino intermediates that alkylate macromolecules — non-specific damage to DNA, ribosomal proteins, and pyruvate metabolism.',
    mechanism:'Bacterial nitroreductases (e.g. <em>nfsA/B</em> in E. coli; ferredoxin-pyruvate-oxidoreductase pathway in anaerobes) convert the prodrug to cytotoxic intermediates that attack many targets simultaneously → resistance is rare and slow to evolve.',
    spectrum:'Nitrofurantoin: urinary-tract Enterobacterales, Enterococcus (mostly), Staphylococcus saprophyticus. Metronidazole: strict anaerobes + microaerophiles (H. pylori) + protozoa (Giardia, Trichomonas, Entamoeba).',
    resistance:'Rare — usually via nfsA + nfsB double mutants (nitrofurantoin) or rdxA / frxA loss (metronidazole in H. pylori).',
    subgroups:[
      {label:'Nitrofurans', items:[
        {name:'Nitrofurantoin', tip:'<strong>Nitrofurantoin</strong>Concentrates in urine — therapeutic levels achieved only in the bladder. Inactive against Proteus, Pseudomonas, Serratia, Morganella (intrinsic).'}
      ]},
      {label:'Nitroimidazoles', items:[
        {name:'Metronidazole', tip:'<strong>Metronidazole</strong>Activated by anaerobic ferredoxin chemistry — hence no aerobic activity. First-line for C. difficile (mild), bacterial vaginosis, intra-abdominal anaerobes, and oral protozoal infections.'}
      ]}
    ]
  },
  {
    id:'phosphonics',
    name:'Phosphonics',
    family:'Cell-wall agents',
    color:'#97C459',
    target:'MurA enzyme (peptidoglycan biosynthesis step 1)',
    chemistry:'A small phosphonic acid epoxide (cis-1,2-epoxypropyl phosphonic acid). The smallest antibiotic in clinical use by molecular weight.',
    mechanism:'Mimics phosphoenolpyruvate (PEP) → irreversibly alkylates the active-site cysteine of UDP-GlcNAc-3-enolpyruvyl transferase (<em>MurA</em>), the first committed step of peptidoglycan synthesis. Bactericidal. Cellular uptake via the GlpT (glycerol-3-phosphate) and UhpT (hexose-phosphate) transporters.',
    spectrum:'Broad — Enterobacterales (including ESBL-E and many CRE), Pseudomonas (variable), Enterococcus, S. aureus. Concentrates in urine → primary use is uncomplicated lower UTI as a single 3 g oral sachet.',
    resistance:'Almost always via mutations in <em>glpT / uhpT</em> transporters that prevent drug uptake; rarely via <em>murA</em> target-site mutations or <em>fosA</em> glutathione transferases (intrinsic in K. pneumoniae).',
    subgroups:[
      {label:'Phosphonics', items:[
        {name:'Fosfomycin', aka:'Fos', tip:'<strong>Fosfomycin</strong>EUCAST recommends MIC (not disc) for systemic use because uptake-mutant resistance gives discordant zone diameters. Single-dose oral cure rates ≥85 % in uncomplicated cystitis.'}
      ]}
    ]
  },
  {
    id:'oxazolidinones',
    name:'Oxazolidinones',
    family:'Protein synthesis inhibitors (50S)',
    color:'#ED93B1',
    target:'50S ribosomal subunit (P-site, 23S rRNA)',
    chemistry:'A five-membered oxazolidinone ring bearing a fluorophenyl and acetamidomethyl substituent (linezolid). Tedizolid replaces the morpholine of linezolid with a pyridinyl-tetrazole for improved potency and reduced myelosuppression.',
    mechanism:'Bind the 23S rRNA at the P-site → prevent formation of the 70S initiation complex (no fMet-tRNA accommodation). The earliest possible block in translation — entirely unique mechanism, hence no cross-resistance with other ribosomal agents.',
    spectrum:'Gram-positives only — MRSA, VRE (incl. VanA), penicillin-resistant pneumococcus, Mycobacterium tuberculosis (XDR-TB regimens). No Gram-negative activity (efflux).',
    resistance:'<em>23S rRNA G2576T</em> mutations (require multiple rRNA-gene copies to mutate — slow); <em>cfr</em> methyltransferase (also confers phenicol / lincosamide / streptogramin A resistance — PhLOPSA phenotype); <em>optrA</em> ABC-F transporter.',
    subgroups:[
      {label:'Oxazolidinones', items:[
        {name:'Linezolid', tip:'<strong>Linezolid</strong>Oral bioavailability 100 % — IV : PO 1:1 conversion. Reversible MAO inhibition (serotonin-syndrome risk with SSRIs). Myelosuppression after ~2 weeks.'},
        {name:'Tedizolid', tip:'<strong>Tedizolid</strong>Once-daily oxazolidinone. Lower haematological toxicity than linezolid. Active against some <em>cfr</em>-positive strains.'}
      ]}
    ]
  },
  {
    id:'lipopeptides',
    name:'Lipopeptides',
    family:'Membrane-active agents',
    color:'#7F77DD',
    target:'Bacterial cell membrane (Ca²⁺-dependent insertion)',
    chemistry:'Cyclic 13-amino-acid lipopeptide with an N-terminal decanoyl tail (daptomycin). The lipid tail anchors the molecule into the cytoplasmic membrane in the presence of Ca²⁺.',
    mechanism:'Ca²⁺-dependent oligomerisation in the membrane → membrane depolarisation, K⁺ efflux, arrest of macromolecular synthesis → bactericidal. Concentration-dependent killing.',
    spectrum:'Gram-positives only — MRSA, MSSA bacteraemia / endocarditis, VRE, streptococci, corynebacteria. Outer membrane prevents Gram-negative access.',
    resistance:'<em>mprF</em> mutations alter membrane phosphatidylglycerol charge (lysinylation) → electrostatic repulsion of the Ca²⁺-daptomycin complex; <em>yyc/walKR</em> two-component system mutations.',
    subgroups:[
      {label:'Lipopeptides', items:[
        {name:'Daptomycin', aka:'Dapto', tip:'<strong>Daptomycin</strong><em>Inactivated by pulmonary surfactant</em> — never report S for pneumonia. High-dose (≥8 mg/kg) for deep-seated infection and to prevent on-treatment resistance.'}
      ]}
    ]
  },
  {
    id:'polymyxins',
    name:'Polymyxins',
    family:'Membrane-active agents',
    color:'#EF9F27',
    target:'Lipid A of Gram-negative LPS',
    chemistry:'Cyclic decapeptides with a tripeptide side chain ending in a fatty acyl group (6-methyloctanoyl in polymyxin B; 6-methylheptanoyl in polymyxin E / colistin). Five diaminobutyric acid (Dab) residues carry positive charges that electrostatically bind the negatively charged phosphate groups of lipid A.',
    mechanism:'Bind LPS → displace divalent cations stabilising the outer membrane → permeabilise the OM (self-promoted uptake) → reach the inner membrane and depolarise it. Bactericidal, rapid.',
    spectrum:'Aerobic Gram-negatives only — Enterobacterales (excl. intrinsically resistant Proteus / Serratia / Morganella / Providencia, all of which modify lipid A), Pseudomonas, Acinetobacter. Last-line for many MDR/XDR Gram-negative infections.',
    resistance:'Intrinsic in Proteus, Serratia, Providencia (lipid A modifications). Acquired via <em>mcr-1</em> phosphoethanolamine transferase (plasmid-borne, global concern); chromosomal <em>pmrA/B</em> and <em>phoP/Q</em> regulatory mutations that add positive charges to lipid A.',
    subgroups:[
      {label:'Polymyxins', items:[
        {name:'Colistin', aka:'Polymyxin E', tip:'<strong>Colistin (polymyxin E)</strong>Administered as the inactive prodrug colistimethate (CMS). EUCAST mandates <em>broth microdilution only</em> for MIC — discs and gradient strips give unreliable results.'},
        {name:'Polymyxin B', tip:'<strong>Polymyxin B</strong>Administered as the active drug directly (no prodrug step). Less nephrotoxic than colistin in some studies. Used in CRAB infections.'}
      ]}
    ]
  },
  {
    id:'ansamycins',
    name:'Ansamycins (rifamycins)',
    family:'Transcription inhibitors',
    color:'#AFA9EC',
    target:'Bacterial DNA-dependent RNA polymerase (β-subunit, <em>rpoB</em>)',
    chemistry:'A naphthoquinone or naphthohydroquinone core bridged by a long aliphatic ("ansa") bridge — hence "ansamycin". The bridge clamps the molecule into the RNA-exit channel of RNA polymerase.',
    mechanism:'Bind a pocket in the β-subunit of RNA polymerase ~12 Å from the active site → sterically block elongation of nascent mRNA beyond ~3 nt. Bactericidal. Excellent intracellular and biofilm penetration.',
    spectrum:'Mycobacteria (TB, leprosy, MAC), staphylococci (combination therapy only — high monotherapy resistance rate), Legionella, biofilm-associated infections, prosthetic joint infections.',
    resistance:'<em>rpoB</em> point mutations within the rifampicin-resistance-determining region (RRDR codons 507–533) develop in single step at frequency ≈10⁻⁸ — hence the absolute rule never to use rifampicin as monotherapy in active infection.',
    subgroups:[
      {label:'Rifamycins', items:[
        {name:'Rifampicin', aka:'Rifampin / Rif', tip:'<strong>Rifampicin</strong>Cornerstone of TB therapy. Major CYP3A4 inducer — multiple drug interactions. Stains body fluids orange. Used for prosthetic-joint / endocarditis adjunct therapy in staphylococci.'},
        {name:'Rifabutin', tip:'<strong>Rifabutin</strong>Less CYP3A4 induction than rifampicin → used for TB in HIV patients on protease inhibitors. MAC prophylaxis/treatment.'},
        {name:'Rifaximin', tip:'<strong>Rifaximin</strong>Non-absorbed oral rifamycin — used for hepatic encephalopathy, traveller\'s diarrhoea, IBS-D. No systemic activity.'}
      ]}
    ]
  },
  {
    id:'amphenicols',
    name:'Amphenicols',
    family:'Protein synthesis inhibitors (50S)',
    color:'#85B7EB',
    target:'50S ribosomal subunit (peptidyl transferase centre)',
    chemistry:'A simple dichloroacetamido-propanediol with a para-nitrobenzene ring. One of the few naturally occurring nitro-aromatic antibiotics.',
    mechanism:'Bind the A-site of the 50S subunit → inhibit peptidyl transferase (the chemistry of peptide bond formation). Bacteriostatic. Crosses the BBB freely — historic use in meningitis.',
    spectrum:'Broad — Gram-positives, Gram-negatives, anaerobes, rickettsiae. Use is restricted by aplastic anaemia risk (idiosyncratic, 1:25 000–40 000); topical ophthalmic use is the most common modern indication.',
    resistance:'Chloramphenicol acetyltransferases (<em>cat</em>) — abundant on integrons/plasmids; efflux (<em>cmlA/floR</em>); ribosomal methylation (<em>cfr</em>, shared with oxazolidinones — PhLOPSA).',
    subgroups:[
      {label:'Amphenicols', items:[
        {name:'Chloramphenicol', aka:'Chlor', tip:'<strong>Chloramphenicol</strong>Topical ophthalmic first-line in many countries. Systemic use restricted to specific severe infections (rickettsiosis, plague) where alternatives are unavailable.'},
        {name:'Florfenicol', tip:'<strong>Florfenicol</strong>Veterinary fluorinated derivative — escapes <em>cat</em>-mediated resistance because the C-3 hydroxyl is replaced by fluorine. Not in human use.'}
      ]}
    ]
  },
  {
    id:'fusidanes',
    name:'Fusidanes (steroidal)',
    family:'Protein synthesis inhibitors',
    color:'#5DCAA5',
    target:'Elongation factor G (EF-G) on the 70S ribosome',
    chemistry:'Tetracyclic triterpenoid — a steroid-like fused-ring fungal metabolite. Highly lipophilic.',
    mechanism:'Stabilises the EF-G–GDP complex on the ribosome <em>after</em> translocation → prevents EF-G release → ribosomal stalling. Bacteriostatic.',
    spectrum:'Narrow — staphylococci (incl. MRSA), corynebacteria, some streptococci. Excellent skin / bone / abscess penetration.',
    resistance:'Develops rapidly on monotherapy via <em>fusA</em> EF-G mutations or <em>fusB/C</em> protective proteins — always paired (e.g. with rifampicin) for systemic staphylococcal infection.',
    subgroups:[
      {label:'Fusidanes', items:[
        {name:'Fusidic acid', aka:'Fucidin', tip:'<strong>Fusidic acid</strong>Common topical agent for impetigo / minor SSTI. Systemic use only in combination. UK has been a global hotspot for community fusidic-acid-resistant MSSA driven by topical overuse.'}
      ]}
    ]
  },
  {
    id:'pseudomonics',
    name:'Pseudomonic acids',
    family:'Protein synthesis inhibitors (aa-tRNA)',
    color:'#ED93B1',
    target:'Bacterial isoleucyl-tRNA synthetase (IleRS)',
    chemistry:'A monic acid (a complex polyketide-like α-acidic side chain) esterified to 9-hydroxynonanoic acid. Mimics isoleucyl-adenylate, the natural substrate of IleRS.',
    mechanism:'Competitively inhibits IleRS → prevents charging of tRNA<sup>Ile</sup> → halts protein synthesis (no Ile incorporation possible). Bacteriostatic at low concentration, bactericidal at high topical concentration.',
    spectrum:'Topical only — staphylococci and streptococci. Used for nasal MRSA decolonisation and impetigo.',
    resistance:'<em>mupA</em> — a plasmid-borne alternative IleRS with low affinity for mupirocin → high-level resistance (MIC > 256 mg/L). Renders decolonisation regimens ineffective; surveillance recommended.',
    subgroups:[
      {label:'Pseudomonic acids', items:[
        {name:'Mupirocin', tip:'<strong>Mupirocin</strong>Topical only — rapidly metabolised systemically. The nasal 2 % ointment is the EUCAST-validated decolonisation agent for MRSA carriers.'}
      ]}
    ]
  }
];

const routineSets = [
  {section:'Urine sensitivities', sets:[
    {name:'Urine GP', codes:['URINE_GP'], antibiotics:['Ampicillin 10','Augmentin 30','Cefpodoxime 10','Nitrofurantoin 100','Cephalexin 30','Trimethoprim 5']},
    {name:'Urine IN', codes:['URINE_IN'], antibiotics:['Mecillinam 10','Augmentin 30','Cefpodoxime 10','Gentamicin 10','Nitrofurantoin 100','Trimethoprim 5']},
    {name:'Urine UR1 GP', codes:['URINE_UR1_GP'], antibiotics:['Ciprofloxacin 5','Gentamicin 10','Ertapenem 10','Fosfomycin 200','Temocillin 30','Mecillinam 10']},
    {name:'Urine UR1 IN', codes:['URINE_UR1_IN'], antibiotics:['Ciprofloxacin 5','Ampicillin 10','Temocillin 30','Ertapenem 10','Fosfomycin 200','Tazocin 36']},
    {name:'Urine UR2', codes:['URINE_UR2'], antibiotics:['Meropenem 10','Cefepime 30','Amikacin 30','Ceftolozane-tazobactam 40','Ceftazidime 10','Ceftazidime-avibactam 14']},
    {name:'Urine Pseudo', codes:['URINE_PSE1'], antibiotics:['Ciprofloxacin 5','Ceftazidime 10','Cefepime 30','Tobramycin 10','Tazocin 36','Meropenem 10']},
    {name:'Urine Pseudo Extras', codes:['URINE_PSE2'], antibiotics:['Amikacin 30','Ceftolozane-tazobactam 40']},
    {name:'Urine Staph', codes:['URINE_SAU','URINE_CNS'], antibiotics:['Ampicillin 2','Nitrofurantoin 100','Norfloxacin 10','Trimethoprim 5','Novobiocin 5']},
    {name:'Urine Strep', codes:['URINE_STREP','URINE_STREP_BHSB'], antibiotics:['Penicillin 1','Ampicillin 2','Levofloxacin 5','Nitrofurantoin 100','Teicoplanin 30','Vancomycin 5']},
    {name:'Urine ESP 1', codes:['URINE_ESP1'], antibiotics:['Ampicillin 2','Levofloxacin 5','Nitrofurantoin 100']},
    {name:'Urine ESP 2', codes:['URINE_ESP2'], antibiotics:['Vancomycin 5 (24 HR)']},
    {name:'Urine ESP Extras', codes:['URINE_ESP3'], antibiotics:['Gentamicin 30','Linezolid 10','Tigecycline 15']},
    {name:'Urine UR3 (QC)', codes:['URINE_UR3_QC'], antibiotics:['Augmentin 30','Tazocin 36','Ceftolozane-tazobactam 40','Ticarcillin-clavulanate 85']},
    {name:'Urine UR4', codes:['URINE_UR4'], antibiotics:['Cefiderocol 30']}
  ]},
  {section:'Wound sensitivities — routine sets', sets:[
    {name:'Acinetobacter', codes:['EU_ACI'], antibiotics:['Ciprofloxacin 5','Gentamicin 10','Meropenem 10','Septrin 25']},
    {name:'Aeromonas', codes:['EU_AERO'], antibiotics:['Aztreonam 30','Ceftazidime 10','Ciprofloxacin 5','Cefepime 30','Levofloxacin 5','Septrin 25']},
    {name:'Coli 1', codes:['EU_COLI1'], antibiotics:['Ampicillin 10','Augmentin 30','Cefpodoxime 10','Ciprofloxacin 5','Gentamicin 10','Tazocin 36']},
    {name:'Coli 2', codes:['EU_COLI2'], antibiotics:['Ceftriaxone 30','Ertapenem 10','Cefoxitin 30','Meropenem 10','Septrin 25','Temocillin 30']},
    {name:'Coli 3', codes:['EU_COLI3'], antibiotics:['Amikacin 30','Aztreonam 30','Ceftolozane-Tazobactam 40','Fosfomycin 200','Tigecycline 15']},
    {name:'Enterococcus 1', codes:['EU_ESP'], antibiotics:['Ampicillin 2','Gentamicin 30','Linezolid 10','Tigecycline 15']},
    {name:'Enterococcus 2', codes:['EU_ESP2'], antibiotics:['Teicoplanin 30','Vancomycin 5']},
    {name:'GPB 1', codes:['EU_GPB1'], antibiotics:['Ciprofloxacin 5','Clindamycin 2','Penicillin 1','Vancomycin 5']},
    {name:'GPB 2', codes:['EU_GPB2'], antibiotics:['Linezolid 10','Rifampicin 5','Tetracycline 30']},
    {name:'Haem 1', codes:['EU_HAEM1'], antibiotics:['Augmentin 3','Ciprofloxacin 5','Cefuroxime 30','Levofloxacin 5']},
    {name:'Haem 2', codes:['EU_HAEM2'], antibiotics:['Benzylpenicillin 1','Septrin 25','Tetracycline 30']},
    {name:'Kingella', codes:['EU_KIN'], antibiotics:['Ciprofloxacin 5','Cefotaxime 5','Meropenem 10','Benzylpenicillin 1','Rifampicin 5','Septrin 25']},
    {name:'Listeria', codes:['EU_LIS'], antibiotics:['Ampicillin 2','Erythromycin 15','Meropenem 10','Penicillin 1','Septrin 25']},
    {name:'Moraxella', codes:['EU_MOR'], antibiotics:['Augmentin 3','Ciprofloxacin 5','Cefuroxime 30','Levofloxacin 5','Septrin 25','Tetracycline 30']},
    {name:'Pasteurella', codes:['EU_PAS'], antibiotics:['Augmentin 3','Ciprofloxacin 5','Cefotaxime 5','Nalidixic Acid 30','Penicillin 1','Tetracycline 30']},
    {name:'Pneumo', codes:['EU_PNEUMO1'], antibiotics:['Chloramphenicol 30','Clindamycin 2','Erythromycin 15','Levofloxacin 5','Oxacillin 1','Tetracycline 30']},
    {name:'Pneumo Extras', codes:['EU_PNEUMO2'], antibiotics:['Linezolid 10','Rifampicin 5','Teicoplanin 30','Vancomycin 5']},
    {name:'Pseudo', codes:['EU_PSE1'], antibiotics:['Ceftazidime 10','Ciprofloxacin 5','Ceftolozane-Tazobactam 40','Meropenem 10','Tobramycin 10','Tazocin 36']},
    {name:'Pseudo Extras', codes:['EU_PSE2'], antibiotics:['Amikacin 30','Aztreonam 30','Cefepime 30','Ticarcillin-Clavulanic Acid 85']},
    {name:'Staph', codes:['EU_SAU1','EU_CNS1'], antibiotics:['Clindamycin 2','Erythromycin 15','Fucidin 10','Rifampicin 5','Tetracycline 30','Trimethoprim 5']},
    {name:'Staph Extras', codes:['EU_SAU2','EU_CNS2'], antibiotics:['Gentamicin 10','Linezolid 10','Mupirocin 200','Norfloxacin 10','Septrin 25','Tigecycline 15']},
    {name:'Staph Fox', codes:['EU_SAUFOX','EU_CNSFOX'], antibiotics:['Cefoxitin 30']},
    {name:'MRSA Mup', codes:['EU_MUP'], antibiotics:['Mupirocin 200']},
    {name:'Stenotrophomonas', codes:['EU_STENO'], antibiotics:['Septrin 25']},
    {name:'Strep', codes:['EU_BHS','EU_AHS'], antibiotics:['Clindamycin 2','Erythromycin 15','Penicillin 1','Teicoplanin 30','Tetracycline 30','Vancomycin 5']}
  ]},
  {section:'Wound sensitivities — ear/eye sets', sets:[
    {name:'Gram positive ear/eye PTOP', codes:['EAR_SAU','EYE_SAU','EYE_BHS','EYE_PNEUMO'], antibiotics:['Chloramphenicol 30','Fucidin 10','Gentamicin 10','Norfloxacin 10']},
    {name:'Gram negative ear/eye NTOP', codes:['EAR_PSE','EYE_PSE','EAR_COLI','EYE_COLI','EYE_HAEM','EYE_MOR'], antibiotics:['Chloramphenicol 30','Ciprofloxacin 5','Gentamicin 10','Nalidixic Acid 30','Pefloxacin 5','Tobramycin 10']},
    {name:'Eye Extras', codes:['EU_EYE_EXT'], antibiotics:['Amikacin 30','Ceftazidime 10','Clarithromycin MIC','Vancomycin MIC']}
  ]}
];

const rareSets = [
  ['Acinetobacter',    [['CIP5','Coli 1'],['CN10','Coli 1'],['MEM10','Coli 2'],['SXT25','Coli 2']]],
  ['Aeromonas',        [['ATM30','Pseudo 2'],['CAZ10','Pseudo 1'],['CIP5','Haem 1'],['FEP30','Pseudo 2'],['LEV5','Haem 1'],['SXT25','Haem 2']]],
  ['GPB 2',            [['LZD10','Staph 2'],['RD5','Staph 1'],['TE30','Staph 1']]],
  ['Kingella',         [['CIP5','Coli 1'],['CTX5','Cold Room / Pot'],['MEM10','Coli 2'],['P1','Strep'],['RD5','Staph 1'],['SXT25','Coli 2']]],
  ['Listeria',         [['AMP2','ESP 1'],['E15','Strep'],['MEM10','Coli 2'],['P1','Strep'],['SXT25','Coli 2']]],
  ['Pasteurella',      [['AMC3','Haem 1'],['CIP5','Haem 1'],['CTX5','Cold Room / Pot'],['NA30','NTOP'],['P1','Haem 2'],['TE30','Haem 2']]],
  ['Pneumo 2',         [['LZD10','Staph 2'],['RD5','Staph 1'],['TEC30','Strep'],['VAN5','Strep']]],
  ['Stenotrophomonas', [['SXT25','Pot / Coli 2 / Staph 2']]],
  ['Eye Extra',        [['AK30','Pseudo 2'],['CAZ10','Pseudo 1']]],
  ['CSF Haem',         [['AMP2','ESP 1'],['C30','Pneumo 1'],['CIP5','Haem 1'],['CRO30','Coli 2'],['CXM30','Haem 1'],['SXT25','Haem 2']]],
  ['UR3 QC',           [['AMP2','ESP 1'],['TZP36','Coli 1'],['C/T40','Pseudo 1'],['TIM85','Pot']]]
];

const anaerobeMICs = ['Augmentin','Clindamycin','Meropenem','Metronidazole','Penicillin G','Piperacillin/Tazobactam'];

const qcOrganisms = [
  {name:'E. coli',       strain:'25922',              plates:['CBA','CLED'],  bcName:'E.coli', bcStrain:'25922'},
  {name:'S. aureus',     strain:'29213',              plates:['CBA','CNA'],   bcName:'S.aure', bcStrain:'29213'},
  {name:'E. faecalis',   strain:'29212',              plates:['CBA','CNA'],   bcName:'E.faec', bcStrain:'29212'},
  {name:'P. aeruginosa', strain:'27853 / NCTC 12903', plates:['CBA','CLED'],  bcName:'P.aeru', bcStrain:'27853'},
  {name:'H. influenzae', strain:'49247',              plates:['Choc','BACH'], bcName:'H.infl', bcStrain:'49247'},
  {name:'H. influenzae', strain:'49766',              plates:['Choc','BACH'], bcName:'H.infl', bcStrain:'49766'},
  {name:'MRSA',          strain:'12493',              plates:['CBA','MRSA'],  bcName:'MRSA',   bcStrain:'12493'},
  {name:'VRE',           strain:'51299',              plates:['CBA'],         bcName:'VRE',    bcStrain:'51299'},
  {name:'K. pneumoniae', strain:'700603',             plates:['CBA'],         bcName:'K.pneu', bcStrain:'700603'},
  {name:'ESBL E. coli',  strain:'35218',              plates:['CBA'],         bcName:'ESBL',   bcStrain:'35218'},
  {name:'S. pneumoniae', strain:'49619',              plates:['CBA','CNA'],   bcName:'S.pneu', bcStrain:'49619'}
];



const gramPatterns = [
  {id:'gpc_clusters',name:'GPC in clusters',gram:'pos',form:'coccus',arr:'clusters',description:'Round Gram-positive cocci (~1 µm) in irregular grape-like clusters, reflecting division in several planes. Catalase separates these staphylococci (positive) from streptococci (negative).',organisms:['Staphylococcus aureus','Coagulase-negative staphylococci','Micrococcus'],clues:['Catalase +','Clusters typical from solid media','S. aureus: latex / DNase / coagulase']},
  {id:'gpc_chains',name:'GPC in chains',gram:'pos',form:'coccus',arr:'chains',description:'Gram-positive cocci dividing in one plane to form pairs and chains; usually catalase-negative. Chain length and blood-agar haemolysis guide the next steps.',organisms:['Streptococcus (β-haemolytic groups)','Streptococcus anginosus group','Enterococcus'],clues:['Catalase −','Longer chains in broth','Haemolysis + Lancefield / PYR']},
  {id:'gpc_pairs',name:'GPC in pairs — lancet diplococci',gram:'pos',form:'lancet',arr:'pairs',description:'Lanceolate Gram-positive cocci in pairs, often capsulate — the classic pneumococcal picture. Confirm with optochin susceptibility and bile solubility.',organisms:['Streptococcus pneumoniae'],clues:['Lancet-shaped pairs','α-haemolysis, draughtsman colony','Optochin S / bile soluble']},
  {id:'gpc_tetrads',name:'GPC in tetrads',gram:'pos',form:'coccus',arr:'tetrads',description:'Gram-positive cocci dividing in two planes to give packets of four (tetrads); usually environmental or low-virulence organisms.',organisms:['Micrococcus','Aerococcus','Staphylococcus (occasionally)'],clues:['Tetrad packets','Catalase variable','Aerococcus: α-haemolytic, PYR/LAP pattern']},
  {id:'gndc',name:'Gram-negative diplococci',gram:'neg',form:'kidney',arr:'pairs',description:'Gram-negative cocci in pairs with adjacent sides flattened (kidney / coffee-bean), often intracellular within neutrophils in genital or CSF films.',organisms:['Neisseria gonorrhoeae','Neisseria meningitidis','Moraxella catarrhalis'],clues:['Kidney-bean pairs','Oxidase +','Intracellular in urethral / CSF films']},
  {id:'gnr_enteric',name:'Gram-negative bacilli',gram:'neg',form:'rod',arr:'single',description:'Straight Gram-negative rods of medium length — the everyday appearance of the Enterobacterales and related GNRs. Oxidase plus lactose/chromogenic reactions drive ID.',organisms:['Escherichia coli','Klebsiella','Proteus','Pseudomonas (oxidase +)'],clues:['Oxidase splits fermenters / non-fermenters','MacConkey / chromogenic agar','Usually abundant discrete rods']},
  {id:'gncb',name:'Gram-negative coccobacilli',gram:'neg',form:'coccobacillus',arr:'single',description:'Short, plump Gram-negative rods bordering on cocci, often faintly staining and pleomorphic. Frequently fastidious — set up chocolate agar in CO2.',organisms:['Haemophilus influenzae','Acinetobacter','Bordetella','Brucella (HG3 — caution)'],clues:['Faint, pleomorphic','Haemophilus: X / V factors','Acinetobacter oxidase −']},
  {id:'gnr_curved',name:'Curved Gram-negative bacilli',gram:'neg',form:'curved',arr:'single',description:'Curved or comma-shaped Gram-negative rods; paired cells form S or seagull shapes. Suspect on faeces (Campylobacter) or with marine / shellfish exposure (Vibrio).',organisms:['Campylobacter jejuni','Vibrio','Helicobacter'],clues:['Seagull / S-forms','Campylobacter: 42°C microaerophilic','Vibrio: oxidase +, TCBS']},
  {id:'gpb_large',name:'Large Gram-positive bacilli',gram:'pos',form:'bigrod',arr:'chains',description:'Large, square-ended (boxcar) Gram-positive rods, sometimes in chains, often with an unstained central or terminal spore. Aerobic Bacillus versus anaerobic Clostridium.',organisms:['Bacillus','Clostridium','Clostridioides difficile'],clues:['Boxcar rods ± spores','Aerobic vs anaerobic growth','Bacillus: catalase +']},
  {id:'gpb_small',name:'Small Gram-positive bacilli (diphtheroids)',gram:'pos',form:'smallrod',arr:'palisade',description:'Short Gram-positive rods arranged in palisades and V / L shapes (Chinese-letter pattern). Many are skin or throat commensals — weigh significance against the site.',organisms:['Corynebacterium','Listeria monocytogenes','Lactobacillus'],clues:['Palisades / Chinese letters','Listeria: tumbling motility, β-haemolysis','Often contaminant unless a sterile site']},
  {id:'gpb_branching',name:'Branching Gram-positive filaments',gram:'pos',form:'branch',arr:'single',description:'Thin, beaded, branching Gram-positive filaments that may fragment into rods and cocci. Modified acid-fast staining and growth conditions separate the genera.',organisms:['Actinomyces','Nocardia (partially acid-fast)'],clues:['Beaded branching filaments','Nocardia: aerobic, modified ZN +','Actinomyces: anaerobic, sulphur granules']},
  {id:'yeast',name:'Yeast cells ± pseudohyphae',gram:'pos',form:'yeast',arr:'single',description:'Large ovoid Gram-positive (purple) budding yeast cells, sometimes with pseudohyphae. Seen in candidiasis and from blood / line tips — correlate with culture and germ tube.',organisms:['Candida albicans','other Candida','Cryptococcus (capsule)'],clues:['Budding cells 4–10 µm','Pseudohyphae on Dalmau plate','Germ tube / MALDI to species']},
  {id:'gram_variable',name:'Gram-variable pleomorphic — clue cells',gram:'variable',form:'coccobacillus',arr:'cluecell',description:'Mixed, pleomorphic Gram-variable coccobacilli, classically coating squamous epithelial cells as clue cells in bacterial vaginosis; no single dominant organism.',organisms:['Gardnerella vaginalis','mixed anaerobes (Mobiluncus, Prevotella)'],clues:['Clue cells (stippled squames)','Loss of lactobacilli','BV: Nugent / Hay-Ison score']},
];

const expectedPhenotypes = [
  {id:'enterobacterales',name:'Enterobacterales (all)',group:'gnr',resist:['Benzylpenicillin','Glycopeptides (vancomycin / teicoplanin)','Fusidic acid','Macrolides','Lincosamides (clindamycin)','Streptogramins','Rifampicin','Daptomycin','Linezolid'],rules:['These Gram-positive agents are never active against Enterobacterales — do not test or report them.','A result that contradicts the expected phenotype should be viewed with suspicion: re-check identification and the test before releasing.']},
  {id:'ecoli',name:'Escherichia coli',group:'gnr',resist:['Benzylpenicillin and the Gram-positive agent block (see Enterobacterales)'],rules:['No additional expected resistance beyond the Enterobacterales block — report ampicillin, co-amoxiclav, cephalosporins etc. by result.','Ampicillin S is plausible; if a normally-active first-line agent reads R, confirm before reporting.']},
  {id:'klebsiella',name:'Klebsiella / Raoultella spp.',group:'gnr',aka:'incl. K. pneumoniae, K. oxytoca, K. aerogenes group',resist:['Ampicillin','Amoxicillin','Ticarcillin'],rules:['Intrinsic penicillinase (SHV / LEN / K1) — never report ampicillin or amoxicillin susceptible.','Co-amoxiclav and cephalosporins are reported by result. K. aerogenes carries inducible AmpC (treat like Enterobacter).']},
  {id:'ckoseri',name:'Citrobacter koseri',group:'gnr',resist:['Ampicillin','Ticarcillin'],rules:['Penicillinase only — unlike C. freundii it is susceptible to co-amoxiclav and cephalosporins, so do not lump the two together.']},
  {id:'cfreundii',name:'Citrobacter freundii complex',group:'gnr',aka:'AmpC / ESCPM group',resist:['Ampicillin','Co-amoxiclav','1st & 2nd generation cephalosporins','Cefoxitin (cephamycins)'],rules:['Inducible chromosomal AmpC. Expert rule (v3.2+): cefotaxime/ceftriaxone/ceftazidime may select derepressed mutants on therapy — report with caution or suppress per local policy.']},
  {id:'enterobacter',name:'Enterobacter cloacae complex / Klebsiella aerogenes',group:'gnr',aka:'AmpC / ESCPM group',resist:['Ampicillin','Co-amoxiclav','1st & 2nd generation cephalosporins','Cefoxitin (cephamycins)'],rules:['Inducible chromosomal AmpC. Derepressed mutants can emerge during 3GC therapy — EUCAST expert rule advises caution/suppression for cefotaxime, ceftriaxone and ceftazidime. Piperacillin/tazobactam reliability is reduced; carbapenems or cefepime preferred for serious infection.']},
  {id:'serratia',name:'Serratia marcescens',group:'gnr',aka:'AmpC / ESCPM group',resist:['Ampicillin','Co-amoxiclav','1st & 2nd generation cephalosporins','Cefoxitin','Colistin / polymyxin B','Nitrofurantoin'],rules:['Inducible AmpC (ESCPM group). Intrinsically resistant to colistin and nitrofurantoin — never report these susceptible. Tigecycline activity is reduced.']},
  {id:'morganella',name:'Morganella morganii',group:'gnr',aka:'Proteae / AmpC',resist:['Ampicillin','Co-amoxiclav','1st & 2nd generation cephalosporins','Tetracyclines & tigecycline','Colistin / polymyxin','Nitrofurantoin'],rules:['Inducible AmpC plus the Proteae intrinsic block (colistin, tetracyclines, nitrofurantoin). Imipenem MICs may be raised intrinsically — interpret carbapenems with care.']},
  {id:'providencia',name:'Providencia spp.',group:'gnr',aka:'Proteae',resist:['Ampicillin','Co-amoxiclav','1st & 2nd generation cephalosporins','Gentamicin & tobramycin','Tetracyclines & tigecycline','Colistin / polymyxin','Nitrofurantoin'],rules:['Proteae group: intrinsic resistance to polymyxins, tetracyclines and nitrofurantoin, plus several aminoglycosides. Do not report these as susceptible.']},
  {id:'pmirabilis',name:'Proteus mirabilis',group:'gnr',aka:'Proteae',resist:['Tetracyclines & tigecycline','Colistin / polymyxin B','Nitrofurantoin'],rules:['Indole-negative. Intrinsically resistant to polymyxins, tetracyclines and nitrofurantoin — a frequent UTI pitfall, never report nitrofurantoin susceptible. Ampicillin and cephalosporins are reported by result.']},
  {id:'pvulgaris',name:'Proteus vulgaris / penneri',group:'gnr',aka:'Proteae',resist:['Ampicillin','Cefuroxime (and 1st-gen cephalosporins)','Tetracyclines & tigecycline','Colistin / polymyxin','Nitrofurantoin'],rules:['Indole-positive Proteus carry an inducible chromosomal β-lactamase — unlike P. mirabilis they are also resistant to ampicillin and early cephalosporins. Same polymyxin/tetracycline/nitrofurantoin block.']},
  {id:'salmonella',name:'Salmonella / Shigella spp.',group:'gnr',aka:'interpretive rule',resist:['1st & 2nd generation cephalosporins','Cefuroxime','Aminoglycosides','Nitrofurantoin (Salmonella, systemic)'],rules:['Interpretive rule: these agents may test active in vitro but are clinically ineffective in invasive disease — do not report them susceptible for systemic infection.','Fluoroquinolones: screen for low-level resistance (pefloxacin 5 µg disc, or ciprofloxacin MIC) — nalidixic-acid/pefloxacin resistance predicts clinical fluoroquinolone failure even when ciprofloxacin looks susceptible.']},
  {id:'pseudomonas',name:'Pseudomonas aeruginosa',group:'nf',aka:'non-fermenter',resist:['Ampicillin & co-amoxiclav','1st, 2nd & most 3rd-gen cephalosporins (cefotaxime, ceftriaxone)','Ertapenem','Trimethoprim','Tetracyclines & tigecycline','Chloramphenicol','Nitrofurantoin','plus the Gram-positive agent block'],rules:['Report only anti-pseudomonal agents (ceftazidime, cefepime, piperacillin/tazobactam, meropenem, imipenem, ciprofloxacin, aminoglycosides, colistin, ceftolozane/tazobactam, ceftazidime/avibactam, cefiderocol).','Ceftriaxone/cefotaxime and ertapenem are never reported for P. aeruginosa.']},
  {id:'acinetobacter',name:'Acinetobacter baumannii complex',group:'nf',aka:'non-fermenter',resist:['Ampicillin & co-amoxiclav','1st & 2nd generation cephalosporins','Cefotaxime / ceftriaxone','Ertapenem','Aztreonam','Trimethoprim','Fosfomycin','Chloramphenicol'],rules:['Tetracycline and doxycycline are intrinsically resistant, but minocycline and tigecycline are NOT — do not extrapolate across the class.','May appear susceptible to ampicillin/sulbactam because of sulbactam’s own activity.']},
  {id:'stenotrophomonas',name:'Stenotrophomonas maltophilia',group:'nf',aka:'non-fermenter',resist:['All penicillins & cephalosporins (except ceftazidime by result)','Carbapenems (meropenem, imipenem, ertapenem) — L1 metallo-β-lactamase','Aztreonam','Aminoglycosides','Fosfomycin','Most agents'],rules:['Carbapenems must NEVER be reported susceptible — intrinsic L1 metallo-β-lactamase, regardless of in-vitro result. This is a classic verification trap.','Report co-trimoxazole (first line), plus minocycline, levofloxacin and cefiderocol where validated.']},
  {id:'burkholderia',name:'Burkholderia cepacia complex',group:'nf',aka:'non-fermenter',resist:['Aminoglycosides','Colistin / polymyxins','Ampicillin & co-amoxiclav','1st generation cephalosporins','Fosfomycin'],rules:['Intrinsically polymyxin- and aminoglycoside-resistant — never report these susceptible (and do not mistake colistin growth for contamination).','Report co-trimoxazole, ceftazidime, meropenem and minocycline per the relevant guideline.']},
  {id:'staphylococcus',name:'Staphylococcus spp.',group:'gpc',aka:'Gram-positive',resist:['Aztreonam','Temocillin','Polymyxins / colistin','Nalidixic acid','All purely Gram-negative agents'],rules:['MRSA (mecA / mecC, cefoxitin screen positive): report ALL β-lactams resistant except the anti-MRSA cephalosporins ceftaroline and ceftobiprole.','Erythromycin-R with clindamycin-S → perform the D-zone test; report clindamycin resistant if inducible (iMLSb) positive.','Never report fusidic acid, rifampicin or mupirocin as suitable monotherapy.']},
  {id:'strep_pyogenes',name:'Streptococcus pyogenes / agalactiae (β-haemolytic A,B,C,G)',group:'gpc',aka:'expected susceptible',resist:['Aminoglycosides (as monotherapy)','Aztreonam','Polymyxins','Nalidixic acid / fosfomycin (by result)','Trimethoprim-sulfamethoxazole (do not report for S. pyogenes per old caution — by result under current breakpoints)'],rules:['Expected SUSCEPTIBLE phenotype: benzylpenicillin can be reported susceptible without testing (resistance is essentially unknown).','Aminoglycosides are only used for synergy, never alone. Macrolide/clindamycin resistance does occur — test and apply the D-zone rule.']},
  {id:'pneumoniae',name:'Streptococcus pneumoniae',group:'gpc',aka:'Gram-positive',resist:['Aminoglycosides (monotherapy)','Aztreonam','Trimethoprim (variable)'],rules:['Use the oxacillin 1 µg screen; if the zone is small, determine penicillin and cefotaxime/ceftriaxone MICs — meningitis breakpoints are far lower than non-meningitis.','Do not report a penicillin category from the screening disc alone in invasive disease.']},
  {id:'efaecalis',name:'Enterococcus faecalis',group:'gpc',aka:'Gram-positive',resist:['All cephalosporins','Aminoglycosides (low-level, as monotherapy)','Clindamycin & lincosamides','Trimethoprim-sulfamethoxazole','Aztreonam','Fusidic acid','Quinupristin/dalfopristin (intrinsic in E. faecalis)'],rules:['Co-trimoxazole and cephalosporins may look active in vitro but are clinically ineffective — never report them susceptible.','Report ampicillin/amoxicillin (usually susceptible), vancomycin, nitrofurantoin (UTI only), linezolid.','For endocarditis screen High-Level Aminoglycoside Resistance (HLAR, gentamicin 30 µg) — HLAR removes cell-wall-agent synergy.']},
  {id:'efaecium',name:'Enterococcus faecium',group:'gpc',aka:'Gram-positive',resist:['All cephalosporins','Aminoglycosides (low-level, monotherapy)','Clindamycin','Trimethoprim-sulfamethoxazole','Aztreonam','Fusidic acid'],rules:['As E. faecalis but ampicillin resistance is common (PBP5) — confirm before reporting ampicillin susceptible.','Unlike E. faecalis it is NOT intrinsically resistant to quinupristin/dalfopristin. Screen for VRE (vanA/vanB) and HLAR as indicated.']},
  {id:'listeria',name:'Listeria monocytogenes',group:'gpc',aka:'Gram-positive',resist:['All cephalosporins (including 3rd generation)','Fosfomycin','Fluoroquinolones (clinically)','Aztreonam'],rules:['Cephalosporins must never be reported susceptible — a key reason empirical meningitis cover adds amoxicillin/ampicillin.','Report ampicillin/amoxicillin (with gentamicin for synergy) and co-trimoxazole.']},
  {id:'vanc_intrinsic',name:'Vancomycin-resistant Gram-positives (intrinsic)',group:'gpc',aka:'avoid false VRE',resist:['Vancomycin (intrinsic) — Leuconostoc, Pediococcus, Lactobacillus, Erysipelothrix; low-level in E. gallinarum / E. casseliflavus (vanC)'],rules:['These organisms are naturally vancomycin-resistant — identify to species before raising a VRE alert, or you will generate false enterococcal VRE reports.','E. gallinarum / E. casseliflavus carry intrinsic low-level vanC; distinguish from acquired vanA/vanB in E. faecium/faecalis.']},
  {id:'anaerobes',name:'Anaerobes (general)',group:'anaerobe',resist:['Aminoglycosides (all anaerobes)','Aztreonam','Temocillin','Quinolones (most older agents)'],rules:['Aminoglycosides have no anaerobic activity — never report. Bacteroides fragilis group usually produce β-lactamase (penicillin/ampicillin resistant) and resistance to clindamycin and metronidazole is rising.','Susceptibility testing of anaerobes uses MIC methods (gradient strip / agar dilution); no validated disc method for most agents.']},
];

const glossary = [
  // ── Resistance phenotypes ─────────────────────
  {g:'Resistance phenotypes', t:'ESBL', d:'Extended-spectrum β-lactamase. Typically CTX-M, SHV, or TEM family; hydrolyses penicillins and 3rd-generation cephalosporins. Inhibited by clavulanate, tazobactam, and avibactam. Screened by cefpodoxime resistance, confirmed by D63 (cefepime/clavulanate synergy).'},
  {g:'Resistance phenotypes', t:'AmpC', d:'Chromosomal or plasmid-mediated cephalosporinase. Hydrolyses 3GCs and cefoxitin; NOT inhibited by clavulanate but IS inhibited by cloxacillin (D69 inducer test). Inducible in Enterobacter, Citrobacter, Serratia, Hafnia, Providencia, Morganella (ESCHAPPM/SPACE/AmpC-inducible group).'},
  {g:'Resistance phenotypes', t:'KPC', d:'Klebsiella pneumoniae carbapenemase — Ambler class A serine carbapenemase. Hydrolyses all β-lactams including carbapenems. Inhibited by phenylboronic acid and by avibactam (so Ceftazidime/Avibactam IS active).'},
  {g:'Resistance phenotypes', t:'MBL / MβL', d:'Metallo-β-lactamase — Ambler class B, zinc-dependent. Families: NDM, VIM and IMP. Hydrolyses all β-lactams except aztreonam, though aztreonam is often defeated by a second mechanism in vivo. Inhibited by EDTA in vitro; D73 labels this as MβL inhibition. Ceftazidime/Avibactam is NOT active. Cefiderocol often retains activity.'},
  {g:'Resistance phenotypes', t:'OXA-48', d:'OXA-48-like carbapenemases (Ambler class D). Weak carbapenemase activity, often gives low/borderline meropenem MICs but reduced ertapenem zones. NOT inhibited by EDTA or boronic acid (classic "no synergy" D73 pattern). Temocillin retains very limited activity. Caz/Avi IS active.'},
  {g:'Resistance phenotypes', t:'iMLSb', d:'Inducible Macrolide–Lincosamide–Streptogramin B resistance, mediated by erm genes. Detected by D-zone test: erythromycin disc placed adjacent to clindamycin — flattening of the clindamycin zone on the side facing the erythromycin = inducible resistance. Do NOT report clindamycin susceptible if D-zone positive.'},
  {g:'Resistance phenotypes', t:'HLAR', d:'High-Level Aminoglycoside Resistance in enterococci, screened with Gentamicin 30 µg disc (or 500 mg/L MIC). HLAR eliminates synergy with cell-wall agents (ampicillin/vancomycin) — endocarditis combination therapy becomes ineffective.'},
  {g:'Resistance phenotypes', t:'BLNAR', d:'β-Lactamase-Negative Ampicillin-Resistant Haemophilus influenzae. PBP-3 alteration mechanism, not β-lactamase production. Penicillin disc screen detects it (pen R predicts amp R even if nitrocefin negative).'},
  {g:'Resistance phenotypes', t:'VISA / hVISA', d:'Vancomycin-Intermediate S. aureus (MIC 4–8 mg/L) and hetero-VISA (subpopulations with elevated MIC within a phenotypically susceptible isolate). Detected by MIC trending or population analysis; relevant in persistent bacteraemia / endocarditis.'},
  {g:'Resistance phenotypes', t:'GISA', d:'Glycopeptide-Intermediate S. aureus — broader term covering both vancomycin and teicoplanin reduced susceptibility.'},
  {g:'Resistance phenotypes', t:'VRE', d:'Vancomycin-Resistant Enterococcus. Genotypes: VanA (Vanc+Teico R, inducible), VanB (Vanc R, Teico variable/S), VanC (intrinsic low-level in E. gallinarum / E. casseliflavus — speciate to avoid false alerts), VanD/E/G (rare).'},
  {g:'Resistance phenotypes', t:'MRSA / MSSA', d:'Methicillin-Resistant / Methicillin-Sensitive S. aureus. Defined by mecA (or mecC) gene presence. Cefoxitin 30 µg disc on MHE is the EUCAST surrogate: zone ≤21mm = MRSA. A positive screen makes ALL β-lactams resistant (with rare exceptions: ceftaroline, ceftobiprole).'},
  {g:'Resistance phenotypes', t:'CRAB', d:'Carbapenem-Resistant Acinetobacter baumannii. Most commonly OXA-23/24/58 carbapenemases (distinct from Enterobacterales OXA-48). Cefiderocol may be the only remaining option.'},
  {g:'Resistance phenotypes', t:'CRE / CRPA', d:'Carbapenem-Resistant Enterobacterales / Pseudomonas aeruginosa. Triggers infection-control alert and reflex D73 carbapenemase typing.'},
  {g:'Resistance phenotypes', t:'MDR / XDR / PDR', d:'Multi-Drug / Extensively-Drug / Pan-Drug Resistant. ECDC/CDC definitions based on number of antimicrobial classes affected.'},
  {g:'Resistance phenotypes', t:'mecA / mecC', d:'Genes encoding altered PBP2a/PBP2c that confer methicillin resistance in staphylococci. mecC is the divergent homolog responsible for some MRSA missed by mecA-only PCR assays.'},
  {g:'Resistance phenotypes', t:'mupA', d:'Plasmid-borne isoleucyl-tRNA synthetase gene conferring high-level mupirocin resistance (MIC >256 mg/L). Renders nasal/skin mupirocin decolonisation ineffective.'},
  {g:'Resistance phenotypes', t:'BRO-1 / BRO-2', d:'Moraxella catarrhalis β-lactamases — >90 % of clinical isolates produce one. Predicts ampicillin/penicillin resistance even when discs look susceptible.'},

  // ── Tests &amp; methods ───────────────────────────
  {g:'Tests &amp; methods', t:'D-zone test', d:'Erythromycin and clindamycin discs placed 12–20 mm apart on the same plate. Truncation ("D" shape) of the clindamycin zone on the erythromycin side = inducible MLSb resistance.'},
  {g:'Tests &amp; methods', t:'CAMP test', d:'Christie-Atkins-Munch-Petersen test. A streak of the test isolate is plated perpendicular to a β-haemolytic S. aureus streak; an arrowhead enhancement of haemolysis at the intersection identifies Group B Streptococcus.'},
  {g:'Tests &amp; methods', t:'PYR test', d:'Pyrrolidonyl arylamidase — Enterococcus and Group A Strep are PYR-positive; most other Streptococci are PYR-negative. Useful at the bench for rapid separation.'},
  {g:'Tests &amp; methods', t:'Optochin', d:'Ethylhydrocupreine disc; S. pneumoniae shows a susceptibility zone ≥14 mm. Viridans group are resistant.'},
  {g:'Tests &amp; methods', t:'MIC', d:'Minimum Inhibitory Concentration — quantitative measure (mg/L) of the lowest drug concentration that prevents visible growth. Required for some β-lactams in pneumococcus, glycopeptides in S. aureus deep infection, anaerobes (no validated disc method), and Stenotrophomonas levofloxacin/minocycline.'},
  {g:'Tests &amp; methods', t:'ECOFF', d:'Epidemiological Cut-Off Value — separates wild-type from non-wild-type isolates based on phenotypic distribution alone, independent of clinical outcome. Used where no clinical breakpoint exists (e.g. gentamicin in Haemophilus, vancomycin in GP anaerobes).'},
  {g:'Tests &amp; methods', t:'MALDI-TOF', d:'Matrix-Assisted Laser Desorption/Ionization Time-Of-Flight mass spectrometry — primary species ID method, having largely replaced biochemical panels for routine bacterial identification.'},
  {g:'Tests &amp; methods', t:'TDA', d:'Tryptophan deaminase — Proteus, Providencia, and Morganella produce a brown halo on tryptophan-containing media (e.g. Uriselect 4). Reflects the indole pathway upstream.'},
  {g:'Tests &amp; methods', t:'Indole (Kovács)', d:'Detects bacterial tryptophanase. P. mirabilis is indole-negative; P. vulgaris / P. penneri are indole-positive (clinically relevant for ampicillin and cephalexin reporting).'},
  {g:'Tests &amp; methods', t:'Nitrocefin', d:'Chromogenic cephalosporin used as a β-lactamase test (yellow → red colour change). Standard for Haemophilus and Moraxella β-lactamase detection.'},

  {g:'Tests &amp; methods', t:'EUCAST', d:'European Committee on Antimicrobial Susceptibility Testing. Provides breakpoint tables, expert rules and methodology used to interpret antimicrobial susceptibility results.'},
  {g:'Tests &amp; methods', t:'SOP', d:'Standard Operating Procedure. Local controlled document describing the approved laboratory method, safety requirements, acceptance criteria and reporting process.'},
  {g:'Tests &amp; methods', t:'IFU', d:'Instructions For Use. Manufacturer\'s validated instructions for a kit, cartridge, reagent or instrument workflow.'},
  {g:'Tests &amp; methods', t:'QC', d:'Quality Control. Use of reference strains, control materials or expected-result checks to confirm test, instrument and reagent performance.'},
  {g:'Tests &amp; methods', t:'MAST', d:'Manufacturer of antimicrobial susceptibility and resistance-detection disc sets used in the D68, D69, D63 and D73 workflows.'},


  // ── Molecular diagnostics ────────────────────
  {g:'Molecular diagnostics', t:'NAAT', d:'Nucleic Acid Amplification Test — umbrella term for methods that amplify DNA or RNA targets. Includes PCR, TMA, LAMP and other amplification chemistries. Use NAAT when the exact platform chemistry is not PCR.'},
  {g:'Molecular diagnostics', t:'TMA', d:'Transcription-Mediated Amplification — isothermal RNA amplification chemistry used by Hologic Aptima assays on the Panther platform. Aptima CT/NG is therefore best described as a NAAT / TMA assay rather than a conventional PCR.'},
  {g:'Molecular diagnostics', t:'PCR', d:'Polymerase Chain Reaction — cyclic temperature-based amplification of DNA targets. In this guide, GeneXpert respiratory and MTB/RIF workflows are PCR-based cartridge assays.'},
  {g:'Molecular diagnostics', t:'RT-PCR', d:'Reverse-Transcription PCR — RNA is first converted to complementary DNA, then amplified by PCR. Used for RNA viruses such as SARS-CoV-2, influenza and RSV.'},
  {g:'Molecular diagnostics', t:'qPCR / real-time PCR', d:'Quantitative or real-time PCR — amplification is detected during each cycle using fluorescent probes or dyes. The curve crossing a detection threshold generates a Ct value.'},
  {g:'Molecular diagnostics', t:'Ct value', d:'Cycle threshold — PCR cycle at which fluorescence crosses the detection threshold. Lower Ct generally means more target nucleic acid, but Ct values are assay-specific and should not be compared directly between platforms without validation.'},
  {g:'Molecular diagnostics', t:'Target', d:'The nucleic-acid sequence the assay is designed to detect, such as CT rRNA, NG rRNA, SARS-CoV-2 N/E genes, influenza matrix genes, RSV targets or MTB rpoB sequences.'},
  {g:'Molecular diagnostics', t:'Internal control', d:'Control material included in each reaction or sample pathway to show that extraction, amplification and detection worked. Failure may indicate inhibition, extraction failure, cartridge failure or insufficient sample.'},
  {g:'Molecular diagnostics', t:'IPC', d:'Internal Process Control — a platform-specific internal control used to verify that sample processing and amplification have worked. Failed IPC with no target detected usually makes the result invalid.'},
  {g:'Molecular diagnostics', t:'SPC', d:'Sample Processing Control — GeneXpert internal control that monitors sample processing and PCR inhibition. A failed SPC may produce invalid, error or no-result outcomes depending on the assay and instrument step affected.'},
  {g:'Molecular diagnostics', t:'Inhibition', d:'Interference with amplification, usually from substances carried over from the specimen matrix. Can cause delayed amplification or internal-control failure. Repeat testing or a fresh sample may be required according to local SOP.'},
  {g:'Molecular diagnostics', t:'Invalid', d:'Molecular result category meaning the assay could not produce a valid positive or negative result. Common causes include internal-control failure, inhibition, insufficient sample, incorrect sample type, cartridge/reagent issue or instrument interruption.'},
  {g:'Molecular diagnostics', t:'Error', d:'Platform-generated failure state, often linked to cartridge, reagent, pressure, probe-check, temperature, optical or instrument-control problems. Treat according to platform and local SOP; do not report as negative.'},
  {g:'Molecular diagnostics', t:'No result', d:'Assay did not complete or did not produce interpretable amplification data. Usually requires repeat testing if sufficient suitable sample remains, or a fresh sample if not.'},
  {g:'Molecular diagnostics', t:'Probe check', d:'GeneXpert pre-amplification check that verifies probe integrity, reagent rehydration, tube filling, fluorescence background and dye signal. Probe-check failure generally indicates a cartridge/reagent or filling issue.'},
  {g:'Molecular diagnostics', t:'Cartridge', d:'Self-contained disposable GeneXpert reaction unit containing sample-processing chambers, dried reagents and PCR/detection areas. The closed-cartridge design reduces contamination risk but does not remove the need for correct sample handling.'},
  {g:'Molecular diagnostics', t:'Cartridge error', d:'GeneXpert cartridge failure or run interruption, distinct from a true detected/not-detected result. Repeat according to local SOP using remaining processed sample only if permitted and safe.'},
  {g:'Molecular diagnostics', t:'Co-detection', d:'More than one target detected in the same molecular assay, for example SARS-CoV-2 plus RSV or influenza. Co-detection may be clinically significant; do not assume one target is contamination without reviewing the amplification curves/platform result and clinical context.'},
  {g:'Molecular diagnostics', t:'Carryover contamination', d:'Transfer of amplified product or target nucleic acid into another sample or reaction. Closed systems reduce risk, but good practice still requires clean workflow, glove changes, decontamination and avoidance of splashes/aerosols.'},
  {g:'Molecular diagnostics', t:'Limit of detection (LoD)', d:'Lowest target concentration detected with defined probability, commonly 95 %. Results close to the LoD may be intermittent, giving weak positive, trace, late Ct or repeat-variable patterns.'},
  {g:'Molecular diagnostics', t:'Trace detected', d:'Very low-level MTB-complex DNA detected by GeneXpert MTB/RIF-type assays. Trace results are close to the limit of detection and require careful interpretation with smear, culture, clinical risk and local TB SOP.'},
  {g:'Molecular diagnostics', t:'RIF resistance', d:'Rifampicin resistance signal on MTB/RIF assays, usually inferred from mutations or probe dropout in the rpoB rifampicin-resistance-determining region. Treat as urgent until confirmed by reference testing.'},
  {g:'Molecular diagnostics', t:'rpoB', d:'Gene encoding the β-subunit of bacterial RNA polymerase. Mutations in the rifampicin-resistance-determining region of MTB rpoB are the main molecular marker for rifampicin resistance.'},
  {g:'Molecular diagnostics', t:'MTB complex', d:'Mycobacterium tuberculosis complex — group including M. tuberculosis, M. bovis, M. africanum and related species. MTB PCR detects complex DNA, not necessarily viable bacilli; culture remains required for full ID and susceptibility.'},
  {g:'Molecular diagnostics', t:'AFB', d:'Acid-Fast Bacilli — organisms that retain auramine or Ziehl-Neelsen stain because of mycolic-acid-rich cell walls. Smear-positive AFB indicates likely infectiousness but is not species-specific.'},
  {g:'Molecular diagnostics', t:'Aptima swab', d:'Hologic Aptima collection swab and transport tube used for CT/NG NAAT workflows on Panther. Correct swab type, tube, fill and labelling are essential for valid testing.'},
  {g:'Molecular diagnostics', t:'UVS', d:'Universal Viral Swab or universal viral transport system — swab/container used for respiratory viral PCR workflows such as combined RSV / influenza A/B / SARS-CoV-2 testing. Local naming and acceptable brands vary by SOP.'},
  {g:'Molecular diagnostics', t:'Panther', d:'Hologic Panther automated molecular platform used here for Aptima CT/NG NAAT. Handles sample processing, amplification and detection in an automated workflow.'},
  {g:'Molecular diagnostics', t:'GeneXpert', d:'Cepheid GeneXpert cartridge-based PCR platform used here for combined respiratory virus PCR and MTB/RIF testing. Each cartridge performs sample processing, amplification and detection in a closed unit.'},
  {g:'Molecular diagnostics', t:'CL3', d:'Containment Level 3 laboratory area for high-risk pathogens such as suspected Mycobacterium tuberculosis. Sputum opening, processing and inactivation must follow local CL3 SOP and safety sign-off.'},
  {g:'Molecular diagnostics', t:'Inactivation', d:'Validated step that renders infectious material safer for downstream handling. For TB sputum workflows, inactivation/contact time and containment requirements must follow local CL3 SOP exactly.'},
  {g:'Molecular diagnostics', t:'Chain of custody', d:'Controlled tracking of specimen identity, handling steps and result reporting. Especially important for TB, positive STI NAATs and infection-control-critical respiratory results.'},
  {g:'Molecular diagnostics', t:'Reflex testing', d:'Additional test triggered by an initial result or clinical context, such as TB culture after MTB PCR, NG culture for susceptibility after NG NAAT where possible, or repeat PCR after invalid results.'},
  {g:'Molecular diagnostics', t:'CT/NG', d:'Combined Chlamydia trachomatis / Neisseria gonorrhoeae NAAT request or result format. Each target should still be interpreted and reported separately.'},
  {g:'Molecular diagnostics', t:'TB', d:'Tuberculosis, usually referring to disease caused by members of the Mycobacterium tuberculosis complex. In this guide, sputum for TB PCR is a CL3 workflow until locally validated inactivation is complete.'},
  {g:'Molecular diagnostics', t:'MTB/RIF', d:'Xpert MTB/RIF-style shorthand for detection of Mycobacterium tuberculosis complex DNA plus rifampicin-resistance-associated rpoB probe behaviour.'},
  {g:'Molecular diagnostics', t:'DNA', d:'Deoxyribonucleic acid. Genetic material targeted directly by many PCR assays, including MTB and some respiratory molecular tests.'},
  {g:'Molecular diagnostics', t:'RNA', d:'Ribonucleic acid. Genetic material targeted by transcription-mediated amplification and reverse-transcription PCR workflows.'},
  {g:'Molecular diagnostics', t:'EDTA', d:'Ethylenediaminetetraacetic acid. Chelates zinc ions and is used phenotypically to demonstrate metallo-β-lactamase activity.'},


  // ── Molecular organisms & targets ─────────────
  {g:'Molecular organisms & targets', t:'CT / Chlamydia trachomatis', d:'Bacterial STI target detected by Aptima CT/NG NAAT. NAAT is highly sensitive and does not provide antimicrobial susceptibility; management follows local sexual-health pathway.'},
  {g:'Molecular organisms & targets', t:'NG / Neisseria gonorrhoeae', d:'Bacterial STI target detected by Aptima CT/NG NAAT. NAAT detection does not provide susceptibility; culture is important where available, especially for treatment failure, test-of-cure concerns or resistance surveillance.'},
  {g:'Molecular organisms & targets', t:'SARS-CoV-2', d:'RNA coronavirus causing COVID-19. Detected in the combined respiratory GeneXpert workflow in this guide. Positive results may trigger isolation, cohorting and infection-control actions according to local policy.'},
  {g:'Molecular organisms & targets', t:'RSV', d:'Respiratory Syncytial Virus — RNA virus causing bronchiolitis and significant respiratory disease in infants, older adults and immunocompromised patients. Detected by the combined respiratory GeneXpert assay.'},
  {g:'Molecular organisms & targets', t:'Influenza A / B', d:'RNA viruses detected by the combined respiratory GeneXpert assay. Influenza A includes multiple subtypes; influenza B has distinct lineages. Result may affect antivirals, cohorting and outbreak management.'},
  {g:'Molecular organisms & targets', t:'MTB / RIF', d:'GeneXpert / Xpert MTB/RIF assay concept combining detection of Mycobacterium tuberculosis complex DNA with molecular inference of rifampicin resistance from rpoB probe behaviour.'},

  // ── Media &amp; agars ────────────────────────────
  {g:'Media &amp; agars', t:'MHE', d:'Mueller-Hinton agar supplemented with 2 % NaCl — EUCAST-mandated medium for cefoxitin MRSA screening. Standard MHA gives unreliable mecA/MRSA detection.'},
  {g:'Media &amp; agars', t:'MHA / CAMHB', d:'Mueller-Hinton Agar (disc) and Cation-Adjusted Mueller-Hinton Broth (MIC). The EUCAST reference media for routine susceptibility testing of fast-growing aerobes. See also MH-F for fastidious organisms.'},
  {g:'Media &amp; agars', t:'CAMHB-ID', d:'Iron-Depleted CAMHB — required for cefiderocol MIC testing. Standard CAMHB gives falsely susceptible results because iron sufficiency disrupts siderophore-mediated uptake.'},
  {g:'Media &amp; agars', t:'HTM', d:'Haemophilus Test Medium — fastidious medium supporting Haemophilus growth and disc testing. Standard MH does not support Haemophilus.'},
  {g:'Media &amp; agars', t:'CLED', d:'Cysteine Lactose Electrolyte Deficient agar — supports growth while inhibiting Proteus swarming; useful for recovering isolated colonies in mixed urinary cultures.'},
  {g:'Media &amp; agars', t:'CBA', d:'Columbia Blood Agar (with 5 % horse blood) — the routine non-selective rich medium for wound, respiratory, deep-tissue, and sterile-site cultures.'},
  {g:'Media &amp; agars', t:'Brucella agar', d:'Supplemented anaerobe blood agar (vit K1 + haemin). EUCAST reference medium for anaerobe MIC testing.'},
  {g:'Media &amp; agars', t:'MH-F', d:'Mueller-Hinton fastidious agar. EUCAST medium for disc testing fastidious organisms such as streptococci, pneumococci, Haemophilus and Moraxella where specified.'},
  {g:'Media &amp; agars', t:'Chocolate agar / Choc', d:'Enriched heated blood agar releasing X and V factors; supports fastidious organisms such as Haemophilus spp.'},
  {g:'Media &amp; agars', t:'CNA', d:'Columbia nalidixic acid agar. Selective medium used to support Gram-positive organisms while suppressing many Gram-negative organisms.'},
  {g:'Media &amp; agars', t:'BACH', d:'Bacitracin chocolate agar, if this matches local stock naming. Used in QC notes for Haemophilus strains and worth checking against the local media list.'},


  // ── Site / panel codes ───────────────────────
  {g:'Panel &amp; site codes', t:'GP / IN donker', d:'GP = community / general practitioner donker; IN = inpatient donker. Each has a reflex extension (GP1 / IN1) triggered by primary-panel resistance.'},
  {g:'Panel &amp; site codes', t:'Coli 1 / 2 / 3', d:'EU_COLI1 (first-line β-lactams + Gent + Cipro + Pip/Taz), EU_COLI2 (cephalosporin/carbapenem screen + temocillin), EU_COLI3 (MDR/CRE escalation: Ami, Atm, Ceftol/Taz, Fos, Tig).'},
  {g:'Panel &amp; site codes', t:'PTOP / NTOP', d:'Topical-only donkers for ear and eye isolates. PTOP = Gram-positive (Chlor, Fucidin, Gent, Norflox). NTOP = Gram-negative (Chlor, Cipro, Gent, Nalidix, Peflox, Tobra).'},
  {g:'Panel &amp; site codes', t:'EU_EYE_EXT', d:'Eye-specific extras donker for severe ophthalmic infection — Amikacin, Ceftazidime, Clarithromycin MIC, Vancomycin MIC. Added to PTOP / NTOP for all eye isolates.'},
  {g:'Panel &amp; site codes', t:'UR2 / UR4', d:'UR2 = highly resistant / ESBL-E / MDR Enterobacterales escalation (Mero, Cefepime, Ami, Ceftol/Taz, Ceftaz, Caz/Avi). UR4 = cefiderocol last-resort donker for XDR/PDR.'},
  {g:'Panel &amp; site codes', t:'D68', d:'MAST ESBL/AmpC screening disc set used to screen Enterobacterales for ESBL and/or AmpC phenotypes.'},
  {g:'Panel &amp; site codes', t:'D69', d:'MAST AmpC characterisation disc set. Uses inhibitor patterns, including cloxacillin effect, to support AmpC identification.'},
  {g:'Panel &amp; site codes', t:'D63', d:'ESBL confirmation set based on cefepime ± clavulanate synergy. Used to confirm ESBL phenotype.'},
  {g:'Panel &amp; site codes', t:'D73', d:'Carbapenemase typing disc set using carbapenem ± inhibitor combinations to suggest MBL/MβL, KPC, OXA-48-like or AmpC-associated patterns.'},
  {g:'Panel &amp; site codes', t:'DDMMYY', d:'Date format: day, month and year using two digits each. Used by the bench-notes barcode label generator.'},
  {g:'Panel &amp; site codes', t:'Cold Room / Pot', d:'Local storage and location shorthand used in rare antibiotic-set notes. Keep aligned with current bench storage practice.'},


  // ── Clinical groupings ───────────────────────
  {g:'Clinical groupings', t:'GAS / GBS', d:'Group A (S. pyogenes) and Group B (S. agalactiae) β-haemolytic streptococci, defined by Lancefield carbohydrate. Group A: invasive disease emergency. Group B: neonatal sepsis + adult diabetic foot.'},
  {g:'Clinical groupings', t:'CoNS', d:'Coagulase-Negative Staphylococci — heterogeneous group including S. epidermidis, S. haemolyticus, S. saprophyticus and S. lugdunensis. Significance depends on site, purity and species; S. lugdunensis behaves clinically like S. aureus. Avoid using CNS as an uncontrolled shorthand because it can also mean central nervous system.'},
  {g:'Clinical groupings', t:'AHS / BHS / γ', d:'Streptococcal haemolysis groupings on blood agar: α (partial / green), β (complete / clear), γ (none). Drives both ID and panel selection.'},
  {g:'Clinical groupings', t:'HACEK', d:'Haemophilus aphrophilus, Aggregatibacter, Cardiobacterium, Eikenella, Kingella — fastidious GN endocarditis pathogens. Frequently culture-negative; PCR or extended blood-culture incubation often needed.'},
  {g:'Clinical groupings', t:'ESCHAPPM / SPACE', d:'Mnemonic groups for inducible-AmpC Enterobacterales: Enterobacter, Serratia, Citrobacter freundii, Hafnia, Aeromonas, Providencia, Proteus vulgaris, Morganella (variations exist). 3GCs should not be reported susceptible without consultant review even if in vitro S.'},
  {g:'Clinical groupings', t:'UTI', d:'Urinary Tract Infection. Infection of bladder, kidney or urinary tract; relevant to urine culture interpretation and oral antibiotic options.'},
  {g:'Clinical groupings', t:'SSTI', d:'Skin and Soft Tissue Infection. Clinical context for wound and skin isolates and topical, oral or IV antimicrobial choices.'},
  {g:'Clinical groupings', t:'IV', d:'Intravenous. Drug administration directly into the bloodstream; relevant where oral options are unsuitable or severe infection is suspected.'},
  {g:'Clinical groupings', t:'GPB', d:'Gram-positive bacillus/bacilli. Morphology group including Corynebacterium and other Gram-positive rods.'},
  {g:'Clinical groupings', t:'GNR', d:'Gram-negative rod. Morphology description used for organisms such as Enterobacterales, Pseudomonas, Acinetobacter and other non-fermenters.'},
  {g:'Clinical groupings', t:'GN', d:'Gram-negative. Organisms with Gram-negative cell-wall structure; often used in Gram-stain shorthand.'},
  {g:'Clinical groupings', t:'CSF', d:'Cerebrospinal fluid. Sterile-site specimen where breakpoints, reporting comments and escalation urgency may differ from superficial or screening specimens.'},
  {g:'Clinical groupings', t:'NCTC', d:'National Collection of Type Cultures. Reference strain collection used for validated control or reference organisms.'},
  {g:'Clinical groupings', t:'ESBL-E', d:'ESBL-producing Enterobacterales. Useful shorthand for E. coli, Klebsiella, Proteus and related Enterobacterales with ESBL phenotype or genotype.'},


  // ── Reporting concepts ───────────────────────
  {g:'Reporting concepts', t:'Intrinsic resistance', d:'Resistance inherent to a species, regardless of disc / MIC result. EUCAST publishes species-specific intrinsic-resistance tables that should suppress reporting (e.g. Stenotrophomonas to carbapenems; Proteus to nitrofurantoin/colistin/tetracycline; Enterococcus to cephalosporins).'},
  {g:'Reporting concepts', t:'Expert rules', d:'EUCAST expert rules translate phenotypic findings into reporting actions (e.g. MRSA → suppress all β-lactams; ESBL → review 3GC and aztreonam reporting; HLAR → flag combination therapy implications).'},
  {g:'Reporting concepts', t:'PK/PD breakpoints', d:'Non-species-specific breakpoints derived from drug pharmacokinetic/pharmacodynamic modelling. Used where species-specific clinical breakpoints are unavailable. Linked parameters include fT>MIC for time-dependent drugs, Cmax/MIC for concentration-dependent drugs, and AUC/MIC for exposure-driven drugs such as glycopeptides.'},

  // ── Drug chemistry &amp; targets ────────────────

  {g:'Drug chemistry &amp; targets', t:'PBP-3', d:'Penicillin-binding protein 3. Alteration in Haemophilus influenzae is associated with BLNAR-type ampicillin resistance.'},
  {g:'Drug chemistry &amp; targets', t:'NAD', d:'Nicotinamide adenine dinucleotide, also called V factor. Required by Haemophilus spp. for growth.'},
  {g:'Drug chemistry &amp; targets', t:'AUC/MIC', d:'Area-under-the-curve to MIC ratio. PK/PD exposure index used for agents where total drug exposure best predicts efficacy, such as glycopeptides.'},
  {g:'Drug chemistry &amp; targets', t:'Cmax/MIC', d:'Peak concentration to MIC ratio. PK/PD index for concentration-dependent killing, especially aminoglycosides and some fluoroquinolone contexts.'},
  {g:'Drug chemistry &amp; targets', t:'fT>MIC', d:'Fraction of the dosing interval for which free drug concentration remains above the MIC. Key PK/PD index for β-lactams.'},
  {g:'Drug chemistry &amp; targets', t:'AAC', d:'Aminoglycoside N-acetyltransferase. One of the aminoglycoside-modifying enzyme families that reduces aminoglycoside ribosome binding.'},
  {g:'Drug chemistry &amp; targets', t:'APH', d:'Aminoglycoside O-phosphotransferase. One of the aminoglycoside-modifying enzyme families.'},
  {g:'Drug chemistry &amp; targets', t:'ANT', d:'Aminoglycoside O-nucleotidyltransferase. One of the aminoglycoside-modifying enzyme families.'},

  {g:'Drug chemistry &amp; targets', t:'PBP', d:'Penicillin-Binding Protein — bacterial membrane-anchored enzymes (transpeptidases and carboxypeptidases) that cross-link the pentapeptide stems of peptidoglycan. All β-lactams act by acylating the active-site serine of one or more PBPs. PBP2a (encoded by mecA) is the altered PBP in MRSA that has low affinity for almost all β-lactams.'},
  {g:'Drug chemistry &amp; targets', t:'β-lactam ring', d:'A four-membered amide ring (three carbons + one nitrogen) whose strained geometry makes its carbonyl unusually reactive — it acts as an irreversible acyl donor toward serine PBPs. Shared by penicillins, cephalosporins, carbapenems and monobactams.'},
  {g:'Drug chemistry &amp; targets', t:'BLI', d:'β-Lactamase Inhibitor. Includes the classical penicillanic-acid sulfones (clavulanate, sulbactam, tazobactam — "suicide" inhibitors), the diazabicyclooctanes (avibactam, relebactam — reversible covalent inhibitors), and the boronates (vaborbactam). No single BLI covers all four Ambler β-lactamase classes.'},
  {g:'Drug chemistry &amp; targets', t:'Ambler classes', d:'Molecular classification of β-lactamases. Class A: serine penicillinases incl. TEM, SHV, CTX-M, KPC. Class B: metallo-β-lactamases (zinc-dependent — NDM, VIM, IMP). Class C: serine cephalosporinases (AmpC). Class D: serine oxacillinases (OXA family, incl. OXA-48).'},
  {g:'Drug chemistry &amp; targets', t:'Cephamycin', d:'A sub-class of cephalosporins with a 7-α-methoxy substituent (cefoxitin, cefotetan). The methoxy group sterically hinders most ESBLs (so cefoxitin S despite ESBL production) but does NOT block AmpC — hence cefoxitin\'s use as an AmpC screen.'},
  {g:'Drug chemistry &amp; targets', t:'Siderophore', d:'Small iron-chelating molecule secreted by bacteria to scavenge environmental Fe³⁺. Iron-loaded siderophores are recaptured via dedicated TonB-dependent outer-membrane receptors (CirA, Fiu, PiuA). Cefiderocol exploits this pathway — its catechol moiety binds Fe³⁺, and the drug–iron complex is actively imported, bypassing porin-loss resistance.'},
  {g:'Drug chemistry &amp; targets', t:'DHFR', d:'Dihydrofolate Reductase — the enzyme that reduces dihydrofolate to tetrahydrofolate (THF), needed for thymidylate and purine biosynthesis. Trimethoprim selectively inhibits bacterial DHFR (~10⁵× more avidly than human DHFR).'},
  {g:'Drug chemistry &amp; targets', t:'DHPS', d:'Dihydropteroate Synthase — the bacterial enzyme that condenses pABA with pteridine pyrophosphate to form dihydropteroate, an early step in folate biosynthesis. Inhibited competitively by sulfonamides (which are pABA analogues). Combined DHPS + DHFR inhibition by co-trimoxazole produces sequential blockade and synergy.'},
  {g:'Drug chemistry &amp; targets', t:'30S / 50S subunits', d:'The two ribosomal subunits of bacteria — together forming the 70S ribosome. 30S (16S rRNA + ~20 proteins) handles mRNA decoding; 50S (23S + 5S rRNA + ~33 proteins) catalyses peptide-bond formation. 30S inhibitors: aminoglycosides, tetracyclines/glycylcyclines. 50S inhibitors: macrolides, lincosamides, oxazolidinones, chloramphenicol, streptogramins.'},
  {g:'Drug chemistry &amp; targets', t:'DNA gyrase / Topoisomerase IV', d:'Bacterial type-II topoisomerases that manage DNA supercoiling. DNA gyrase (subunits GyrA + GyrB) introduces negative supercoils; topoisomerase IV (ParC + ParE) decatenates daughter chromosomes after replication. Fluoroquinolones trap these enzymes on cleaved DNA → bactericidal double-strand breaks. Resistance arises by point mutations in the QRDR.'},
  {g:'Drug chemistry &amp; targets', t:'QRDR', d:'Quinolone-Resistance-Determining Region — short stretches of <em>gyrA</em>/<em>gyrB</em> (and <em>parC</em>/<em>parE</em>) where fluoroquinolone-contact residues cluster. Single mutations (e.g. GyrA Ser83 or Asp87 in E. coli) raise quinolone MICs stepwise; combined gyrase + topoIV mutations give clinical-level resistance.'},
  {g:'Drug chemistry &amp; targets', t:'MurA', d:'UDP-N-acetylglucosamine 1-carboxyvinyltransferase — catalyses the first committed step of peptidoglycan biosynthesis (PEP + UDP-GlcNAc → enolpyruvyl-UDP-GlcNAc). Fosfomycin is a PEP analogue that irreversibly alkylates the active-site cysteine of MurA.'},
  {g:'Drug chemistry &amp; targets', t:'Lipid II', d:'The membrane-anchored peptidoglycan precursor (undecaprenyl-PP-MurNAc-pentapeptide-GlcNAc) that is flipped from the cytoplasmic to the periplasmic face for cross-linking. Glycopeptides (vancomycin, teicoplanin) sequester the terminal D-Ala–D-Ala of the lipid II pentapeptide, blocking both transglycosylation and transpeptidation.'},
  {g:'Drug chemistry &amp; targets', t:'LPS / Lipid A', d:'Lipopolysaccharide — the major component of the Gram-negative outer membrane. Lipid A (the membrane-anchored portion of LPS) is the endotoxin and the binding target of the polymyxins (colistin / polymyxin B). Modification of lipid A phosphates (via PmrA/B or MCR enzymes) reduces the negative charge and confers polymyxin resistance.'},
  {g:'Drug chemistry &amp; targets', t:'EF-G', d:'Elongation Factor G — the GTPase that drives translocation of tRNAs through the ribosome after peptide-bond formation. Fusidic acid stabilises EF-G in its post-translocational, GDP-bound state on the ribosome, preventing factor release and halting translation.'},
  {g:'Drug chemistry &amp; targets', t:'IleRS', d:'Isoleucyl-tRNA Synthetase — the aminoacyl-tRNA synthetase that charges tRNA<sup>Ile</sup> with isoleucine. Mupirocin competitively inhibits bacterial IleRS by mimicking the natural isoleucyl-adenylate intermediate; high-level mupirocin resistance is conferred by the <em>mupA</em>-encoded alternative IleRS.'},
  {g:'Drug chemistry &amp; targets', t:'Bactericidal vs bacteriostatic', d:'Bactericidal agents kill bacteria (MBC within 1–2 dilutions of MIC) — β-lactams, glycopeptides, fluoroquinolones, aminoglycosides, daptomycin, nitroheterocycles. Bacteriostatic agents inhibit growth — tetracyclines, macrolides, lincosamides, sulfonamides, chloramphenicol, oxazolidinones. The distinction matters most in deep-seated or low-immunity infection (endocarditis, neutropenia, meningitis).'},
  {g:'Drug chemistry &amp; targets', t:'Time- vs concentration-dependent killing', d:'PK/PD pharmacodynamic types. Time-dependent (β-lactams): efficacy correlates with fraction of dosing interval where free drug > MIC (fT>MIC). Concentration-dependent (aminoglycosides, fluoroquinolones): efficacy correlates with Cmax/MIC or AUC/MIC — hence once-daily aminoglycoside dosing. Glycopeptides are AUC/MIC-driven.'},
  {g:'Drug chemistry &amp; targets', t:'AME', d:'Aminoglycoside-Modifying Enzyme — covalently modifies aminoglycosides at specific hydroxyl or amino groups, reducing ribosome binding. Three families by chemistry: AAC (N-acetyltransferases), APH (O-phosphotransferases) and ANT (O-nucleotidyltransferases). Substrate profile differs by enzyme — amikacin is the most stable to AMEs of the clinical aminoglycosides.'},
  {g:'Drug chemistry &amp; targets', t:'MLSb', d:'Macrolide–Lincosamide–Streptogramin B resistance — joint cross-resistance to all three classes via shared 23S rRNA binding at A2058. <em>erm</em> methyltransferases methylate this nucleotide; the modification can be constitutive or inducible (iMLSb, detected by the D-zone test).'},
  {g:'Drug chemistry &amp; targets', t:'cfr / PhLOPSA', d:'<em>cfr</em>-encoded 23S rRNA methyltransferase that confers joint resistance to Phenicols, Lincosamides, Oxazolidinones, Pleuromutilins, and Streptogramin A (PhLOPSA phenotype). The only known mechanism of acquired linezolid resistance that is transferable on plasmids.'},
  {g:'Drug chemistry &amp; targets', t:'mcr-1', d:'Plasmid-borne phosphoethanolamine transferase that modifies lipid A → reduces colistin binding. First reported in China in 2015 (animal-origin E. coli); now globally disseminated. Confers low-to-moderate colistin MIC elevation (4–8 mg/L) — enough to cross the resistance breakpoint.'},
  {g:'Drug chemistry &amp; targets', t:'PAE', d:'Post-Antibiotic Effect — continued suppression of bacterial growth after drug concentrations fall below the MIC. Long PAE is characteristic of aminoglycosides and fluoroquinolones against Gram-negatives, and underpins the safety of extended-interval (once-daily) aminoglycoside dosing.'}
,

  // ── Blood science terms ──────────────────────
  {g:'Blood science terms', t:'FBC', d:'Full Blood Count. Core haematology test measuring haemoglobin, red-cell indices, white-cell count/differential and platelets from anticoagulated whole blood, usually a purple EDTA tube.'},
  {g:'Blood science terms', t:'Hb', d:'Haemoglobin concentration. Key FBC component for anaemia, polycythaemia and bleeding assessment; interpret with MCV/MCH, reticulocytes, iron studies and clinical context.'},
  {g:'Blood science terms', t:'RBC / Red cells', d:'Red blood cells / erythrocytes. FBC red-cell parameters and blood-film morphology help classify anaemia, haemolysis and marrow response.'},
  {g:'Blood science terms', t:'WBC', d:'White Blood Cell count. FBC component used to assess leucocytosis, leucopenia and differential cell-pattern clues such as neutrophilia, lymphocytosis or eosinophilia.'},
  {g:'Blood science terms', t:'Platelets / Plt', d:'Thrombocytes measured on the FBC. Low counts suggest bleeding risk, marrow suppression, immune destruction, consumption or artefact; high counts may be reactive or myeloproliferative.'},
  {g:'Blood science terms', t:'Blood film', d:'Microscopic examination of a stained blood smear. Used to assess red-cell morphology, platelet clumping, abnormal white cells, blasts, haemolysis features and selected parasites.'},
  {g:'Blood science terms', t:'Reticulocytes / Retics', d:'Immature red cells containing residual RNA. Reticulocyte count shows whether marrow is responding appropriately to anaemia, haemolysis or recovery after treatment.'},
  {g:'Blood science terms', t:'ESR', d:'Erythrocyte Sedimentation Rate. Non-specific inflammatory marker measuring red-cell settling in a standardised citrate tube; affected by anaemia, immunoglobulins, pregnancy, age and chronic inflammation.'},
  {g:'Blood science terms', t:'HbA1c', d:'Glycated haemoglobin. Reflects average glycaemia over preceding weeks and is measured from whole blood; may be misleading with altered red-cell turnover or haemoglobin variants.'},
  {g:'Blood science terms', t:'PT', d:'Prothrombin Time. Coagulation assay assessing extrinsic/common pathway clotting, used in bleeding screens, liver synthetic assessment and warfarin-related testing.'},
  {g:'Blood science terms', t:'INR', d:'International Normalised Ratio. Standardised PT result used mainly for warfarin monitoring and some liver/coagulation assessments.'},
  {g:'Blood science terms', t:'APTT', d:'Activated Partial Thromboplastin Time. Coagulation assay assessing intrinsic/common pathway clotting; used in bleeding screens, selected heparin monitoring and factor/inhibitor investigations.'},
  {g:'Blood science terms', t:'Fibrinogen / FIB', d:'Functional fibrinogen concentration or activity. Important in major bleeding, DIC, liver disease, obstetric haemorrhage and thrombolysis contexts.'},
  {g:'Blood science terms', t:'D-dimer / DD', d:'Fibrin degradation product. Useful in validated venous-thromboembolism exclusion pathways when pre-test probability is low/intermediate; non-specific and often raised in infection, cancer, pregnancy and inflammation.'},
  {g:'Blood science terms', t:'U&E', d:'Urea and Electrolytes. Routine chemistry profile including sodium, potassium, urea, creatinine and related renal/electrolyte markers depending on local profile.'},
  {g:'Blood science terms', t:'Creatinine / eGFR', d:'Creatinine is a renal filtration marker used to estimate glomerular filtration rate (eGFR). Interpret with age, muscle mass, acute illness and local AKI criteria.'},
  {g:'Blood science terms', t:'LFT', d:'Liver Function Tests. Routine chemistry profile that may include bilirubin, ALT, AST, ALP, GGT, albumin and total protein; pattern recognition is more useful than isolated results.'},
  {g:'Blood science terms', t:'ALT / AST', d:'Alanine aminotransferase and aspartate aminotransferase. Enzymes used as hepatocellular injury markers; AST is less liver-specific and may be affected by muscle injury or haemolysis.'},
  {g:'Blood science terms', t:'ALP / GGT', d:'Alkaline phosphatase and gamma-glutamyl transferase. Used together to support cholestatic or biliary-pattern liver interpretation; ALP also has bone sources.'},
  {g:'Blood science terms', t:'CRP', d:'C-reactive protein. Acute-phase inflammatory protein used to support infection/inflammation assessment and trend response, but it is non-specific.'},
  {g:'Blood science terms', t:'Troponin / Tn', d:'Cardiac troponin. Marker of myocardial injury; diagnosis of acute coronary syndrome requires clinical context and rise/fall pattern rather than a single value alone.'},
  {g:'Blood science terms', t:'TFT', d:'Thyroid Function Tests. Usually TSH with reflex or paired free T4 and sometimes free T3, depending on local pathway and clinical context.'},
  {g:'Blood science terms', t:'TSH / fT4 / fT3', d:'Thyroid-stimulating hormone, free thyroxine and free triiodothyronine. Interpreted together to assess thyroid feedback, replacement therapy and hyper-/hypothyroid patterns.'},
  {g:'Blood science terms', t:'Ferritin', d:'Iron-storage protein measured in serum. Low ferritin supports iron deficiency, but ferritin is also an acute-phase reactant and can be normal or high during inflammation.'},
  {g:'Blood science terms', t:'B12 / Folate', d:'Vitamin B12 and folate assays support investigation of macrocytosis, anaemia, neuropathy and nutritional or absorption problems. Interpret with FBC and clinical features.'},
  {g:'Blood science terms', t:'IgG / IgA / IgM', d:'Major immunoglobulin classes measured in immunology. Used in immune-deficiency, chronic inflammation, infection, liver disease and paraprotein workups.'},
  {g:'Blood science terms', t:'ANA / ENA', d:'Antinuclear antibody and extractable nuclear antigen antibody testing. Autoimmune serology used for connective-tissue disease workups; positive screens must be interpreted with pre-test probability.'},
  {g:'Blood science terms', t:'IgE', d:'Immunoglobulin E. Total or allergen-specific IgE supports allergy assessment, but sensitisation does not always equal clinical allergy.'},
  {g:'Blood science terms', t:'C3 / C4', d:'Complement proteins used in immune-complex disease, SLE activity, complement deficiency and some infection/inflammation contexts. Consumption may lower levels; acute phase responses may raise them.'},
  {g:'Blood science terms', t:'G&S', d:'Group and Save. Transfusion test that determines ABO/Rh group and screens for red-cell antibodies before possible blood issue.'},
  {g:'Blood science terms', t:'XM / Crossmatch', d:'Compatibility testing between patient sample and donor blood units. Required when blood is likely to be transfused or antibodies require serological matching.'},
  {g:'Blood science terms', t:'TDM', d:'Therapeutic Drug Monitoring. Measurement of drug concentrations, such as gentamicin or vancomycin levels, to balance efficacy and toxicity; sample timing relative to dose is critical.'},
  {g:'Blood science terms', t:'BC / Blood cultures', d:'Blood culture bottles are used to recover viable bacteria or yeasts from bloodstream infection. Skin antisepsis, adequate volume and collection before antimicrobials improve yield.'},
  {g:'Blood science terms', t:'Trace metals', d:'Low-level metal assays such as zinc, copper, lead or mercury. Require trace-element controlled tubes because ordinary tubes, needles or the environment can contaminate results.'},

  // ── Expanded blood science glossary terms ─────
  {"g": "Blood coagulation & thrombosis", "t": "Fibrin", "d": "Insoluble protein mesh formed when thrombin cleaves fibrinogen. Fibrin stabilises a clot; cross-linked fibrin breakdown generates D-dimer."},
  {"g": "Blood coagulation & thrombosis", "t": "Fibrinolysis", "d": "Enzymatic breakdown of fibrin clots, mainly by plasmin. Overactivation can contribute to bleeding; impaired fibrinolysis can favour thrombosis."},
  {"g": "Blood coagulation & thrombosis", "t": "Plasmin / plasminogen", "d": "Plasminogen is the inactive precursor converted to plasmin, which digests fibrin into degradation products including D-dimer fragments."},
  {"g": "Blood coagulation & thrombosis", "t": "FDP", "d": "Fibrin/Fibrinogen Degradation Products. Breakdown fragments from fibrin or fibrinogen; D-dimer is more specific for cross-linked fibrin degradation."},
  {"g": "Blood coagulation & thrombosis", "t": "DIC", "d": "Disseminated Intravascular Coagulation. Systemic coagulation activation causing consumption of platelets/factors and fibrin formation; typical labs may include low platelets, prolonged PT/APTT, low fibrinogen and raised D-dimer."},
  {"g": "Blood coagulation & thrombosis", "t": "VTE", "d": "Venous Thromboembolism. Umbrella term covering deep vein thrombosis and pulmonary embolism; D-dimer is used only within validated exclusion pathways based on pre-test probability."},
  {"g": "Blood coagulation & thrombosis", "t": "DVT", "d": "Deep Vein Thrombosis. Clot in the deep venous system, classically leg veins; may embolise to the lungs as pulmonary embolism."},
  {"g": "Blood coagulation & thrombosis", "t": "PE", "d": "Pulmonary Embolism. Obstruction of pulmonary arteries by thrombus, usually from DVT; diagnosis combines clinical probability, imaging and selected lab tests."},
  {"g": "Blood coagulation & thrombosis", "t": "Haemostasis", "d": "Physiological process that stops bleeding: vascular constriction, platelet plug formation, coagulation-factor activation, fibrin stabilisation and later fibrinolysis."},
  {"g": "Blood coagulation & thrombosis", "t": "Primary haemostasis", "d": "Platelet adhesion, activation and aggregation at an injury site. Abnormalities often cause mucocutaneous bleeding and may show thrombocytopenia or platelet-function defects."},
  {"g": "Blood coagulation & thrombosis", "t": "Secondary haemostasis", "d": "Coagulation-factor cascade producing thrombin and fibrin to stabilise the platelet plug. Abnormalities are assessed with PT, APTT, fibrinogen and factor assays."},
  {"g": "Blood coagulation & thrombosis", "t": "Intrinsic pathway", "d": "Contact-factor side of coagulation assessed by APTT. Includes factors XII, XI, IX and VIII before joining the common pathway."},
  {"g": "Blood coagulation & thrombosis", "t": "Extrinsic pathway", "d": "Tissue-factor side of coagulation assessed mainly by PT/INR. Factor VII is the key extrinsic factor before the common pathway."},
  {"g": "Blood coagulation & thrombosis", "t": "Common pathway", "d": "Shared final coagulation pathway involving factors X, V, II (prothrombin), fibrinogen and fibrin formation; affects both PT and APTT when significantly abnormal."},
  {"g": "Blood coagulation & thrombosis", "t": "Thrombin / Factor IIa", "d": "Activated prothrombin enzyme that converts fibrinogen to fibrin and amplifies coagulation by activating platelets and other clotting factors."},
  {"g": "Blood coagulation & thrombosis", "t": "Prothrombin / Factor II", "d": "Inactive precursor of thrombin. Vitamin K-dependent factor affected by warfarin and liver synthetic function."},
  {"g": "Blood coagulation & thrombosis", "t": "Factor Xa", "d": "Activated factor X in the common pathway; converts prothrombin to thrombin. Target of direct oral anticoagulants such as apixaban and rivaroxaban."},
  {"g": "Blood coagulation & thrombosis", "t": "Factor VIII", "d": "Intrinsic-pathway cofactor. Deficiency causes haemophilia A and prolongs APTT; levels may rise as an acute-phase response."},
  {"g": "Blood coagulation & thrombosis", "t": "Factor IX", "d": "Intrinsic-pathway factor. Deficiency causes haemophilia B and typically prolongs APTT."},
  {"g": "Blood coagulation & thrombosis", "t": "vWF", "d": "von Willebrand factor. Mediates platelet adhesion and carries factor VIII; deficiency/dysfunction causes von Willebrand disease with bleeding symptoms."},
  {"g": "Blood coagulation & thrombosis", "t": "Antithrombin", "d": "Natural anticoagulant that inhibits thrombin and factor Xa. Heparin works by enhancing antithrombin activity; deficiency increases thrombosis risk."},
  {"g": "Blood coagulation & thrombosis", "t": "Protein C / Protein S", "d": "Vitamin K-dependent natural anticoagulant pathway. Deficiency or warfarin initiation effects can predispose to thrombosis."},
  {"g": "Blood coagulation & thrombosis", "t": "Lupus anticoagulant", "d": "Antiphospholipid antibody phenomenon that prolongs phospholipid-dependent clotting assays in vitro but is associated clinically with thrombosis and pregnancy morbidity."},
  {"g": "Blood coagulation & thrombosis", "t": "APS", "d": "Antiphospholipid Syndrome. Autoimmune prothrombotic disorder associated with lupus anticoagulant, anticardiolipin and/or anti-β2 glycoprotein I antibodies plus clinical criteria."},
  {"g": "Blood coagulation & thrombosis", "t": "Thrombophilia screen", "d": "Panel of inherited/acquired thrombosis-risk tests. Timing matters because acute thrombosis, anticoagulants, pregnancy and inflammation can distort results."},
  {"g": "Blood coagulation & thrombosis", "t": "UFH", "d": "Unfractionated Heparin. Parenteral anticoagulant that enhances antithrombin; monitoring may use APTT or anti-Xa depending on local protocol."},
  {"g": "Blood coagulation & thrombosis", "t": "LMWH", "d": "Low-Molecular-Weight Heparin, such as enoxaparin or dalteparin. More predictable heparin anticoagulant; anti-Xa monitoring is used only in selected situations."},
  {"g": "Blood coagulation & thrombosis", "t": "DOAC", "d": "Direct Oral Anticoagulant. Includes factor Xa inhibitors and direct thrombin inhibitors; can interfere with PT/APTT and specialist coagulation assays."},
  {"g": "Blood coagulation & thrombosis", "t": "Warfarin", "d": "Vitamin K antagonist that reduces functional factors II, VII, IX and X plus proteins C/S. Monitored primarily with INR."},
  {"g": "Blood coagulation & thrombosis", "t": "Anti-Xa", "d": "Assay estimating factor Xa inhibitor/heparin activity. Used for selected UFH/LMWH monitoring and sometimes DOAC assessment depending on calibrated assay availability."},
  {"g": "Blood coagulation & thrombosis", "t": "Clotting factors", "d": "Plasma proteins of the coagulation cascade. Deficiency, inhibitors, liver disease, vitamin K deficiency or anticoagulants can prolong PT/APTT."},
  {"g": "Blood coagulation & thrombosis", "t": "Cryoprecipitate / Cryo", "d": "Blood component rich in fibrinogen, factor VIII, factor XIII and vWF. Used mainly for fibrinogen replacement in bleeding according to local transfusion policy."},
  {"g": "Blood coagulation & thrombosis", "t": "FFP", "d": "Fresh Frozen Plasma. Plasma component containing coagulation factors; used for selected bleeding/coagulopathy scenarios rather than simple volume replacement."},
  {"g": "Haematology morphology & indices", "t": "MCV", "d": "Mean Cell Volume. Average red-cell size; low MCV supports microcytosis and high MCV supports macrocytosis, interpreted with Hb, MCH, RDW, film and haematinics."},
  {"g": "Haematology morphology & indices", "t": "MCH / MCHC", "d": "Mean Cell Haemoglobin and Mean Cell Haemoglobin Concentration. Red-cell haemoglobin indices that support classification of anaemia and hypochromia."},
  {"g": "Haematology morphology & indices", "t": "RDW", "d": "Red Cell Distribution Width. Measures variation in red-cell size; raised RDW supports anisocytosis and can help separate mixed deficiency states."},
  {"g": "Haematology morphology & indices", "t": "Neutrophils", "d": "Granulocytes central to bacterial infection and acute inflammation responses. Neutropenia increases infection risk; neutrophilia is non-specific."},
  {"g": "Haematology morphology & indices", "t": "Lymphocytes", "d": "White-cell subset including T cells, B cells and NK cells. Lymphocytosis may be reactive or clonal; lymphopenia occurs in many acute/chronic conditions."},
  {"g": "Haematology morphology & indices", "t": "Eosinophils", "d": "Granulocytes associated with allergy, asthma, parasites, drug reactions and some haematological disorders."},
  {"g": "Haematology morphology & indices", "t": "Basophils", "d": "Granulocytes involved in hypersensitivity responses; persistent basophilia can be a clue to myeloproliferative disease."},
  {"g": "Haematology morphology & indices", "t": "Monocytes", "d": "White-cell subset involved in phagocytosis and chronic inflammation. Monocytosis can be reactive or reflect marrow/haematological disease."},
  {"g": "Haematology morphology & indices", "t": "Blasts", "d": "Immature precursor cells. Blasts in peripheral blood are abnormal and may indicate acute leukaemia or severe marrow stress; urgent film review/escalation is usually required."},
  {"g": "Haematology morphology & indices", "t": "Anaemia", "d": "Reduced haemoglobin/red-cell mass. Classified by MCV and mechanism: blood loss, reduced production, deficiency, inflammation, renal disease or haemolysis."},
  {"g": "Haematology morphology & indices", "t": "Haemolysis screen", "d": "Investigation for red-cell destruction, typically using bilirubin, LDH, haptoglobin, reticulocytes, DAT and film morphology alongside clinical context."},
  {"g": "Haematology morphology & indices", "t": "Haptoglobin", "d": "Plasma protein that binds free haemoglobin. Low haptoglobin supports intravascular haemolysis but may be affected by inflammation or liver disease."},
  {"g": "Haematology morphology & indices", "t": "DAT / Coombs", "d": "Direct Antiglobulin Test. Detects antibody or complement bound to patient red cells; used in autoimmune haemolysis and transfusion-reaction investigation."},
  {"g": "Haematology morphology & indices", "t": "Schistocytes", "d": "Red-cell fragments on blood film. Suggest mechanical fragmentation/microangiopathic haemolysis such as TTP, HUS, DIC or prosthetic-valve haemolysis."},
  {"g": "Haematology morphology & indices", "t": "Spherocytes", "d": "Dense round red cells lacking central pallor. Seen in hereditary spherocytosis and immune haemolysis; interpret with DAT and clinical context."},
  {"g": "Haematology morphology & indices", "t": "NRBC", "d": "Nucleated Red Blood Cells. Immature erythroid cells in peripheral blood; may indicate marrow stress, hypoxia, haemolysis or severe systemic illness."},
  {"g": "Clinical chemistry terms", "t": "Sodium / Na⁺", "d": "Major extracellular cation measured in U&E. Abnormalities reflect water balance, renal/endocrine physiology, drugs and acute illness."},
  {"g": "Clinical chemistry terms", "t": "Potassium / K⁺", "d": "Major intracellular cation measured in U&E. Haemolysis or EDTA contamination can falsely raise potassium; true abnormalities can be clinically urgent."},
  {"g": "Clinical chemistry terms", "t": "Chloride / Cl⁻", "d": "Major extracellular anion measured in electrolyte profiles and used in acid-base interpretation with bicarbonate and anion gap."},
  {"g": "Clinical chemistry terms", "t": "Bicarbonate / HCO₃⁻", "d": "Buffer component reported in chemistry or blood gas profiles. Helps assess metabolic acid-base disturbance."},
  {"g": "Clinical chemistry terms", "t": "Anion gap", "d": "Calculated estimate of unmeasured anions, commonly Na − (Cl + HCO₃). Raised anion gap supports metabolic acidosis from lactate, ketones, renal failure or toxins."},
  {"g": "Clinical chemistry terms", "t": "Lactate", "d": "Marker of anaerobic metabolism/tissue hypoperfusion and some metabolic/toxic states. Requires correct sample handling and rapid processing depending on method."},
  {"g": "Clinical chemistry terms", "t": "AKI", "d": "Acute Kidney Injury. Abrupt renal function deterioration, usually assessed by creatinine change and urine output criteria rather than one isolated creatinine."},
  {"g": "Clinical chemistry terms", "t": "CKD", "d": "Chronic Kidney Disease. Persistent kidney dysfunction or damage, commonly staged by eGFR and albuminuria."},
  {"g": "Clinical chemistry terms", "t": "Calcium / Ca²⁺", "d": "Electrolyte relevant to bone, parathyroid, renal and malignancy workups. Interpret total calcium with albumin or use ionised calcium where appropriate."},
  {"g": "Clinical chemistry terms", "t": "Phosphate / PO₄³⁻", "d": "Bone/mineral and renal marker affected by kidney function, PTH, vitamin D and cellular shifts."},
  {"g": "Clinical chemistry terms", "t": "Magnesium / Mg²⁺", "d": "Electrolyte involved in neuromuscular/cardiac function; abnormalities may accompany renal disease, GI loss, alcohol use or drug effects."},
  {"g": "Clinical chemistry terms", "t": "Albumin", "d": "Major serum protein made by the liver. Reflects inflammation, nutrition, liver/renal/GI loss and affects corrected calcium interpretation."},
  {"g": "Clinical chemistry terms", "t": "Bilirubin", "d": "Haem breakdown product. Raised levels may reflect haemolysis, hepatocellular injury, cholestasis or inherited conjugation disorders."},
  {"g": "Clinical chemistry terms", "t": "LDH", "d": "Lactate dehydrogenase. Non-specific cell injury/haemolysis marker; raised in haemolysis, tissue damage, liver disease and malignancy contexts."},
  {"g": "Clinical chemistry terms", "t": "CK", "d": "Creatine kinase. Muscle enzyme used for rhabdomyolysis, muscle injury and selected cardiac/neuromuscular contexts."},
  {"g": "Clinical chemistry terms", "t": "BNP / NT-proBNP", "d": "Natriuretic peptides released with cardiac wall stretch. Used in heart-failure assessment; affected by age, renal function, obesity and atrial fibrillation."},
  {"g": "Clinical chemistry terms", "t": "hCG", "d": "Human Chorionic Gonadotrophin. Pregnancy hormone and tumour marker in selected contexts; used in pregnancy assessment and trophoblastic/germ-cell tumour monitoring."},
  {"g": "Clinical chemistry terms", "t": "PTH", "d": "Parathyroid Hormone. Regulates calcium/phosphate balance; interpreted with calcium, phosphate, vitamin D and renal function."},
  {"g": "Clinical chemistry terms", "t": "Vitamin D", "d": "Usually 25-hydroxyvitamin D. Assessed in bone/mineral disorders, deficiency risk and selected endocrine/renal contexts."},
  {"g": "Clinical chemistry terms", "t": "Lipids", "d": "Cholesterol/triglyceride profile used for cardiovascular risk and metabolic assessment."},
  {"g": "Clinical chemistry terms", "t": "HDL / LDL / TG", "d": "High-density lipoprotein cholesterol, low-density lipoprotein cholesterol and triglycerides. Core components of lipid interpretation."},
  {"g": "Clinical chemistry terms", "t": "Osmolality", "d": "Measure of solute concentration. Used in hyponatraemia workups, toxic alcohol assessment and fluid balance investigations."},
  {"g": "Clinical chemistry terms", "t": "Ammonia", "d": "Nitrogenous analyte used in hepatic encephalopathy/metabolic investigations. Very sample-handling sensitive; follow local urgent transport/processing rules."},
  {"g": "Immunology & transfusion terms", "t": "RF", "d": "Rheumatoid Factor. Autoantibody used in rheumatoid arthritis workups but not specific; interpret with anti-CCP and clinical features."},
  {"g": "Immunology & transfusion terms", "t": "Anti-CCP", "d": "Anti-cyclic citrullinated peptide antibody. More specific marker supporting rheumatoid arthritis diagnosis/prognosis than RF in the right clinical context."},
  {"g": "Immunology & transfusion terms", "t": "ANCA", "d": "Anti-Neutrophil Cytoplasmic Antibodies. Includes PR3-ANCA and MPO-ANCA patterns used in vasculitis workups."},
  {"g": "Immunology & transfusion terms", "t": "dsDNA", "d": "Double-stranded DNA antibodies. SLE-associated autoantibody often used with complement levels to assess disease activity."},
  {"g": "Immunology & transfusion terms", "t": "SLE", "d": "Systemic Lupus Erythematosus. Autoimmune connective-tissue disease associated with ANA, dsDNA, ENA patterns, complement consumption and varied clinical features."},
  {"g": "Immunology & transfusion terms", "t": "Coeliac screen / tTG", "d": "Coeliac serology commonly includes tissue transglutaminase antibodies, interpreted with total IgA and gluten exposure status."},
  {"g": "Immunology & transfusion terms", "t": "SPEP / Serum electrophoresis", "d": "Serum protein electrophoresis. Separates serum proteins to detect paraproteins, inflammation patterns and hypogammaglobulinaemia."},
  {"g": "Immunology & transfusion terms", "t": "IFE / Immunofixation", "d": "Immunofixation electrophoresis. Characterises monoclonal proteins by heavy and light chain type after SPEP or suspected paraprotein."},
  {"g": "Immunology & transfusion terms", "t": "Paraprotein", "d": "Monoclonal immunoglobulin produced by a clonal plasma-cell/B-cell population. Relevant to myeloma, MGUS and related disorders."},
  {"g": "Immunology & transfusion terms", "t": "SFLC", "d": "Serum Free Light Chains. Measures free kappa and lambda light chains and ratio; used in plasma-cell disorder workups and monitoring."},
  {"g": "Immunology & transfusion terms", "t": "Kappa / Lambda", "d": "Immunoglobulin light-chain types. Skewed ratio can suggest monoclonal plasma-cell or B-cell disease."},
  {"g": "Immunology & transfusion terms", "t": "ABO", "d": "Major blood group system based on A and B red-cell antigens and naturally occurring plasma antibodies; central to transfusion compatibility."},
  {"g": "Immunology & transfusion terms", "t": "RhD", "d": "Rhesus D antigen status. Important in transfusion and pregnancy because anti-D can cause haemolytic transfusion reactions or haemolytic disease of the fetus/newborn."},
  {"g": "Immunology & transfusion terms", "t": "IAT", "d": "Indirect Antiglobulin Test. Detects antibodies in patient plasma that can bind reagent/donor red cells; used in antibody screening and crossmatching."},
  {"g": "Immunology & transfusion terms", "t": "Antibody screen", "d": "Transfusion test for clinically significant red-cell antibodies. Positive screens may require antibody identification and antigen-negative blood."},
  {"g": "Immunology & transfusion terms", "t": "MTP", "d": "Massive Transfusion Protocol. Emergency pathway for balanced blood-component support during major haemorrhage according to local policy."},
  {"g": "Immunology & transfusion terms", "t": "HDFN", "d": "Haemolytic Disease of the Fetus and Newborn. Maternal red-cell antibodies cross the placenta and destroy fetal/neonatal red cells."},

  // ── Blood tubes &amp; additives ─────────────────
  {g:'Blood tubes &amp; additives', t:'SST', d:'Serum Separator Tube, commonly yellow/gold top. Contains clot activator and separator gel; after clotting and centrifugation it provides serum for many chemistry, immunology and serology assays.'},
  {g:'Blood tubes &amp; additives', t:'Serum', d:'Liquid fraction of blood after clotting. Lacks fibrinogen and most clotting factors; commonly used for chemistry, immunology, serology, endocrine and drug-level assays.'},
  {g:'Blood tubes &amp; additives', t:'Plasma', d:'Liquid fraction of anticoagulated blood. Contains clotting factors and is used for coagulation testing, some rapid chemistry pathways and transfusion compatibility workflows.'},
  {g:'Blood tubes &amp; additives', t:'EDTA tube', d:'Purple or pink anticoagulant tube containing K₂/K₃ EDTA. EDTA chelates calcium, preventing clotting and preserving cell morphology for FBC/film or red-cell testing for transfusion.'},
  {g:'Blood tubes &amp; additives', t:'Sodium citrate tube', d:'Light blue coagulation tube containing buffered sodium citrate. Citrate reversibly binds calcium; correct fill volume is essential because clotting assays depend on the blood-to-anticoagulant ratio.'},
  {g:'Blood tubes &amp; additives', t:'Lithium heparin tube', d:'Green tube containing lithium heparin. Prevents clotting by enhancing antithrombin activity and is used for plasma chemistry where rapid turnaround or no clotting delay is desired.'},
  {g:'Blood tubes &amp; additives', t:'Fluoride oxalate tube', d:'Grey tube containing sodium fluoride and potassium oxalate. Fluoride inhibits glycolysis and oxalate anticoagulates, helping preserve glucose and some lactate-type analytes.'},
  {g:'Blood tubes &amp; additives', t:'Pink EDTA tube', d:'Transfusion-labelled EDTA tube for group-and-save/crossmatch workflows. Strict identity, sample age and labelling rules apply because errors can cause incompatible transfusion.'},
  {g:'Blood tubes &amp; additives', t:'Black ESR tube', d:'Citrate tube designed for ESR measurement with fixed anticoagulant ratio and tube geometry. Not interchangeable with routine coagulation citrate tubes unless local SOP permits.'},
  {g:'Blood tubes &amp; additives', t:'Trace-element tube', d:'Royal/dark blue or local equivalent tube manufactured to minimise metal contamination. Additive varies, so check the exact tube required for zinc, copper, lead, mercury or other trace-metal assays.'},
  {g:'Blood tubes &amp; additives', t:'Clot activator', d:'Tube additive that accelerates coagulation so serum can be separated after centrifugation. Used in SST/yellow-gold tubes for many serum assays.'},
  {g:'Blood tubes &amp; additives', t:'Separator gel', d:'Polymer gel that forms a barrier between cells/clot and serum or plasma during centrifugation. Helps reduce ongoing cellular exchange, but some drug or toxicology assays may require non-gel tubes locally.'},
  {g:'Blood tubes &amp; additives', t:'Underfilled citrate', d:'Citrate tube filled below the line. Excess anticoagulant relative to blood can prolong clotting times and invalidate PT/APTT/coagulation results.'},
  {g:'Blood tubes &amp; additives', t:'Haemolysis', d:'Rupture of red cells releasing intracellular contents. Can interfere with chemistry assays, falsely increase potassium/AST/LDH and trigger sample comments or rejection depending on assay.'},
  {g:'Blood tubes &amp; additives', t:'Clotted EDTA', d:'EDTA sample containing a clot due to delayed mixing, under-anticoagulation or poor collection. Can falsely lower platelet/WBC counts and often invalidates FBC or transfusion testing.'},
  {g:'Blood tubes &amp; additives', t:'Order of draw', d:'Recommended sequence for collecting blood tubes to reduce additive carryover. Follow local phlebotomy policy, especially around blood cultures, citrate, serum, heparin, EDTA and fluoride tubes.'},

  // ── Bench shorthand &amp; disc codes ───────────
  {g:'Bench shorthand &amp; disc codes', t:'CIP5', d:'Ciprofloxacin 5 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'SXT25', d:'Co-trimoxazole 25 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'MEM10', d:'Meropenem 10 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'RD5', d:'Rifampicin 5 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'AMP2', d:'Ampicillin 2 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'CAZ10', d:'Ceftazidime 10 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'LZD10', d:'Linezolid 10 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'TE30', d:'Tetracycline 30 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'CTX5', d:'Cefotaxime 5 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'P1', d:'Penicillin 1 unit disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'CN10', d:'Gentamicin 10 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'ATM30', d:'Aztreonam 30 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'FEP30', d:'Cefepime 30 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'LEV5', d:'Levofloxacin 5 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'AMC3', d:'Amoxicillin/clavulanic acid 3 µg disc, if that matches local stock naming.'},
  {g:'Bench shorthand &amp; disc codes', t:'NA30', d:'Nalidixic acid 30 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'TEC30', d:'Teicoplanin 30 µg disc.'},
  {g:'Bench shorthand &amp; disc codes', t:'VAN5', d:'Vancomycin 5 µg disc.'},

  // ── Mycology terms ─────────────────────────
  {g:'Mycology — morphology', t:'Hyphae', d:'Branching tubular filaments forming the body of a mould; a mass of hyphae is a mycelium. Width and septation are key ID features — broad ribbon-like sparsely septate hyphae suggest Mucorales, narrow regularly septate hyphae point to the large septate-mould group.'},
  {g:'Mycology — morphology', t:'Septa (septate)', d:'Cross-walls dividing a hypha into cells. Regular septation characterises dermatophytes and most filamentous fungi; presence or absence is the first branch of the SMI mould algorithm.'},
  {g:'Mycology — morphology', t:'Aseptate / pauci-septate', d:'Hyphae with few or no cross-walls (coenocytic), so cytoplasm is continuous. Typical of the Mucorales — broad, thin-walled, ribbon-like with right-angle branching, and easily crushed on a mount.'},
  {g:'Mycology — morphology', t:'Mycelium', d:'The interwoven mass of hyphae making up a mould colony. Vegetative mycelium absorbs and anchors; aerial mycelium bears the reproductive conidia.'},
  {g:'Mycology — morphology', t:'Conidia', d:'Asexual mould spores borne externally on hyphae or specialised conidiophores. Their size, shape, septation and arrangement are the most reliable identification feature.'},
  {g:'Mycology — morphology', t:'Microconidia', d:'Small single-celled conidia whose shape and arrangement help separate dermatophytes — teardrop microconidia along the hyphae in T. rubrum, clusters of round microconidia in the T. mentagrophytes complex.'},
  {g:'Mycology — morphology', t:'Macroconidia', d:'Large multicellular conidia; shape and wall texture are diagnostic — rough spindle-shaped (Microsporum), smooth club-shaped in clusters (Epidermophyton), symmetrical fusiform (Nannizzia gypsea).'},
  {g:'Mycology — morphology', t:'Arthroconidia (arthrospores)', d:'Rectangular barrel-shaped conidia formed by fragmentation of a hypha. Seen in Trichosporon and Geotrichum on cornmeal agar, and as the infective form of Coccidioides.'},
  {g:'Mycology — morphology', t:'Blastoconidia (blastospores)', d:'Conidia produced by budding — the characteristic asexual form of yeasts. On the Dalmau plate, blastospores with or without pseudohyphae, arthrospores or chlamydoconidia separate the germ-tube-negative yeasts.'},
  {g:'Mycology — morphology', t:'Pseudohyphae', d:'Chains of elongated budding yeast cells that stay attached, with constrictions at the septa (unlike a true hypha or germ tube). A feature of many Candida species on cornmeal agar.'},
  {g:'Mycology — morphology', t:'Chlamydoconidia (chlamydospores)', d:'Thick-walled resistant resting cells formed within or at the tip of a hypha. Terminal chlamydoconidia on cornmeal agar are characteristic of Candida albicans; chlamydospore chains are a clue to Trichophyton verrucosum.'},
  {g:'Mycology — morphology', t:'Germ tube', d:'A short hyphal outgrowth from a yeast cell with no constriction at its base (distinguishing it from a pseudohypha). Formed in serum at 37°C within 2–3 h — a positive test is presumptive of C. albicans (also C. dubliniensis / africana).'},
  {g:'Mycology — morphology', t:'Spherule', d:'The 37°C tissue form of Coccidioides: a large round structure packed with endospores whose rupture releases new endospores. Basis of this organism’s dimorphism and high infectivity — Hazard Group 3.'},
  {g:'Mycology — morphology', t:'Spiral hyphae', d:'Tightly coiled hyphal segments seen in the Trichophyton mentagrophytes complex; a helpful but not exclusive microscopy clue.'},
  {g:'Mycology — morphology', t:'Favic chandelier', d:'Antler-like branched hyphal tips resembling a candelabra, classically seen in Trichophyton schoenleinii (the agent of favus).'},
  {g:'Mycology — morphology', t:'Pectinate / bamboo hyphae', d:'Comb-like (pectinate) hyphae are a clue to Microsporum audouinii; bamboo hyphae with prominent septa and granular cytoplasm suggest Microsporum ferrugineum.'},
  {g:'Mycology — morphology', t:'Conidiophore', d:'A specialised hypha bearing conidia. Its architecture — such as the vesicle and phialides of Aspergillus — is central to mould identification.'},
  {g:'Mycology — morphology', t:'Phialide / annellide', d:'Conidiogenous cells. A phialide releases conidia from a fixed opening (Aspergillus, Penicillium); an annellide leaves ring-like scars as successive conidia form (Exophiala, Scopulariopsis).'},
  {g:'Mycology — morphology', t:'Sporangiospores', d:'Asexual spores produced inside a closed sac (sporangium) on a sporangiophore — the reproductive structure of the Mucorales, in contrast to the externally borne conidia of septate moulds.'},
  {g:'Mycology — morphology', t:'Capsule', d:'A polysaccharide layer around the cell, shown by India ink as a clear halo. The hallmark of Cryptococcus, also detected by cryptococcal antigen (CrAg).'},
  {g:'Mycology — clinical &amp; methods', t:'Dimorphism (thermally dimorphic)', d:'Growth as a mould at 25–30°C and as a yeast (or spherule for Coccidioides) at 37°C. Endemic pathogens such as Histoplasma, Blastomyces and Coccidioides are dimorphic and mostly Hazard Group 3.'},
  {g:'Mycology — clinical &amp; methods', t:'Monomorphic', d:'A fungus showing the same filamentous form at 25°C and 37°C, with no yeast phase — e.g. Aspergillus, Fusarium and the dermatophytes.'},
  {g:'Mycology — clinical &amp; methods', t:'Dermatophyte', d:'A keratinophilic mould (Trichophyton, Microsporum, Epidermophyton, Nannizzia) that infects skin, hair and nails to cause tinea. Identified by colony features and micro/macroconidial morphology.'},
  {g:'Mycology — clinical &amp; methods', t:'Dematiaceous (melanised)', d:'Darkly pigmented fungi whose walls contain melanin, giving olive-grey to black colonies and hyphae (Exophiala, Cladophialophora). Agents of phaeohyphomycosis and chromoblastomycosis.'},
  {g:'Mycology — clinical &amp; methods', t:'Hyaline', d:'Colourless, non-pigmented fungal elements (Aspergillus, Fusarium, Acremonium); the counterpart to dematiaceous fungi.'},
  {g:'Mycology — clinical &amp; methods', t:'Anthropophilic / zoophilic / geophilic', d:'Dermatophyte reservoir categories: anthropophilic (human-adapted, chronic mild lesions, e.g. T. rubrum), zoophilic (animal source, inflammatory, e.g. M. canis, T. verrucosum) and geophilic (soil, e.g. Nannizzia gypsea).'},
  {g:'Mycology — clinical &amp; methods', t:'Ectothrix / endothrix', d:'Hair-shaft invasion patterns in tinea capitis. Ectothrix: arthroconidia coat the outside of the shaft, often fluorescent (M. canis, T. verrucosum). Endothrix: arthroconidia stay within the shaft, non-fluorescent black-dot type (T. tonsurans, T. violaceum).'},
  {g:'Mycology — clinical &amp; methods', t:'Favus', d:'Chronic tinea capitis with cup-shaped crusts (scutula) and scarring alopecia, classically caused by Trichophyton schoenleinii; favic chandeliers are the microscopy clue.'},
  {g:'Mycology — clinical &amp; methods', t:'Tinea (dermatophytosis)', d:'Dermatophyte infection named by body site: capitis (scalp), corporis (body), cruris (groin), pedis (feet), unguium / onychomycosis (nails), imbricata (concentric rings, T. concentricum).'},
  {g:'Mycology — clinical &amp; methods', t:'Pleomorphism', d:'Loss of typical colony morphology and sporulation on repeated subculture, producing sterile white fluffy growth — common in dermatophytes and Epidermophyton. Minimise by limited subculturing and using fresh isolates for ID.'},
  {g:'Mycology — clinical &amp; methods', t:'Wood’s lamp', d:'Long-wave UV (about 365 nm) applied to hair/skin: some ectothrix Microsporum infections fluoresce bright green, aiding screening, whereas most Trichophyton infections do not fluoresce.'},
  {g:'Mycology — clinical &amp; methods', t:'KOH preparation', d:'Direct microscopy of skin, nail or hair in 10–20% potassium hydroxide (with or without calcofluor) to dissolve keratin and reveal fungal hyphae or spores while culture is pending.'},
  {g:'Mycology — clinical &amp; methods', t:'Lactophenol cotton blue (LPCB)', d:'Standard mounting stain for fungal cultures: lactophenol preserves and clears the specimen while cotton blue stains chitin in the walls, so hyphae and conidia are easily seen.'},
  {g:'Mycology — clinical &amp; methods', t:'Sabouraud dextrose agar (SDA)', d:'Low-pH high-sugar primary fungal medium; selective versions add cycloheximide (suppresses moulds, selects dermatophytes) and chloramphenicol or gentamicin (suppresses bacteria).'},
  {g:'Mycology — clinical &amp; methods', t:'Cornmeal (Dalmau) plate', d:'Cornmeal-Tween 80 agar read under a coverslip (Dalmau technique) encourages yeasts to form pseudohyphae, chlamydoconidia, arthroconidia and blastospore patterns used to separate germ-tube-negative yeasts.'},
  {g:'Mycology — clinical &amp; methods', t:'Lipophilic (lipid-dependent)', d:'Requiring exogenous long-chain fatty acids for growth. Most Malassezia species grow only on lipid-supplemented media (olive-oil overlay, Dixon agar); M. pachydermatis is the non-lipid-dependent exception.'},
  {g:'Mycology — clinical &amp; methods', t:'Hair perforation test', d:'In-vitro test growing the fungus with sterile hair: T. mentagrophytes and M. canis form wedge-shaped perforations (positive), helping separate them from look-alikes such as T. rubrum (negative).'},

];

const organismIndexEntries = [
  {section:'Urine pathways',items:[
    {name:'Staphylococcus spp.',key:'staph',type:'panel'},
    {name:'Streptococcus spp.',key:'strep',type:'panel'},
    {name:'Enterococcus spp.',key:'esp',type:'panel'},
    {name:'Pseudomonas aeruginosa',key:'pseudo',type:'panel'}
  ]},
  {section:'Wound pathways',items:[
    {name:'Staphylococcus aureus / CoNS',key:'w_mssa',type:'panel'},
    {name:'Streptococcus spp. (BHS / AHS)',key:'w_strep',type:'panel'},
    {name:'Streptococcus pneumoniae',key:'w_pneumo1',type:'panel'},
    {name:'Enterococcus spp.',key:'w_esp1',type:'panel'},
    {name:'Pseudomonas aeruginosa',key:'w_pseudo1',type:'panel'},
    {name:'Haemophilus spp.',key:'w_haem1',type:'panel'},
    {name:'Anaerobes',key:'w_anaerobe_mics',type:'panel'},
    {name:'Corynebacterium / GPB',key:'w_gpb1',type:'panel'},
    {name:'Acinetobacter spp.',key:'w_acine',type:'panel'},
    {name:'Aeromonas spp.',key:'w_aero',type:'panel'},
    {name:'Kingella spp.',key:'w_kin',type:'panel'},
    {name:'Listeria monocytogenes',key:'w_list',type:'panel'},
    {name:'Moraxella catarrhalis',key:'w_mor',type:'panel'},
    {name:'Pasteurella spp.',key:'w_past',type:'panel'},
    {name:'Stenotrophomonas maltophilia',key:'w_steno',type:'panel'},
    {name:'Topical ear / eye isolates',key:'w_topical_id',type:'panel'}
  ]}
];

const bactIdFields = ['gram','oxidase','catalase','indole','fermentation','shape','haemolysis','coagulase','aesculin','pyr','spores','dnase','tributyrin','hughleifson','atmosphere','mr','vp','citrate'];
const bactIdOrganisms = [
  {name:'Staphylococcus aureus', group:'Gram-positive cocci', gram:'GP', oxidase:'negative', catalase:'positive', coagulase:'positive', dnase:'positive', haemolysis:'beta', shape:'cocci', fermentation:'glucose', atmosphere:['facultative','co2'], indole:'negative', aesculin:'variable', pyr:'negative', spores:'negative', mr:'positive', vp:'positive', citrate:'negative', note:'Golden colonies can be beta-haemolytic; latex/clumping factor and DNase support ID. Cefoxitin screen for MRSA.'},
  {name:'Coagulase-negative staphylococci', group:'Gram-positive cocci', gram:'GP', oxidase:'negative', catalase:'positive', coagulase:'negative', dnase:'negative', haemolysis:'variable', shape:'cocci', fermentation:'glucose', atmosphere:['facultative','co2'], indole:'negative', aesculin:'variable', pyr:'variable', spores:'negative', mr:'positive', vp:'variable', citrate:'variable', note:'Includes S. epidermidis and S. saprophyticus. Novobiocin helps separate S. saprophyticus in urine workups.'},
  {name:'Streptococcus pyogenes / Group A strep', group:'Beta-haemolytic streptococcus', gram:'GP', oxidase:'negative', catalase:'negative', coagulase:'negative', dnase:'positive', haemolysis:'beta', shape:'cocci', fermentation:'glucose', atmosphere:['facultative','co2'], indole:'negative', aesculin:'negative', pyr:'positive', spores:'negative', mr:'positive', vp:'negative', citrate:'negative', note:'Beta-haemolytic, bacitracin-sensitive pattern classically; PYR positive.'},
  {name:'Streptococcus agalactiae / Group B strep', group:'Beta-haemolytic streptococcus', gram:'GP', oxidase:'negative', catalase:'negative', coagulase:'negative', dnase:'negative', haemolysis:'beta', shape:'cocci', fermentation:'glucose', atmosphere:['facultative','co2'], indole:'negative', aesculin:'variable', pyr:'negative', spores:'negative', mr:'negative', vp:'positive', citrate:'negative', note:'Often narrow beta-haemolysis; CAMP positive in classical identification.'},
  {name:'Streptococcus pneumoniae', group:'Alpha-haemolytic streptococcus', gram:'GP', oxidase:'negative', catalase:'negative', coagulase:'negative', dnase:'negative', haemolysis:'alpha', shape:'cocci', fermentation:'glucose', atmosphere:['facultative','co2'], indole:'negative', aesculin:'negative', pyr:'negative', spores:'negative', mr:'positive', vp:'negative', citrate:'negative', note:'Lancet diplococci; optochin susceptible and bile soluble classically.'},
  {name:'Viridans streptococci / anginosus group', group:'Alpha/gamma streptococci', gram:'GP', oxidase:'negative', catalase:'negative', coagulase:'negative', dnase:'negative', haemolysis:['alpha','gamma','variable'], shape:'cocci', fermentation:'glucose', atmosphere:['facultative','co2'], indole:'negative', aesculin:'variable', pyr:'negative', spores:'negative', mr:'variable', vp:'variable', citrate:'negative', note:'Mixed alpha or non-haemolytic streptococci; anginosus group may form abscesses.'},
  {name:'Enterococcus faecalis', group:'Enterococcus', gram:'GP', oxidase:'negative', catalase:'negative', coagulase:'negative', dnase:'negative', haemolysis:['gamma','variable'], shape:'cocci', fermentation:'glucose', atmosphere:['facultative','co2'], indole:'negative', aesculin:'positive', pyr:'positive', spores:'negative', mr:'positive', vp:'negative', citrate:'negative', note:'Bile aesculin and PYR positive; common urine isolate.'},
  {name:'Enterococcus faecium', group:'Enterococcus', gram:'GP', oxidase:'negative', catalase:'negative', coagulase:'negative', dnase:'negative', haemolysis:['gamma','variable'], shape:'cocci', fermentation:'glucose', atmosphere:['facultative','co2'], indole:'negative', aesculin:'positive', pyr:'positive', spores:'negative', mr:'positive', vp:'negative', citrate:'negative', note:'Often more resistant than E. faecalis; confirm with MALDI or local ID workflow.'},
  {name:'Listeria monocytogenes', group:'Gram-positive rod', gram:'GP', oxidase:'negative', catalase:'positive', coagulase:'negative', dnase:'negative', haemolysis:'beta', shape:'rods', fermentation:'glucose', atmosphere:['facultative','co2'], indole:'negative', aesculin:'positive', pyr:'positive', spores:'negative', mr:'positive', vp:'positive', citrate:'negative', note:'Small beta-haemolytic rods; tumbling motility/umbrella motility classically.'},
  {name:'Corynebacterium spp.', group:'Gram-positive rod', gram:'GP', oxidase:'variable', catalase:'positive', coagulase:'negative', dnase:'variable', haemolysis:['gamma','variable'], shape:'rods', fermentation:'variable', atmosphere:['aerobic','facultative','co2'], indole:'variable', aesculin:'variable', pyr:'variable', spores:'negative', mr:'variable', vp:'variable', citrate:'variable', note:'Club-shaped palisading rods; many are skin flora but some species are significant.'},
  {name:'Bacillus spp.', group:'Spore-forming Gram-positive rod', gram:'GP', oxidase:'variable', catalase:'positive', coagulase:'negative', dnase:'variable', haemolysis:['beta','variable'], shape:'rods', fermentation:'variable', atmosphere:['aerobic','facultative'], indole:'variable', aesculin:'variable', pyr:'variable', spores:'positive', mr:'variable', vp:'positive', citrate:'variable', note:'Aerobic spore-forming rods; B. cereus commonly beta-haemolytic.'},
  {name:'Clostridium spp.', group:'Anaerobic spore-forming rod', gram:'GP', oxidase:'negative', catalase:'negative', coagulase:'negative', dnase:'variable', haemolysis:['beta','variable'], shape:'rods', fermentation:'glucose', atmosphere:'anaerobic', indole:'variable', aesculin:'variable', pyr:'variable', spores:'positive', mr:'variable', vp:'variable', citrate:'variable', note:'Obligate anaerobic spore-forming rods; handle under anaerobic workflow.'},
  {name:'Actinomyces spp.', group:'Anaerobic branching Gram-positive rod', gram:'GP', oxidase:'negative', catalase:'negative', coagulase:'negative', dnase:'negative', haemolysis:'variable', shape:'branching', fermentation:'glucose', atmosphere:['anaerobic','co2'], indole:'negative', aesculin:'variable', pyr:'variable', spores:'negative', mr:'variable', vp:'variable', citrate:'negative', note:'Branching/filamentous rods, often slow-growing anaerobes from deep-seated infections.'},
  {name:'Cutibacterium acnes', group:'Anaerobic Gram-positive rod', gram:'GP', oxidase:'negative', catalase:'positive', coagulase:'negative', dnase:'negative', haemolysis:'none', shape:'rods', fermentation:'glucose', atmosphere:'anaerobic', indole:'positive', aesculin:'negative', pyr:'negative', spores:'negative', mr:'variable', vp:'variable', citrate:'negative', note:'Slow-growing anaerobic skin commensal; consider significance by specimen type and repeats.'},
  {name:'Escherichia coli', group:'Enterobacterales', gram:'GN', oxidase:'negative', catalase:'positive', indole:'positive', fermentation:'lactose', shape:'rods', haemolysis:'variable', coagulase:'negative', aesculin:'variable', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'facultative', mr:'positive', vp:'negative', citrate:'negative', note:'Typical IMViC ++--; common urine and wound isolate. Watch for ESBL/AmpC screens when resistant.'},
  {name:'Klebsiella pneumoniae / oxytoca', group:'Enterobacterales', gram:'GN', oxidase:'negative', catalase:'positive', indole:['negative','variable'], fermentation:'lactose', shape:'rods', haemolysis:'none', coagulase:'negative', aesculin:'variable', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'facultative', mr:'negative', vp:'positive', citrate:'positive', note:'Mucoid lactose fermenter; K. oxytoca is often indole positive whereas K. pneumoniae is usually indole negative.'},
  {name:'Enterobacter cloacae complex', group:'Enterobacterales', gram:'GN', oxidase:'negative', catalase:'positive', indole:'negative', fermentation:'lactose', shape:'rods', haemolysis:'none', coagulase:'negative', aesculin:'variable', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'facultative', mr:'negative', vp:'positive', citrate:'positive', note:'AmpC-risk Enterobacterales; colonies may be late lactose fermenters.'},
  {name:'Citrobacter freundii complex', group:'Enterobacterales', gram:'GN', oxidase:'negative', catalase:'positive', indole:'variable', fermentation:'lactose', shape:'rods', haemolysis:'none', coagulase:'negative', aesculin:'variable', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'facultative', mr:'positive', vp:'negative', citrate:'positive', note:'AmpC-risk group; citrate positive, often H2S variable.'},
  {name:'Proteus mirabilis', group:'Enterobacterales', gram:'GN', oxidase:'negative', catalase:'positive', indole:'negative', fermentation:'non-lactose', shape:'rods', haemolysis:'variable', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'facultative', mr:'positive', vp:'negative', citrate:'positive', note:'Swarming, urease positive, phenylalanine deaminase positive; indole negative.'},
  {name:'Proteus vulgaris group', group:'Enterobacterales', gram:'GN', oxidase:'negative', catalase:'positive', indole:'positive', fermentation:'non-lactose', shape:'rods', haemolysis:'variable', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'facultative', mr:'positive', vp:'negative', citrate:'variable', note:'Swarming Proteus with indole positive pattern.'},
  {name:'Morganella morganii', group:'Enterobacterales', gram:'GN', oxidase:'negative', catalase:'positive', indole:'positive', fermentation:'non-lactose', shape:'rods', haemolysis:'variable', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'facultative', mr:'positive', vp:'negative', citrate:'variable', note:'Urease/PDA positive Proteeae; usually non-lactose fermenter.'},
  {name:'Providencia spp.', group:'Enterobacterales', gram:'GN', oxidase:'negative', catalase:'positive', indole:'variable', fermentation:'non-lactose', shape:'rods', haemolysis:'none', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'facultative', mr:'positive', vp:'negative', citrate:'positive', note:'Proteeae; consider catheter urine association and intrinsic resistance patterns.'},
  {name:'Serratia marcescens', group:'Enterobacterales', gram:'GN', oxidase:'negative', catalase:'positive', indole:'negative', fermentation:'non-lactose', shape:'rods', haemolysis:'none', coagulase:'negative', aesculin:'variable', pyr:'negative', spores:'negative', dnase:'positive', atmosphere:'facultative', mr:'negative', vp:'positive', citrate:'positive', note:'DNase positive, may produce red pigment; AmpC-risk organism.'},
  {name:'Salmonella spp.', group:'Enterobacterales', gram:'GN', oxidase:'negative', catalase:'positive', indole:'negative', fermentation:'non-lactose', shape:'rods', haemolysis:'none', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'facultative', mr:'positive', vp:'negative', citrate:'positive', note:'Non-lactose fermenter, usually H2S positive except some serovars; refer per local pathway.'},
  {name:'Shigella spp.', group:'Enterobacterales', gram:'GN', oxidase:'negative', catalase:'variable', indole:'variable', fermentation:'non-lactose', shape:'rods', haemolysis:'none', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'facultative', mr:'positive', vp:'negative', citrate:'negative', note:'Non-motile non-lactose fermenter; send/confirm under enteric pathogen protocols.'},
  {name:'Yersinia enterocolitica', group:'Enterobacterales', gram:'GN', oxidase:'negative', catalase:'positive', indole:'variable', fermentation:'non-lactose', shape:'coccobacilli', haemolysis:'none', coagulase:'negative', aesculin:'negative', pyr:'positive', spores:'negative', dnase:'negative', atmosphere:'facultative', mr:'positive', vp:'positive', citrate:'negative', note:'Small coccobacillus; urease positive and motility temperature-dependent classically.'},
  {name:'Pseudomonas aeruginosa', group:'Non-fermenting Gram-negative rod', gram:'GN', oxidase:'positive', catalase:'positive', indole:'negative', fermentation:'non-fermenter', shape:'rods', haemolysis:'beta', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'aerobic', mr:'negative', vp:'negative', citrate:'positive', note:'Oxidase positive non-fermenter; often green pigment/grape-like odour; triggers Pseudomonas panels.'},
  {name:'Acinetobacter baumannii complex', group:'Non-fermenting Gram-negative coccobacillus', gram:'GN', oxidase:'negative', catalase:'positive', indole:'negative', fermentation:'non-fermenter', shape:'coccobacilli', haemolysis:'none', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'aerobic', mr:'negative', vp:'negative', citrate:'positive', note:'Oxidase-negative non-fermenting coccobacilli; can be highly resistant.'},
  {name:'Stenotrophomonas maltophilia', group:'Non-fermenting Gram-negative rod', gram:'GN', oxidase:'negative', catalase:'positive', indole:'negative', fermentation:'non-fermenter', shape:'rods', haemolysis:'variable', coagulase:'negative', aesculin:'positive', pyr:'negative', spores:'negative', dnase:'positive', atmosphere:'aerobic', mr:'negative', vp:'negative', citrate:'positive', note:'Oxidase-negative non-fermenter; DNase and aesculin positive are useful clues. Septrin is key in many workflows.'},
  {name:'Burkholderia cepacia complex', group:'Non-fermenting Gram-negative rod', gram:'GN', oxidase:'variable', catalase:'positive', indole:'negative', fermentation:'non-fermenter', shape:'rods', haemolysis:'none', coagulase:'negative', aesculin:'variable', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'aerobic', mr:'negative', vp:'negative', citrate:'positive', note:'Non-fermenter; important in CF/respiratory contexts and usually resistant to aminoglycosides.'},
  {name:'Aeromonas spp.', group:'Oxidase-positive Gram-negative rod', gram:'GN', oxidase:'positive', catalase:'positive', indole:'positive', fermentation:'glucose', shape:'rods', haemolysis:['beta','variable'], coagulase:'negative', aesculin:'variable', pyr:'negative', spores:'negative', dnase:'positive', atmosphere:'facultative', mr:'positive', vp:'variable', citrate:'variable', note:'Water-associated oxidase-positive fermenter; can mimic Enterobacterales except oxidase positive.'},
  {name:'Vibrio spp.', group:'Curved Gram-negative rod', gram:'GN', oxidase:'positive', catalase:'positive', indole:'variable', fermentation:'glucose', shape:'curved', haemolysis:'variable', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'positive', atmosphere:['facultative','co2'], mr:'variable', vp:'variable', citrate:'variable', note:'Curved oxidase-positive rods; halophilic species linked to marine exposure.'},
  {name:'Campylobacter jejuni/coli', group:'Microaerophilic curved Gram-negative rod', gram:'GN', oxidase:'positive', catalase:'positive', indole:'negative', fermentation:'non-fermenter', shape:'curved', haemolysis:'none', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'microaerophilic', mr:'negative', vp:'negative', citrate:'negative', note:'Curved/seagull rods; microaerophilic growth and enteric workflow organism.'},
  {name:'Helicobacter pylori', group:'Microaerophilic curved Gram-negative rod', gram:'GN', oxidase:'positive', catalase:'positive', indole:'negative', fermentation:'non-fermenter', shape:'spiral', haemolysis:'none', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'microaerophilic', mr:'negative', vp:'negative', citrate:'negative', note:'Curved/spiral, urease positive, microaerophilic.'},
  {name:'Haemophilus influenzae', group:'Fastidious Gram-negative coccobacillus', gram:'GN', oxidase:'positive', catalase:'positive', indole:'positive', fermentation:'glucose', shape:'coccobacilli', haemolysis:'none', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:['co2','facultative'], mr:'variable', vp:'negative', citrate:'negative', note:'Requires X and V factors; chocolate agar/CO2 atmosphere.'},
  {name:'Moraxella catarrhalis', group:'Gram-negative diplococcus', gram:'GN', oxidase:'positive', catalase:'positive', indole:'negative', fermentation:'non-fermenter', shape:'cocci', haemolysis:'none', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'positive', atmosphere:['co2','aerobic'], mr:'negative', vp:'negative', citrate:'negative', note:'Oxidase positive diplococci; DNase positive and Tributyrin/butyrate esterase positive classically.'},
  {name:'Neisseria gonorrhoeae', group:'Fastidious Gram-negative diplococcus', gram:'GN', oxidase:'positive', catalase:'positive', indole:'negative', fermentation:'glucose', shape:'cocci', haemolysis:'none', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'co2', mr:'negative', vp:'negative', citrate:'negative', note:'Fastidious oxidase-positive diplococci; glucose only in classic carbohydrate use. Molecular testing may be primary.'},
  {name:'Neisseria meningitidis', group:'Fastidious Gram-negative diplococcus', gram:'GN', oxidase:'positive', catalase:'positive', indole:'negative', fermentation:'glucose', shape:'cocci', haemolysis:'none', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'co2', mr:'negative', vp:'negative', citrate:'negative', note:'Oxidase-positive diplococci; glucose and maltose use classically. Escalate significant isolates.'},
  {name:'Kingella kingae', group:'Fastidious Gram-negative rod/coccobacillus', gram:'GN', oxidase:'positive', catalase:'negative', indole:'negative', fermentation:'glucose', shape:'coccobacilli', haemolysis:'beta', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'co2', mr:'negative', vp:'negative', citrate:'negative', note:'Fastidious beta-haemolytic coccobacillus; oxidase positive, catalase negative.'},
  {name:'Pasteurella multocida', group:'Gram-negative coccobacillus', gram:'GN', oxidase:'positive', catalase:'positive', indole:'positive', fermentation:'glucose', shape:'coccobacilli', haemolysis:'none', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:['facultative','co2'], mr:'positive', vp:'negative', citrate:'negative', note:'Animal bite/scratch association; oxidase, catalase and indole positive.'},
  {name:'Bacteroides fragilis group', group:'Anaerobic Gram-negative rod', gram:'GN', oxidase:'negative', catalase:'positive', indole:'variable', fermentation:'glucose', shape:'rods', haemolysis:'none', coagulase:'negative', aesculin:'positive', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'anaerobic', mr:'variable', vp:'variable', citrate:'variable', note:'Bile-resistant anaerobic Gram-negative rods; often abscess/deep wound isolates.'},
  {name:'Prevotella spp.', group:'Anaerobic Gram-negative rod', gram:'GN', oxidase:'negative', catalase:'variable', indole:'variable', fermentation:'glucose', shape:'rods', haemolysis:'variable', coagulase:'negative', aesculin:'variable', pyr:'variable', spores:'negative', dnase:'variable', atmosphere:'anaerobic', mr:'variable', vp:'variable', citrate:'variable', note:'Pigmented and non-pigmented anaerobic rods; oral/genital/soft tissue flora.'},
  {name:'Fusobacterium spp.', group:'Anaerobic Gram-negative rod', gram:'GN', oxidase:'negative', catalase:'negative', indole:'variable', fermentation:'variable', shape:'rods', haemolysis:'variable', coagulase:'negative', aesculin:'negative', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:'anaerobic', mr:'variable', vp:'variable', citrate:'negative', note:'Anaerobic slender/fusiform rods; F. necrophorum is clinically important in throat/deep infections.'},
  {name:'Gardnerella vaginalis', group:'Gram-variable coccobacillus', gram:'GV', oxidase:'negative', catalase:'negative', indole:'negative', fermentation:'glucose', shape:'coccobacilli', haemolysis:'beta', coagulase:'negative', aesculin:'positive', pyr:'negative', spores:'negative', dnase:'negative', atmosphere:['co2','anaerobic'], mr:'variable', vp:'variable', citrate:'negative', note:'Gram-variable coccobacilli; associated with bacterial vaginosis context rather than routine wound ID.'}
];

const bactIdTributyrinMap = {
  'Moraxella catarrhalis':'positive',
  'Neisseria gonorrhoeae':'negative',
  'Neisseria meningitidis':'negative',
  'Kingella kingae':'negative'
};
const bactIdHughLeifsonMap = {
  'Staphylococcus aureus':'fermentative',
  'Coagulase-negative staphylococci':'fermentative',
  'Streptococcus pyogenes / Group A strep':'fermentative',
  'Streptococcus agalactiae / Group B strep':'fermentative',
  'Streptococcus pneumoniae':'fermentative',
  'Viridans streptococci / anginosus group':'fermentative',
  'Enterococcus faecalis / faecium':'fermentative',
  'Listeria monocytogenes':'fermentative',
  'Corynebacterium spp.':'fermentative',
  'Bacillus spp.':'variable',
  'Clostridium spp.':'fermentative',
  'Cutibacterium acnes':'fermentative',
  'Actinomyces spp.':'fermentative',
  'Escherichia coli':'fermentative',
  'Klebsiella pneumoniae / oxytoca':'fermentative',
  'Enterobacter cloacae complex':'fermentative',
  'Citrobacter freundii complex':'fermentative',
  'Serratia marcescens':'fermentative',
  'Proteus mirabilis':'fermentative',
  'Proteus vulgaris':'fermentative',
  'Morganella morganii':'fermentative',
  'Providencia spp.':'fermentative',
  'Salmonella enterica':'fermentative',
  'Shigella spp.':'fermentative',
  'Yersinia enterocolitica':'fermentative',
  'Pseudomonas aeruginosa':'oxidative',
  'Acinetobacter baumannii complex':'oxidative',
  'Stenotrophomonas maltophilia':'oxidative',
  'Burkholderia cepacia complex':'oxidative',
  'Aeromonas spp.':'fermentative',
  'Vibrio spp.':'fermentative',
  'Campylobacter jejuni/coli':'asaccharolytic',
  'Helicobacter pylori':'asaccharolytic',
  'Haemophilus influenzae':'fermentative',
  'Moraxella catarrhalis':'asaccharolytic',
  'Neisseria gonorrhoeae':'oxidative',
  'Neisseria meningitidis':'oxidative',
  'Kingella kingae':'fermentative',
  'Pasteurella multocida':'fermentative',
  'Bacteroides fragilis group':'fermentative',
  'Prevotella spp.':'fermentative',
  'Fusobacterium spp.':'variable',
  'Gardnerella vaginalis':'fermentative'
};


/* ════════════════════════════════════════════════════════════════════
   GUIDELINE VERSION STAMPS  (added v25)
   Single source of truth for the "based on / reviewed" badge shown per
   view. Values here are the same citations already used in the view
   heroes/footers — consolidated so they live in one place and can be
   updated in one edit. Set `reviewed` to the date you last checked each
   view against the current source, for ISO 15189 / UKAS traceability.

   Per-view entry: { lines:[{label, version}], reviewed:'YYYY-MM' | '—' }
   `reviewed:'—'` renders as "review date not set".
   ════════════════════════════════════════════════════════════════════ */
const GUIDELINE_VERSIONS = {
  _meta: { appData: 'v25', reviewed: '—' },   // global app data version + last full review
  flow:    { lines:[{label:'EUCAST clinical breakpoints', version:'set version'}], reviewed:'—' },
  wound:   { lines:[{label:'EUCAST clinical breakpoints', version:'set version'}], reviewed:'—' },
  interp:  { lines:[{label:'EUCAST clinical breakpoints', version:'set version'},{label:'MAST D-set IFUs', version:'local'}], reviewed:'—' },
  checker: { lines:[{label:'EUCAST clinical breakpoints', version:'PLACEHOLDER — UNVALIDATED'}], reviewed:'—' },
  rules:   { lines:[{label:'EUCAST Expected Resistant Phenotypes', version:'v1.2 (2023)'},{label:'Expert Rules', version:'v3.3'}], reviewed:'—' },
  myco:    { lines:[{label:'UK SMI ID 1', version:'Issue 4 (06.08.25)'},{label:'EUCAST antifungal breakpoints', version:'v10.0 (2020)+updates'}], reviewed:'—' },
  plate:   { lines:[{label:'Schematic reference', version:'local media'}], reviewed:'—' },
  virology:{ lines:[{label:'Assay IFUs + local SOP', version:'local'}], reviewed:'—' }
};

/* ════════════════════════════════════════════════════════════════════
   ZONE-DIAMETER S / I / R CHECKER  (added v25)

   ⚠ PLACEHOLDER DATA — NOT VALIDATED FOR CLINICAL USE ⚠
   The breakpoints below are illustrative starter values to exercise the
   engine. They are NOT a substitute for the current EUCAST clinical
   breakpoint table or your local validated SOP, and several agents have
   site-specific (e.g. uncomplicated UTI only) or surrogate-screen
   breakpoints that are easy to misapply.

   BEFORE ANY BENCH USE: open the current EUCAST breakpoint table for your
   region, correct every S/R value and disc content, then flip that
   agent's `ok:true`. The view shows validation progress and refuses to
   look authoritative until you have signed each value off.

   Interpretation rule (EUCAST disc diffusion):
     zone ≥ S  → S        (susceptible, standard dosing)
     zone < R  → R        (resistant)
     R ≤ zone < S → I     (susceptible, increased exposure)
     If S === R there is no I band (binary S/R).
   Fields: agent, disc (µg/label), S (mm), R (mm), ok (validated?),
           note (site/surrogate caveat), screen (true = surrogate screen).
   ════════════════════════════════════════════════════════════════════ */
const sirBreakpoints = {
  version: 'PLACEHOLDER — replace with current EUCAST table before use',
  groups: [
    { id:'entero', name:'Enterobacterales', agents:[
      {agent:'Ampicillin',                disc:'10 µg', S:14, R:14, ok:false, note:'Binary S/R. E. coli/P. mirabilis only.'},
      {agent:'Amoxicillin-clavulanate',   disc:'20-10 µg', S:19, R:19, ok:false, note:'Uncomplicated UTI breakpoints differ — check site.'},
      {agent:'Mecillinam',                disc:'10 µg', S:15, R:15, ok:false, note:'Uncomplicated UTI only.'},
      {agent:'Cefpodoxime',               disc:'10 µg', S:21, R:21, ok:false, note:'Screening surrogate for ESBL/AmpC.', screen:true},
      {agent:'Ceftriaxone',               disc:'30 µg', S:25, R:22, ok:false, note:''},
      {agent:'Cefoxitin',                 disc:'30 µg', S:19, R:19, ok:false, note:'AmpC screen surrogate, not a reportable result.', screen:true},
      {agent:'Ciprofloxacin',             disc:'5 µg',  S:25, R:22, ok:false, note:''},
      {agent:'Gentamicin',                disc:'10 µg', S:17, R:17, ok:false, note:''},
      {agent:'Amikacin',                  disc:'30 µg', S:18, R:15, ok:false, note:''},
      {agent:'Trimethoprim',              disc:'5 µg',  S:18, R:15, ok:false, note:'Uncomplicated UTI only.'},
      {agent:'Nitrofurantoin',            disc:'100 µg',S:11, R:11, ok:false, note:'Uncomplicated UTI; E. coli only.'},
      {agent:'Piperacillin-tazobactam',   disc:'30-6 µg',S:20, R:17, ok:false, note:''},
      {agent:'Temocillin',                disc:'30 µg', S:20, R:20, ok:false, note:'UTI breakpoint differs.'},
      {agent:'Ertapenem',                 disc:'10 µg', S:25, R:22, ok:false, note:'Carbapenemase screen if reduced.', screen:true},
      {agent:'Meropenem',                 disc:'10 µg', S:22, R:16, ok:false, note:'Carbapenemase screen <28 mm.'}
    ]},
    { id:'pseud', name:'Pseudomonas aeruginosa', agents:[
      {agent:'Piperacillin-tazobactam',   disc:'30-6 µg',S:50, R:18, ok:false, note:'P. aeruginosa uses "S increased exposure" model.'},
      {agent:'Ceftazidime',               disc:'10 µg', S:50, R:17, ok:false, note:''},
      {agent:'Cefepime',                  disc:'30 µg', S:50, R:19, ok:false, note:''},
      {agent:'Ciprofloxacin',             disc:'5 µg',  S:50, R:26, ok:false, note:''},
      {agent:'Levofloxacin',              disc:'5 µg',  S:50, R:21, ok:false, note:''},
      {agent:'Meropenem',                 disc:'10 µg', S:24, R:18, ok:false, note:''},
      {agent:'Tobramycin',                disc:'10 µg', S:18, R:16, ok:false, note:''},
      {agent:'Amikacin',                  disc:'30 µg', S:18, R:15, ok:false, note:''}
    ]},
    { id:'staph', name:'Staphylococcus spp.', agents:[
      {agent:'Cefoxitin (MRSA screen)',   disc:'30 µg', S:22, R:22, ok:false, note:'Surrogate for meticillin resistance. S. aureus cutoff; CoNS differs.', screen:true},
      {agent:'Erythromycin',              disc:'15 µg', S:21, R:18, ok:false, note:'Check inducible clinda (D-zone).'},
      {agent:'Clindamycin',               disc:'2 µg',  S:22, R:19, ok:false, note:''},
      {agent:'Trimethoprim-sulfamethoxazole', disc:'1.25-23.75 µg', S:17, R:14, ok:false, note:''},
      {agent:'Tetracycline',              disc:'30 µg', S:22, R:19, ok:false, note:''},
      {agent:'Gentamicin',                disc:'10 µg', S:18, R:18, ok:false, note:''},
      {agent:'Fusidic acid',              disc:'10 µg', S:24, R:24, ok:false, note:''},
      {agent:'Rifampicin',                disc:'5 µg',  S:26, R:23, ok:false, note:''},
      {agent:'Linezolid',                 disc:'10 µg', S:21, R:21, ok:false, note:''},
      {agent:'Norfloxacin (FQ screen)',   disc:'10 µg', S:17, R:17, ok:false, note:'Fluoroquinolone screen.', screen:true}
    ]},
    { id:'strep', name:'Streptococcus (β-haemolytic A/B/C/G)', agents:[
      {agent:'Benzylpenicillin',          disc:'1 unit',S:18, R:18, ok:false, note:'Group A/B/C/G; pneumococci differ.'},
      {agent:'Erythromycin',              disc:'15 µg', S:21, R:18, ok:false, note:'Check inducible clinda (D-zone).'},
      {agent:'Clindamycin',               disc:'2 µg',  S:19, R:16, ok:false, note:''},
      {agent:'Tetracycline',              disc:'30 µg', S:23, R:20, ok:false, note:''},
      {agent:'Levofloxacin',              disc:'5 µg',  S:17, R:14, ok:false, note:''},
      {agent:'Vancomycin',                disc:'5 µg',  S:13, R:13, ok:false, note:''},
      {agent:'Teicoplanin',               disc:'30 µg', S:15, R:15, ok:false, note:''}
    ]},
    { id:'entc', name:'Enterococcus spp.', agents:[
      {agent:'Ampicillin',                disc:'2 µg',  S:10, R:8,  ok:false, note:'E. faecalis; E. faecium often intrinsically R.'},
      {agent:'Vancomycin',                disc:'5 µg',  S:12, R:12, ok:false, note:'Read at full 24 h; suspect VRE if hazy/reduced.'},
      {agent:'Teicoplanin',               disc:'30 µg', S:16, R:16, ok:false, note:''},
      {agent:'Linezolid',                 disc:'10 µg', S:19, R:19, ok:false, note:''},
      {agent:'Gentamicin (high-level)',   disc:'30 µg', S:8,  R:8,  ok:false, note:'HLAR screen only — synergy prediction.', screen:true},
      {agent:'Nitrofurantoin',            disc:'100 µg',S:15, R:15, ok:false, note:'Uncomplicated UTI only.'},
      {agent:'Norfloxacin (FQ screen)',   disc:'10 µg', S:12, R:12, ok:false, note:'UTI fluoroquinolone screen.', screen:true}
    ]}
  ]
};
