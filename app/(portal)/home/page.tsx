import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getCurrentUser } from '@/lib/server-api';
import FizzWelcome from '@/components/FizzWelcome';
import { languageName } from '@/lib/languages';
import { humanDuration } from '@/lib/duration';

export const metadata: Metadata = { title: 'Home' };
export const dynamic = 'force-dynamic';

/** Placeholder home: confirms sign-in and shows what was saved. The portal UI is the next build step. */
export default async function HomePage() {
  const me = await getCurrentUser();
  if (!me.ok) return null; // layout already redirects
  const u = me.user;
  const rows: [string, string | null][] = [
    ['Name', u.name],
    ['Username', u.username],
    ['Email', u.email],
    ['Phone', u.phone],
    ['Language', languageName(u.language)],
    ['City', u.city],
    ['Department', u.department],
    ['Job title', u.jobTitle],
    ['Role', u.role.replace('_', ' ')],
    ['Login key (Entra object ID)', u.loginKey],
  ];

  return (
    <main className="pt-main">
      <Suspense><FizzWelcome firstName={u.name.split(' ')[0]} /></Suspense>
      <h1>Hello, {u.name.split(' ')[0]}</h1>
      <section className="pt-card" aria-labelledby="profile-h">
        <h2 id="profile-h">Your eKO profile</h2>
        <dl className="pt-dl">
          {rows.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v || '—'}</dd></div>
          ))}
        </dl>
      </section>
      <p className="pt-muted">
        For your security, eKO signs you out after {humanDuration(me.session.idleTimeoutMinutes)} without activity.
      </p>
    </main>
  );
}
