'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import * as bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { encrypt } from '@/lib/auth'

export async function login(formData: FormData) {
    const username = formData.get('username') as string
    const password = formData.get('password') as string

    if (!username || !password) {
        return { error: 'ユーザー名とパスワードを入力してください' }
    }

    // Find admin user
    const admin = await prisma.admin.findUnique({
        where: { username }
    })

    if (!admin) {
        return { error: 'ユーザー名またはパスワードが間違っています' }
    }

    // Check password
    const isValid = await bcrypt.compare(password, admin.passwordHash)

    if (!isValid) {
        return { error: 'ユーザー名またはパスワードが間違っています' }
    }

    // Create JWT session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    const session = await encrypt({ adminId: admin.id, username: admin.username, expires })

        // Save in HttpOnly cookie
        ; (await cookies()).set('session', session, {
            expires,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        })

    redirect('/admin')
}

export async function logout() {
    ; (await cookies()).delete('session')
    redirect('/admin/login')
}
