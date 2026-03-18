import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.JWT_SECRET_KEY || 'default_secret_for_local_dev_only'
const key = new TextEncoder().encode(secretKey)

export type SessionPayload = {
    adminId: string
    username: string
    expires: Date
}

export async function encrypt(payload: SessionPayload) {
    return await new SignJWT(payload as any)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key)
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        })
        return payload as unknown as SessionPayload
    } catch {
        return null
    }
}
