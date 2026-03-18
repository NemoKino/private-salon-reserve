import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'

const prismaClientSingleton = () => {
  // Prisma v7 requires an adapter for direct SQLite connections.
  // We use the PrismaBetterSqlite3 adapter with a fallback URL
  // to ensure the client can be instantiated even if DATABASE_URL is missing 
  // (e.g., during some build phases).
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || 'file:./dev.db'
  })
  return new PrismaClient({ adapter })
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof prismaClientSingleton> | undefined
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
