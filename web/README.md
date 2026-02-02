# QuestHabit Landing Page

Marketing and waitlist landing page for [questhabit.com](https://questhabit.com).

## Tech Stack

- **Next.js 15** (Static Export)
- **Tailwind CSS 4**
- **TypeScript**

## Features

- Dark premium design matching the app aesthetic
- Responsive (mobile-first)
- Interactive phone mockups showing app UI
- Email waitlist capture (ready for Supabase backend)
- Feature showcase, pricing, FAQ, testimonials
- SEO-optimized with OpenGraph/Twitter meta
- Static export — deploy anywhere (Vercel, Cloudflare Pages, S3)

## Getting Started

```bash
cd web
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

The site exports as static HTML:

```bash
npm run build
```

Output goes to `web/out/` — deploy this folder to any static host.

### Vercel (Recommended)

1. Connect the repo to Vercel
2. Set root directory to `web/`
3. Done — automatic deploys on push

### Cloudflare Pages

1. Build command: `cd web && npm run build`
2. Output directory: `web/out`

## TODO

- [ ] Connect waitlist form to Supabase
- [ ] Add actual App Store / Play Store links at launch
- [ ] Add real social media links
- [ ] Add blog section
- [ ] Privacy policy & terms of service pages
- [ ] Analytics (Plausible or PostHog)
