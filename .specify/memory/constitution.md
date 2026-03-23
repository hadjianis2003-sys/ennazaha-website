<!--
SYNC IMPACT REPORT
==================
Version change: N/A (initial ratification) → 1.0.0
Modified principles: none (first-time population)
Added sections:
  - Core Principles (8 principles)
  - Tech Stack & Architecture
  - Development Workflow & Quality Gates
  - Governance
Templates requiring updates:
  ✅ .specify/templates/plan-template.md — Constitution Check gates align with principles below
  ✅ .specify/templates/spec-template.md — RTL/bilingual and accessibility constraints noted
  ✅ .specify/templates/tasks-template.md — task types cover i18n, CMS integration, SEO, analytics
Deferred TODOs:
  - TODO(LOCATIONS): Section 8 "Locations Served" intentionally left empty per user request
  - TODO(RATIFICATION_DATE): First formal ratification — set to project init date 2026-03-22
-->

# ENNAZAHA Constitution

## Core Principles

### I. RTL-First, Bilingual by Design

All UI components, layouts, and CSS MUST be authored with RTL (right-to-left) as the primary
direction. Arabic is the primary language (`lang="ar"`, `dir="rtl"`); French is secondary.
Every user-facing string MUST exist in both languages via the i18n layer. No page or component
MAY be shipped without verified Arabic copy. Font choices (`Oxanium` for Latin/numerals,
`Merriweather` for body serif, and a suitable Arabic web font such as `Cairo` or `Tajawal`)
MUST be loaded from Google Fonts and declared in the global CSS design-token file.

**Rationale**: ENNAZAHA's primary market is Algerian Arabic speakers. An afterthought RTL pass
produces layout breakage and erodes trust. Bilingual parity is a legal and brand requirement.

### II. Design-Token Supremacy

All colors, typography scales, spacing, border-radius values, and shadow parameters MUST be
declared as CSS custom properties in a single source-of-truth token file (e.g.,
`src/styles/tokens.css`). Components MUST reference tokens only — hard-coded hex values or
pixel sizes inside component files are FORBIDDEN. Both light and dark theme tokens (as defined
in the brand identity) MUST be maintained in the same token file.

**Rationale**: Consistency across 15+ pages and future reskin capability depend on a single
authoritative token layer. Drift between components produces visual inconsistency incompatible
with a premium real-estate brand.

### III. Accessibility & Performance as Gates (NON-NEGOTIABLE)

Every page MUST achieve:
- Lighthouse Performance ≥ 90 on mobile (tested via CI).
- Lighthouse Accessibility ≥ 90.
- Core Web Vitals: LCP < 2.5 s, CLS < 0.1, FID/INP < 200 ms.
- Images MUST be served via Next.js `<Image>` with proper `alt` text in both AR and FR.
- All interactive elements MUST be keyboard-navigable and have visible focus indicators.

**Rationale**: Google SEO ranking and user trust in the Algerian market depend on fast, accessible
pages. Real estate buyers frequently browse on mid-range Android devices on 4G connections.

### IV. CMS-Driven Content (No Hard-Coded Data)

All domain data — projects, apartment units, blog posts, testimonials, FAQs, team members —
MUST be fetched from the headless CMS (Strapi or Sanity). No page may render hard-coded project
names, prices, or dates. The CMS schema MUST reflect the data models defined in Section 7 of this
constitution. Seed/mock data for local development is permitted only in a dedicated `seed/`
directory and MUST NOT reach production builds.

**Rationale**: Content teams and clients MUST be able to update listings, prices, and articles
without touching source code. Hard-coded data guarantees outdated information and production bugs.

### V. TypeScript Strict Mode

All source files MUST be TypeScript. `strict: true` is non-negotiable in `tsconfig.json`.
`any` type annotations are FORBIDDEN unless wrapped in an `// eslint-disable` comment with
a written justification. API response types MUST be validated at the boundary (e.g., Zod schemas
for CMS payloads) before being consumed by components.

**Rationale**: The project spans 15+ routes, multiple data models, and third-party integrations
(GA4, Facebook Pixel, HubSpot, WhatsApp API). Type safety prevents subtle data-shape bugs that
surface only in production.

### VI. SEO & Analytics Instrumentation

Every page MUST include:
- A unique, descriptive `<title>` and `<meta name="description">` in the active language.
- Canonical URL tags.
- Open Graph / Twitter Card meta tags with project-specific images.
- Structured data (`schema.org/RealEstateListing`, `LocalBusiness`) where applicable.
- GA4 page-view event and Facebook Pixel `PageView` event on every route change.
- HubSpot form tracking on all lead-capture forms.

**Rationale**: Organic search and paid retargeting are primary acquisition channels. Missing meta
tags or broken pixel fires directly reduce ROI on the client's marketing spend.

### VII. Component Isolation & Build-Order Discipline

Development MUST follow the priority sequence defined in Section 11:
1. Homepage → 2. Projects listing + filters → 3. Project detail → 4. Contact → 5. Remaining pages.

Shared global components (Navbar, Footer, WhatsApp float, Cookie Banner, Loading Screen) MUST be
built and reviewed before any page that depends on them. A page MUST NOT be marked complete if
its global shell components are missing or mocked out. Each component MUST be independently
renderable in isolation (Storybook or equivalent) before integration.

**Rationale**: Sequential build discipline prevents integration regressions and allows early
stakeholder review of the most-critical pages first.

### VIII. Privacy & Legal Compliance

- The Cookie Banner MUST appear on first visit and block non-essential cookies (Analytics,
  Pixel) until user consent is given.
- HubSpot and WhatsApp integrations MUST NOT transmit PII before consent.
- The `robots.txt` and `sitemap.xml` MUST be auto-generated by the Next.js build.
- HTTPS MUST be enforced on all Vercel deployments (enforced by platform; documented as a gate).

**Rationale**: GDPR-adjacent frameworks apply to Algerian digital businesses serving EU-adjacent
users. Cookie consent failures expose the client to reputational and potential regulatory risk.

## Tech Stack & Architecture

**Framework**: Next.js (App Router) — TypeScript, deployed on Vercel.
**Styling**: Vanilla CSS only. TailwindCSS is FORBIDDEN unless the client explicitly reverses
this decision via a constitution amendment.
**CMS**: Strapi (preferred) or Sanity — headless, content served via REST/GraphQL.
**Database**: PostgreSQL (backing CMS or direct).
**Image Hosting**: AWS S3 — images referenced via CDN-backed URLs.
**Maps**: Google Maps Embed API on Project Detail and Contact pages.
**Analytics**: GA4 + Facebook Pixel (consent-gated).
**CRM / Forms**: HubSpot (consent-gated).
**Communication**: WhatsApp Business API — floating button always visible, bottom-right.
**Fonts**: Google Fonts — `Oxanium` (sans), `Merriweather` (serif), Arabic font TBD (e.g.,
`Cairo`).

**Site Architecture** (routes as defined; slugs are CMS-driven):

| Route | Page |
|---|---|
| `/` | Homepage |
| `/projects` | All projects (filterable) |
| `/projects/[slug]` | Project detail |
| `/offers` | Apartments & Commercial Units |
| `/buy` | Buying Journey |
| `/invest` | Investor page |
| `/about` | Company info |
| `/blog` | Articles list |
| `/blog/[slug]` | Article detail |
| `/locations` | Our Cities (TODO: cities list pending) |
| `/virtual-tour` | 360° VR viewer |
| `/premium` | Premium tier |
| `/faq` | FAQ (accordion) |
| `/contact` | Contact form + map |

## Development Workflow & Quality Gates

**Branch strategy**: Feature branches off `main`; PRs require at least one reviewer approval.

**Constitution Check** (MUST pass before any feature branch is merged):
1. All new strings added to both AR and FR locale files.
2. No hard-coded color/spacing values — tokens used exclusively.
3. No domain data hard-coded in component files.
4. `tsc --noEmit` passes with zero errors.
5. ESLint passes with zero errors (no suppressed `any` without written justification).
6. Lighthouse budget met on the affected route(s).
7. Cookie-gated integrations tested with consent both granted and denied.

**Commit convention**: `type(scope): message` — e.g., `feat(projects): add filter bar component`.

**Deployment**: Vercel preview deployments per PR; production deploys from `main` after
reviewer approval.

**CMS schema changes** MUST be accompanied by a migration script and reviewed before merge.

## Governance

This constitution supersedes all other coding conventions, style guides, or verbal agreements
for the ENNAZAHA website project. Any amendment MUST:
1. Be proposed as a PR modifying this file with a written rationale.
2. Increment `CONSTITUTION_VERSION` using semantic versioning:
   - **MAJOR**: Principle removal, redefinition, or backward-incompatible architectural change.
   - **MINOR**: New principle or section added, or materially expanded guidance.
   - **PATCH**: Clarifications, wording fixes, non-semantic refinements.
3. Be approved by the project lead before merging.
4. Update `LAST_AMENDED_DATE` to the date of approval.

All PRs and feature plans MUST reference the Constitution Check above. Complexity violations
(deviations from stated constraints) MUST be documented in the plan's Complexity Tracking table.

**Version**: 1.0.0 | **Ratified**: 2026-03-22 | **Last Amended**: 2026-03-22
