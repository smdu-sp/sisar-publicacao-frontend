/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import { IRespostaPublicacao, IUpdatePublicacao } from '@/types/publicacao';
import { paraResposta } from '@/lib/resposta';
import * as publicacoesDomain from '@/lib/domain/publicacoes';

export async function atualizar(id: string, data: IUpdatePublicacao): Promise<IRespostaPublicacao> {
	const session = await auth();
	if (!session) redirect('/login');

	return paraResposta(() => publicacoesDomain.atualizar(id, data));
}
