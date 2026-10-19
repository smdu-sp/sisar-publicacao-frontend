/** @format */

'use server';

import { IRespostaUsuario } from '@/types/usuario';
import { requireSession } from '@/lib/auth/permissoes';
import { paraResposta } from '@/lib/resposta';
import * as usuariosDomain from '@/lib/domain/usuarios';

export async function buscarMeuUsuario(): Promise<IRespostaUsuario> {
	return paraResposta(async () => {
		const session = await requireSession();
		return usuariosDomain.buscarPorId(session.usuario.sub);
	});
}
