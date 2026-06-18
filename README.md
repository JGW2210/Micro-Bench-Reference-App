# Microbiology Bench Reference

A single-page, bench-side reference tool for clinical microbiology laboratory
scientists, covering culture, sensitivity, and molecular workflows. It runs
entirely in the browser as a static site — no framework, no build step, no
server-side component.

> [!IMPORTANT]
> This is a quick-reference aid, **not** a substitute for official guidance,
> validated SOPs, or professional judgement. Always confirm interpretations
> against the current EUCAST breakpoint tables, UK SMIs, and manufacturer
> Instructions For Use (IFUs). The bundled reference PDFs are third-party
> documents retained for citation/traceability and remain the property of
> their respective publishers (EUCAST, UK Health Security Agency / UK SMI,
> and assay manufacturers), under their own terms.

## What's in it

The app provides reference views including specimen workflows (wound, CSF,
faeces, blood culture), antimicrobial susceptibility interpretation (EUCAST
breakpoints, expert rules, a zone-diameter S/I/R checker, MAST D-set
calculators), organism/abx indexes, mycology, parasitology, serology, and
molecular assay panels — each cross-referenced to its source document.

## Project layout

| Path | Purpose |
| --- | --- |
| `index.html` | App shell and all view markup |
| `app.js` | All UI behaviour and rendering (vanilla JS, global scope) |
| `data.js` | The dataset: panels, organisms, breakpoints, and citation catalogues |
| `styles.css` | Styling, light/dark themes, print stylesheet |
| `tests/validate-data.js` | Data-integrity checks (schema, disc loads, citation→PDF on disk) |
| `tests/audit-citations.js` | Re-derives citation coverage and flags orphan tags / unresolved codes |
| `EUCAST-CITATIONS.md`, `SMI-CITATIONS.md`, `MYCOLOGY-VIROLOGY-CITATIONS.md` | Human-readable citation companions |
| `EUCAST/`, `SMIs/`, `IFUs/`, `Extra References/` | Third-party reference PDFs (citation source-of-truth, not loaded at runtime) |

## Running locally

It's a static site, so any static file server works. A convenience script is
provided (requires Python 3):

```sh
npm run serve   # serves at http://localhost:8000
```

Then open <http://localhost:8000>. Prefer a real server over opening
`index.html` via `file://`, as the latter can behave differently.

## Checks and tests

No dependencies are required — both commands run on a stock Node install:

```sh
npm run check   # node --check on data.js and app.js (syntax)
npm test        # data validation + citation coverage audit
```

These run automatically on every push and pull request via GitHub Actions
(`.github/workflows/ci.yml`).

## Release / deploy ritual

Assets are versioned with a manual cache-bust query string in `index.html`
(currently `?v=20260618i` on the `styles.css`, `data.js`, and `app.js`
references). **When you change any of those assets, bump that version string**
so clients pick up the new files instead of a stale cache. Run
`npm run check && npm test` before pushing.

## License

The project's own code is released under the MIT License (see `LICENSE`). The
bundled reference PDFs are not covered by that license — see the note at the
top of this file.
