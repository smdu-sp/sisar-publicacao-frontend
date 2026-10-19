/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { IRespostaUsuario, IUpdateUsuario } from '@/types/usuario';
import { requirePermissao } from '@/lib/auth/permissoes';
import { paraResposta } from '@/lib/resposta';
import * as usuariosDomain from '@/lib/domain/usuarios';

export async function atualizar(id: string, data: IUpdateUsuario): Promise<IRespostaUsuario> {
	const session = await auth();
	if (!session) redirect('/login');

	return paraResposta(async () => {
		await requirePermissao(session, ['ADM', 'TEC', 'USR']);
		return usuariosDomain.atualizar(session.usuario.sub, id, data);
	});
}
