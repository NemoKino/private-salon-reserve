import { NextResponse } from 'next/server';
import { login } from '@/lib/auth';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const validUser = process.env.BASIC_AUTH_USER;
        const validPass = process.env.BASIC_AUTH_PASSWORD;

        if (!validUser || !validPass) {
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        if (username === validUser && password === validPass) {
            // Create session
            await login(username);
            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
