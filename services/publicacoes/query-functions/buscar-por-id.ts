/** @format */

'use server';

import { IRespostaPublicacao } from '@/types/publicacao';
import { requireSession } from '@/lib/auth/permissoes';
import { paraResposta } from '@/lib/resposta';
import * as publicacoesDomain from '@/lib/domain/publicacoes';

export async function buscarPorId(id: string): Promise<IRespostaPublicacao> {
	return paraResposta(async () => {
		await requireSession();
		return publicacoesDomain.buscarPorId(id);
	});
}
