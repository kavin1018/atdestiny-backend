export class BaseException extends Error {
    statusCode: number;
    isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational: boolean = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Object.setPrototypeOf(this, BaseException.prototype);
    }
}

export class NotFoundException extends BaseException {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}

export class BadRequestException extends BaseException {
    constructor(message = 'Bad request') {
        super(message, 400);
    }
}

export class UnauthorizedException extends BaseException {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}

export class ForbiddenException extends BaseException {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}

export class ConflictException extends BaseException {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}

export class ValidationException extends BaseException {
    errors: any[];

    constructor(message = 'Validation error', errors: any[] = []) {
        super(message, 422);
        this.errors = errors;
    }
}
