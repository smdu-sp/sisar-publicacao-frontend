/** @format */

import { auth } from './auth';
import { prismaMain } from '../prisma/main';
import { ForbiddenError, UnauthorizedError } from '../errors';
import type { Session } from 'next-auth';

export async function requireSession(): Promise<Session> {
	const session = await auth();
	if (!session?.usuario) throw new UnauthorizedError();
	return session;
}

export async function requirePermissao(session: Session, permissoes: string[]): Promise<void> {
	const usuario = await prismaMain.usuario.findUnique({
		where: { id: session.usuario.sub },
		select: { permissao: true },
	});
	if (!usuario) throw new UnauthorizedError();
	if (usuario.permissao === 'DEV') return;
	if (!permissoes.some((permissao) => permissao === usuario.permissao))
		throw new ForbiddenError('Operação não autorizada.');
}
