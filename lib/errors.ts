/** @format */

export class DomainError extends Error {
	status: number;
	constructor(message: string, status: number) {
		super(message);
		this.status = status;
	}
}

export class BadRequestError extends DomainError {
	constructor(message: string) {
		super(message, 400);
	}
}

export class UnauthorizedError extends DomainError {
	constructor(message: string = 'Não autenticado.') {
		super(message, 401);
	}
}

export class ForbiddenError extends DomainError {
	constructor(message: string) {
		super(message, 403);
	}
}

export class NotFoundError extends DomainError {
	constructor(message: string) {
		super(message, 404);
	}
}

export class InternalServerError extends DomainError {
	constructor(message: string) {
		super(message, 500);
	}
}
