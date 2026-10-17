# NBT Labs Website

Production marketing website for NBT Labs, a Montreal-based process improvement, Odoo, automation, and agentic AI consultancy.

## Technology

- **Next.js 16** (App Router) and **React 19**
- **TypeScript**
- **Tailwind CSS** foundations with a custom responsive design system
- Custom Magic UI-inspired motion components
- Server-rendered metadata, structured data, sitemap, and robots directives
- Deployed on **Vercel** from this repository

## Requirements

- Node.js 22.13 or newer
- npm

## Local development

```bash
npm install
npm run dev
```

The development server prints its local URL after startup.

### Forms → Odoo CRM

Both website forms create a lead in Odoo CRM (`crm.lead`) through Odoo's JSON-2 API (shared helper: `src/app/_lib/odoo.ts`):

- `/get-in-touch` → `POST /api/contact` (name, email, company, topic, message)
- Free audit (`/contact` form and the audit scorecard) → `POST /api/audit` (contact details, `answers: [{ question, answer }]`, optional `report` and `score`; the payload is documented at the top of `src/app/api/audit/route.ts`)

 Copy `.env.example` to `.env.local` and set:

- `ODOO_BASE_URL`: e.g. `https://nbtlabs.odoo.com`
- `ODOO_API_KEY_WEBSITE`: API key of the Odoo user that owns website leads (Preferences → Account Security → New API Key)

`docker compose` reads `.env.local` automatically. On Vercel, add the same variables under Project → Settings → Environment Variables. Never put the real key in `.env.example`: that file is committed.

## Build

```bash
npm run build
npm start
```

`npm run build` creates the Next.js production build in `.next/` (generated, not committed).

## Run with Docker

```bash
docker compose up --build
```

Serves the production build at http://localhost:3010 (container listens on 3000 internally; mapped to 3010 on the host to avoid clashing with anything else already on 3000, e.g. the nbt_odoo stack). Override the host port with `WEB_PORT`:

```bash
WEB_PORT=3000 docker compose up --build
```

The build stage needs outbound internet access (it fetches the Geist fonts from Google Fonts at build time, same as `npm run build` locally). Stop with `docker compose down`.

## Project structure

```text
public/             Logo, social preview, sitemap, and robots files
src/
  app/
    _components/    Shared navigation, footer, motion, forms, and page sections
    _data/          Shared content and SEO configuration
    */page.tsx      Individual website routes
    globals.css     Complete responsive visual system
  registry/magicui/ Reusable animation and interaction components
```

## Content map

- Navigation, packages, team members, and process steps: `src/app/_data/site.ts`
- Site URL, page metadata helpers, and structured data: `src/app/_data/seo.ts`
- Home page: `src/app/page.tsx`
- Services: `src/app/services/page.tsx`
- Pricing: `src/app/pricing/page.tsx`
- Why NBT Labs: `src/app/why-nbt/page.tsx`
- How We Work: `src/app/how-we-work/page.tsx`
- Who We Help: `src/app/who-we-help/page.tsx`
- Contact (free audit): `src/app/contact/page.tsx`
- Get in touch (general contact form): `src/app/get-in-touch/page.tsx`, creates Odoo CRM leads via `src/app/api/contact/route.ts`
- Results: `src/app/case-studies/page.tsx`
- Global styling and responsive behavior: `src/app/globals.css`

## Deploy (Vercel)

Connect this GitHub repo to Vercel with:

```text
Framework: Next.js
Build Command: npm run build
```

Leave **Root Directory** empty (repository root). Production deploys run automatically on push to `main`:

```bash
git push origin main
```

Optional CLI deploy:

```bash
npx vercel
npx vercel --prod
```