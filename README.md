# California Executive Clemency Dashboard (2019–2026)

**Live dashboard → [https://newanforbi.github.io/california-clemency-data/](https://newanforbi.github.io/california-clemency-data/)**

An interactive, single-page data dashboard analyzing executive clemency in California under Governor Gavin Newsom — 271 pardons, 166 commutations, and 43 reprieves across six years of criminal justice reform.

---

## What It Answers

The dashboard directly addresses 10 research questions derived from the annual clemency reports:

| # | Question | Visualization |
|---|---|---|
| 1 | Trends over time | Grouped bar + cumulative line chart |
| 2 | Demographic disparities | Gender/race doughnuts, age bracket comparison |
| 3 | Policy impact | Annotated line chart with 5 policy event markers |
| 4 | Offense-specific patterns | Applications vs. pardons vs. commutations doughnuts |
| 5 | Geographic distribution | D3 choropleth — California county grant rates |
| 6 | Qualitative predictors | Grant reasons vs. denial reasons horizontal bars |
| 7 | Recidivism & outcomes | Recipients (~8%) vs. general parolees (~45%) |
| 8 | Comparative analysis | CA vs. CT, OH, Federal (Obama/Trump) |
| 9 | Notable cases | Wait-time chart + 5 narrative case study cards |
| 10 | Victim & community impact | CalVIP ($107M), CARE Court ($291M), stat grid |

---

## Running Locally

No build step, no server required. Just open the file:

```
open index.html
# or double-click index.html in your file explorer
```

The map section fetches California county boundaries from a public CDN (`us-atlas`). All other charts are fully offline.

---

## Tech Stack

| Layer | Tool |
|---|---|
| Charts | [Chart.js v4](https://www.chartjs.org/) + [chartjs-plugin-annotation](https://www.chartjs.org/chartjs-plugin-annotation/) |
| Map | [D3.js v7](https://d3js.org/) + [TopoJSON](https://github.com/topojson/topojson) |
| Fonts | Inter via Google Fonts |
| Build | None — pure HTML/CSS/JS |

---

## Data Source

All data is synthesized from the California Governor's Office **Annual Executive Reports on Clemency** (2019–2024) and supplementary sources. See `claude.md` for the full source document and `data.js` for structured constants with provenance comments.

Application volumes, demographic percentages, and recidivism figures are estimates; fields marked with `*` in the dashboard are not exact administrative counts.

---

## File Structure

```
├── index.html   — Dashboard shell (10 sections, CDN imports)
├── data.js      — All structured data constants
├── charts.js    — Chart.js rendering + DOM generation
├── map.js       — D3 choropleth for geographic section
├── styles.css   — Design system (navy/gold/teal, CSS Grid)
└── claude.md    — Source analysis document
```
