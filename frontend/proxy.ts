import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS  = ['/login', '/register'];
const STUDENT_PATHS = ['/student'];
const TEACHER_PATHS = ['/teacher'];
const ADMIN_PATHS   = ['/admin'];

export function proxy(request: NextRequest) {
  return defaultProxy(request);
}

export default function defaultProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read persisted auth from cookie (we'll sync from localStorage on client)
  // For edge middleware, we use a cookie approach — client sets it on login
  const authCookie = request.cookies.get('cc_role')?.value;
  const isLoggedIn = !!request.cookies.get('cc_auth')?.value;

  // Redirect logged-in users away from auth pages
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p)) && isLoggedIn) {
    const role = authCookie;
    if (role === 'STUDENT') return NextResponse.redirect(new URL('/student/dashboard', request.url));
    if (role === 'TEACHER') return NextResponse.redirect(new URL('/teacher/dashboard', request.url));
    if (role === 'ADMIN')   return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Protect private routes
  if (STUDENT_PATHS.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', request.url));
    if (!pathname.startsWith('/student/feed') && authCookie !== 'STUDENT') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (TEACHER_PATHS.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', request.url));
    if (authCookie !== 'TEACHER') return NextResponse.redirect(new URL('/login', request.url));
  }

  if (ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', request.url));
    if (authCookie !== 'ADMIN') return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/student/:path*',
    '/teacher/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
