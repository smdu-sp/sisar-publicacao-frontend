/** @format */

import { PrismaClient } from '_prisma/sgu/client';

const globalForPrisma = globalThis as unknown as { prismaSgu?: PrismaClient };

export const prismaSgu = globalForPrisma.prismaSgu ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaSgu = prismaSgu;
