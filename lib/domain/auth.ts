/** @format */

import { prismaMain } from '../prisma/main';
import { UnauthorizedError } from '../errors';
import { autenticar } from '../smul-auth';
import type { Usuario } from '_prisma/main/client';

export async function validateUser(login: string, senha: string): Promise<Usuario> {
	const usuario = await prismaMain.usuario.findUnique({ where: { login } });
	if (!usuario) throw new UnauthorizedError('Credenciais incorretas.');
	if (usuario.status === false) throw new UnauthorizedError('Usuário desativado.');
	if (process.env.ENVIRONMENT === 'local') return usuario;

	await autenticar(login, senha);
	return usuario;
}

export async function atualizarUltimoLogin(id: string): Promise<void> {
	await prismaMain.usuario.update({ where: { id }, data: { ultimoLogin: new Date() } });
}
