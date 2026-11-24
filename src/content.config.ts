import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const path = z.string().regex(/^\/([a-z0-9-]+\/)*$/, 'Paths must be lowercase and end with a trailing slash');
const faq = z.array(z.object({ q: z.string(), a: z.string() }));
const titleField = z
  .string()
  .max(60, 'Titles must be under 60 characters')
  .refine((t) => t.endsWith('| Works AI'), 'Titles must end with "| Works AI"');
const description = z.string().min(100); // final length (after price tokens) is checked in dist by `npm run check`
const updated = z.coerce.date();

const services = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/services' }),
  schema: z.object({
    title: titleField,
    description,
    h1: z.string(),
    answer: z.string(),
    path,
    group: z.enum(['services', 'business', 'ai-shop']),
    navLabel: z.string(),
    navBlurb: z.string(),
    keyword: z.string(),
    serviceType: z.string(),
    draft: z.boolean().default(false),
    updated,
    order: z.number().default(50),
    priceKey: z.string(),
    course: z.string().nullable().default(null),
    problemPage: path,
    parent: path.optional(),
    related: z.array(path).min(2).max(3),
    problem: z.array(z.string()).min(1),
    problemQuotes: z.array(z.string()).default([]),
    deliverables: z.array(z.object({ title: z.string(), text: z.string() })).min(3).max(5),
    offerings: z
      .array(z.object({ title: z.string(), blurb: z.string(), icon: z.string(), badge: z.string(), summary: z.string(), includes: z.array(z.string()).min(3), features: z.array(z.string()).min(3), stack: z.array(z.string()).min(3) }))
      .optional(),
    scenario: z.object({
      kind: z.enum(['call', 'chat', 'feed']),
      title: z.string(),
      business: z.string(),
      channel: z.string().optional(),
      context: z.string(),
      lines: z.array(z.object({ from: z.enum(['customer', 'ai', 'system', 'you']), text: z.string(), meta: z.string().optional() })).min(3),
      outcome: z.object({ title: z.string(), items: z.array(z.string()).min(2) }),
    }),
    workflow: z
      .array(z.object({ actor: z.enum(['customer', 'ai', 'you', 'us']), title: z.string(), text: z.string(), preview: z.string().optional() }))
      .min(4)
      .max(6),
    steps: z.array(z.object({ title: z.string(), text: z.string() })).length(3),
    faq: faq.length(5),
    whatsappMessage: z.string().optional(),
  }),
});

const problems = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/problems' }),
  schema: z.object({
    title: titleField,
    description,
    h1: z.string(),
    answer: z.string(),
    path,
    keyword: z.string(),
    audience: z.string(),
    draft: z.boolean().default(false),
    updated,
    services: z.array(path).min(2),
    goodLooksLike: z.array(z.string()).min(3),
    faq: faq.default([]),
  }),
});

const courses = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/courses' }),
  schema: z.object({
    title: titleField,
    description,
    name: z.string(),
    h1: z.string(),
    answer: z.string(),
    path,
    service: path,
    format: z.string(),
    mode: z.enum(['recorded', 'live']),
    length: z.string(),
    workload: z.string().regex(/^P(T?\d+[HDWM])+$/, 'ISO 8601 duration, e.g. PT4H'),
    checkoutKey: z.string(),
    draft: z.boolean().default(false),
    updated,
    order: z.number().default(50),
    audience: z.array(z.string()).min(2),
    outcomes: z.array(z.string()).min(3),
    syllabus: z.array(z.object({ module: z.string(), lessons: z.array(z.string()).min(1) })).min(2),
    faq: faq.min(3),
    freeLesson: path.optional(),
  }),
});

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lessons' }),
  schema: z.object({
    title: titleField,
    description,
    h1: z.string(),
    path,
    course: z.string(),
    draft: z.boolean().default(false),
    updated,
    duration: z.string(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: titleField,
    description,
    h1: z.string(),
    answer: z.string(),
    category: z.enum(['Pricing guides', 'How-to', 'Comparisons']),
    draft: z.boolean().default(true),
    published: z.coerce.date(),
    updated,
    author: z.string().default('{{AUTHOR_NAME}}'),
    takeaways: z.array(z.string()).default([]),
    readingTime: z.string().optional(),
    featured: z.boolean().default(false),
    service: path,
    problemPage: path,
    keyword: z.string(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/pages' }),
  schema: z.object({
    title: titleField,
    description,
    h1: z.string(),
    path,
    draft: z.boolean().default(true),
    updated,
    legalReview: z.boolean().default(false),
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/caseStudies' }),
  schema: z.object({
    title: titleField,
    description,
    h1: z.string(),
    path,
    client: z.string(),
    clientConsent: z.boolean(),
    service: path,
    draft: z.boolean().default(true),
    updated,
  }),
});

export const collections = { services, problems, courses, lessons, blog, pages, caseStudies };
