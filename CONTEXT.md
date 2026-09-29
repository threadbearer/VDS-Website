# Architecture & Context for Vega Design Studio

> **Single Source of Truth** for AI assistants, agents, and engineers working in this repository.  
> This document maps every file, architectural pattern, design token, data contract, pricing tier, and backlog item.  
> **Rule**: Keep this document updated whenever files, routes, tokens, env vars, or database schemas change.

---

## 1. Quick Reference

| Attribute | Specification |
| :--- | :--- |
| **Project Name** | Vega Design Studio (`vega-design-studio`) |
| **Domain & Host** | `vegadesign.studio` (Hosted on Vercel) |
| **Headquarters** | Los Angeles, California |
| **Framework** | Next.js 16.3.7 (Turbopack, App Router) |
| **UI Library** | React 18.3.1 / React DOM 18.3.1 |
| **Styling Engine** | Tailwind CSS 4.1.12 (`@tailwindcss/postcss`, `@tailwindcss/typography`, `@import "tailwindcss"`) |
| **AI SDK** | Vercel AI SDK (`ai` v5.0.27, `@ai-sdk/openai`, `@ai-sdk/react`) |
| **Email Transports** | Resend (`resend` v6.0.2) with Nodemailer (`nodemailer` v7.0.6) SMTP fallback |
| **Analytics** | Vercel Analytics (`@vercel/analytics` v1.5.0) |
| **Contact Phone** | `(661) 477-1610` (`tel:+16614771610`) |
| **Contact Email** | `jlegorreta@vegadesign.studio` |
| **GitHub Handle** | `https://github.com/threadbearer` |
| **Booking Link** | `https://calendar.app.google/MCoM4jfg2dWgypC47` |

### Core Developer Commands
```bash
# Start development server with Turbopack
npm run dev

# Fast production build validation (filtered output to save token context)
./scripts/build-check.sh

# Run Next.js production build directly
npm run build

# Run ESLint validation
npm run lint

# Architecture & doc-drift health scanner
./scripts/audit-health.sh

# Full security & secrets audit
./scripts/audit-security.sh
```

---

## 2. Architecture Map & File Directory Index

The codebase follows the Next.js App Router structure rooted directly in `./app` (with `@/*` path aliasing configured in `jsconfig.json`).

```
vega-design-studio/
├── app/
│   ├── about/
│   │   └── page.js                 # About page (Philosophy, Principles, Capabilities)
│   ├── api/
│   │   ├── chat/
│   │   │   └── route.js            # Knight Shift AI agent conversational backend with persona rules
│   │   ├── health/
│   │   │   └── route.js            # Edge runtime health & OpenAI API configuration check
│   │   └── lead/
│   │       └── route.js            # Lead qualification & dual-destination email dispatch
│   ├── components/
│   │   ├── About.js                # Studio mission, values, and capabilities section
│   │   ├── CaseSummary.js          # Case study metadata summary block (tags, impact, services)
│   │   ├── Chatbot.js              # Backward-compatible wrapper exporting KnightShiftAgent
│   │   ├── Contact.js              # Interactive contact & scheduling block
│   │   ├── Footer.js               # Global footer with copyright, city, and social links
│   │   ├── Hero.js                 # Homepage hero with ambient glow orbs & animated gradient
│   │   ├── icons.jsx               # Path re-exporter for centralized SVG icons
│   │   ├── JsonLd.jsx              # Reusable JSON-LD schema injection component
│   │   ├── KnightShiftAgent.jsx    # Dual-mode Knight Shift digital employee (Live phone voice line + smart chat)
│   │   ├── NavBar.js               # Sticky glassmorphic header with desktop/mobile navigation
│   │   ├── Portfolio.js            # Homepage featured projects showcase grid
│   │   ├── Pricing.js              # Homepage pricing bundles (Web Essentials, Storefront, AI)
│   │   ├── Process.js              # 4-stage delivery process (Discovery, Sprint, Build, Launch)
│   │   └── Services.js             # 6-card agency capabilities grid
│   ├── contact/
│   │   ├── ContactForm.jsx         # Interactive client lead form with validation & states
│   │   └── page.jsx                # Dedicated contact page with inquiry form & direct channels
│   ├── services/
│   │   └── page.jsx                # Detailed services breakdown, package tiers & FAQs
│   ├── ui/
│   │   ├── BeforeAfter.js          # Interactive clip-path image comparison slider
│   │   └── elements.js             # Reusable layout primitives: Container, Section, Card, CTA
│   ├── work/
│   │   ├── page.jsx                # Portfolio showcase index with category filter tabs
│   │   └── [slug]/
│   │       ├── opengraph-image.js  # Dynamic Edge OpenGraph card generator (1200x630)
│   │       └── page.jsx            # Deep-dive project case study page
│   ├── error.jsx                   # Global App Router error boundary with recovery action
│   ├── globals.css                 # Master design system tokens, keyframes, and glass classes
│   ├── information.js              # Centralized data store: BRAND, BOOKING, and PROJECTS
│   ├── layout.jsx                  # Root HTML layout, Outfit/Inter Google Fonts, Org JSON-LD
│   ├── not-found.jsx               # Branded 404 page
│   ├── page.jsx                    # Homepage composing Hero, Services, Pricing, Process, Work
│   ├── robots.txt                  # Search engine crawl directives & sitemap location
│   └── sitemap.js                  # Dynamic sitemap index generator
├── public/                         # Static image assets, logos, and project screenshots
├── scripts/                        # Development health scanners, Crucible hooks, and smoke tests
├── styles/
│   └── globals.css                 # Mirror stylesheet for root utility parity
├── AGENTS.md                       # Operational rules and guardrails for AI coding assistants
├── CONTEXT.md                      # This document — the master architecture index
├── jsconfig.json                   # Compiler options & path alias (@/* -> app/*)
├── next.config.mjs                 # Next.js configuration, cache headers, remote image hosts
├── package.json                    # Project dependencies and script declarations
└── tailwind.config.js              # Tailwind CSS configuration wrapper
```

### File-by-File Purpose Index

| File Path | Component / Type | Purpose & Description |
| :--- | :--- | :--- |
| `app/layout.jsx` | Server Component | App-wide root layout. Injects Google Fonts (`Inter` 300–700, `Outfit` 400–800), global CSS, Organization JSON-LD, sticky `NavBar`, children, and Vercel Analytics. |
| `app/page.jsx` | Client Component | Main landing page. Stacks `Hero`, `Services`, `Pricing`, `Process`, `Portfolio`, `About`, `Chatbot`, and `Footer` with a fixed cyan ambient background glow. |
| `app/about/page.js` | Server Component | Explains studio philosophy, 3 core principles ("Clarity over noise", "Performance as a feature", "AI where it helps"), technical capabilities, and agile 4-step delivery cycle. |
| `app/services/page.jsx` | Server Component | Comprehensive services catalog detailing 6 core offerings, starting price brackets, service feature bullets, and an interactive FAQ grid with OfferCatalog JSON-LD. |
| `app/contact/page.jsx` | Client Component | Direct client contact portal with inquiry form, calendar booking integration, phone link, email link, and GitHub profile reference. |
| `app/work/page.jsx` | Client Component | Interactive work archive. Features dynamic category filter buttons (All, E-Commerce, Web Development, SEO, etc.) and responsive cards linking to live apps and case studies. |
| `app/work/[slug]/page.jsx` | Server Component | In-depth case study template awaiting dynamic route `params`. Renders project hero, overview, technical challenges, solutions, quantifiable impact bullets, process timeline, and booking sidebar. |
| `app/work/[slug]/opengraph-image.js` | Edge Route Handler | Generates high-resolution (1200x630) social sharing OpenGraph preview images dynamically based on project title and taxonomy tags. |
| `app/api/chat/route.js` | Node.js API Route | Conversational AI agent endpoint powered by Knight Shift digital employee instructions, Vega service knowledge base, and fallback response generation. |
| `app/api/health/route.js` | Edge API Route | Uptime and service readiness check. Verifies runtime health and reports if `OPENAI_API_KEY` is present in the environment. |
| `app/api/lead/route.js` | Node.js API Route | Lead qualification endpoint. Validates email syntax, constructs plain-text/HTML lead summaries, and dispatches email via Resend or Nodemailer SMTP fallback. Sends client auto-responder and calendar invite. |
| `app/components/Hero.js` | React Component | Main visual hook. Features glowing radial background orbs, animated shifting brand gradient headline ("Vega — the future's North Star for Design & Innovation"), and CTAs. |
| `app/components/NavBar.js` | Client Component | Responsive sticky navigation header with 16px backdrop blur. Includes wordmark, navigation links, booking CTA, and animated mobile hamburger drawer. |
| `app/components/Portfolio.js` | React Component | Homepage project grid showcasing live production clients from `app/information.js` with live demo, repository, and case study links. |
| `app/components/Pricing.js` | React Component | Transparent 3-tier pricing showcase highlighting "Web Essentials", "Online Storefront" (featured), and "AI Agents and Tools". |
| `app/components/Services.js` | React Component | 6-card high-level capabilities overview (Brand & Identity, Web & Digital Experiences, AI Solutions, Marketing, E-Commerce, Audits & SEO). |
| `app/components/Process.js` | React Component | 4-phase agile methodology: 01 Discovery → 02 Design Sprint → 03 Build & QA → 04 Launch & Grow. |
| `app/components/About.js` | React Component | Homepage studio overview emphasizing builder mindset, core values, capabilities, and tech stack tags. |
| `app/components/KnightShiftAgent.jsx` | Client Component | Flagship Knight Shift digital employee widget. Features direct phone voice line dialing to the Knight Shift voice orchestrator, real-time conversational chat, email lead capture, and direct calendar booking. |
| `app/components/Chatbot.js` | Client Component | Backward-compatible wrapper delegating to `KnightShiftAgent`. |
| `src/components/icons.tsx` | UI Component | Centralized SVG icon system (Mic, Phone, Chat, Shield, AudioWave, Sparkles, etc.) preventing SVG token bloat. |
| `app/components/Footer.js` | React Component | Global footer with copyright, Los Angeles city locator, phone, email, and social links. |
| `app/components/JsonLd.jsx` | React Component | Renders safe, stringified JSON-LD `<script type="application/ld+json">` for Google structured data indexing. |
| `app/components/CaseSummary.js` | React Component | Reusable card displaying delivered services and bulleted client results. |
| `app/ui/elements.js` | UI Primitives | Foundation components: `Container` (max-w-6xl with responsive padding), `Section` (vertical spacing rhythm), `Card` (glassmorphic container), `CallToAction` (banner with calendar & email actions). |
| `app/ui/BeforeAfter.js` | Client Component | Interactive visual before/after slider utilizing CSS `clip-path` and an accessible HTML range input. |
| `app/information.js` | Data Store | Central source of truth exporting `BRAND` constants, `BOOKING` calendar URL, and full structured `PROJECTS` metadata. |
| `app/globals.css` | Stylesheet | Theme root tokens (`--cyan-1`, `--cyan-2`, `--gold`, `--bg`, `--glass`), custom keyframe animations, and utility helper classes. |
| `app/sitemap.js` | Dynamic Sitemap | Generates standard XML sitemap encompassing all primary static routes plus all dynamic case study URLs. |
| `app/robots.txt` | Directives | Directs search web crawlers to allow all site paths and points to the sitemap location. |
| `app/error.jsx` | Client Component | Catches uncaught runtime render exceptions with user feedback and a reset button. |
| `app/not-found.jsx` | Server Component | Clean 404 page with return-home navigation. |
| `next.config.mjs` | Configuration | Enables React strict mode, immutable 1-year cache headers for `/portfolio/*`, and Unsplash remote image host patterns. |

---

## 3. API Routes & Authentication Matrix

All API routes in Vega Design Studio are App Router route handlers.

### Route Catalog

| Path | Method | Runtime | Auth Requirement | Purpose & Data Handling |
| :--- | :--- | :--- | :--- | :--- |
| `/api/chat` | `POST` | `nodejs` | **Public** (§2 Exempt) | Knight Shift conversational agent backend. Provides streaming/dynamic completions with Vega's knowledge base and fallback responses. |
| `/api/health` | `GET` | `edge` | **Public** (§2 Exempt) | Lightweight uptime check. Validates `OPENAI_API_KEY` configuration. Returns `{ ok: boolean }`. |
| `/api/lead` | `POST` | `nodejs` | **Public** (§2 Exempt) | Accepts lead qualifications `{ email, projectType, budget, timeline, source }`. Dispatches notification emails to studio and automated confirmation + booking links to lead. |

### Intentionally-Exempt Routes (§2 Documentation)
1. **`/api/chat`**: Public conversational agent intake for site visitors. Never exposes sensitive server credentials; filters messages and operates on public studio service knowledge.
2. **`/api/health`**: Public monitoring probe for Vercel/uptime monitors. Never exposes secrets or internal state; only reports boolean configuration status.
3. **`/api/lead`**: Public intake endpoint for site visitors submitted from the chatbot or contact form. Email input is strictly validated via regex. It processes data strictly in memory and forwards it via email without writing unauthenticated state to persistent user accounts.

### Data Flow for `/api/lead`
```
User Submission (Chatbot / Contact Form)
                     │
                     ▼
          POST /api/lead (Node.js)
                     │
         [Validate Email via Regex]
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
[Studio Notification]      [Lead Auto-Responders]
• Summary of project/budget • 1. Acknowledgement receipt
• Dispatched to STUDIO_EMAIL • 2. Private booking strategy invite
• Powered by Resend (fallback: Nodemailer SMTP)
```

### Future Supabase Client Matrix
When database features (client dashboards, lead persistence, proposal portals) are activated, the strict client segregation matrix MUST be followed:

```
API routes / webhooks    → createServiceClient()  from @/lib/supabase
Dashboard pages (SSR)    → createClient()          from @/utils/supabase/server
Browser components       → createClient()          from @/utils/supabase/client
```

*Security Guardrail*: `createServiceClient()` contains the Supabase Service Role key and MUST NEVER be imported into client components or SSR page files.

---

## 4. Design System & Token Registry

The studio visual identity pairs a sleek obsidian dark mode with electric cyan accents and refined gold highlights. All variables are declared in `app/globals.css`.

### CSS Custom Properties (`:root`)

```css
:root {
  /* Brand Accent Colors */
  --gold: #C6A664;
  --cyan-1: #00FFFF;
  --cyan-2: #00BFFF;

  /* Surfaces & Backgrounds */
  --bg: #0B0B0B;
  --bg-card: #111111;
  --bg-elevated: #1A1A1A;

  /* Text & Ink */
  --ink: #FFFFFF;
  --ink-muted: #a0a0a0;

  /* Borders & Glassmorphism */
  --border: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(255, 255, 255, 0.2);
  --glass: rgba(255, 255, 255, 0.04);
  --glass-border: rgba(255, 255, 255, 0.1);

  /* Shadows & Ambient Glows */
  --shadow-card: 0 4px 24px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 30px rgba(0, 255, 255, 0.08);

  /* Radii */
  --radius: 1rem;
  --radius-lg: 1.5rem;

  /* Timing Curves */
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);

  /* Typography */
  --font-heading: 'Outfit', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

### Core Utility Classes

| Class Name | Visual Effect & Application |
| :--- | :--- |
| `.brand-gradient` | Cyan-to-blue linear gradient text (`linear-gradient(90deg, #00FFFF, #00BFFF)` with background clip). |
| `.brand-gradient-animated` | 4-stop continuously shimmering cyan gradient animation (`gradient-shift` keyframe, 4s cycle). |
| `.glass-card` | Premium glassmorphism surface with `background: var(--glass)`, `backdrop-filter: blur(12px)`, border, and hover lift. |
| `.bg-grid` | Architectural dark grid pattern with 60px x 60px subtle grid lines for hero backgrounds. |
| `.tech-badge` | Rounded pill badge with cyan border, low-opacity fill, and monospace-like precision styling. |
| `.section-label` | Uppercase, tracked-out label (`letter-spacing: 0.25em`) in muted ink for section categorizers. |
| `.animate-fade-up` | 0.6s entry animation shifting from `translateY(24px)` to `0` with smooth cubic easing. |

---

## 5. Pricing Tiers & Offering Catalog

Vega Design Studio structures client pricing into three distinct tiers on the homepage, supplemented by modular service packages.

### Homepage Bundles (`app/components/Pricing.js`)

#### 1. Web Essentials — $2,500
*Target: Early-stage businesses and founders seeking a market-ready web presence.*
- Modern high-performance website with advanced SEO
- Complete visual design and brand kit (logo, typography, palette)
- Marketing setup & analytics integration (Vercel / Plausible)
- Online presence and local search optimization

#### 2. Online Storefront — $4,500 (Featured / Most Popular)
*Target: Established brands launching high-converting digital storefronts.*
- Full custom e-commerce storefront (zero-bloat architecture)
- Brand identity package with printed collateral guidelines
- Integrated marketing strategy and advertising campaign setup
- Comprehensive post-launch support and performance tuning

#### 3. AI Agents and Tools — $2,500 setup + $299/mo
*Target: Businesses automating inbound lead capture and client qualification.*
- Conversational customer service representatives
- Interactive customer-to-product liaison assistants
- Automated workflow task workers and lead triaging
- AI-driven content generation and copywriting tooling

### Service Catalog Packages (`app/services/page.jsx`)
- **Website and Hosting**: from $2,500 (Brand polish, 1-page Next.js site, basic analytics + SEO, booking integration)
- **E-commerce**: from $6,000 (Identity system, 3–6 page Next.js site, AI FAQ/lead assistant, accessibility pass)
- **AI Agent**: Custom scope (Brand integration, custom Next.js build + CMS, AI concierge, internal tooling, split testing)
- **Design and Branding**: Custom scope (Comprehensive brand guidelines, typography system, digital design assets)
- **Marketing and Ad Campaigns**: Custom scope (Funnel strategy, PPC/social campaign creation, conversion tracking)
- **AI Tools**: Custom scope (Workflow automation, internal copilots, tailored LLM prompt pipelines)

---

## 6. Business Context & Case Studies

### Brand Philosophy & Mission
Vega Design Studio ("VDS") is a high-end digital design studio and innovation agency based in Los Angeles, California.  
**Motto**: *"Guided by Vega — Where Creativity Meets Intelligence."*  
The studio avoids bloated agency retainers and multi-month delays. Engagements run 1–4 weeks, focusing on fast feedback loops, strict design aesthetics, and measurable business outcomes.

### Active Client Case Studies (`app/information.js`)

#### 1. Adelphos Manila (`adelphos-manila`)
- **Client**: Adelphos Manila — Masonic fraternity luxury storefront.
- **Taxonomy**: `E-Commerce • Vanilla JS • Serverless`
- **Tech Stack**: HTML5, CSS3, Vanilla ES6+ JS, Google Apps Script backend.
- **Challenge**: Deliver a luxury e-commerce experience with dynamic cart state and client-side document processing without recurring database costs.
- **Solution & Impact**: Engineered a zero-dependency dual-layer state-sync engine under 60KB total weight; eliminated ongoing database hosting fees via Google Sheets/Apps Script integration.

#### 2. Montalvo's Pure Water (`mp-water`)
- **Client**: Montalvo's Pure Water — Retail water store with locations in Palmdale and Lancaster, CA.
- **Taxonomy**: `Redesign • SEO • Performance`
- **Tech Stack**: HTML5, CSS3, Vanilla JS, LocalBusiness JSON-LD.
- **Challenge**: Replace a bloated 580KB Webflow-exported site with a high-speed, local SEO-optimized platform.
- **Solution & Impact**: Rebuilt from scratch with a 91% code weight reduction (580KB → 47KB), dual LocalBusiness structured schema for both store branches, and WebP image optimization.

#### 3. JSP Construction (`jsp-construction`)
- **Client**: JSP Construction — Licensed Los Angeles General Contractor (CSLB #1094925).
- **Taxonomy**: `Multi-Page • CSS Architecture • Accessibility`
- **Tech Stack**: HTML5, CSS3 Custom Properties, Vanilla JS, Formspree, GCP.
- **Challenge**: Build high-trust web presence in the competitive LA construction market to convert organic visitors into booked consultations.
- **Solution & Impact**: Implemented a modular 5-file CSS architecture with 119 design tokens; entire multi-page site weighs under 115KB with full WCAG accessibility compliance.

#### 4. GR Counseling (`gr-counseling`)
- **Client**: GR Counseling — Private healthcare and counseling practice.
- **Taxonomy**: `Next.js • SCSS • GCP`
- **Tech Stack**: Next.js, React, SCSS Modules, Google Cloud.
- **Challenge**: Modernize a fragmented healthcare website into a warm, trust-inspiring patient portal across 15+ pages.
- **Solution & Impact**: Built a 15+ page Next.js SSR application with warm minimalist luxury design tokens, dynamic appointment booking, and healthcare SEO.

---

## 7. SEO, Structured Data & Sharing

Vega Design Studio implements structured data across all surfaces to dominate Los Angeles design and AI searches.

### Structured Schemas (`JSON-LD`)
1. **Organization** (`app/layout.jsx`): Site-wide metadata defining legal name, logo, official domain (`https://vegadesign.studio`), GitHub repository link, and Los Angeles customer service telephone (`+1-661-477-1610`).
2. **AboutPage** (`app/about/page.js`): Semantic schema describing studio capabilities and principles.
3. **Service & OfferCatalog** (`app/services/page.jsx`): Maps package names, descriptions, and USD price points directly to Google's Service index.
4. **LocalBusiness** (Recommended on homepage/contact): Encodes geographical coordinates, service area (Los Angeles County, Antelope Valley, Southern California), and business hours.

### Social Previews (OpenGraph)
- **Static Pages**: Configured via Next.js metadata objects in `app/layout.jsx` and individual pages.
- **Dynamic Case Studies**: Powered by `@vercel/og` in `app/work/[slug]/opengraph-image.js`. Edge runtime dynamically draws a 1200x630 card with the project's title, taxonomy tags, and Vega branding.

### Indexing Files
- `app/sitemap.js`: Automatically lists `https://vegadesign.studio/`, `/work`, `/services`, `/about`, `/contact`, and loops over all active project slugs in `PROJECTS`.
- `app/robots.txt`: Directs web crawlers and specifies sitemap location.

---

## 8. Database Table Registry & Data Architecture

### Current State: Static Data + Serverless Transport
The application currently maintains its primary business data (portfolio, brand constants, pricing) directly in `app/information.js` to maximize load speed and eliminate unnecessary database latency. Inbound inquiries are routed ephemerally through `/api/lead` via Resend / Nodemailer.

### Database Table Registry (For Supabase Migration)
When database persistence is provisioned, the following table standards and schemas MUST be maintained:

| Table Name | Purpose | Key Columns | RLS Policy Requirement |
| :--- | :--- | :--- | :--- |
| `leads` | Inbound client inquiries from contact form / bot | `id`, `created_at`, `email`, `project_type`, `budget`, `timeline`, `source`, `status` | Insert: Public (anonymously allowed). Read/Update: Admin/Authenticated service role only. |
| `projects` | CMS for dynamic case study publishing | `id`, `slug`, `title`, `tag`, `blurb`, `overview`, `challenge`, `solution`, `impact`, `tech`, `live_url`, `repo_url` | Read: Public `USING (true)`. Write: Admin only. |
| `chat_conversations` | Transcripts from the Vega AI floating chatbot | `id`, `created_at`, `session_id`, `messages`, `qualified_lead` | Insert: Public session. Read: Admin service role only. |

#### RLS Policy Standards
- Every new database table MUST have Row Level Security enabled (`ALTER TABLE <table> ENABLE ROW LEVEL SECURITY`).
- `UPDATE` policies MUST specify both `USING` and `WITH CHECK` clauses to prevent record hijacking or unauthorized reassignment.
- Deprecated `auth.role()` functions MUST NOT be used; use Postgres `TO authenticated` / `TO anon` clauses instead.

---

## 9. Environment Variables

Variables required for local development and Vercel production deployments:

| Variable Name | Environment | Required? | Purpose |
| :--- | :--- | :--- | :--- |
| `OPENAI_API_KEY` | Edge / Node.js | Yes (for AI features) | Powers `/api/health` validation and the conversational backend for `Chatbot.js`. |
| `RESEND_API_KEY` | Node.js | Recommended | API key for primary transactional email delivery in `/api/lead`. |
| `STUDIO_EMAIL` | Node.js | Recommended | Destination email receiving instant lead notifications (default: `jlegorreta@vegadesign.studio`). |
| `BOOKING_LINK` | Client / Node.js | Optional | Custom Google Calendar or scheduling URL (fallback: default Google Calendar link). |
| `SMTP_HOST` | Node.js | Optional Fallback | SMTP server hostname if Resend is inactive. |
| `SMTP_PORT` | Node.js | Optional Fallback | SMTP port (465 for SSL, 587 for TLS). |
| `SMTP_USER` | Node.js | Optional Fallback | SMTP username / sender account. |
| `SMTP_PASS` | Node.js | Optional Fallback | SMTP account password or app-specific token. |
| `NEXT_PUBLIC_SUPABASE_URL` | Client / Server | Optional (Future) | Supabase project API URL. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client / Browser | Optional (Future) | Public client anonymous Supabase key. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Optional (Future) | Elevated service-role key for backend operations. **NEVER expose to client**. |

---

## 10. Developer Process & Guardrails

### Verification Pipeline
Before finishing any significant task or committing code, run the verification harness:

1. **Build Sanity**: `./scripts/build-check.sh`  
   *Ensures Turbopack and Next.js can bundle without type or syntax regressions.*
2. **Linting**: `npm run lint`  
   *Validates ESLint rules for Next.js 15.*
3. **Health Scan**: `./scripts/audit-health.sh`  
   *Verifies all API routes and database tables are documented in `CONTEXT.md`.*
4. **Security Scan**: `./scripts/audit-security.sh`  
   *Checks for leaked secrets, accidental `NEXT_PUBLIC_` exposures, and route authentication.*

### AI Coding Agent Rules
- **No Console Logs**: Do not leave `console.log` in finished code. Use `console.error` or `console.warn` only for genuine persistent operational alerts.
- **No Raw SVGs**: In components, avoid inlining giant raw `<svg>` trees to keep token context clean; centralize icons or use clean asset imports.
- **CSS Utility Hygiene**: Extract repeating or lengthy Tailwind classes into semantic utility classes in `app/globals.css`.
- **Async Route Params**: In Next.js 15, `params` and `searchParams` in server components and route handlers are Promises. Always `await params`.

---

## 11. Work Queue & Feature Contract (Remaining Work)

Derived from the studio's non-negotiable feature contract and release roadmap:

### P1 — Launch & Production Readiness
- [x] **Robots.txt Domain Fix**: Updated `Sitemap: https://vegadesign.studio/sitemap.xml` in `app/robots.txt`.
- [x] **Contact Form Action**: Upgraded `app/contact/ContactForm.jsx` to natively post to `/api/lead` with validation, reactive loading, success, and error UI states.
- [x] **Chatbot Lead Capture**: Integrated email detection in `app/components/Chatbot.js` to dispatch briefs directly to `/api/lead`.
- [x] **Next.js 15 Async Params**: Updated `app/work/[slug]/opengraph-image.js` to properly await `params` before accessing `slug`.
- [ ] **Image Optimization Pipeline**: Migrate raw `<img>` tags in `app/components/Portfolio.js`, `app/work/page.jsx`, and `app/work/[slug]/page.jsx` to `next/image` with explicit `sizes` and local `.webp` assets.
- [x] **Vercel Production Deployment**: Deployed to Vercel and aliased to primary domain `https://vegadesign.studio`.

### P2 — Interactive Feature Enhancements
- [ ] **Case Study Gallery Lightbox**: Add interactive screenshot lightbox with keyboard navigation (`←`/`→`/`Esc`) and ARIA dialog semantics on project detail pages.
- [ ] **Mobile Swipe Carousel**: Add touch-enabled carousel for mobile case study browsing.
- [ ] **Before/After Integration**: Place `app/ui/BeforeAfter.js` onto active case study pages (specifically `mp-water` and `adelphos-manila`) to visually demonstrate redesign impact.
- [ ] **Security Headers & CSP**: Configure Content Security Policy, strict HSTS, and frame protection in `next.config.mjs`.

### P3 — Future Capabilities & Integrations
- [ ] **Supabase CMS Integration**: Migrate `app/information.js` project entries to Supabase table registry for real-time editorial updates.
- [ ] **Client Proposal & Invoice Portal**: Secure tokenized proposal viewing (`/proposals/[token]`) for client contract sign-offs.
