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

The development server prints its local URL after startup. No environment variables are currently required.

## Build

```bash
npm run build
npm start
```

`npm run build` creates the Next.js production build in `.next/` (generated, not committed).

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
- Contact: `src/app/contact/page.tsx`
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