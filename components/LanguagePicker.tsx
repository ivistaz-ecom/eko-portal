'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LANGUAGES } from '@/lib/languages';
import { FizzArt, buttonBubble, useFizz } from './FizzBubbles';

export default function LanguagePicker({ firstName, logoUrl }: { firstName: string; logoUrl: string }) {
  const router = useRouter();
  const [lang, setLang] = useState('en');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const btnRef = useFizz(16, buttonBubble);

  async function save() {
    setBusy(true);
    setErr(null);
    const r = await fetch('/api/users/me/language', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: lang }),
    });
    if (r.status === 401) { window.location.assign('/login?error=session_expired'); return; }
    if (!r.ok) { setBusy(false); setErr('We couldn’t save that. Please try again.'); return; }
    router.replace('/home?welcome=1');
  }

  function onKey(e: React.KeyboardEvent, i: number) {
    const n = LANGUAGES.length;
    const k = e.key;
    const to = k === 'ArrowRight' || k === 'ArrowDown' ? (i + 1) % n : k === 'ArrowLeft' || k === 'ArrowUp' ? (i - 1 + n) % n : -1;
    if (to < 0) return;
    e.preventDefault();
    setLang(LANGUAGES[to].id);
    (document.querySelector(`[data-lang="${LANGUAGES[to].id}"]`) as HTMLElement | null)?.focus();
  }

  return (
    <main className="fz" aria-label="Choose your language">
      <section className="fz-form">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {logoUrl ? <img className="fz-logo" src={logoUrl} alt="HCCB" /> : null}
        <h1>Hi {firstName}, welcome to eKO</h1>
        <p className="fz-sub">Choose your language. You can change it any time from the header.</p>

        <div className="lg-grid" role="radiogroup" aria-label="Language">
          {LANGUAGES.map((l, i) => (
            <button
              key={l.id}
              type="button"
              role="radio"
              data-lang={l.id}
              aria-checked={lang === l.id}
              tabIndex={lang === l.id ? 0 : -1}
              className="lg"
              onClick={() => setLang(l.id)}
              onKeyDown={(e) => onKey(e, i)}
            >
              <strong lang={l.id}>{l.name}</strong>
              <span>{l.live ? l.english : `${l.english}, coming soon`}</span>
            </button>
          ))}
        </div>
        {!LANGUAGES.find((l) => l.id === lang)?.live ? (
          <p className="fz-hint" role="status">We’ll save this choice and switch eKO over as soon as the translation is ready. Until then you’ll see English.</p>
        ) : null}
        {err ? <p className="fz-err" role="alert" style={{ marginTop: 10 }}>{err}</p> : null}

        <button className="fz-btn" type="button" onClick={save} disabled={busy} ref={btnRef as React.RefObject<HTMLButtonElement>} style={{ marginTop: 18 }}>
          <div className="gloss" />
          <span>{busy ? 'Saving…' : 'Continue →'}</span>
        </button>
      </section>
      <FizzArt />
    </main>
  );
}
