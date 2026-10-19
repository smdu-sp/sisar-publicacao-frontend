/** @format */

'use server';

import { INovoUsuario, IRespostaUsuario } from '@/types/usuario';
import { requireSession, requirePermissao } from '@/lib/auth/permissoes';
import { paraResposta } from '@/lib/resposta';
import { BadRequestError } from '@/lib/errors';
import * as usuariosDomain from '@/lib/domain/usuarios';

export async function buscarNovo(login: string): Promise<IRespostaUsuario> {
	return paraResposta(async () => {
		if (!login || login === '') throw new BadRequestError('Não foi possível buscar o usuário, login vazio.');
		const session = await requireSession();
		await requirePermissao(session, ['ADM']);
		return usuariosDomain.buscarNovo(login) as unknown as Promise<INovoUsuario>;
	});
}
