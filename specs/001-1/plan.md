# Implementation Plan: Core Website MVP

**Branch**: `001-1` | **Date**: 2026-03-22 | **Spec**: [spec.md](../001-1/spec.md)
**Input**: Feature specification from `/specs/001-1/spec.md`

## Summary

Build a premium, modern, bilingual (Arabic RTL primary, French LTR secondary) real estate developer website for ENNAZAHA using Next.js App Router. The goal is a high-converting digital storefront providing clear residential specs, filters, lead capture, and a glassmorphism-inspired design with a dark navy and gold palette.

## Technical Context

**Language/Version**: TypeScript (strict)
**Primary Dependencies**: Next.js App Router, React
**Storage**: Strapi or Sanity (Headless CMS), AWS S3 (Images)
**Testing**: Playwright or Cypress for E2E user flows (Bilingual UI, Forms)
**Target Platform**: Web (Vercel deployment)
**Project Type**: Next.js Web Application
**Performance Goals**: Lighthouse > 90, LCP < 2.5s, CLS < 0.1
**Constraints**: 100% Bilingual (AR/FR), RTL-First layout, Vanilla CSS styling
**Scale/Scope**: 15+ Core Routes, CRM Integrations (HubSpot, WhatsApp)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- **RTL-First, Bilingual by Design**: Passed. Next.js i18n layout provider explicitly enforces `dir="rtl"` and `lang="ar"` natively based on route.
- **Design-Token Supremacy**: Passed. Global CSS variables utilized for dark navy and gold palette.
- **Accessibility & Performance**: Passed. Next.js image optimization and basic HTML semantics employed.
- **CMS-Driven Content**: Passed. Next.js data fetching from headless CMS planned.
- **TypeScript Strict Mode**: Passed.

## Project Structure

### Documentation (this feature)

```text
specs/001-1/
├── plan.md              # This file
├── research.md          # Technical decisions and validation
├── data-model.md        # Strapi/Sanity CMS entity models
├── quickstart.md        # Local setup instructions
├── contracts/           # API and Form shapes
└── tasks.md             # (To be generated in the next step)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── [lang]/
│       ├── page.tsx               # Homepage
│       ├── layout.tsx             # Root Layout (i18n, RTL)
│       └── projects/
│           ├── page.tsx           # Projects Listing Page
│           └── [slug]/page.tsx    # Project Detail Page
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx             # Includes AR/FR toggle
│   │   └── Footer.tsx
│   ├── shared/
│   │   ├── FloatingWhatsApp.tsx
│   │   └── CookieBanner.tsx
│   └── features/
│       ├── MortgageCalculator.tsx
│       ├── WaitlistForm.tsx
│       └── LeadCaptureForm.tsx
├── styles/
│   ├── globals.css                # CSS Reset & Core Typography
│   └── tokens.css                 # CSS Variables (Colors, Glassmorphism, Radii)
└── lib/
    ├── cms.ts                     # Strapi/Sanity data fetching utility
    └── hubspot.ts                 # CRM integration utility
```

**Structure Decision**: A standard Next.js App Router structure under `src/app/[lang]` is chosen to seamlessly implement the bilingual and RTL requirements from the ground up. Features are isolated into specific components logic directories.

## Complexity Tracking

No constitution violations detected. Standard Next.js server/client component boundaries will manage the minimal state required for the mortgage calculator and forms.
