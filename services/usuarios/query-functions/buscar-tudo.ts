/** @format */

'use server';

import { IRespostaUsuario } from '@/types/usuario';
import { requireSession, requirePermissao } from '@/lib/auth/permissoes';
import { paraResposta } from '@/lib/resposta';
import * as usuariosDomain from '@/lib/domain/usuarios';

export async function buscarTudo(
	pagina: number = 1,
	limite: number = 10,
	busca: string = '',
	status: string = '',
	permissao: string = '',
): Promise<IRespostaUsuario> {
	return paraResposta(async () => {
		const session = await requireSession();
		await requirePermissao(session, ['ADM']);
		return usuariosDomain.buscarTudo(pagina, limite, busca, status, permissao);
	});
}
