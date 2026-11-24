/**
 * `npm run indexnow` — after deploying, pings IndexNow (Bing, Yandex and others) with
 * the URLs whose HTML changed since the last successful ping.
 *
 *   npm run indexnow             changed URLs only
 *   npm run indexnow -- --all    every URL in the sitemap
 *   npm run indexnow -- --dry    show what would be sent, send nothing
 *
 * The key file lives in /public/<key>.txt and is deployed with the site.
 * State is kept in .indexnow-manifest.json (git-ignored).
 */
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { indexNowKey } from '../src/data/indexnow.ts';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const DIST = join(ROOT, 'dist');
const MANIFEST = join(ROOT, '.indexnow-manifest.json');
const HOST = 'worksai.uk';
const all = process.argv.includes('--all');
const dry = process.argv.includes('--dry');

const sitemap = await readFile(join(DIST, 'sitemap.xml'), 'utf8').catch(() => {
  console.error('dist/sitemap.xml not found. Run `npm run build` first.');
  process.exit(1);
});
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
const previous: Record<string, string> = JSON.parse(await readFile(MANIFEST, 'utf8').catch(() => '{}'));
const current: Record<string, string> = {};
const changed: string[] = [];

for (const url of urls) {
  const path = new URL(url).pathname;
  const html = await readFile(join(DIST, path, 'index.html'), 'utf8');
  // ignore asset hashes so only real content changes count
  const hash = createHash('sha256').update(html.replace(/\/_astro\/[^"']+/g, '')).digest('hex');
  current[url] = hash;
  if (all || previous[url] !== hash) changed.push(url);
}

if (!changed.length) {
  console.log('IndexNow: nothing changed since the last ping.');
  process.exit(0);
}
console.log(`IndexNow: ${changed.length} URL(s)${dry ? ' (dry run)' : ''}:\n  ${changed.join('\n  ')}`);
if (dry) process.exit(0);

const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: HOST, key: indexNowKey, keyLocation: `https://${HOST}/${indexNowKey}.txt`, urlList: changed.slice(0, 10000) }),
});
if (res.status === 200 || res.status === 202) {
  await writeFile(MANIFEST, JSON.stringify(current, null, 2));
  console.log(`IndexNow accepted (${res.status}). Manifest updated.`);
} else {
  console.error(`IndexNow returned ${res.status}: ${await res.text()}`);
  process.exit(1);
}
