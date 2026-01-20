import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export const config = {
    // Protect only /admin routes
    matcher: ['/admin/:path*'],
};

export async function middleware(req: NextRequest) {
    const session = req.cookies.get('session')?.value;

    // Verify session
    const verifiedPayload = session ? await verifyToken(session) : null;

    if (!verifiedPayload) {
        // Redirect to login page if no valid session
        const loginUrl = new URL('/login', req.url);
        // Optional: Pass the original URL to redirect back after login
        // loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}
