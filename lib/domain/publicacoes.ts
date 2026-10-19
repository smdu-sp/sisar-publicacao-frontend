/** @format */

import { prismaMain } from '../prisma/main';
import { prismaSgu } from '../prisma/sgu';
import { Colegiado, Publicacao, TecnicoPublicacao, Tipo_Documento } from '_prisma/main/client';
import { BadRequestError, InternalServerError } from '../errors';
import { verificaLimite, verificaPagina } from '../app-service';

export function formataProcesso(numero_processo: string): string {
	return numero_processo.replaceAll('.', '').replaceAll('-', '').replaceAll('/', '');
}

export async function cadastrarTecnico(rf: string): Promise<TecnicoPublicacao | null> {
	let tecnico = await prismaMain.tecnicoPublicacao.findUnique({ where: { rf } });
	if (tecnico) return tecnico;
	const funcionario = await prismaSgu.tblUsuarios.findFirst({ where: { cpRF: rf } });
	if (!funcionario) return null;
	tecnico = await prismaMain.tecnicoPublicacao.create({ data: { rf, nome: funcionario.cpNome as string } });
	return tecnico;
}

export async function criar(createPublicacaoDto: {
	numero_processo: string;
	tipo_documento: string;
	colegiado?: string;
	tecnico_rf: string;
	coordenadoria_id: string;
	data_emissao: Date;
	data_publicacao: Date;
	prazo?: number;
}): Promise<Publicacao> {
	const { tecnico_rf, coordenadoria_id, numero_processo } = createPublicacaoDto;
	if (!numero_processo || numero_processo === '') throw new BadRequestError('Processo não informado.');
	if (!tecnico_rf || tecnico_rf === '') throw new BadRequestError('Tecnico não informado.');
	if (!coordenadoria_id || coordenadoria_id === '') throw new BadRequestError('Coordenadoria não informado.');
	const tecnico = await cadastrarTecnico(tecnico_rf);
	if (!tecnico) throw new BadRequestError('Tecnico não cadastrado.');
	const coordenadoria = await prismaMain.coordenadoria.findUnique({ where: { id: coordenadoria_id } });
	if (!coordenadoria) throw new BadRequestError('Coordenadoria não encontrada.');
	const publicacao = await prismaMain.publicacao.create({
		data: { ...createPublicacaoDto, numero_processo: formataProcesso(numero_processo) } as never,
	});
	return publicacao;
}

export async function buscarTudo(
	pagina: number = 1,
	limite: number = 10,
	busca?: string,
	tipo_documento?: string,
	colegiado?: string,
) {
	[pagina, limite] = verificaPagina(pagina, limite);
	const searchParams = {
		...(busca && { OR: [{ numero_processo: { contains: busca } }] }),
		...(tipo_documento &&
			tipo_documento !== '' &&
			tipo_documento !== 'all' && { tipo_documento: Tipo_Documento[tipo_documento as keyof typeof Tipo_Documento] }),
		...(colegiado &&
			colegiado !== '' &&
			colegiado !== 'all' && { colegiado: Colegiado[colegiado as keyof typeof Colegiado] }),
	};
	const total = await prismaMain.publicacao.count({ where: searchParams });
	if (total === 0) return { total: 0, pagina: 0, limite: 0, data: [] };
	[pagina, limite] = verificaLimite(pagina, limite, total);
	const publicacoes = await prismaMain.publicacao.findMany({
		where: searchParams,
		include: { tecnico: true, coordenadoria: true },
		orderBy: { data_publicacao: 'desc' },
		skip: (pagina - 1) * limite,
		take: limite,
	});
	return { total, pagina, limite, data: publicacoes };
}

export async function buscarPorId(id: string): Promise<Publicacao> {
	if (!id || id === '') throw new BadRequestError('ID vazio.');
	const publicacao = await prismaMain.publicacao.findUnique({ where: { id } });
	if (!publicacao) throw new BadRequestError('Publicação não encontrada.');
	return publicacao;
}

export async function buscarPorProcesso(numero_processo: string): Promise<Publicacao> {
	if (!numero_processo || numero_processo === '') throw new BadRequestError('Processo vazio.');
	const publicacao = await prismaMain.publicacao.findFirst({
		where: { numero_processo: formataProcesso(numero_processo) },
	});
	if (!publicacao) throw new BadRequestError('Publicação não encontrada.');
	return publicacao;
}

export async function atualizar(
	id: string,
	updatePublicacaoDto: Partial<{
		numero_processo: string;
		tipo_documento: string;
		colegiado: string;
		tecnico_rf: string;
		coordenadoria_id: string;
		data_emissao: Date;
		data_publicacao: Date;
		prazo: number;
	}>,
): Promise<Publicacao> {
	await buscarPorId(id);
	const publicacao = await prismaMain.publicacao.update({ where: { id }, data: updatePublicacaoDto as never });
	if (!publicacao) throw new InternalServerError('Publicação não atualizada.');
	return publicacao;
}
