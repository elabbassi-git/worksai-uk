/**
 * Optional hreflang alternates for equivalent pages on a sister site in another language.
 * Only add a row where a REAL equivalent page exists; the sites never copy each other's text.
 * Values left as {{SISTER_SITE_URLS}} are ignored until filled in.
 *
 * Every worksai.uk page always declares en-GB and x-default pointing to itself.
 */
export const hreflangAlternates: Record<string, Record<string, string>> = {
  '/': { fr: '{{SISTER_SITE_URLS}}', ar: '{{SISTER_SITE_URLS}}' },
};
