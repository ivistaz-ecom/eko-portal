import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/server-api';
import LanguagePicker from '@/components/LanguagePicker';
import SessionWatcher from '@/components/SessionWatcher';
import '../login/login.css';

export const metadata: Metadata = { title: 'Choose your language' };
export const dynamic = 'force-dynamic';

/** First sign-in step: pick and store the preferred language. */
export default async function WelcomePage() {
  const me = await getCurrentUser();
  if (!me.ok) redirect(`/login?error=${me.code}`);
  if (me.user.language) redirect('/home');

  return (
    <div className="login">
      <SessionWatcher />
      <LanguagePicker firstName={me.user.name.split(' ')[0]} logoUrl={process.env.NEXT_PUBLIC_LOGO_URL || ''} />
    </div>
  );
}
