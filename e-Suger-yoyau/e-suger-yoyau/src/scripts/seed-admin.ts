import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const adminUsername = process.env.ADMIN_USERNAME || 'owner'
    const adminPassword = process.env.ADMIN_PASSWORD || 'password123'

    const existingAdmin = await prisma.admin.findUnique({
        where: { username: adminUsername }
    })

    if (existingAdmin) {
        console.log('Admin user already exists.')
        return
    }

    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    const admin = await prisma.admin.create({
        data: {
            username: adminUsername,
            passwordHash: hashedPassword
        }
    })

    console.log('Created initial admin user:', admin.username)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
