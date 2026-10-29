import { NextResponse, type NextRequest } from 'next/server';

const COOKIE = process.env.SESSION_COOKIE_NAME || 'eko_session';
const PUBLIC = ['/login'];

/**
 * Fast first gate: no session cookie -> go to /login (remembering where they were going).
 * The real check (idle timeout, revoked, disabled) is done by FastAPI on every request.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (PUBLIC.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return NextResponse.next();

  if (!req.cookies.get(COOKIE)?.value) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    if (pathname !== '/' && pathname !== '/home') url.searchParams.set('next', pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  // Skip API proxy, Next internals and static files.
  matcher: ['/((?!api/|_next/|images/|favicon.ico|robots.txt).*)'],
};
