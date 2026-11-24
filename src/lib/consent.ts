/**
 * Cookie consent (ICO-style: Accept, Reject and Settings with equal prominence)
 * and GA4 event tracking. GA4 loads only after analytics consent.
 */
type Consent = { analytics: boolean; marketing: boolean; ts: string; v: 1 };
const KEY = 'wai-consent';

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag?: (...args: unknown[]) => void;
    waiTrack: (event: string, params?: Record<string, unknown>) => void;
  }
}

const read = (): Consent | null => {
  try {
    const c = JSON.parse(localStorage.getItem(KEY) ?? 'null');
    return c && c.v === 1 ? c : null;
  } catch {
    return null;
  }
};

let gaLoaded = false;
function loadGA(id: string) {
  if (gaLoaded || !id) return;
  gaLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id, { anonymize_ip: true });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(s);
}

export function initConsent() {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  const gaId = banner.dataset.ga ?? '';
  const settings = banner.querySelector<HTMLFormElement>('#cookie-settings')!;
  const settingsBtn = banner.querySelector<HTMLButtonElement>('[data-consent="settings"]')!;

  window.waiTrack = (event, params = {}) => {
    if (window.gtag) window.gtag('event', event, { page_path: location.pathname, ...params });
  };

  const apply = (c: Consent | null) => {
    if (c?.analytics) loadGA(gaId);
  };
  const save = (analytics: boolean, marketing: boolean) => {
    const c: Consent = { analytics, marketing, ts: new Date().toISOString(), v: 1 };
    localStorage.setItem(KEY, JSON.stringify(c));
    banner.hidden = true;
    apply(c);
  };
  const open = () => {
    const c = read();
    (settings.elements.namedItem('analytics') as HTMLInputElement).checked = !!c?.analytics;
    (settings.elements.namedItem('marketing') as HTMLInputElement).checked = !!c?.marketing;
    banner.hidden = false;
  };

  const current = read();
  if (current) apply(current);
  else if (banner.dataset.required === '1') banner.hidden = false;

  banner.addEventListener('click', (e) => {
    const action = (e.target as HTMLElement).closest<HTMLButtonElement>('[data-consent]')?.dataset.consent;
    if (action === 'accept') save(true, banner.dataset.marketing === '1');
    if (action === 'reject') save(false, false);
    if (action === 'settings') {
      settings.hidden = !settings.hidden;
      settingsBtn.setAttribute('aria-expanded', String(!settings.hidden));
    }
  });
  settings.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = settings.elements;
    save((f.namedItem('analytics') as HTMLInputElement).checked, (f.namedItem('marketing') as HTMLInputElement).checked);
  });
  document.querySelectorAll('[data-cookie-settings]').forEach((b) => b.addEventListener('click', open));

  // GA4 events from links/buttons: data-event="audit_booking_click" etc.
  document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>('[data-event]');
    if (el?.dataset.event) window.waiTrack(el.dataset.event, el.dataset.eventLabel ? { label: el.dataset.eventLabel } : {});
  });
}
