/** Progressive enhancement for lead forms: validation, honeypot, async submit, success/error states. */
const isPlaceholder = (v: string) => !v || /\{\{.*\}\}/.test(v) || v.includes('%7B%7B');

export function initLeadForms() {
  document.querySelectorAll<HTMLElement>('[data-lead-form]').forEach((root) => {
    if (root.dataset.ready) return;
    root.dataset.ready = '1';
    const form = root.querySelector('form')!;
    const success = root.querySelector<HTMLElement>('[data-success]')!;
    const errorBox = root.querySelector<HTMLElement>('[data-form-error]')!;
    const submit = root.querySelector<HTMLButtonElement>('[data-submit]')!;
    const noSite = root.querySelector<HTMLInputElement>('[data-no-website]');
    const url = form.querySelector<HTMLInputElement>('input[name="website"]');
    const promise = root.querySelector<HTMLElement>('[data-promise]');
    const successText = root.querySelector<HTMLElement>('[data-success-text]');
    const pageField = form.querySelector<HTMLInputElement>('[data-page-field]');
    if (pageField) pageField.value = location.pathname;

    noSite?.addEventListener('change', () => {
      if (!url) return;
      url.disabled = noSite.checked;
      url.required = !noSite.checked;
      url.closest('fieldset')?.querySelector('[data-error]')?.classList.add('hidden');
      url.removeAttribute('aria-invalid');
      if (promise)
        promise.textContent = noSite.checked
          ? 'We will email you a free homepage mock-up idea within 2 working days.'
          : 'We will email you a short report within 2 working days.';
      if (successText)
        successText.textContent = noSite.checked
          ? 'We will sketch a free homepage mock-up idea for your business and email it to you within 2 working days.'
          : 'We will look at your website ourselves and email you a short report within 2 working days.';
    });

    const validate = () => {
      let firstBad: HTMLElement | null = null;
      form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input[required], textarea[required]').forEach((el) => {
        const ok = el.disabled || el.checkValidity();
        const msg = document.getElementById(el.getAttribute('aria-describedby') ?? '');
        el.toggleAttribute('aria-invalid', !ok);
        if (!ok) el.setAttribute('aria-invalid', 'true');
        msg?.classList.toggle('hidden', ok);
        if (!ok && !firstBad) firstBad = el;
      });
      (firstBad as HTMLElement | null)?.focus();
      return !firstBad;
    };

    form.addEventListener('input', (e) => {
      const el = e.target as HTMLInputElement;
      if (el.getAttribute('aria-invalid') && el.checkValidity()) {
        el.removeAttribute('aria-invalid');
        document.getElementById(el.getAttribute('aria-describedby') ?? '')?.classList.add('hidden');
      }
    });

    // ----- Send from the visitor's own email app or WhatsApp, pre-filled with the form -----
    const status = root.querySelector<HTMLElement>('[data-send-status]');
    const SKIP = new Set(['form', 'page', 'company_website', 'marketing_opt_in']);
    const LABELS: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      phone: 'Phone / WhatsApp',
      business: 'Business',
      business_type: 'Business type',
      service: 'Service',
      budget: 'Budget (one-time)',
      website: 'Website',
      no_website: 'Website',
      preferred_time: 'Preferred call time (UK)',
    };
    const ORDER = Object.keys(LABELS);
    const labelFor = (el: Element) => {
      const known = LABELS[(el as HTMLInputElement).name];
      if (known) return known;
      const lab = el.id ? form.querySelector(`label[for="${el.id}"]`) : null;
      const text = (lab?.textContent ?? (el as HTMLInputElement).name).replace(/\(.*?\)/g, '').replace(/\s+/g, ' ').trim();
      return text || (el as HTMLInputElement).name;
    };
    const collect = () => {
      const rows: [string, string, string][] = [];
      let message = '';
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea').forEach((el) => {
        if (!el.name || SKIP.has(el.name) || el.disabled) return;
        if ((el.type === 'radio' || el.type === 'checkbox') && !(el as HTMLInputElement).checked) return;
        let v = el.value.trim();
        if (el.name === 'no_website') v = 'No website yet';
        if (!v) return;
        if (el.name === 'message') message = v;
        else rows.push([el.name, labelFor(el), v]);
      });
      const rank = (n: string) => (ORDER.includes(n) ? ORDER.indexOf(n) : ORDER.length);
      rows.sort((x, y) => rank(x[0]) - rank(y[0]));
      return { rows: rows.map(([, k, v]) => [k, v] as [string, string]), message };
    };
    const compose = (rich: boolean) => {
      const { rows, message } = collect();
      const b = (t: string) => (rich ? `*${t}*` : t);
      const lines = [root.dataset.greeting ?? 'Hello Works AI,', '', ...rows.map(([k, v]) => `${b(k + ':')} ${v}`)];
      if (message) lines.push('', b('Message:'), message);
      lines.push('', `Sent from ${location.host}${location.pathname}`);
      return lines.join('\n');
    };
    root.querySelectorAll<HTMLButtonElement>('[data-send]').forEach((btn) => {
      btn.addEventListener('click', () => {
        errorBox.classList.add('hidden');
        if (!validate()) return;
        if (new FormData(form).get('company_website')) return; // bot
        const how = btn.dataset.send;
        if (how === 'email') {
          const name = (form.elements.namedItem('name') as HTMLInputElement | null)?.value.trim();
          const subject = `${root.dataset.subject ?? 'Enquiry'}${name ? ` – ${name}` : ''}`;
          location.href = `mailto:${root.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compose(false))}`;
        } else {
          window.open(`https://wa.me/${root.dataset.whatsapp}?text=${encodeURIComponent(compose(true))}`, '_blank', 'noopener');
        }
        if (status) {
          status.textContent =
            how === 'email'
              ? `Your email app should now be open with your request filled in. Press send there. Nothing opened? Email us at ${root.dataset.email}.`
              : 'WhatsApp should now be open with your request filled in. Press send there to reach us.';
          status.classList.remove('hidden');
        }
        window.waiTrack?.(root.dataset.eventName ?? 'contact_submit', { form: root.dataset.variant, method: how });
      });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorBox.classList.add('hidden');
      if (!validate()) return;
      const data = new FormData(form);
      if (data.get('company_website')) return; // bot
      const endpoint = form.getAttribute('action') ?? '';
      if (isPlaceholder(endpoint)) {
        root.querySelector<HTMLButtonElement>('[data-send="email"]')?.click();
        return;
      }
      submit.disabled = true;
      const original = submit.textContent;
      submit.textContent = 'Sending…';
      try {
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error(String(res.status));
        form.hidden = true;
        success.hidden = false;
        success.focus();
        window.waiTrack?.(root.dataset.eventName ?? 'contact_submit', { form: root.dataset.variant, no_website: !!noSite?.checked });
      } catch {
        errorBox.textContent = 'Sorry, something went wrong sending your request. Please try again, or email or WhatsApp us.';
        errorBox.classList.remove('hidden');
      } finally {
        submit.disabled = false;
        submit.textContent = original;
      }
    });
  });
}
