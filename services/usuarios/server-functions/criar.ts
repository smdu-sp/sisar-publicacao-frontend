/** @format */

'use server';

import { redirect } from 'next/navigation';
import { ICreateUsuario, IRespostaUsuario } from '@/types/usuario';
import { auth } from '@/lib/auth/auth';
import { requirePermissao } from '@/lib/auth/permissoes';
import { paraResposta } from '@/lib/resposta';
import { UnauthorizedError } from '@/lib/errors';
import * as usuariosDomain from '@/lib/domain/usuarios';

export async function criar(data: ICreateUsuario): Promise<IRespostaUsuario> {
	const session = await auth();
	if (!session) redirect('/login');

	return paraResposta(async () => {
		await requirePermissao(session, ['ADM']);
		const usuarioLogado = await usuariosDomain.buscarPorId(session.usuario.sub);
		if (!usuarioLogado) throw new UnauthorizedError();
		return usuariosDomain.criar(data, usuarioLogado);
	}, 201);
}
