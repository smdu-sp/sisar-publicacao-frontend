/** @format */

import { prismaMain } from '../prisma/main';
import { prismaSgu } from '../prisma/sgu';
import { $Enums, Permissao, Usuario } from '_prisma/main/client';
import { ForbiddenError, NotFoundError } from '../errors';
import { verificaLimite, verificaPagina } from '../app-service';
import { buscarPorLogin as smulBuscarPorLogin } from '../smul-auth';

export function validaPermissaoCriador(
	permissao: $Enums.Permissao,
	permissaoCriador: $Enums.Permissao,
): $Enums.Permissao {
	if (permissao === $Enums.Permissao.DEV && permissaoCriador === $Enums.Permissao.ADM)
		permissao = $Enums.Permissao.ADM;
	return permissao;
}

export async function listaCompleta(): Promise<Usuario[]> {
	const lista = await prismaMain.usuario.findMany({ orderBy: { nome: 'asc' } });
	if (!lista || lista.length === 0) throw new ForbiddenError('Nenhum usuário encontrado.');
	return lista;
}

export async function listaTecnicos(): Promise<{ value: string; label: string }[]> {
	const funcionarios = await prismaSgu.tblUsuarios.findMany({
		orderBy: { cpNome: 'asc' },
		select: { cpRF: true, cpNome: true },
	});
	const tecnicos = funcionarios.map((funcionario) => ({
		value: funcionario.cpRF as string,
		label: funcionario.cpNome as string,
	}));
	if (tecnicos.length === 0) throw new NotFoundError('Nenhum usuário encontrado.');
	return tecnicos;
}

export async function buscarTecnicos(): Promise<{ id: string; nome: string }[]> {
	const lista = await prismaMain.usuario.findMany({
		where: { permissao: 'TEC' },
		orderBy: { nome: 'asc' },
		select: { id: true, nome: true },
	});
	if (!lista || lista.length === 0) throw new ForbiddenError('Nenhum técnico encontrado.');
	return lista;
}

export async function criar(
	createUsuarioDto: {
		nome: string;
		email: string;
		login: string;
		avatar?: string;
		permissao?: string;
		status?: boolean;
		nomeSocial?: string;
	},
	usuarioLogado: Usuario,
): Promise<Usuario> {
	const loguser = await buscarPorLogin(createUsuarioDto.login);
	if (loguser) throw new ForbiddenError('Login já cadastrado.');
	const emailuser = await buscarPorEmail(createUsuarioDto.email);
	if (emailuser) throw new ForbiddenError('Email já cadastrado.');
	const permissao = validaPermissaoCriador(createUsuarioDto.permissao as Permissao, usuarioLogado.permissao);
	const usuario = await prismaMain.usuario.create({ data: { ...createUsuarioDto, permissao } });
	return usuario;
}

export async function buscarTudo(
	pagina: number = 1,
	limite: number = 10,
	busca?: string,
	status?: string,
	permissao?: string,
) {
	[pagina, limite] = verificaPagina(pagina, limite);
	const searchParams = {
		...(busca && {
			OR: [
				{ nome: { contains: busca } },
				{ nomeSocial: { contains: busca } },
				{ login: { contains: busca } },
				{ email: { contains: busca } },
			],
		}),
		...(status && status !== '' && { status: status === 'ATIVO' ? true : status === 'INATIVO' ? false : undefined }),
		...(permissao && permissao !== '' && { permissao: Permissao[permissao as keyof typeof Permissao] }),
	};
	const total = await prismaMain.usuario.count({ where: searchParams });
	if (total === 0) return { total: 0, pagina: 0, limite: 0, data: [] };
	[pagina, limite] = verificaLimite(pagina, limite, total);
	const usuarios = await prismaMain.usuario.findMany({
		where: searchParams,
		orderBy: { nome: 'asc' },
		skip: (pagina - 1) * limite,
		take: limite,
	});
	return { total, pagina, limite, data: usuarios };
}

export async function buscarPorId(id: string): Promise<Usuario | null> {
	return prismaMain.usuario.findUnique({ where: { id } });
}

export async function buscarPorEmail(email: string): Promise<Usuario | null> {
	return prismaMain.usuario.findUnique({ where: { email } });
}

export async function buscarPorLogin(login: string): Promise<Usuario | null> {
	return prismaMain.usuario.findUnique({ where: { login } });
}

export async function atualizar(
	usuarioLogadoId: string,
	id: string,
	updateUsuarioDto: {
		login?: string;
		nome?: string;
		email?: string;
		avatar?: string;
		permissao?: string;
		status?: boolean;
		nomeSocial?: string;
	},
): Promise<Usuario> {
	const usuarioLogado = await buscarPorId(usuarioLogadoId);
	if (updateUsuarioDto.login) {
		const usuarioComLogin = await buscarPorLogin(updateUsuarioDto.login);
		if (usuarioComLogin && usuarioComLogin.id !== id) throw new ForbiddenError('Login já cadastrado.');
	}
	const usuarioAntes = await prismaMain.usuario.findUnique({ where: { id } });
	if (!usuarioAntes) throw new NotFoundError('Usuário não encontrado.');
	if (['TEC', 'USR'].includes(usuarioAntes.permissao) && id !== usuarioLogadoId)
		throw new ForbiddenError('Operação não autorizada para este usuário.');
	const permissao =
		updateUsuarioDto.permissao && updateUsuarioDto.permissao !== ''
			? validaPermissaoCriador(updateUsuarioDto.permissao as Permissao, usuarioLogado!.permissao)
			: usuarioAntes.permissao;
	return prismaMain.usuario.update({ data: { ...updateUsuarioDto, permissao }, where: { id } });
}

export async function excluir(id: string): Promise<{ desativado: boolean }> {
	await prismaMain.usuario.update({ data: { status: false }, where: { id } });
	return { desativado: true };
}

export async function autorizaUsuario(id: string): Promise<{ autorizado: boolean }> {
	const autorizado = await prismaMain.usuario.update({ where: { id }, data: { status: true } });
	if (autorizado && autorizado.status === true) return { autorizado: true };
	throw new ForbiddenError('Erro ao autorizar o usuário.');
}

export async function validaUsuario(id: string): Promise<Usuario> {
	const usuario = await prismaMain.usuario.findUnique({ where: { id } });
	if (!usuario) throw new ForbiddenError('Usuário não encontrado.');
	if (usuario.status !== true) throw new ForbiddenError('Usuário inativo.');
	return usuario;
}

export async function buscarNovo(login: string): Promise<{ login: string; nome: string; email: string } | Usuario> {
	const usuarioExiste = await buscarPorLogin(login);
	if (usuarioExiste && usuarioExiste.status === true) throw new ForbiddenError('Login já cadastrado.');
	if (usuarioExiste && usuarioExiste.status !== true) {
		return prismaMain.usuario.update({ where: { id: usuarioExiste.id }, data: { status: true } });
	}
	const { nome, email } = await smulBuscarPorLogin(login);
	if (!nome || !email) throw new NotFoundError('Usuário não encontrado.');
	return { login, nome, email };
}
