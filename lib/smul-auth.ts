/** @format */

import { NotFoundError, UnauthorizedError } from './errors';

const SMUL_AUTH_URL = process.env.SMUL_AUTH_URL;
const SECRETARIAS = 'SMUL';

export async function autenticar(login: string, senha: string): Promise<void> {
	const response = await fetch(`${SMUL_AUTH_URL}/auth/ldap/autenticar`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ login, senha }),
	});
	if (!response.ok) {
		const data = await response.json().catch(() => null);
		throw new UnauthorizedError(data?.message ?? 'Credenciais incorretas.');
	}
}

export async function buscarPorLogin(login: string): Promise<{ nome: string; email: string }> {
	const response = await fetch(
		`${SMUL_AUTH_URL}/auth/ldap/buscar-por-login/${encodeURIComponent(login)}?secretarias=${SECRETARIAS}`,
	);
	if (!response.ok) {
		const data = await response.json().catch(() => null);
		throw new NotFoundError(data?.message ?? 'Usuário não encontrado.');
	}
	const data = await response.json();
	// Formato de sucesso não documentado no swagger do serviço; ajustar os nomes de campo
	// abaixo caso o payload real use chaves diferentes (ex.: LDAP costuma usar name/mail).
	const nome: string | undefined = data?.nome ?? data?.name;
	const email: string | undefined = data?.email ?? data?.mail;
	if (!nome || !email) throw new NotFoundError('Usuário não encontrado.');
	return { nome: nome.toString(), email: email.toString().toLowerCase() };
}
