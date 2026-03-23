# Feature Specification: Core Website MVP (Homepage, Projects, Details, Mortgage, Waitlist)

**Feature Branch**: `001-1`  
**Created**: 2026-03-22  
**Status**: Draft  
**Input**: User description of 5 core website features targeting the Algerian real estate market

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Homepage & Global Discovery (Priority: P1)

The user lands on the website to discover who ENNAZAHA is and what they offer. They want to verify credibility, see top projects, and easily switch between Arabic and French.

**Why this priority**: The homepage is the primary entry point and digital storefront. Without it, there is no credibility or inbound funnel.
**Independent Test**: Can be fully tested by loading the root URL, switching languages via the nav toggle, verifying RTL/LTR shifts, viewing the hero video/stats, scrolling through the testimonials slider, and clicking the floating WhatsApp button.

**Acceptance Scenarios**:
1. **Given** a user opens the home page, **When** they click the AR/FR toggle, **Then** all text translates and the layout direction switches (RTL/LTR) instantly.
2. **Given** a user is on the homepage, **When** they scroll down, **Then** the stats counter animates and the WhatsApp button remains persistently visible in the bottom right corner.
3. **Given** a user wants to find a project quickly, **When** they use the quick-search bar in the hero section, **Then** they are redirected to the projects page with those filters applied.

---

### User Story 2 - Projects Listing & Filtering (Priority: P1)

The user wants to browse all available real estate developments and filter them by city, status, or type to find a match for their budget and needs.

**Why this priority**: Finding a relevant project is the core utility of a real estate website.
**Independent Test**: Can be fully tested by navigating to the projects page, seeing a grid of project cards, applying various filters (City, Status, Type), and verifying the grid updates accordingly.

**Acceptance Scenarios**:
1. **Given** a user is on the projects page, **When** they select "Under Construction" and "Draria", **Then** only projects matching both criteria are displayed.
2. **Given** a user applies a highly restrictive filter, **When** no projects match, **Then** a friendly empty state message appears encouraging them to contact sales instead of a blank screen.
3. **Given** a list of projects, **When** the user views a project card, **Then** they see the cover photo, name, location, status badge, and starting price.

---

### User Story 3 - Project Detail & Lead Capture (Priority: P2)

The user wants comprehensive information about a specific residence (gallery, delivery date, map, unit types) to decide if they should inquire.

**Why this priority**: Once a project is found, this page does the heavy lifting to convert the visitor into a lead.
**Independent Test**: Can be fully tested by opening a specific project URL, viewing the image gallery, checking the dynamic map embed, and successfully submitting the project-specific contact form.

**Acceptance Scenarios**:
1. **Given** a user is on a project detail page, **When** they scroll to the unit table, **Then** they see a clear breakdown of available types (e.g., F2/F3) and their square footage.
2. **Given** a user is ready to inquire, **When** they fill out the contact form on this page, **Then** the submission is automatically tagged with the specific project's context.
3. **Given** a user wants the brochure, **When** they click "Download Brochure", **Then** they can download the PDF (after an optional email capture step).

---

### User Story 4 - Mortgage Affordability Calculator (Priority: P3)

The user wants to estimate their monthly payments based on property price and down payment to see if they qualify.

**Why this priority**: Removes the friction of price uncertainty, but is a value-add tool secondary to actually viewing the projects.
**Independent Test**: Can be fully tested by interacting with the price, down payment, and duration sliders/inputs and verifying the monthly payment calculates in real-time.

**Acceptance Scenarios**:
1. **Given** the user inputs a property price and a 20% down payment over 20 years, **When** the inputs change, **Then** the estimated monthly payment updates instantly in real-time.
2. **Given** the user calculates their payment, **When** they view the result, **Then** a clear disclaimer text is visible stating this is an estimate subject to bank approval.

---

### User Story 5 - Customer Waitlist (Priority: P3)

The user wants to buy in a specific city where there are currently no projects, so they sign up to be notified of future launches.

**Why this priority**: Captures out-of-market leads for future CRM nurturing.
**Independent Test**: Can be fully tested by submitting the waitlist form with a preferred location and verifying the success message.

**Acceptance Scenarios**:
1. **Given** the user fills out the Name, Email, Phone, and Preferred Location, **When** they submit the form, **Then** they see a success message thanking them for subscribing.

---

### Edge Cases

- What happens when a user's browser has strict privacy blockers enabled? (Analytics/CRM integration might fail; the forms must degrade gracefully and still submit via standard backend routes if possible).
- How does system handle missing translation strings for a specific project? (Should fallback to the primary language, Arabic, rather than breaking the page).
- What happens if the CRM (HubSpot) API is down when a user submits a lead? (The system must queue or email the lead as a fallback to ensure zero lead loss).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide a global bilingual toggle that instantly switches UI language and layout direction (RTL/LTR) across all pages.
- **FR-002**: System MUST display a persistently visible floating WhatsApp contact button on all pages.
- **FR-003**: System MUST permit filtering of projects by City, Status (Ready, Ongoing, New), and Property Type (Apartment, Commercial).
- **FR-004**: System MUST display friendly "empty state" fallback UI when filter combinations yield zero results.
- **FR-005**: System MUST include a real-time mortgage calculator with inputs for Price, Down Payment, and Duration.
- **FR-006**: System MUST append the active project context to lead submissions generated from a Project Detail page.
- **FR-007**: System MUST integrate Waitlist and Contact forms directly with HubSpot CRM.
- **FR-008**: System MUST support gated digital asset downloads (brochure PDFs).

### Key Entities

- **Project**: Represents a real estate development. Key attributes: Name, Slug, Location/City, Status, Searchable Tags, Cover Image, Gallery Images, Delivery Date, Map Coordinates, Brochure PDF URL.
- **Apartment Unit Type**: Represents a class of apartments within a project. Key attributes: Project ID, Type designation (e.g., F3), surface area range.
- **Lead (Contact/Waitlist)**: Customer profile captured via forms. Key attributes: Name, Email, Phone, Context (Project Name or Preferred City), Interest Type (Buy/Invest/Waitlist).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of the site's static and dynamic text is available natively in both Arabic and French without layout breakages.
- **SC-002**: Users can filter and find a matching project (or reach the empty state) in under 3 interactions.
- **SC-003**: Form submissions (Contact and Waitlist) successfully sync to HubSpot CRM with a 99.9% success rate.
- **SC-004**: The mortgage calculator updates its output in < 100ms after user input changes, functioning entirely client-side without page reloads.
- **SC-005**: Zero lead loss: 100% of submitted contact forms are recorded, even if third-party CRM APIs experience temporary downtime.
