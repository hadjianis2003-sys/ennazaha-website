# Technical Research & Decisions

**Context**: ENNAZAHA Real Estate Website  
**Branch**: `001-1`

## 1. Web Framework: Next.js App Router

**Decision**: Use Next.js 14+ with App Router.
**Rationale**: Native server-side rendering (SSR) and image optimization guarantee fast loading times and perfect SEO scores, critical for real estate discovery. App Router's nested layouts cleanly support the RTL/LTR language toggling requirement (`app/[lang]/layout.tsx`).
**Alternatives considered**: React (CRA/Vite) — Rejected due to lack of native SSR for SEO; Remix — Rejected as Next.js has better standard ecosystem support for Vercel and i18n.

## 2. Styling Solution: Vanilla CSS & CSS Variables

**Decision**: Native CSS Modules and global CSS custom variables.
**Rationale**: Constitution explicitly forbids Tailwind to enforce a custom premium aesthetic. Native CSS variables (`--primary: #B45309;`) allow for strict design system adherence. A `tokens.css` file will serve as the single source of truth for the glassmorphism and color palette tokens.
**Alternatives considered**: Styled Components/Emotion — Rejected due to runtime performance overhead; Tailwind CSS — Explicitly forbidden by constitution.

## 3. Localization Strategy (i18n)

**Decision**: Next.js Dynamic Route Segments (`[lang]`) mapping to JSON dictionaries.
**Rationale**: Allows sharing identical component logic while completely isolating the text rendering. Setting the HTML `dir` attribute dynamically per language at the root layout seamlessly flips the entire layout between RTL and LTR natively.
**Alternatives considered**: Client-side translation libraries (react-i18next) — Rejected due to layout shift and SEO risks.

## 4. Headless CMS Strategy

**Decision**: Strapi or Sanity.
**Rationale**: Both provide robust visual editors for non-technical clients to update property statuses and upload large galleries. Strapi offers deeper Postgres integration if self-hosted; Sanity provides a zero-ops real-time solution. Both expose strongly-typed REST/GraphQL APIs that Next.js Server Components can easily consume.
**Alternatives considered**: Hard-coding specific JSON files — Rejected per constitution (CMS-driven mandate).

## 5. Forms & CRM Integration (HubSpot / WhatsApp)

**Decision**: Next.js Server Actions connecting to HubSpot Forms API.
**Rationale**: Processing form submissions on the server entirely hides API keys from the client and guarantees 100% delivery natively, bypassing client-side ad-blockers that often trap direct third-party script integrations.
**Alternatives considered**: Standard HubSpot embedded `<iframe>` scripts — Rejected due to lack of styling control (clashes with premium visual aesthetic) and tracking blockers.
