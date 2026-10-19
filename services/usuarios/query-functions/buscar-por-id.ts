/** @format */

'use server';

import { IRespostaUsuario } from '@/types/usuario';
import { requireSession, requirePermissao } from '@/lib/auth/permissoes';
import { paraResposta } from '@/lib/resposta';
import { BadRequestError } from '@/lib/errors';
import * as usuariosDomain from '@/lib/domain/usuarios';

export async function buscarPorId(id: string): Promise<IRespostaUsuario> {
	return paraResposta(async () => {
		if (!id || id === '') throw new BadRequestError('Não foi possível buscar o usuário, ID vazio.');
		const session = await requireSession();
		await requirePermissao(session, ['ADM']);
		return usuariosDomain.buscarPorId(id);
	});
}
