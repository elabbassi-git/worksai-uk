/**
 * `npm run test:responsive`: loads every page in dist/sitemap.xml (+ the 404) at 12 viewport
 * sizes in headless Chrome and fails on: horizontal page overflow, visible elements that spill
 * past the viewport without a clipping ancestor, and text smaller than 10.5px.
 * Requires the preview server (`npm run preview`) or set BASE_URL. Uses the local Chrome install.
 */
import puppeteer from 'puppeteer-core';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const BASE = process.env.BASE_URL ?? 'http://localhost:4321';
const CHROME =
  process.env.CHROME_PATH ??
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => existsSync(p));
if (!CHROME) throw new Error('Chrome not found: set CHROME_PATH');

const sizes: [number, number, string][] = [
  [320, 640, 'small phone'],
  [360, 740, 'Android'],
  [375, 812, 'iPhone'],
  [390, 844, 'iPhone 14'],
  [414, 896, 'large phone'],
  [667, 375, 'phone landscape'],
  [844, 390, 'phone landscape L'],
  [768, 1024, 'tablet portrait'],
  [1024, 768, 'tablet landscape'],
  [1280, 800, 'laptop'],
  [1440, 900, 'desktop'],
  [1920, 1080, 'large desktop'],
];

const sitemap = await readFile(new URL('../dist/sitemap.xml', import.meta.url), 'utf8');
const pages = [...sitemap.matchAll(/<loc>https:\/\/worksai\.uk([^<]+)<\/loc>/g)].map((m) => m[1]!).concat(['/404/']);

const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
const failures: string[] = [];

for (const path of pages) {
  for (const [w, h, label] of sizes) {
    await page.setViewport({ width: w, height: h, isMobile: w < 768, hasTouch: w < 768 });
    await page.goto(BASE + path, { waitUntil: 'load' });
    const probs: string[] = await page.evaluate((vw: number) => {
      const out: string[] = [];
      const de = document.documentElement;
      if (de.scrollWidth > vw + 1) out.push(`page scrolls sideways (${de.scrollWidth}px)`);
      const clipped = (el: Element) => {
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          if (/(hidden|auto|scroll|clip)/.test(getComputedStyle(a).overflowX)) return true;
        }
        return false;
      };
      for (const el of document.querySelectorAll('body *')) {
        if (out.length > 5) break;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[aria-hidden="true"]') || el.closest('[hidden]')) continue;
        if ((r.right > vw + 2 || r.left < -2) && cs.position !== 'fixed' && !clipped(el)) {
          out.push(`${el.tagName.toLowerCase()}.${String((el as HTMLElement).className).split(' ').slice(0, 3).join('.')} spills [${Math.round(r.left)}..${Math.round(r.right)}]`);
        }
        if (!el.children.length && el.textContent?.trim() && parseFloat(cs.fontSize) < 10.5 && !el.closest('svg,.sr-only')) {
          out.push(`tiny text ${cs.fontSize}: "${el.textContent.trim().slice(0, 24)}"`);
        }
      }
      return [...new Set(out)];
    }, w);
    if (probs.length) failures.push(`${path} @ ${w}x${h} (${label}): ${probs.slice(0, 4).join(' | ')}`);
  }
}
await browser.close();
console.log(`Responsive: ${pages.length} pages × ${sizes.length} viewports = ${pages.length * sizes.length} checks.`);
if (failures.length) {
  console.error(`\n${failures.length} problem(s):\n  ` + failures.join('\n  '));
  process.exit(1);
}
console.log('No overflow, spill or unreadable text found.');
