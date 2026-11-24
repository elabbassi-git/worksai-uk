/**
 * `npm run check` — QA gate for the built site (run after `npm run build`).
 * Fails (exit 1) on any error. Also regenerates the placeholder list in TODO.md.
 *
 * Checks: unique titles (<60 chars, "| Works AI") and descriptions (140–160), one H1,
 * self canonical, en-GB, breadcrumbs, JSON-LD validity and required types, forbidden
 * schema types, broken internal links, ≥3 internal links in and out, drafts absent
 * from dist/sitemap/links, sitemap URLs exist, image attributes, prices only from
 * pricing.ts, UK spelling, banned hype words, and word counts (warnings).
 */
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse, type HTMLElement } from 'node-html-parser';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const SITE = 'https://worksai.uk';
const errors: string[] = [];
const warnings: string[] = [];
const err = (page: string, msg: string) => errors.push(`${page}: ${msg}`);
const warn = (page: string, msg: string) => warnings.push(`${page}: ${msg}`);

async function walk(dir: string, filter: (f: string) => boolean): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p, filter)));
    else if (filter(p)) out.push(p);
  }
  return out;
}
const exists = async (p: string) => !!(await stat(p).catch(() => null));

/* ---------- load pages ---------- */
type Page = { path: string; root: HTMLElement; html: string; text: string };
const pages: Page[] = [];
for (const file of await walk(DIST, (f) => f.endsWith('.html'))) {
  const rel = '/' + relative(DIST, file).split(sep).join('/').replace(/index\.html$/, '').replace(/\.html$/, '/');
  const html = await readFile(file, 'utf8');
  const root = parse(html);
  const main = root.querySelector('body')!.clone() as HTMLElement;
  main.querySelectorAll('script, style, svg').forEach((n) => n.remove());
  pages.push({ path: rel, root, html, text: main.textContent.replace(/\s+/g, ' ') });
}
const isReal = (p: Page) => p.path !== '/404/';
const real = pages.filter(isReal);
const known = new Set(pages.map((p) => p.path));

/* ---------- drafts from source ---------- */
const drafts: string[] = [];
for (const f of await walk(join(ROOT, 'src/content'), (f) => /\.mdx?$/.test(f))) {
  const fm = (await readFile(f, 'utf8')).match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  const draft = /^draft:\s*true/m.test(fm) || (f.includes(`${sep}blog${sep}`) && !/^draft:\s*false/m.test(fm));
  if (!draft) continue;
  let path = fm.match(/^path:\s*"?([^"\n]+)"?/m)?.[1];
  if (!path && f.includes(`${sep}blog${sep}`)) path = `/blog/${f.split(sep).pop()!.replace(/\.mdx?$/, '')}/`;
  if (path) drafts.push(path.trim());
}

/* ---------- per-page checks ---------- */
const titles = new Map<string, string>();
const descs = new Map<string, string>();
const inbound = new Map<string, Set<string>>();
const outbound = new Map<string, Set<string>>();
const placeholders = new Map<string, Set<string>>();

for (const p of pages) {
  const r = p.root;
  const title = r.querySelector('title')?.text ?? '';
  const desc = r.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
  const canonical = r.querySelector('link[rel="canonical"]')?.getAttribute('href');
  const h1s = r.querySelectorAll('h1');

  if (r.querySelector('html')?.getAttribute('lang') !== 'en-GB') err(p.path, 'html lang is not en-GB');
  if (h1s.length !== 1) err(p.path, `expected 1 <h1>, found ${h1s.length}`);
  // heading hierarchy: first heading is the h1 and no level is skipped (h2 -> h4)
  {
    const levels = r.querySelectorAll('main h1, main h2, main h3, main h4, main h5, main h6').map((h) => Number(h.tagName[1]));
    if (levels.length && levels[0] !== 1) err(p.path, `first heading in <main> is h${levels[0]}, expected h1`);
    for (let i = 1; i < levels.length; i++) if (levels[i]! > levels[i - 1]! + 1) err(p.path, `heading level skipped: h${levels[i - 1]} -> h${levels[i]}`);
  }
  const robots = r.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
  if (isReal(p) && !/index, follow/.test(robots)) err(p.path, `robots meta should allow indexing, got "${robots}"`);
  if (!isReal(p) && !/noindex/.test(robots)) err(p.path, '404 page must be noindex');
  for (const prop of ['og:title', 'og:description', 'og:url', 'og:type', 'og:locale']) if (!r.querySelector(`meta[property="${prop}"]`)) err(p.path, `missing ${prop}`);
  if (!r.querySelector('meta[name="twitter:card"]')) err(p.path, 'missing twitter:card');

  if (isReal(p)) {
    if (title.length >= 60) err(p.path, `title is ${title.length} chars (must be under 60): "${title}"`);
    if (!title.endsWith('| Works AI')) err(p.path, 'title must end with "| Works AI"');
    if (titles.has(title)) err(p.path, `duplicate title (also ${titles.get(title)})`);
    titles.set(title, p.path);
    if (desc.length < 140 || desc.length > 160) err(p.path, `meta description is ${desc.length} chars (140–160): "${desc}"`);
    if (descs.has(desc)) err(p.path, `duplicate description (also ${descs.get(desc)})`);
    descs.set(desc, p.path);
    if (canonical !== SITE + p.path) err(p.path, `canonical ${canonical} is not self-referencing`);
    const hreflangs = r.querySelectorAll('link[rel="alternate"][hreflang]').map((l) => l.getAttribute('hreflang'));
    if (!hreflangs.includes('en-GB') || !hreflangs.includes('x-default')) err(p.path, 'missing en-GB / x-default hreflang');
    if (!r.querySelector('meta[property="og:image"]')) err(p.path, 'missing og:image');
    const og = r.querySelector('meta[property="og:image"]')?.getAttribute('content')?.replace(SITE, '');
    if (og && !(await exists(join(DIST, og)))) err(p.path, `og:image file missing: ${og}`);
    if (r.querySelector('nav[aria-label="Breadcrumb"]')) err(p.path, 'visible breadcrumbs are not used (BreadcrumbList JSON-LD only)');
  }

  // JSON-LD
  const blocks = r.querySelectorAll('script[type="application/ld+json"]');
  if (!blocks.length) err(p.path, 'no JSON-LD');
  const types: string[] = [];
  for (const b of blocks) {
    let data: any;
    try {
      data = JSON.parse(b.text);
    } catch {
      err(p.path, 'JSON-LD does not parse');
      continue;
    }
    if (data['@context'] !== 'https://schema.org') err(p.path, 'JSON-LD @context must be https://schema.org');
    const nodes: any[] = data['@graph'] ?? [data];
    const visit = (n: any) => {
      if (!n || typeof n !== 'object') return;
      if (Array.isArray(n)) return n.forEach(visit);
      if (n['@type']) types.push(...[n['@type']].flat());
      Object.values(n).forEach(visit);
    };
    nodes.forEach(visit);
    const raw = b.text;
    if (raw.includes('{{')) err(p.path, 'JSON-LD contains an unfilled {{PLACEHOLDER}}');
    for (const n of nodes) {
      if (n['@type'] === 'Service' && (!n.name || !n.provider || !n.areaServed)) err(p.path, 'Service schema missing name/provider/areaServed');
      if (n['@type'] === 'Course') {
        if (!n.name || !n.description || !n.provider) err(p.path, 'Course schema missing name/description/provider');
        if (!n.offers?.category || n.offers?.priceCurrency !== 'GBP') err(p.path, 'Course offers must have category and GBP');
        if (!n.hasCourseInstance?.[0]?.courseMode) err(p.path, 'Course missing hasCourseInstance.courseMode');
      }
      if (n['@type'] === 'Article' && (!n.headline || !n.datePublished || !n.author)) err(p.path, 'Article schema incomplete');
      if (n['@type'] === 'FAQPage' && !n.mainEntity?.length) err(p.path, 'FAQPage with no questions');
    }
  }
  for (const t of ['Organization', 'WebSite']) if (!types.includes(t)) err(p.path, `JSON-LD missing ${t}`);
  if (!types.some((t) => ['WebPage', 'ContactPage', 'AboutPage'].includes(t))) err(p.path, 'JSON-LD missing WebPage');
  if (isReal(p) && p.path !== '/' && !types.includes('BreadcrumbList')) err(p.path, 'JSON-LD missing BreadcrumbList');
  for (const t of ['AggregateRating', 'Review', 'LocalBusiness']) if (types.includes(t)) err(p.path, `forbidden schema type ${t}`);
  if (/^\/(services|business)\/.+/.test(p.path) && !types.includes('Service')) err(p.path, 'service page without Service schema');
  if (/^\/ai-shop\/training\/[^/]+\/$/.test(p.path) && !types.includes('Course')) err(p.path, 'course page without Course schema');

  // images
  for (const img of r.querySelectorAll('img')) {
    if (img.getAttribute('alt') == null) err(p.path, `<img> without alt: ${img.getAttribute('src')}`);
    if (!img.getAttribute('width') || !img.getAttribute('height')) err(p.path, `<img> without width/height: ${img.getAttribute('src')}`);
  }

  // links
  const outs = new Set<string>();
  for (const a of r.querySelectorAll('a[href]')) {
    let href = a.getAttribute('href')!;
    if (href.startsWith(SITE)) href = href.slice(SITE.length) || '/';
    if (!href.startsWith('/') || href.startsWith('//')) continue;
    const clean = href.split('#')[0]!.split('?')[0]!;
    if (!clean) continue;
    if (/\{\{/.test(clean) || /%7B%7B/.test(clean)) {
      err(p.path, `link to a placeholder URL: ${href}`);
      continue;
    }
    const isFile = /\.[a-z0-9]+$/i.test(clean);
    if (!isFile && !clean.endsWith('/')) err(p.path, `link without trailing slash: ${href}`);
    const ok = isFile ? await exists(join(DIST, clean)) : known.has(clean);
    if (!ok) err(p.path, `broken internal link: ${href}`);
    if (drafts.includes(clean)) err(p.path, `links to draft page ${clean}`);
    if (!isFile && clean !== p.path) {
      outs.add(clean);
      if (!inbound.has(clean)) inbound.set(clean, new Set());
      inbound.get(clean)!.add(p.path);
    }
    const text = a.textContent.trim().toLowerCase();
    if (['click here', 'here', 'read more', 'more'].includes(text)) err(p.path, `non-descriptive anchor text "${text}" -> ${href}`);
  }
  outbound.set(p.path, outs);

  // visible-text checks
  const found = p.html.match(/\{\{[A-Z0-9_]+\}\}/g);
  if (found) placeholders.set(p.path, new Set(found));
  const us = p.text.match(/\b(organiz\w*|optimiz\w*|colors?\b|favorite\w*|analyz\w*|inquir\w*|behavior\w*|catalog\b|centers?\b|personaliz\w*|prioritiz\w*|customiz\w*)/gi);
  if (us) err(p.path, `US spelling: ${[...new Set(us)].join(', ')}`);
  const hype = p.text.match(/\b(revolutionary|cutting-edge|unlock\w*|game-chang\w*|supercharg\w*|next-level|seamless\w*)\b/gi);
  if (hype) err(p.path, `hype words: ${[...new Set(hype)].join(', ')}`);
  if (/\bMorocc|\bMaroc/i.test(p.html)) err(p.path, 'mentions Morocco');
  // One-time pricing only: no recurring prices or plans anywhere
  const recurring = p.text.match(/£[\d,.]+\s*(\/\s*mo(nth)?\b|per month|a month|monthly)|\b(monthly plans?|monthly subscription|subscription plans?|per month|\/month|\/mo\b|retainer of)/gi);
  if (recurring) err(p.path, `recurring pricing reference: ${[...new Set(recurring)].join(', ')}`);
}

/* ---------- site-wide link graph ---------- */
for (const p of real) {
  const ins = inbound.get(p.path)?.size ?? 0;
  const outs = outbound.get(p.path)?.size ?? 0;
  if (ins === 0) err(p.path, 'orphan page: no internal links point to it');
  else if (ins < 3) err(p.path, `only ${ins} internal pages link to it (need 3)`);
  if (outs < 3) err(p.path, `only ${outs} internal links out (need 3)`);
}

/* ---------- drafts & sitemap ---------- */
const sitemap = await readFile(join(DIST, 'sitemap.xml'), 'utf8');
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!.replace(SITE, ''));
for (const d of drafts) {
  if (known.has(d)) err(d, 'draft page is present in dist/');
  if (locs.includes(d)) err(d, 'draft page is in sitemap.xml');
}
for (const l of locs) if (!known.has(l)) err(l, 'sitemap URL has no page');
for (const p of real) if (!locs.includes(p.path)) err(p.path, 'published page missing from sitemap.xml');
if (!/<lastmod>\d{4}-\d{2}-\d{2}<\/lastmod>/.test(sitemap)) err('sitemap.xml', 'missing lastmod');
if (!(await exists(join(DIST, 'robots.txt')))) err('robots.txt', 'missing');
if (!(await exists(join(DIST, 'rss.xml')))) err('rss.xml', 'missing');
if (!(await exists(join(DIST, 'llms.txt')))) err('llms.txt', 'missing');
{
  const robotsTxt = await readFile(join(DIST, 'robots.txt'), 'utf8');
  if (/Disallow:\s*\/\s*$/m.test(robotsTxt)) err('robots.txt', 'blocks the whole site');
  if (/Disallow:\s*\/og\//.test(robotsTxt)) err('robots.txt', 'blocks Open Graph images');
  if (!robotsTxt.includes('Sitemap: https://worksai.uk/sitemap.xml')) err('robots.txt', 'missing Sitemap line');
}

/* ---------- prices only from pricing.ts (source lint) ---------- */
for (const f of await walk(join(ROOT, 'src'), (f) => /\.(astro|md|mdx|ts)$/.test(f))) {
  const rel = relative(ROOT, f);
  if (rel === join('src', 'data', 'pricing.ts')) continue;
  if (rel.startsWith(join('src', 'content', 'lessons')) || rel.startsWith(join('src', 'content', 'blog'))) continue; // teaching examples
  (await readFile(f, 'utf8')).split('\n').forEach((line: string, i: number) => {
    if (/£\s?\d/.test(line) && !/preview:/.test(line) && !/illustrative/i.test(line)) err(`${rel}:${i + 1}`, `hard-coded price "${line.trim().slice(0, 80)}" (use pricing.ts tokens)`);
  });
}

/* ---------- word counts (warnings) ---------- */
const words = (p: Page) => (p.root.querySelector('main')?.textContent ?? '').trim().split(/\s+/).length;
for (const p of real) {
  const n = words(p);
  if (/^\/(services|business)\/[^/]+\/([^/]+\/)?$/.test(p.path) && n < 800) warn(p.path, `${n} words in <main> (launch pages target 800–1,200)`);
}

/* ---------- placeholders into TODO.md ---------- */
const byKey = new Map<string, Set<string>>();
for (const [page, set] of placeholders) for (const k of set) (byKey.get(k) ?? byKey.set(k, new Set()).get(k)!).add(page);
const table =
  '| Placeholder | Appears on |\n|---|---|\n' +
  [...byKey.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, ps]) => `| \`${k}\` | ${[...ps].sort().map((x) => `\`${x}\``).join(', ')} |`)
    .join('\n');
const todoPath = join(ROOT, 'TODO.md');
if (await exists(todoPath)) {
  const todo = await readFile(todoPath, 'utf8');
  const start = '<!-- PLACEHOLDERS:START -->';
  const end = '<!-- PLACEHOLDERS:END -->';
  if (todo.includes(start)) {
    const next = todo.replace(new RegExp(`${start}[\\s\\S]*?${end}`), `${start}\n_Generated by \`npm run check\` from the built site._\n\n${table}\n${end}`);
    await writeFile(todoPath, next);
  }
}

/* ---------- report ---------- */
console.log(`Checked ${pages.length} pages (${real.length} published + 404), ${drafts.length} drafts, ${locs.length} sitemap URLs, ${byKey.size} distinct placeholders.`);
if (warnings.length) console.log(`\n${warnings.length} warning(s):\n  ` + warnings.join('\n  '));
if (errors.length) {
  console.error(`\n${errors.length} error(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log('\nAll checks passed.');
