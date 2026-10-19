import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
	schema: 'prisma/main/schema.prisma',
	migrations: {
		path: 'prisma/main/migrations',
		seed: 'ts-node prisma/main/seed.ts',
	},
	datasource: {
		url: env('MAIN_DATABASE_URL'),
	},
});
