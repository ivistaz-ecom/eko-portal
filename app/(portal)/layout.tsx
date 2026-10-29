import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/server-api';
import SessionWatcher from '@/components/SessionWatcher';
import SignOutButton from '@/components/SignOutButton';

export const dynamic = 'force-dynamic';

/** Every page inside (portal) requires a valid, non-idle session. */
export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const me = await getCurrentUser();
  if (!me.ok) redirect(`/login?error=${me.code}`);
  if (!me.user.language) redirect('/welcome');

  const u = me.user;
  const initials = u.name.split(/\s+/).map((s) => s[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="pt">
      <SessionWatcher />
      <div className="pt-bar" />
      <header className="pt-hdr">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={process.env.NEXT_PUBLIC_LOGO_URL || ''} alt="HCCB" />
        <div className="who">
          {u.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="pt-av" src={u.photoUrl} alt="" />
          ) : (
            <span className="pt-av" aria-hidden="true">{initials}</span>
          )}
          <span>{u.name}</span>
          <SignOutButton />
        </div>
      </header>
      {children}
    </div>
  );
}
