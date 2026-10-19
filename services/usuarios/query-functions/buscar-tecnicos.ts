/** @format */

'use server';

import { IRespostaUsuario } from '@/types/usuario';
import { requireSession, requirePermissao } from '@/lib/auth/permissoes';
import { paraResposta } from '@/lib/resposta';
import * as usuariosDomain from '@/lib/domain/usuarios';

export async function buscarTecnicos(): Promise<IRespostaUsuario> {
	return paraResposta(async () => {
		const session = await requireSession();
		await requirePermissao(session, ['ADM']);
		return usuariosDomain.buscarTecnicos();
	});
}
