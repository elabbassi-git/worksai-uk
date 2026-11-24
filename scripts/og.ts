/**
 * Post-build: generates a 1200x630 Open Graph PNG for every built page (from its <h1>
 * and meta description), plus /logo.png and /apple-touch-icon.png.
 * Run automatically by `npm run build`.
 */
import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const require = createRequire(import.meta.url);
const DIST = fileURLToPath(new URL('../dist/', import.meta.url));
const fontDir = join(require.resolve('@fontsource/inter/package.json'), '..', 'files');
const fonts = [
  { name: 'Inter', data: await readFile(join(fontDir, 'inter-latin-500-normal.woff')), weight: 500 as const, style: 'normal' as const },
  { name: 'Inter', data: await readFile(join(fontDir, 'inter-latin-700-normal.woff')), weight: 700 as const, style: 'normal' as const },
];

const decode = (s: string) =>
  s
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

async function htmlFiles(dir: string): Promise<string[]> {
  const out: string[] = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await htmlFiles(p)));
    else if (e.name === 'index.html') out.push(p);
  }
  return out;
}

const h = (type: string, style: Record<string, unknown>, children?: unknown) => ({ type, props: { style, children } });

const mark = (size: number) =>
  h('div', { display: 'flex', width: size, height: size, borderRadius: size * 0.22, background: '#15171c', alignItems: 'center', justifyContent: 'center', position: 'relative' }, [
    h('div', { display: 'flex', color: '#f6f2ea', fontSize: size * 0.56, fontWeight: 700, letterSpacing: -2 }, 'W'),
    h('div', { position: 'absolute', right: size * 0.14, bottom: size * 0.14, width: size * 0.13, height: size * 0.13, borderRadius: 999, background: '#ec5b2a' }, ''),
  ]);

function card(title: string, eyebrow: string) {
  return h(
    'div',
    { width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 120, padding: 72, background: '#f6f2ea', fontFamily: 'Inter', position: 'relative' },
    [
      h('div', { position: 'absolute', right: -120, top: -120, width: 520, height: 520, borderRadius: 999, background: '#fbd9c9' }, ''),
      h('div', { position: 'absolute', right: 140, bottom: -200, width: 380, height: 380, borderRadius: 999, background: '#d6e6dc' }, ''),
      h('div', { display: 'flex', alignItems: 'center', gap: 18 }, [
        h('div', { display: 'flex', fontSize: 44, fontWeight: 700, color: '#15171c', letterSpacing: -1 }, [h('span', {}, 'Works'), h('span', { color: '#ec5b2a', marginLeft: 10 }, 'AI')]),
      ]),
      h('div', { display: 'flex', flexDirection: 'column', gap: 18, maxWidth: 1000 }, [
        h('div', { display: 'flex', fontSize: 24, fontWeight: 500, color: '#555b67', textTransform: 'uppercase', letterSpacing: 2 }, eyebrow),
        h('div', { display: 'flex', fontSize: title.length > 70 ? 46 : title.length > 42 ? 54 : 66, fontWeight: 700, color: '#15171c', lineHeight: 1.05, letterSpacing: -2 }, title),
      ]),
      h('div', { position: 'absolute', left: 72, top: 536, display: 'flex', fontSize: 26, color: '#383d47', fontWeight: 500 }, 'worksai.uk  ·  Book a free 30-minute AI audit'),
    ],
  );
}

const png = async (node: unknown, width: number, height: number) => {
  const svg = await satori(node as never, { width, height, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng();
};

await mkdir(join(DIST, 'og'), { recursive: true });
const files = await htmlFiles(DIST);
let n = 0;
for (const file of files) {
  const html = await readFile(file, 'utf8');
  const og = html.match(/<meta property="og:image" content="https:\/\/worksai\.uk(\/og\/[^"]+\.png)"/)?.[1];
  if (!og) continue;
  const title = decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? 'Works AI');
  const crumbs = [...html.matchAll(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/g)][0]?.[0];
  const eyebrow = crumbs ? decode(crumbs.match(/<li[^>]*>[\s\S]*?<\/li>\s*<li[^>]*>([\s\S]*?)<\/li>/)?.[1] ?? '').replace(/^\/\s*/, '') : 'AI, websites & SEO for UK businesses';
  await writeFile(join(DIST, og), await png(card(title, eyebrow || 'Works AI'), 1200, 630));
  n++;
}

const logo = h('div', { width: 512, height: 512, display: 'flex' }, [mark(512)]);
await writeFile(join(DIST, 'logo.png'), await png(logo, 512, 512));
await writeFile(join(DIST, 'apple-touch-icon.png'), await png(h('div', { width: 180, height: 180, display: 'flex' }, [mark(180)]), 180, 180));
console.log(`og: ${n} Open Graph images + logo.png + apple-touch-icon.png`);
