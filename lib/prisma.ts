import { PrismaClient } from "@prisma/client"

// Global type definition for the Prisma client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Initialize PrismaClient only if it doesn't exist already
// This prevents multiple instances during hot reloading in development
let prisma: PrismaClient

if (typeof window === "undefined") {
  if (process.env.NODE_ENV === "production") {
    prisma = new PrismaClient()
  } else {
    // Use cached client for development to prevent too many connections
    if (!globalForPrisma.prisma) {
      globalForPrisma.prisma = new PrismaClient()
    }
    prisma = globalForPrisma.prisma
  }
}

// Export the prisma instance
export { prisma }

