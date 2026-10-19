/** @format */

'use server';

import { IRespostaPublicacao } from '@/types/publicacao';
import { requireSession } from '@/lib/auth/permissoes';
import { paraResposta } from '@/lib/resposta';
import * as publicacoesDomain from '@/lib/domain/publicacoes';

export async function buscarTudo(
	pagina: number = 1,
	limite: number = 10,
	busca: string = '',
	tipo_documento: string = 'all',
	colegiado: string = 'all',
): Promise<IRespostaPublicacao> {
	return paraResposta(async () => {
		await requireSession();
		return publicacoesDomain.buscarTudo(pagina, limite, busca, tipo_documento, colegiado);
	});
}
