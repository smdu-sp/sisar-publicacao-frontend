import 'dotenv/config';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
	schema: 'prisma/sgu/schema.prisma',
	datasource: {
		url: env('SGU_DATABASE_URL'),
	},
});
