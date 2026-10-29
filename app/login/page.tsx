import type { Metadata } from 'next';
import { getPublicConfig } from '@/lib/server-api';
import LoginForm from '@/components/LoginForm';
import './login.css';

export const metadata: Metadata = { title: 'Sign in' };
export const dynamic = 'force-dynamic';

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function LoginPage({ searchParams }: { searchParams: Search }) {
  const sp = await searchParams;
  const one = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) as string | undefined;
  const config = await getPublicConfig();

  return (
    <div className="login">
      <LoginForm
        allowedDomains={config?.allowedDomains ?? []}
        idleTimeoutMinutes={config?.idleTimeoutMinutes ?? 1440}
        backendDown={!config}
        error={one('error')}
        signedOut={one('signed_out') === '1'}
        next={one('next')}
        logoUrl={process.env.NEXT_PUBLIC_LOGO_URL || ''}
        passwordResetUrl={process.env.NEXT_PUBLIC_PASSWORD_RESET_URL || 'https://passwordreset.microsoftonline.com/'}
        helpdeskUrl={process.env.NEXT_PUBLIC_HELPDESK_URL || ''}
      />
    </div>
  );
}
