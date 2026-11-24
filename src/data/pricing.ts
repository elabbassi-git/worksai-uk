/**
 * THE single source of truth for every price on the site (GBP).
 * Change a number here and every page, meta description and JSON-LD offer updates.
 *
 * - `onRequest: true` shows "Price on request" until a real figure is set
 *   (these were {{PRICE_FROM}} in the brief).
 * - All prices are proposals until the owner approves them (see TODO.md).
 */

export type ServicePrice = {
  name: string;
  /** One-time price. null = not set yet (use onRequest). */
  build: number | null;
  /** Show "from" before the price. */
  from: boolean;
  /** Shows "Price on request" until a real figure is set ({{PRICE_FROM}} in the brief). */
  onRequest?: boolean;
  includes: string[];
  excludes: string[];
};

/**
 * Pricing model: ONE-TIME PAYMENT ONLY. No monthly fees, retainers or subscriptions.
 * Clients own what we build. Third-party running costs (hosting, AI usage, WhatsApp fees,
 * software licences) are paid by the client directly to those providers, in accounts in
 * the client's name, at the provider's own rates, with no markup from us.
 */
export const pricingModel = {
  headline: 'One-time payment. You own it.',
  postLaunchSupport: '{{POST_LAUNCH_SUPPORT_PERIOD}}',
};

export const currency = 'GBP';

/** If true, course pages say the course price is deducted when the buyer later orders the service. */
export const courseCreditTowardsService = true;

/** Wording about VAT. Stays a placeholder until confirmed with an accountant. */
export const vatNote = '{{VAT_NOTE}}';

const own = 'Full ownership: code, accounts and data in your name';
const handover = 'Hand-over documentation and training';

export const services = {
  freeAudit: {
    name: 'Free 30-minute AI audit call',
    build: 0,
    from: false,
    includes: ['A 30-minute video call', 'A look at how enquiries, bookings and admin work today', 'Two or three practical next steps'],
    excludes: ['A written report (see the written AI audit)'],
  },
  writtenAudit: {
    name: 'Written AI audit',
    build: 295,
    from: false,
    includes: ['A review of your website, enquiry handling and admin', 'A written report with priorities and rough costs', 'A follow-up call to go through it'],
    excludes: ['Building anything recommended in the report'],
  },
  saasPlatform: {
    name: 'SaaS & web platform development',
    build: null,
    from: true,
    onRequest: true,
    includes: [
      'Discovery, product scoping and technical architecture',
      'UX and UI design of every screen',
      'Full build: accounts, roles, multi-tenancy, payments, admin',
      'Automated tests, security review and launch',
      own,
      handover,
    ],
    excludes: ['Hosting and third-party service fees, paid directly to providers', 'New features after launch (quoted as one-off pieces of work)'],
  },
  aiAssistant: {
    name: 'WhatsApp or website AI assistant',
    build: 1200,
    from: true,
    includes: [
      'Set-up on WhatsApp or your website',
      'Trained on your services, prices and FAQs',
      'Hand-over to a person when needed',
      'Booking or lead capture into your calendar or CRM',
      own,
      handover,
    ],
    excludes: [
      'WhatsApp Business Platform message fees (paid directly to Meta)',
      'AI usage and hosting, paid directly to providers in your own accounts',
    ],
  },
  aiReceptionist: {
    name: 'AI receptionist',
    build: 1500,
    from: true,
    includes: [
      'Call forwarding set-up on your number',
      'Call answering, message taking and booking',
      'Call summaries by email or WhatsApp',
      'Transfer to a person for urgent calls',
      own,
      handover,
    ],
    excludes: ['Voice platform call minutes, paid directly to the provider', 'Phone hardware'],
  },
  workflowAutomation: {
    name: 'Workflow automation (including invoice reminders)',
    build: 750,
    from: true,
    includes: [
      'Connection to your accounting tool, such as Xero or QuickBooks',
      'Reminder schedule by email and WhatsApp',
      'Templates written in your tone',
      'Error alerts so you know if a connection stops',
      own,
    ],
    excludes: ['Your accounting software and automation tool fees', 'WhatsApp message fees'],
  },
  website: {
    name: 'Website (5 pages + AI chat) with SEO',
    build: 1490,
    from: false,
    includes: [
      'A 5-page website designed for your business',
      'On-page SEO: titles, descriptions, structure, speed',
      'An AI chat assistant trained on your services',
      'Contact and enquiry forms',
      'Launch on hosting in your own name',
      own,
    ],
    excludes: ['Extra pages beyond the five (quoted separately)', 'Domain and hosting fees, paid directly to the provider', 'Large amounts of copywriting'],
  },
  dashboard: {
    name: 'Business dashboard',
    build: 900,
    from: true,
    includes: ['One screen for sales, accounts and ads', 'Connections to your existing tools', 'Automatic data refresh', own],
    excludes: ['Paid connector licences if a tool requires them'],
  },
  localSeo: {
    name: 'Google Business Profile & local SEO set-up',
    build: null,
    from: true,
    onRequest: true,
    includes: [
      'A complete, optimised Google Business Profile',
      'Listings cleaned up across the main UK directories',
      'A review-request system set up for you',
      'A 90-day posting plan with ready-made templates',
      'Training so you can run it yourself',
    ],
    excludes: ['Creating listings at addresses you do not trade from', 'Paid Google Ads'],
  },
  onlineBooking: {
    name: 'Online booking & appointments',
    build: null,
    from: true,
    onRequest: true,
    includes: ['Online booking page or widget', 'Text and email reminders', 'Calendar sync', 'Deposits or prepayment if you want them', own],
    excludes: ['Booking software, SMS and payment fees, paid directly to providers'],
  },
  clientPortal: {
    name: 'Client portal',
    build: null,
    from: true,
    onRequest: true,
    includes: ['Secure client log-in', 'Document upload and sharing', 'Progress or status tracking', own],
    excludes: ['Hosting and third-party licences, paid directly to providers'],
  },
  customCrm: {
    name: 'Custom CRM & integrations',
    build: null,
    from: true,
    onRequest: true,
    includes: ['A CRM shaped around how you sell', 'Or HubSpot or Pipedrive connected to your tools', 'Data import from spreadsheets', 'Training for your team'],
    excludes: ['HubSpot or Pipedrive licences'],
  },
  aiWebDevelopment: {
    name: 'AI web app development',
    build: null,
    from: true,
    onRequest: true,
    includes: ['Scoping and technical design', 'Build of the AI feature or web app', 'Testing with real examples', own, handover],
    excludes: ['AI model usage fees, paid directly to providers'],
  },
  researchStudio: {
    name: 'AI research & prototyping sprint',
    build: null,
    from: true,
    onRequest: true,
    includes: ['A 2 to 4 week sprint', 'A working prototype', 'A written go/no-go recommendation'],
    excludes: ['Building the production version'],
  },
  enterpriseAi: {
    name: 'AI solutions for growing companies',
    build: null,
    from: true,
    onRequest: true,
    includes: ['Discovery workshops', 'A prioritised AI roadmap', 'Delivery of agreed projects', 'Staff training'],
    excludes: ['Software licences'],
  },
} satisfies Record<string, ServicePrice>;

export type ServicePriceKey = keyof typeof services;

/** Budget bands offered on the contact form (the client's budget, not our prices). */
export const budgetBands = ['Under £1,500', '£1,500 to £5,000', '£5,000 to £15,000', '£15,000 to £50,000', 'Over £50,000', 'Not sure yet'];

export type CoursePrice = { price: number; from: boolean };

/** One-time course prices, keyed by course slug. */
export const courses: Record<string, CoursePrice> = {
  'whatsapp-ai-assistant': { price: 149, from: false },
  'google-business-profile-masterclass': { price: 79, from: false },
  'automate-invoice-chasing-xero-n8n': { price: 99, from: false },
  'ai-receptionist-in-a-day': { price: 99, from: false },
  'cut-no-shows-online-booking': { price: 49, from: false },
  'seo-for-small-business-websites': { price: 99, from: false },
  'run-a-client-portal': { price: 79, from: false },
  'simple-crm-your-team-will-use': { price: 79, from: false },
  'looker-studio-dashboards': { price: 99, from: false },
  'add-ai-to-your-web-app': { price: 199, from: false },
  'ai-idea-validation-sprint': { price: 495, from: false },
  'ai-strategy-workshop-leadership': { price: 1500, from: true },
  'ai-for-your-team-workshop': { price: 995, from: false },
};

/**
 * Sourced market figures for the "How our prices compare" note on /pricing/.
 * Not our prices: published figures from a third-party study, cited by name.
 */
export const marketComparison = {
  study: 'a November 2026 study of 277 UK AI agencies by TrustedAIAgencies, reported by IT Brief UK',
  sourceLink: '{{SOURCE_LINK}}',
  percentNotPublishingPrices: 59,
  medianStartingProject: 1500,
  medianChatbotBuild: 4000,
};

/* ---------- formatting helpers ---------- */

const gbp = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP', maximumFractionDigits: 0 });

export const formatGBP = (n: number) => gbp.format(n);

export const getService = (key: ServicePriceKey): ServicePrice => services[key];

/** Short human summary, e.g. "From £1,200, one-time" or "Price on request". */
export function priceSummary(key: ServicePriceKey): string {
  const s: ServicePrice = services[key];
  if (s.onRequest || s.build == null) return 'Price on request';
  if (s.build === 0) return 'Free';
  return `${s.from ? 'From ' : ''}${formatGBP(s.build)}, one-time`;
}

/**
 * Resolve price tokens in copy, so prose and meta descriptions never hard-code a price.
 * Tokens: [[price:<serviceKey>.build]], [[price:<serviceKey>.summary]], [[course:<slug>]], [[market:<field>]]
 */
export function fillPrices(text: string): string {
  return text.replace(/\[\[(price|course|market):([\w-]+)(?:\.(\w+))?\]\]/g, (match, kind, key, field) => {
    if (kind === 'price') {
      const s = (services as Record<string, ServicePrice>)[key];
      if (!s) throw new Error(`Unknown price token ${match}`);
      if (field === 'summary') return priceSummary(key as ServicePriceKey);
      if (field !== 'build') throw new Error(`Only .build and .summary price tokens exist (one-time pricing): ${match}`);
      if (s.onRequest || s.build == null) return 'price on request';
      return formatGBP(s.build);
    }
    if (kind === 'course') {
      const c = courses[key];
      if (!c) throw new Error(`Unknown course price ${match}`);
      return `${c.from ? 'from ' : ''}${formatGBP(c.price)}`;
    }
    const m = (marketComparison as Record<string, unknown>)[key];
    if (typeof m !== 'number') throw new Error(`Unknown market figure ${match}`);
    return key.startsWith('percent') ? `${m}%` : formatGBP(m);
  });
}

/** The lowest published one-time price, for "from" summaries. */
export const lowestBuild = Math.min(
  ...Object.values(services as Record<string, ServicePrice>)
    .map((s) => s.build)
    .filter((b): b is number => typeof b === 'number' && b > 0),
);
