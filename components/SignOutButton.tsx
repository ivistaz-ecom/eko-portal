'use client';
import { useState } from 'react';

export default function SignOutButton() {
  const [busy, setBusy] = useState(false);
  async function signOut() {
    setBusy(true);
    const r = await fetch('/api/auth/logout', { method: 'POST' }).catch(() => null);
    const body = r ? await r.json().catch(() => ({})) : {};
    window.location.assign(body.redirect || '/login?signed_out=1');
  }
  return (
    <button className="pt-out" type="button" onClick={signOut} disabled={busy}>
      {busy ? 'Signing out…' : 'Sign out'}
    </button>
  );
}
