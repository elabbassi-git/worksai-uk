/**
 * Site-wide configuration. Every value that describes the business and is not
 * yet confirmed starts as a {{PLACEHOLDER}}. `npm run check` lists every
 * placeholder that still appears in the built site.
 */
export const site = {
  brand: 'Works AI',
  domain: 'worksai.uk',
  url: 'https://worksai.uk',
  tagline: 'AI assistants, websites and automation for UK businesses',
  email: 'hello@worksai.uk',
  phone: '+447311020193', // E.164, used in tel: links
  phoneDisplay: '+44 7311 020193',
  whatsappNumber: '447311020193', // international format, digits only
  bookingUrl: '{{BOOKING_URL}}', // e.g. a Cal.com or Calendly embed URL
  formEndpoint: '{{FORM_ENDPOINT}}', // e.g. https://formspree.io/f/xxxx
  ga4Id: '{{GA4_ID}}', // e.g. G-XXXXXXXXXX
  adPixelId: '', // leave empty unless an ad pixel is approved
  legalName: '{{LEGAL_NAME}}',
  registrationNumber: '{{COMPANY_REGISTRATION_NUMBER}}',
  linkedinUrl: '{{LINKEDIN_URL}}',
  sameAs: ['{{LINKEDIN_URL}}'] as string[],
  location: 'A remote team serving UK businesses, working UK business hours',
  hours: '9:00 to 17:30, Monday to Friday, UK time (GMT/BST)',
  hoursNote: '{{CONFIRM_HOURS}}',
  /** Default "last updated" date for pages that do not set their own. */
  defaultUpdated: '2026-11-24',
} as const;

/** True when a config value has been filled in (not a {{PLACEHOLDER}} or empty). */
export const isSet = (value: string | undefined | null): value is string =>
  !!value && !/\{\{.*\}\}/.test(value);

/** Return the value only when it is real, otherwise undefined (used in JSON-LD). */
export const real = (value: string | undefined | null) => (isSet(value) ? value : undefined);

export const whatsappLink = (message = 'Hello Works AI, I would like to ask about your services.') =>
  `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(message)}`;
