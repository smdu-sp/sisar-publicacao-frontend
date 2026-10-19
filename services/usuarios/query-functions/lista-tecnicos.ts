/** @format */

'use server';

import { IRespostaUsuario } from '@/types/usuario';
import { requireSession } from '@/lib/auth/permissoes';
import { paraResposta } from '@/lib/resposta';
import * as usuariosDomain from '@/lib/domain/usuarios';

export async function listaTecnicos(): Promise<IRespostaUsuario> {
	return paraResposta(async () => {
		await requireSession();
		return usuariosDomain.listaTecnicos();
	});
}
