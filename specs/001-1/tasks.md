---
description: "Task list for Core Website MVP implementation"
---

# Tasks: Core Website MVP

**Input**: Design documents from `/specs/001-1/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/forms.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 Initialize Next.js project with App Router globally at src/
- [ ] T002 [P] Configure global CSS resets in src/styles/globals.css
- [ ] T003 [P] Configure design tokens in src/styles/tokens.css (navy/gold palette)
- [ ] T004 Install required dependencies (React icons, etc.) in package.json

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented
**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T005 Implement `app/[lang]/layout.tsx` for i18n and RTL/LTR direction
- [ ] T006 [P] Create `src/lib/cms.ts` for Strapi data fetching abstraction
- [ ] T007 [P] Create `src/lib/hubspot.ts` for CRM integrations
- [ ] T008 Implement `components/layout/Navbar.tsx` with AR/FR toggle
- [ ] T009 Implement `components/layout/Footer.tsx`
- [ ] T010 [P] Implement `components/shared/FloatingWhatsApp.tsx`
- [ ] T011 [P] Implement `components/shared/CookieBanner.tsx`

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Homepage & Global Discovery (Priority: P1) 🎯 MVP

**Goal**: Serve as the premium digital storefront that builds instant trust.
**Independent Test**: Load the root URL, switch languages, verify RTL/LTR shifts, view the hero video/stats, and testimonials slider.

### Implementation for User Story 1

- [ ] T012 [P] [US1] Create Testimonial schema type in Strapi
- [ ] T013 [P] [US1] Implement `app/[lang]/page.tsx` base layout
- [ ] T014 [US1] Build Hero component with CTA and quick-search
- [ ] T015 [US1] Build StatsCounter animated component
- [ ] T016 [US1] Build TestimonialsSlider component fetching from CMS
- [ ] T017 [US1] Build Buy vs Invest persona cards section
- [ ] T018 [US1] Integrate all sections into Homepage

**Checkpoint**: Homepage functional and translates perfectly

---

## Phase 4: User Story 2 - Projects Listing & Filtering (Priority: P1)

**Goal**: Allow users to browse all developments and filter by city/status.
**Independent Test**: Navigate to projects page, apply filters, verify grid updates or shows empty state.

### Implementation for User Story 2

- [ ] T019 [P] [US2] Create Project schema type in Strapi
- [ ] T020 [P] [US2] Implement `app/[lang]/projects/page.tsx`
- [ ] T021 [US2] Build ProjectCard component (`components/features/ProjectCard.tsx`)
- [ ] T022 [US2] Build FilterBar component for city/status/type
- [ ] T023 [US2] Implement filtering logic and empty states ("No projects found")

**Checkpoint**: Users can search and find projects

---

## Phase 5: User Story 3 - Project Detail & Lead Capture (Priority: P2)

**Goal**: Comprehensive project info converging into lead capture.
**Independent Test**: Open a project URL, view gallery, check map, submit contact form.

### Implementation for User Story 3

- [ ] T024 [P] [US3] Create ApartmentUnit schema type in Strapi
- [ ] T025 [P] [US3] Implement `app/[lang]/projects/[slug]/page.tsx`
- [ ] T026 [US3] Build ImageGallery slider component
- [ ] T027 [US3] Build UnitSpecsTable component fetching unit types for the project
- [ ] T028 [US3] Implement Google Maps embed section
- [ ] T029 [US3] Build `components/features/LeadCaptureForm.tsx` 
- [ ] T030 [US3] Create `POST /api/leads/contact` Server Action linking to `lib/hubspot.ts`
- [ ] T031 [US3] Add "Download Brochure" button logic

**Checkpoint**: Users can view a specific project and become leads

---

## Phase 6: User Story 4 - Mortgage Affordability Calculator (Priority: P3)

**Goal**: Quick estimation of monthly payments to qualify users.
**Independent Test**: Adjust sliders for price/down-payment/years and see real-time output.

### Implementation for User Story 4

- [ ] T032 [P] [US4] Build `components/features/MortgageCalculator.tsx` UI (sliders, inputs)
- [ ] T033 [US4] Implement algorithmic logic for client-side monthly payment calculation
- [ ] T034 [US4] Add disclaimer text and CTA linking to contact
- [ ] T035 [US4] Embed Calculator in Project Detail page

**Checkpoint**: Financial friction removed for buyers

---

## Phase 7: User Story 5 - Customer Waitlist (Priority: P3)

**Goal**: Capture leads for out-of-market locations.
**Independent Test**: Submit waitlist form and verify success message.

### Implementation for User Story 5

- [ ] T036 [P] [US5] Build `components/features/WaitlistForm.tsx`
- [ ] T037 [US5] Create `POST /api/leads/waitlist` Server Action linking to `lib/hubspot.ts`
- [ ] T038 [US5] Embed Waitlist Form in Footer and Empty States
- [ ] T039 [US5] Add clear success and error handling feedback messages

**Checkpoint**: Waitlist leads can be successfully captured

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T040 [P] Implement SEO metadata tags across all pages
- [ ] T041 [P] Ensure 100% Lighthouse Accessibility score (Aria labels)
- [ ] T042 Verify HubSpot integration robustness and fallback behaviors
- [ ] T043 Final visual QA matching glassmorphism and gold/navy parameters

---

## Dependencies & Execution Order

- **Setup (Phase 1)**: No dependencies
- **Foundational (Phase 2)**: Depends on Phase 1 completion
- **User Story 1 & 2 (P1s)**: Can run in parallel after Phase 2
- **User Story 3 (P2)**: Depends on US2 (Needs project context)
- **User Story 4 & 5 (P3s)**: Can run independently once foundational form layout is complete

## Implementation Strategy: MVP First

1. Complete Phase 1 and 2 (Foundation)
2. Complete Phase 3 (Homepage)
3. Deploy Homepage as "Coming Soon / Landing Page" MVP (if desired)
4. Add Projects Listing (US2) + Detail (US3)
5. Layer on Mortgage (US4) and Waitlist (US5) tools
