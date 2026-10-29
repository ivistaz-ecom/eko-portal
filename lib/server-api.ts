import 'server-only';
import { cookies, headers } from 'next/headers';
import type { EkoUser, PublicConfig, SessionInfo } from './types';

const BACKEND = process.env.BACKEND_INTERNAL_URL || 'http://127.0.0.1:8000';

/** Server-side call to FastAPI, forwarding the browser's cookies. */
async function backend(path: string, init?: RequestInit) {
  const cookieHeader = (await cookies()).toString();
  const h = await headers();
  return fetch(`${BACKEND}${path}`, {
    ...init,
    cache: 'no-store',
    headers: {
      ...(init?.headers || {}),
      cookie: cookieHeader,
      'user-agent': h.get('user-agent') ?? '',
      'x-forwarded-for': h.get('x-forwarded-for') ?? '',
    },
  });
}

export type CurrentUser =
  | { ok: true; user: EkoUser; session: SessionInfo }
  | { ok: false; code: string };

export async function getCurrentUser(): Promise<CurrentUser> {
  try {
    const r = await backend('/api/auth/me');
    if (r.ok) return { ok: true, ...(await r.json()) };
    const body = await r.json().catch(() => ({}));
    return { ok: false, code: body?.detail?.code ?? 'not_signed_in' };
  } catch {
    return { ok: false, code: 'server' };
  }
}

export async function getPublicConfig(): Promise<PublicConfig | null> {
  try {
    const r = await backend('/api/auth/config');
    return r.ok ? await r.json() : null;
  } catch {
    return null;
  }
}
