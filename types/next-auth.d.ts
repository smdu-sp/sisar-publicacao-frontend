/** @format */

import NextAuth from 'next-auth';

declare module 'next-auth' {
	interface Session {
		usuario: {
			sub: string;
			nome: string;
			nomeSocial?: string;
			login: string;
			email: string;
			permissao: string;
			status: boolean;
			avatar?: string;
		};
	}
}
