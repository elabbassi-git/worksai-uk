import { getCollection, type CollectionEntry } from 'astro:content';

/** Hand-written .astro pages that are always published. */
export const staticPages: Record<string, string> = {
  '/': 'Home',
  '/services/': 'Services',
  '/business/': 'Business Solutions',
  '/ai-shop/': 'AI Shop',
  '/ai-shop/training/': 'AI Training & Coaching',
  '/pricing/': 'Pricing',
  '/free-ai-audit/': 'Book a free AI audit',
  '/free-seo-check/': 'Free website & SEO check',
  '/contact/': 'Contact us',
  '/about/': 'About',
  '/blog/': 'Blog',
  '/faq/': 'FAQ',
};

const pub = <T extends { data: { draft?: boolean } }>(e: T) => !e.data.draft;

export const publishedServices = async () =>
  (await getCollection('services', pub)).sort((a, b) => a.data.order - b.data.order);
export const publishedProblems = async () => await getCollection('problems', pub);
export const publishedCourses = async () =>
  (await getCollection('courses', pub)).sort((a, b) => a.data.order - b.data.order);
export const publishedLessons = async () => await getCollection('lessons', pub);
export const publishedPosts = async () =>
  (await getCollection('blog', pub)).sort((a, b) => +b.data.published - +a.data.published);
export const publishedPages = async () => await getCollection('pages', pub);
export const publishedCaseStudies = async () =>
  await getCollection('caseStudies', (e) => !e.data.draft && e.data.clientConsent);

export const postPath = (p: CollectionEntry<'blog'>) => `/blog/${p.id}/`;

/** path -> human label, for every page that exists in the build. Drafts are absent. */
export async function publishedRegistry(): Promise<Map<string, string>> {
  const map = new Map<string, string>(Object.entries(staticPages));
  for (const s of await publishedServices()) map.set(s.data.path, s.data.navLabel);
  for (const p of await publishedProblems()) map.set(p.data.path, p.data.h1);
  for (const c of await publishedCourses()) map.set(c.data.path, c.data.name);
  for (const l of await publishedLessons()) map.set(l.data.path, l.data.h1);
  for (const p of await publishedPages()) map.set(p.data.path, p.data.h1);
  for (const p of await publishedPosts()) map.set(postPath(p), p.data.h1);
  if ((await publishedCaseStudies()).length) map.set('/case-studies/', 'Case studies');
  return map;
}

/** True when a page at this path is published (used to hide links to drafts). */
export async function isPublished(path: string) {
  return (await publishedRegistry()).has(path);
}
