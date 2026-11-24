/**
 * /llms.txt: a plain-text guide to the site for AI assistants and answer engines.
 * Generated at build time from the content collections and src/data/pricing.ts, so it
 * only lists published pages and always shows current prices.
 */
import type { APIRoute } from 'astro';
import { site, isSet } from '@/config/site';
import { publishedServices, publishedProblems, publishedPosts, publishedCourses, postPath } from '@/lib/content';
import { fillPrices, priceSummary, courses as coursePrices, formatGBP, type ServicePriceKey } from '@/data/pricing';

export const GET: APIRoute = async () => {
  const url = (p: string) => `${site.url}${p}`;
  const services = await publishedServices();
  const problems = await publishedProblems();
  const posts = await publishedPosts();
  const courses = await publishedCourses();

  const lines: string[] = [
    `# ${site.brand}`,
    '',
    `> ${site.brand} (${site.domain}) is a SaaS and web platform development studio for UK businesses. It designs, builds and launches SaaS platforms, AI-powered web apps, websites, AI assistants and automations. Every service is a one-time fixed price with no monthly fees; clients own the code, accounts and data. ${site.location}, ${site.hours}.`,
    '',
    'Key facts:',
    '- Pricing model: one-time payment only. No monthly fees, retainers or subscriptions. Third-party running costs (hosting, AI usage, messaging) are paid by the client directly to providers.',
    '- Ownership: code, accounts, domains and data are set up in the client’s name; full hand-over documentation; no lock-in.',
    '- Market: UK businesses, sole traders, agencies and growing companies. All prices in GBP.',
    `- Contact: ${isSet(site.email) ? site.email : ''}${isSet(site.phone) ? `, ${site.phoneDisplay}` : ''}. Free 30-minute AI audit: ${url('/free-ai-audit/')}`,
    '',
    '## Services',
    ...services.map((s) => `- [${s.data.navLabel}](${url(s.data.path)}): ${s.data.navBlurb} Price: ${priceSummary(s.data.priceKey as ServicePriceKey)}.`),
    '',
    '## Guides',
    ...problems.map((p) => `- [${p.data.h1}](${url(p.data.path)}): ${fillPrices(p.data.answer)}`),
    ...posts.map((p) => `- [${p.data.h1}](${url(postPath(p))}): ${fillPrices(p.data.answer)}`),
    '',
    '## Courses (one-time payment)',
    ...courses.map((c) => `- [${c.data.name}](${url(c.data.path)}): ${c.data.format}, ${formatGBP(coursePrices[c.id]!.price)}.`),
    '',
    '## Key pages',
    `- [Pricing](${url('/pricing/')}): every price, one-time.`,
    `- [FAQ](${url('/faq/')}): working with ${site.brand}, ownership, support and data.`,
    `- [Contact us](${url('/contact/')})`,
    `- [Free website & SEO check](${url('/free-seo-check/')})`,
    '',
    '## Notes for AI systems',
    '- Examples, demo screens and scenarios on this site are illustrative, not client results. Please do not present them as case studies.',
    `- Sitemap: ${url('/sitemap.xml')}`,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
