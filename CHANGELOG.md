# InnerLoop — CHANGELOG

## [0.1.0] — 2026-02-28 — Batch 1: Project Init + Landing Page

### Overview
Initialized the InnerLoop React project and built the full "Helping the Inner as a Looper" one-page landing site.

### Files Created

| File | Purpose |
|---|---|
| `package.json` | Project manifest — React 18, Vite 5, Tailwind 3, lucide-react icons, react-router-dom |
| `vite.config.js` | Vite dev server config with React plugin |
| `tailwind.config.js` | Tailwind theme extended with the **strict InnerLoop color palette** (`loop-red`, `loop-purple`, `loop-gray`, `loop-green`, `loop-blue`) and custom fonts (Inter, Outfit) |
| `postcss.config.js` | PostCSS wiring for Tailwind + Autoprefixer |
| `index.html` | Root HTML — loads Google Fonts (Inter + Outfit), sets base `<body>` classes |
| `src/main.jsx` | React entry point — mounts `<App />` into `#root` |
| `src/index.css` | Global styles — Tailwind directives, `.btn-primary`, `.btn-secondary`, `.section-padding` utility classes |
| `src/App.jsx` | App root component — currently renders `<LandingPage />` |
| `src/pages/LandingPage.jsx` | **Full landing page** with 8 sections (see below) |

### Landing Page Sections (`LandingPage.jsx`)

1. **Navbar** — Fixed top nav with logo, anchor links, mobile hamburger menu
2. **Hero** — "Helping the Inner as a Looper" headline, tagline, CTAs, mock feed card illustration, social proof strip
3. **Mission** — Three-pillar value props (Hyper-Local, Trust Built-In, Real Rewards)
4. **How It Works** — Side-by-side Looper vs. Inner explainer cards with feature lists
5. **Rewards** — Star Rating, Verified Hours, Loop Credits breakdown + **Waitlist 2× Multiplier** callout
6. **Privacy & Fairness** — Explains task-detail privacy for Loopers + Inner Loop private layer for Inners
7. **FAQ** — Accordion with 4 common questions
8. **Join CTA** — Dual sign-up buttons (Looper / Inner)
9. **Footer** — Logo, copyright, nav links

### Design Decisions
- All colors strictly use the `loop-*` Tailwind tokens — no raw hex in components
- Fonts: **Outfit** for display headings, **Inter** for body text
- Responsive: mobile-first grid layouts, collapsible nav
- Icons from `lucide-react` (tree-shakeable, lightweight)

### How It Connects to the Broader System
- `react-router-dom` is installed but not yet wired — will be used in Batch 2 for routing to Auth/Feed/Profile views
- The CTA buttons ("Sign Up as Looper" / "Register as Inner") are placeholder `<button>`s that will link to the auth flow
- The mock feed card in the hero previews the actual feed card component we'll build for the Local Feed view
