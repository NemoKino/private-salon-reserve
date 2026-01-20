import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Use the Basic Auth password as the secret key for JWT signing
// In a real app, use a dedicated random string like JWT_SECRET
const SECRET_KEY = process.env.BASIC_AUTH_PASSWORD || 'default_secret_key_change_me';
const key = new TextEncoder().encode(SECRET_KEY);

export async function signToken(payload: any) {
    const token = await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h') // Session lasts 24 hours
        .sign(key);
    return token;
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, key);
        return payload;
    } catch (error) {
        return null;
    }
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    if (!session) return null;
    return await verifyToken(session);
}

export async function login(username: string) {
    // Verify credentials happen in the API route before calling this
    const token = await signToken({ username });
    const cookieStore = await cookies();

    // Set the cookie
    cookieStore.set('session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
    });
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('session');
}
