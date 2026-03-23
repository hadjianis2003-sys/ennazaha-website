# Quickstart Guide: ENNAZAHA Core Website

**Context**: Core Website MVP (`001-1`)

Follow these steps to spin up the local development environment for the ENNAZAHA Next.js project.

## Requirements
- Node.js 18.17+
- npm or yarn
- Access to the Strapi/Sanity staging environment credentials.

## 1. Clone & Install
```bash
git clone <repository_url> ennazaha_website
cd ennazaha_website/src
npm install
```

## 2. Environment Variables
Copy `.env.example` to `.env.local` and populate the required keys:

```bash
cp .env.example .env.local
```

Ensure the following variables are set:
- `NEXT_PUBLIC_API_URL` (Pointer to the Headless CMS)
- `HUBSPOT_API_KEY` (For Lead capture testing)
- `NEXT_PUBLIC_WHATSAPP_NUMBER` (For the floating button)

## 3. Run the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:3000` to view the homepage.

*Note: By default, the root maps to the `/ar` language route per the RTL-First constitution.*

## 4. Run Quality Checks
Before submitting a PR, ensure all constitution checks pass:
```bash
npm run type-check   # tsc --noEmit
npm run lint         # ESLint strict validation
```
