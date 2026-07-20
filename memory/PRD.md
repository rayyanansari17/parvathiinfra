# PRD — Parvathi Infra Developers · THE VIEW

## Original Problem Statement
Build an Awwwards-Site-of-the-Day caliber luxury real-estate website for **Parvathi Infra Developers** with their flagship venture **THE VIEW** — a gated villa-plot community (45 plots · 3.6 acres) near Kadthal, Telangana.

Non-negotiables:
- High-end dark theme (obsidian + champagne/metallic gold foil accents).
- Cinematic, buttery-smooth scroll storytelling using GSAP, ScrollTrigger, Framer Motion, and Lenis.
- Distinctive cinematic preloader (SVG stroke-draw of THE VIEW wordmark).
- Realistic assets from provided brochure PDF, drone videos, master plan.
- AI concierge chatbot ("Aria") trained on the project's verified facts.
- Pages: Home, About Us, Projects, The View (immersive flagship), Gallery, Contact.
- Lead capture form + gated brochure capture (email wiring deferred).
- WhatsApp floating widget with gold ring pulse.
- No dummy team names; avoid AI-slop design patterns.
- i18n framework (English, Telugu, Hindi) — P1.

## Users
- Prospective high-net-worth buyers researching luxury villa plots.
- Sales & concierge team consuming captured leads from `/api/leads`.
- Investors & partners viewing portfolio overview.

## Tech Stack
- **Frontend**: React 19 (CRA + craco), TailwindCSS, Framer Motion, GSAP, Lenis smooth scroll, Embla, Radix/Shadcn primitives, lucide-react.
- **Backend**: FastAPI, MongoDB (Motor).
- **AI**: Emergent LLM Key → Claude Sonnet 4.5 via `emergentintegrations`.

## Architecture
```
/app/
├── backend/
│   ├── server.py              # /api/leads, /api/brochure-request, /api/chat, /api/chat/{id}
│   ├── tests/backend_test.py  # 8 pytest cases, all green
│   └── .env
├── frontend/
│   ├── public/assets/         # hero video, brochure PDF + PNGs, master plan, scale model
│   └── src/
│       ├── App.js             # BrowserRouter + routes
│       ├── components/site/   # SiteLayout, Navigation, Preloader, CustomCursor,
│       │                        Chatbot, LeadForm, BrochureModal, WhatsAppFloat,
│       │                        Footer, Reveal helpers
│       ├── pages/             # Home, About, Projects, TheView, Gallery, Contact
│       ├── hooks/useLenis.js
│       ├── lib/{api,siteData}.js
│       └── constants/testIds/ # NAV, HOME_PAGE, THE_VIEW_PAGE, CHAT, LEAD, BROCHURE, …
├── design_guidelines.json
└── memory/{PRD.md, test_credentials.md}
```

## API Endpoints
| Method | Route                       | Purpose                                                |
|--------|-----------------------------|--------------------------------------------------------|
| GET    | `/api/`                     | Health / branding message                              |
| POST   | `/api/leads`                | Capture lead (name, phone, email?, message?, source?)  |
| GET    | `/api/leads`                | List leads (admin)                                     |
| POST   | `/api/brochure-request`     | Gated brochure download capture (+creates lead)        |
| POST   | `/api/chat`                 | Aria concierge chat with session memory                |
| GET    | `/api/chat/{session_id}`    | Chat history                                           |

## Data Models
- `leads` — `{id, name, phone, email?, project_interested, message?, source, created_at}`
- `brochure_requests` — `{id, name, phone, email, created_at}`
- `chat_messages` — `{id, session_id, role, content, created_at}`

## What's been implemented — 20 Feb 2026 (Walkthrough refactor)
- ✅ **Interactive Walkthrough — GSAP image-sequence film**. Replaced the blurry HTML5 `<video>` (film.mp4) with a **scroll-scrubbed 7-scene image sequence** using GSAP ScrollTrigger:
  - `/app/frontend/src/lib/walkthroughData.js` — new `FILM_SCENES` array (page-1.jpg … page-7.jpg) each with title, copy, chapter label, and per-scene Ken Burns anchors (from/to translate + scale).
  - `/app/frontend/src/components/site/WalkthroughFilm.jsx` — full rewrite. Preloads all 7 images, pins the section for `sceneCount × 100vh`, cross-fades layer opacities and animates Ken Burns transforms on scroll. Chapter rail, prev/next, skip-to-layout, and Parvathi flags overlay on Chapter 3 all retained.
  - Removed `film.mp4` (~12 MB) and dead `WALKTHROUGH_FILM` / `CAPTIONS` / `CHAPTERS` constants.
  - Testing agent (iteration_5): 100% pass, zero console errors, verified all 11 checkpoints (no `<video>`, all 7 layers, chapter dots, jump-to-scene, gate flags, skip-to-layout, pin release).

## What's been implemented — earlier
- ✅ Backend (`/app/backend/server.py`) — leads, brochure-request, Aria chatbot with session context (Claude Sonnet 4.5), history endpoint. 100% pytest green (8/8).
- ✅ Tailwind theme (obsidian + gold) + fonts (Cinzel / Cormorant Garamond / Jost) wired in `index.css`, `tailwind.config.js`, `public/index.html`.
- ✅ Global chrome: cinematic SVG stroke-draw preloader, luxury nav with scroll frost, custom gold cursor, gold-pulse WhatsApp float, footer.
- ✅ Aria chatbot widget wired to `/api/chat` with localStorage session persistence.
- ✅ Home page — hero video, gold-foil headline, marquee of approvals, pull-quote, animated stats, flagship spotlight, projects grid, lead CTA.
- ✅ About page — hero, philosophy quote, three studio values, scrolling milestones timeline, lead CTA.
- ✅ Projects page — three-project portfolio grid (THE VIEW, Studio Archive, Estate 04).
- ✅ The View flagship page — pinned/scrolled hero video, overture stats, editorial manifesto, **interactive master plan** with All/Available/Sold filters and per-plot hover tooltips, amenities grid (8), infrastructure (8), connectivity list (7) + Google Map embed, editorial gallery, FAQ accordion (5), preview form CTA.
- ✅ Gallery — masonry columns with category filters, lightbox modal, includes brochure page renders.
- ✅ Contact — split lead form + office/site/email/WhatsApp cards + map.
- ✅ Gated brochure modal — captures lead then reveals download link to `/assets/brochure.pdf`.
- ✅ Lead capture across all major pages, hitting `/api/leads`.
- ✅ Testing agent full regression: 100% backend (8/8) + 100% frontend (41/41 UI checks).
- ✅ POST endpoints return 201 for REST semantics.

## Backlog / Next Actions
- **P1 · i18n** — install `react-i18next`, wire English/Telugu/Hindi toggles, extract copy into locale files.
- **P1 · Real content** — replace `SITE.whatsappNumber` placeholder (`919000000000`) once real number provided; swap phone number.
- **P1 · Email wiring** — user asked to defer; wire Resend when green-lit for brochure download & lead notifications.
- **P1 · Embla premium carousels** — polish amenities & testimonials into a horizontal-scroll editorial carousel.
- **P2 · GSAP ScrollTrigger** — add a scroll-scrubbed drone flythrough with pinned parallax between hero and master plan.
- **P2 · Rate limiting** — add lightweight IP throttle on POST endpoints (slowapi) before production.
- **P2 · Chat memory** — cap conversation transcript in server-side folding to last N messages.
- **P2 · Testimonials slider** — add on About + The View.
- **P2 · Admin CRM view** — password-protected `/admin/leads` route to review leads inline.

## Known Notes
- WhatsApp number is a placeholder — user will provide real one.
- Custom cursor auto-disables on touch devices.
- Preloader shows for ~2.8s once per full navigation.
- The framer-motion `useScroll` on TheView hero emits a benign container-position warning; not user-visible.
