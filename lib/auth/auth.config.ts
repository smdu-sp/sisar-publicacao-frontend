/** @format */

import Credentials from 'next-auth/providers/credentials';
import type { NextAuthConfig } from 'next-auth';
import { validateUser, atualizarUltimoLogin } from '../domain/auth';

export default {
	providers: [
		Credentials({
			name: 'credentials',
			credentials: {
				login: { label: 'Login', type: 'text' },
				senha: { label: 'Senha', type: 'password' },
			},
			type: 'credentials',
			async authorize(credentials) {
				if (credentials?.login && credentials?.senha) {
					const { login, senha } = credentials as { login: string; senha: string };
					try {
						const usuario = await validateUser(login, senha);
						await atualizarUltimoLogin(usuario.id);
						return {
							sub: usuario.id,
							nome: usuario.nome,
							nomeSocial: usuario.nomeSocial ?? undefined,
							login: usuario.login,
							email: usuario.email,
							permissao: usuario.permissao,
							status: usuario.status,
							avatar: usuario.avatar ?? undefined,
						};
					} catch {
						return null;
					}
				}
				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user, trigger, session }) {
			if (trigger === 'update' && session?.usuario) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const tokenUser = token.user as any;
				tokenUser.avatar = session.usuario.avatar;
				tokenUser.permissao = session.usuario.permissao;
				tokenUser.nomeSocial = session.usuario.nomeSocial;
				return token;
			}
			if (user) token.user = user;
			return token;
		},
		async session({ session, token }) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			session.usuario = token.user as any;
			return session;
		},
	},
	pages: {
		signIn: '/login',
		error: '/login',
	},
} satisfies NextAuthConfig;
