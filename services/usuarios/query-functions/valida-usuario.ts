/** @format */

'use server';

import { auth } from '@/lib/auth/auth';
import { IRespostaUsuario } from '@/types/usuario';
import { redirect } from 'next/navigation';
import { paraResposta } from '@/lib/resposta';
import * as usuariosDomain from '@/lib/domain/usuarios';

export async function validaUsuario(): Promise<IRespostaUsuario> {
	const session = await auth();
	if (!session) redirect('/login');

	return paraResposta(() => usuariosDomain.validaUsuario(session.usuario.sub));
}
