import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from '@/lib/auth'

const protectedRoutes = ['/admin']
const publicRoutes = ['/admin/login']

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route) && !publicRoutes.includes(path))
    const isPublicRoute = publicRoutes.includes(path)

    const cookie = req.cookies.get('session')?.value
    const session = cookie ? await decrypt(cookie).catch(() => null) : null

    if (isProtectedRoute && !session?.adminId) {
        return NextResponse.redirect(new URL('/admin/login', req.nextUrl))
    }

    if (isPublicRoute && session?.adminId) {
        return NextResponse.redirect(new URL('/admin', req.nextUrl))
    }

    return NextResponse.next()
}

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}
