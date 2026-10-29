'use client';
import { useEffect, useRef } from 'react';

const CHECK_EVERY_MS = 5 * 60 * 1000;     // background "still signed in?" check (does NOT extend)
const ACTIVITY_PING_MS = 5 * 60 * 1000;   // at most one "user is active" ping per 5 minutes

/**
 * Keeps the browser in step with the server-side inactivity timeout.
 * - Real interaction (click/keys/scroll/touch) -> throttled POST /api/auth/activity.
 * - Periodic + on-focus GET /api/auth/session (no extension) -> if 401, go to login.
 */
export default function SessionWatcher() {
  const lastPing = useRef(Date.now());

  useEffect(() => {
    let stopped = false;
    const kickOut = (code = 'idle_timeout') => {
      if (stopped) return;
      stopped = true;
      window.location.assign(`/login?error=${encodeURIComponent(code)}`);
    };
    const handle = async (r: Response) => {
      if (r.status === 401) {
        const body = await r.json().catch(() => ({}));
        kickOut(body?.detail?.code ?? 'session_expired');
      }
    };

    const check = () => fetch('/api/auth/session', { cache: 'no-store' }).then(handle).catch(() => {});
    const onActivity = () => {
      if (Date.now() - lastPing.current < ACTIVITY_PING_MS) return;
      lastPing.current = Date.now();
      fetch('/api/auth/activity', { method: 'POST' }).then(handle).catch(() => {});
    };
    const onVisible = () => { if (document.visibilityState === 'visible') check(); };

    const timer = window.setInterval(check, CHECK_EVERY_MS);
    const evs = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const;
    evs.forEach((e) => window.addEventListener(e, onActivity, { passive: true }));
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', check);

    return () => {
      window.clearInterval(timer);
      evs.forEach((e) => window.removeEventListener(e, onActivity));
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', check);
    };
  }, []);

  return null;
}
