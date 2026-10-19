/** @format */

import { DomainError } from './errors';

export interface IResposta<T> {
	ok: boolean;
	error: string | null;
	data: T | null;
	status: number;
}

export async function paraResposta<T>(fn: () => Promise<T>, successStatus: number = 200): Promise<IResposta<T>> {
	try {
		const data = await fn();
		return { ok: true, error: null, data, status: successStatus };
	} catch (error) {
		if (error instanceof DomainError) return { ok: false, error: error.message, data: null, status: error.status };
		return { ok: false, error: 'Erro inesperado: ' + error, data: null, status: 500 };
	}
}
