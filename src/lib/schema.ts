import { site, real } from '@/config/site';
import { services as servicePrices, courses as coursePrices, currency, type ServicePrice } from '@/data/pricing';

const abs = (path: string) => new URL(path, site.url).href;
const ORG_ID = `${site.url}/#organization`;
const clean = <T extends Record<string, unknown>>(o: T) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => v !== undefined && !(Array.isArray(v) && v.length === 0)));

export function organization() {
  return clean({
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.brand,
    legalName: real(site.legalName),
    url: `${site.url}/`,
    logo: abs('/logo.png'),
    description: `${site.tagline}. ${site.location}.`,
    email: real(site.email),
    telephone: real(site.phone),
    sameAs: site.sameAs.filter((u) => real(u)),
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    knowsAbout: [
      'SaaS development',
      'Web platform development',
      'AI web application development',
      'AI agents and virtual assistants',
      'WhatsApp chatbots',
      'AI receptionists',
      'Workflow automation',
      'Website design',
      'Search engine optimisation',
      'Local SEO and Google Business Profile',
    ],
    slogan: 'One-time fixed prices. You own what we build.',
    contactPoint: real(site.email)
      ? [
          clean({
            '@type': 'ContactPoint',
            contactType: 'sales',
            email: real(site.email),
            telephone: real(site.phone),
            areaServed: 'GB',
            availableLanguage: ['en-GB'],
          }),
        ]
      : undefined,
  });
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    name: site.brand,
    url: `${site.url}/`,
    inLanguage: 'en-GB',
    publisher: { '@id': ORG_ID },
  };
}

export function webPage(opts: { path: string; title: string; description: string; updated: string; hasBreadcrumb: boolean; type?: string }) {
  const url = abs(opts.path);
  return {
    '@type': opts.type ?? 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: opts.title,
    description: opts.description,
    inLanguage: 'en-GB',
    isPartOf: { '@id': `${site.url}/#website` },
    about: { '@id': ORG_ID },
    dateModified: opts.updated,
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(ogPath(opts.path)), width: 1200, height: 630 },
    ...(opts.hasBreadcrumb ? { breadcrumb: { '@id': `${url}#breadcrumb` } } : {}),
    speakable: { '@type': 'SpeakableSpecification', cssSelector: ['h1', '[data-speakable]'] },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbList(crumbs: Crumb[]) {
  const last = crumbs[crumbs.length - 1]!;
  return {
    '@type': 'BreadcrumbList',
    '@id': `${abs(last.path)}#breadcrumb`,
    itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

export function service(opts: { name: string; description: string; path: string; serviceType: string; priceKey: string }) {
  const p = (servicePrices as Record<string, ServicePrice>)[opts.priceKey];
  const lead = p && !p.onRequest && p.build != null && p.build > 0 ? p.build : undefined;
  return clean({
    '@type': 'Service',
    '@id': `${abs(opts.path)}#service`,
    name: opts.name,
    description: opts.description,
    serviceType: opts.serviceType,
    url: abs(opts.path),
    provider: { '@id': ORG_ID },
    areaServed: { '@type': 'Country', name: 'United Kingdom' },
    offers:
      lead != null
        ? {
            '@type': 'Offer',
            price: lead,
            priceCurrency: currency,
            description: 'One-time payment',
            url: abs(opts.path),
          }
        : undefined,
  });
}

export function course(opts: {
  name: string;
  description: string;
  path: string;
  slug: string;
  mode: 'recorded' | 'live';
  workload: string;
}) {
  const price = coursePrices[opts.slug];
  return clean({
    '@type': 'Course',
    '@id': `${abs(opts.path)}#course`,
    name: opts.name,
    description: opts.description,
    url: abs(opts.path),
    inLanguage: 'en-GB',
    provider: { '@type': 'Organization', '@id': ORG_ID, name: site.brand, sameAs: `${site.url}/` },
    offers: price
      ? {
          '@type': 'Offer',
          category: 'Paid',
          price: price.price,
          priceCurrency: currency,
          url: abs(opts.path),
        }
      : undefined,
    hasCourseInstance: [
      {
        '@type': 'CourseInstance',
        courseMode: 'Online',
        courseWorkload: opts.workload,
      },
    ],
  });
}

export function article(opts: { headline: string; description: string; path: string; published: Date; updated: Date; author: string }) {
  return clean({
    '@type': 'Article',
    headline: opts.headline,
    description: opts.description,
    mainEntityOfPage: abs(opts.path),
    datePublished: opts.published.toISOString().slice(0, 10),
    dateModified: opts.updated.toISOString().slice(0, 10),
    inLanguage: 'en-GB',
    author: real(opts.author) ? { '@type': 'Person', name: opts.author } : { '@id': ORG_ID },
    publisher: { '@id': ORG_ID },
    image: abs(ogPath(opts.path)),
  });
}

export function faqPage(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

/** /services/ai-agents/whatsapp/ -> /og/services-ai-agents-whatsapp.png */
export const ogPath = (path: string) => `/og/${path.replace(/^\/|\/$/g, '').replace(/\//g, '-') || 'home'}.png`;
