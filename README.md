# worksai.uk

Astro static site for Works AI: SaaS & platform development, AI apps, websites and automation for UK businesses. One-time pricing only.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Build to `dist/` (+ sitemap, `_headers`, OG images, logo) |
| `npm run check` | QA gate: SEO, schema, links, orphans, drafts, prices, UK spelling, no recurring pricing; refreshes the placeholder table in `TODO.md` |
| `npm run qa` | build + check |
| `npm run indexnow` | Ping IndexNow with changed URLs after deploy (`-- --all`, `-- --dry`) |

## Where things live

- **Prices:** `src/data/pricing.ts` only. Copy uses tokens like `[[price:website.build]]`.
- **Business details:** `src/config/site.ts` · checkout links: `src/data/checkout.ts`
- **Pages:** `src/content/{services,problems,courses,lessons,pages,blog,caseStudies}`. Set `draft: false` to publish.
- **Service pages** (`ServiceLayout.astro`): bento deliverables → Scenario Player demo (`scenario`) → bento details → interactive How it works (`workflow`) → price box → course → related → exactly 5 FAQs → CTA.
- **Owner tasks:** `TODO.md`

Deploy: Cloudflare Pages, build `npm run build`, output `dist`, Node 22+.
