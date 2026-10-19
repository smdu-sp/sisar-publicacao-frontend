/** @format */

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '_prisma/sgu/client';

const globalForPrisma = globalThis as unknown as { prismaSgu?: PrismaClient };

const adapter = new PrismaMariaDb(process.env.SGU_DATABASE_URL as string);

export const prismaSgu = globalForPrisma.prismaSgu ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaSgu = prismaSgu;
