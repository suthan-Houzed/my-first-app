import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
  import { clerkMiddleware } from "@clerk/nextjs/server";

// Define public paths that don't require authentication
const publicPaths = ['/login', '/register'];

// Original middleware implementation
/*
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('auth-token')?.value;

  // Check if the path is public
  const isPublicPath = publicPaths.includes(pathname);
  // If user is not authenticated and trying to access protected route
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is authenticated and trying to access login/register
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}
*/

// Clerk middleware implementation
  export default clerkMiddleware({
  // Public routes that don't require authentication
  // publicRoutes: ["/", "/api/webhook"],
});

// Configure which paths the middleware should run on
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