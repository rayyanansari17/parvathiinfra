# THE VIEW · Interactive Tour

Node-based virtual walkthrough at `/the-view/walkthrough`, entry point `app/the-view/walkthrough/page.jsx` → `TourShell.jsx`.

## Files

- `TourShell.jsx` — orchestrator: current node index, autoplay, audio, keyboard/swipe nav, body-scroll lock, preloading.
- `TourNode.jsx` — a single cinematic scene: GSAP Ken Burns, 2.5D parallax, grain/vignette, caption, forward + info hotspots.
- `MasterPlan.jsx` — Node 10: pan/zoom layout plan, 41 plot hotspots, amenity pins A–I, filters, side panels.
- `TourPreloader.jsx`, `TopBar.jsx`, `ProgressLine.jsx`, `ChapterRail.jsx`, `MiniMap.jsx`, `InfoPanel.jsx`, `CTACard.jsx` — supporting UI.

## Data

- `src/data/tour.json` — the 10 nodes (copy, image, camera params, forward hotspot, info hotspots, mini-map position) + `amenityPins` (A–I).
- `src/data/plots.json` — verbatim client data: project stats + `plots[]` (verified, with `sqyd`/`sqft`/optional `level`) + `unverifiedPlots` (id list) + `unverifiedPositions` (id + `pos`).

## Swapping an image

1. Drop the new file into `public/assets/tour/`.
2. Update the `image` path in `tour.json` (or `MasterPlan.jsx` for `10-layout-plan.jpg` / `badge-fcda.jpg` / `logo-theview.jpg` references).

## Adding a node

1. Insert a new object into `tour.json`'s `nodes` array at the desired position, reindex `index` for every node after it.
2. Give it a unique `id`, `title`, `chapter`, `copy` (no em dashes), `image`, `camera` Ken Burns params, `forwardHotspot`, `infoHotspots`, `miniMapPos`.
3. `TourShell.jsx` reads `NODES` straight from the JSON; no other code changes needed unless the node is the Master Plan (id `"masterplan"`, matched by id, not position).

## Editing plot data

Edit `src/data/plots.json` directly. Only put a plot in `plots[]` if its sqyd/sqft are confirmed by the client; otherwise it belongs in `unverifiedPositions` (with just an `id` and `pos`) and its id in `unverifiedPlots`. Never invent a sold/reserved status; every plot enquires as "Available · Enquire".

## Tuning hotspot / pin coordinates

All coordinates in both JSON files are `{ "x": <percent>, "y": <percent> }` measured from the top-left of the relevant image. Every coordinate in this build (plot positions, amenity pins, forward hotspots, info hotspots, mini-map dots) was estimated by eye against the source renders/drawing and should be treated as a first pass — nudge the `x`/`y` values while looking at the live page (they update instantly, no rebuild logic to touch).
