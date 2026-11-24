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

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorBox.classList.add('hidden');
      if (!validate()) return;
      const data = new FormData(form);
      if (data.get('company_website')) return; // bot
      const endpoint = form.getAttribute('action') ?? '';
      if (isPlaceholder(endpoint)) {
        errorBox.textContent = 'This form is not connected yet. Please email or WhatsApp us instead.';
        errorBox.classList.remove('hidden');
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
