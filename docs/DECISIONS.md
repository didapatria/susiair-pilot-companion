# Decision Notes

Engineering decisions made up front for this test, with the reasoning. Kept short on purpose — the README covers the how.

| # | Topic | Decision & why |
|---|-------|----------------|
| 1 | **SCSS over Tailwind** | The brief's mandatory stack lists SCSS; the invitation email mentioned Tailwind. Followed the formal brief: token maps in `abstracts/_tokens.scss` emitted as CSS custom properties, BEM-ish class naming, `@use` only. Happy to adapt if Tailwind is preferred. |
| 2 | **Fixed "today" = 2026-05-31** | The brief says to treat today as 31 May 2026 so the chart has data on both sides. A constant (`APP_TODAY`) also makes SSR hydration-safe and immune to timezone off-by-one — all date math is pure UTC epoch-day arithmetic on ISO strings, never local-time `Date`. |
| 3 | **Schedule rendering is data-driven** | The legend renders from the JSON `legend[]`; each day cell is filled with its record's `base_color` (the dataset's `fieldGuide` marks it as the fill source of truth), while the duty label resolves from `duty_type`. One record deliberately carries a color that differs from its type's legend color — it renders as the data says. Statuses render verbatim; the completed tick derives from `count_logbooks === count_schedules`, never recomputed from dates (the schedules file carries its own internal date). |
| 4 | **Chart bounds from JSON `chartBounds`** | `limit / max / windowDays / displayRangeDays` are read from the file per toggle, not hardcoded — the brief says to use the file directly. Where the PDF table and the JSON disagree (`1y` max 1250 vs 1200), the JSON wins. |
| 5 | **Hand-rolled SVG chart** | The spec is small and fixed: 15 points, one series, one limit line, five toggles. Direct SVG gives exact control over the limit line, today marker, tap tooltip, and over-limit emphasis (clipPath above the limit re-colors the exceeded segment red and fills a soft red band), with zero added bundle weight. |
| 6 | **Airport codes displayed as provided** | `HLP`, `CJN`, `MKW`, `PDG`, `SIQ` render exactly as in the data as `CODE · City`, mirroring the brief's own example. |
| 7 | **Nuxt 4, SSR on, strict TypeScript, pnpm** | Latest stable Nuxt with the `app/` source directory; SSR is safe because of decision 2. `pages/ components/ composables/ layouts/` match the structure the brief asks to see. |
| 8 | **Static imports + simulated latency** | No backend and no API calls: typed static imports from `app/assets/data/`. Store `load()` actions wrap the import behind ~400 ms so skeleton loading states genuinely render (`useLazyAsyncData(..., { server: false })` ships skeletons in the SSR HTML). |
| 9 | **Engine correctness proven by fixtures** | The rolling engine is a pure module using prefix sums in integer tenths (lossless for 1-decimal data). Unit tests assert precomputed values: all four cards, both full 15-point series (1w/1m), the exact 1m over-limit dates, 3m/6m/1y spot values, edge clamping at both dataset ends, and the 1,444.5 h integrity sum. |
| 10 | **Repo hygiene** | The recruitment attachments (brief PDF, original mock files) stay out of the repository; the app's copy of the mock data ships in `app/assets/data/`. Screenshots used by the README live in `docs/screenshots/`. |

Post-completion visual polish pass: numeric typography, chart annotation (today marker, peak callout, limit chip), calendar contrast fix (WCAG-ratio ink picker), document urgency summary, livery-stripe motif and motion refinements — presentation layer only, no logic changes.
