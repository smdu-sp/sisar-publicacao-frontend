/** @format */

'use server';

import { IRespostaCoordenadoria } from '@/types/coordenadorias';
import { requireSession } from '@/lib/auth/permissoes';
import { paraResposta } from '@/lib/resposta';
import * as coordenadoriasDomain from '@/lib/domain/coordenadorias';

export async function listaCompleta(): Promise<IRespostaCoordenadoria> {
	return paraResposta(async () => {
		await requireSession();
		return coordenadoriasDomain.listaCompleta();
	});
}
