/** @format */

'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { ICreatePublicacao, IRespostaPublicacao } from '@/types/publicacao';
import { paraResposta } from '@/lib/resposta';
import * as publicacoesDomain from '@/lib/domain/publicacoes';

export async function criar(data: ICreatePublicacao): Promise<IRespostaPublicacao> {
	const session = await auth();
	if (!session) redirect('/login');

	return paraResposta(() => publicacoesDomain.criar(data), 201);
}
