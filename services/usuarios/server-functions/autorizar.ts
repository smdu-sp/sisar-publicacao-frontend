/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { IRespostaUsuario } from '@/types/usuario';
import { redirect } from 'next/navigation';
import { requirePermissao } from '@/lib/auth/permissoes';
import { paraResposta } from '@/lib/resposta';
import * as usuariosDomain from '@/lib/domain/usuarios';

export async function autorizar(id: string): Promise<IRespostaUsuario> {
	const session = await auth();
	if (!session) redirect('/login');

	return paraResposta(async () => {
		await requirePermissao(session, ['ADM']);
		return usuariosDomain.autorizaUsuario(id);
	});
}
