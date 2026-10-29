'use client';
import { useRef, useState } from 'react';
import { FizzArt, buttonBubble, useFizz } from './FizzBubbles';
import { humanDuration } from '@/lib/duration';

type Props = {
  allowedDomains: string[];
  idleTimeoutMinutes: number;
  backendDown: boolean;
  error?: string;
  signedOut: boolean;
  next?: string;
  logoUrl: string;
  passwordResetUrl: string;
  helpdeskUrl: string;
};

function messageFor(code: string | undefined, domain: string, idle: number): string | null {
  switch (code) {
    case undefined: return null;
    case 'domain': return `Please sign in with your official ${domain ? `@${domain} ` : ''}email address.`;
    case 'cancelled': return 'Sign-in was cancelled on the Microsoft page. Try again when you’re ready.';
    case 'microsoft': return 'Microsoft couldn’t complete your sign-in (password or Authenticator check). Please try again.';
    case 'tenant': return 'This Microsoft account isn’t part of the company directory. Use your work account.';
    case 'expired_attempt': return 'That sign-in attempt took too long. Please try again.';
    case 'disabled':
    case 'account_disabled': return 'Your eKO access is turned off. Please contact the IT service desk.';
    case 'idle_timeout': return `You were signed out after ${humanDuration(idle)} without activity. Sign in again to continue.`;
    case 'session_expired': return 'Your session has ended. Please sign in again.';
    case 'server': return 'We can’t reach eKO right now. Please try again in a minute.';
    default: return 'Please sign in to continue.';
  }
}

const Alert = ({ ok, children }: { ok?: boolean; children: React.ReactNode }) => (
  <div className={`fz-alert${ok ? ' ok' : ''}`} role={ok ? 'status' : 'alert'}>
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" style={{ stroke: ok ? '#39B549' : '#e3000f', fill: 'none', strokeWidth: 2, strokeLinecap: 'round' }}>
      {ok ? <path d="M5 12.5l4.5 4.5L19 7.5" /> : <><circle cx="12" cy="12" r="9" /><path d="M12 7.5v5.5M12 16.5v.01" /></>}
    </svg>
    <span>{children}</span>
  </div>
);

export default function LoginForm(p: Props) {
  const domain = p.allowedDomains[0] ?? '';
  const [email, setEmail] = useState('');
  const [remember, setRemember] = useState(false);
  const [fieldErr, setFieldErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const btnRef = useFizz(16, buttonBubble);

  const banner = p.backendDown ? messageFor('server', domain, p.idleTimeoutMinutes) : messageFor(p.error, domain, p.idleTimeoutMinutes);

  function validate(v: string): string | null {
    const value = v.trim().toLowerCase();
    if (!value) return 'Enter your official email address.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'That doesn’t look like an email address.';
    const d = value.split('@')[1];
    if (p.allowedDomains.length && !p.allowedDomains.includes(d)) {
      return `Use your official ${p.allowedDomains.map((x) => '@' + x).join(' or ')} email address.`;
    }
    return null;
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const err = validate(email);
    setFieldErr(err);
    if (err) { emailRef.current?.focus(); return; }
    setBusy(true);
    const q = new URLSearchParams({ email: email.trim().toLowerCase(), remember: String(remember) });
    if (p.next) q.set('next', p.next);
    // Hand over to Microsoft: password + Microsoft Authenticator happen there.
    window.location.assign(`/api/auth/login?${q.toString()}`);
  }

  return (
    <main className="fz" aria-label="Sign in to eKO">
      <section className="fz-form">
        {p.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="fz-logo" src={p.logoUrl} alt="HCCB" onError={(e) => { (e.target as HTMLImageElement).style.visibility = 'hidden'; }} />
        ) : null}
        <h1>Welcome Back</h1>
        <p className="fz-sub">Sign in with your official Microsoft 365 account</p>

        {p.signedOut && !banner ? <Alert ok>You’ve signed out of eKO.</Alert> : null}
        {banner ? <Alert>{banner}</Alert> : null}

        <form onSubmit={onSubmit} noValidate>
          <div className="fz-field">
            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6" /></svg>
            <input
              ref={emailRef}
              type="email"
              inputMode="email"
              placeholder={domain ? `name@${domain}` : 'Email address'}
              aria-label="Official email address"
              autoComplete="username"
              autoFocus
              required
              value={email}
              aria-invalid={fieldErr ? 'true' : 'false'}
              aria-describedby={fieldErr ? 'email-err' : undefined}
              onChange={(e) => { setEmail(e.target.value); if (fieldErr) setFieldErr(null); }}
            />
          </div>
          {fieldErr ? <p className="fz-err" id="email-err">{fieldErr}</p> : null}

          <div className="fz-note">
            <svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="10" width="14" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /><circle cx="12" cy="15.5" r="1.2" /></svg>
            <span>Your password and Microsoft Authenticator check happen on Microsoft’s secure sign-in page.</span>
          </div>

          <button className="fz-btn" type="submit" disabled={busy || p.backendDown} ref={btnRef as React.RefObject<HTMLButtonElement>}>
            <div className="gloss" />
            <span>{busy ? 'Popping in…' : 'Pop In →'}</span>
          </button>

          <div className="fz-ms" aria-hidden="true">
            <span className="sq"><i style={{ background: '#F25022' }} /><i style={{ background: '#7FBA00' }} /><i style={{ background: '#00A4EF' }} /><i style={{ background: '#FFB900' }} /></span>
            Secured by Microsoft Entra ID
          </div>

          <div className="fz-row">
            <label><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label>
            <a href={p.passwordResetUrl} target="_blank" rel="noopener noreferrer">Forgot password?</a>
          </div>
        </form>

        <p className="fz-foot">
          New here?{' '}
          <button type="button" onClick={() => { setHint(true); emailRef.current?.focus(); }}>Uncap an account</button>
        </p>
        {hint ? (
          <p className="fz-hint" role="status">
            No sign-up needed. Sign in with your official {domain ? `@${domain} ` : ''}email and your eKO profile is created
            automatically. Can’t sign in?{' '}
            {p.helpdeskUrl ? <a href={p.helpdeskUrl}>Contact the IT service desk</a> : 'Contact the IT service desk.'}
          </p>
        ) : null}
      </section>
      <FizzArt />
    </main>
  );
}
