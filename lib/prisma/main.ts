/** @format */

import { PrismaClient } from '_prisma/main/client';

const globalForPrisma = globalThis as unknown as { prismaMain?: PrismaClient };

export const prismaMain = globalForPrisma.prismaMain ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaMain = prismaMain;
