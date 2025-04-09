import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
//   const { pathname } = request.nextUrl;

//   // Public paths that don't require authentication
//   const publicPaths = ['/login', '/register'];
//   const isPublicPath = publicPaths.includes(pathname);

//   // If user is not on register page and not authenticated, redirect to register
//   if (!isPublicPath) {
//     return NextResponse.redirect(new URL('/login', request.url));
//   }

//   return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 