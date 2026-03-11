// Prisma client singleton for Next.js
// Prevents multiple instances in development due to hot-reloading

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Only create Prisma client if DATABASE_URL is available
// During Vercel build, DATABASE_URL might not be set yet
export const prisma = globalForPrisma.prisma ?? 
  (process.env.DATABASE_URL 
    ? new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      })
    : null as any)

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
