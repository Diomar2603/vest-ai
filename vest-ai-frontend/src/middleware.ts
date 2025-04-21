import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function isTokenExpired(token: string): boolean {
  try {
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));

    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (err) {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const publicPaths = ['/', '/login', '/register'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  const isExpired = token ? isTokenExpired(token) : true;

  if ((!token || isExpired) && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (token && !isExpired && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register')) {
    return NextResponse.redirect(new URL('/chat', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
}
