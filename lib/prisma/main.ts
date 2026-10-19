/** @format */

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '_prisma/main/client';

const globalForPrisma = globalThis as unknown as { prismaMain?: PrismaClient };

const adapter = new PrismaMariaDb(process.env.MAIN_DATABASE_URL as string);

export const prismaMain = globalForPrisma.prismaMain ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prismaMain = prismaMain;
