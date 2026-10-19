/** @format */

import { prismaMain } from '../prisma/main';
import { Coordenadoria } from '_prisma/main/client';
import { BadRequestError, InternalServerError } from '../errors';
import { verificaLimite, verificaPagina } from '../app-service';

export async function criar(createCoordenadoriaDto: { sigla?: string; nome: string; codigo: string; status?: boolean }) {
	return 'This action adds a new coordenadoria';
}

export async function listaCompleta(): Promise<{ value: string; label: string }[]> {
	const coordenadorias = await prismaMain.coordenadoria.findMany({
		orderBy: { sigla: 'asc' },
		select: { id: true, sigla: true, nome: true },
	});
	return coordenadorias.map((coordenadoria) => ({
		value: coordenadoria.id,
		label: `${coordenadoria.sigla} - ${coordenadoria.nome}`,
	}));
}

export async function buscarTudo(pagina: number = 1, limite: number = 10, busca?: string) {
	[pagina, limite] = verificaPagina(pagina, limite);
	const searchParams = {
		...(busca && { OR: [{ nome: { contains: busca } }, { sigla: { contains: busca } }] }),
	};
	const total = await prismaMain.coordenadoria.count({ where: searchParams });
	if (total === 0) return { total: 0, pagina: 0, limite: 0, data: [] };
	[pagina, limite] = verificaLimite(pagina, limite, total);
	const coordenadorias = await prismaMain.coordenadoria.findMany({
		where: searchParams,
		skip: (pagina - 1) * limite,
		take: limite,
	});
	return { total, pagina, limite, data: coordenadorias };
}

export async function buscarPorId(id: string): Promise<Coordenadoria> {
	if (!id || id === '') throw new BadRequestError('ID vazio.');
	const coordenadoria = await prismaMain.coordenadoria.findUnique({ where: { id } });
	if (!coordenadoria) throw new InternalServerError('Coordenadoria não encontrada.');
	return coordenadoria;
}

export async function buscarPorSigla(sigla: string): Promise<Coordenadoria | null> {
	if (!sigla || sigla === '') throw new BadRequestError('Sigla vazia.');
	return prismaMain.coordenadoria.findUnique({ where: { sigla } });
}

export async function buscarPorCodigo(codigo: string): Promise<Coordenadoria | null> {
	if (!codigo || codigo === '') throw new BadRequestError('Código vazio.');
	return prismaMain.coordenadoria.findUnique({ where: { codigo } });
}

export async function atualizar(
	id: string,
	updateCoordenadoriaDto: { sigla?: string; nome?: string; codigo?: string; status?: boolean },
): Promise<Coordenadoria> {
	await buscarPorId(id);
	const { sigla, codigo } = updateCoordenadoriaDto;
	if (sigla) {
		const coordSigla = await buscarPorSigla(sigla);
		if (coordSigla && coordSigla.id !== id) throw new BadRequestError('Sigla já cadastrada.');
	}
	if (codigo) {
		const coordCodigo = await buscarPorCodigo(codigo);
		if (coordCodigo && coordCodigo.id !== id) throw new BadRequestError('Código já cadastrado.');
	}
	const coordenadoria = await prismaMain.coordenadoria.update({ where: { id }, data: updateCoordenadoriaDto });
	return coordenadoria;
}

export async function desativar(id: string): Promise<{ desativado: boolean }> {
	await buscarPorId(id);
	await prismaMain.coordenadoria.update({ where: { id }, data: { status: false } });
	return { desativado: true };
}
