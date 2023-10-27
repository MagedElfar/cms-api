export const setError = (status: number, message: string | string[]): object => {
    return { status, message };
}

export class AppError extends Error {
    status: number;
    error: string | string[];
    type: string;
    constructor(message: string, status: number, error: string | string[]) {
        super(message);
        this.name = this.constructor.name;
        this.type = "Error";
        this.status = status;
        this.error = error
    }
}


export class BadRequestError extends AppError {
    constructor(error: string | string[] = "BadRequestError") {
        super("BadRequestError", 400, error)
    }
}

export class AuthorizationError extends AppError {
    constructor(error: string | string[] = "AuthorizationError") {
        super("AuthorizationError", 401, error)
    }
}

export class ForbiddenError extends AppError {
    constructor(error: string | string[] = "ForbiddenError") {
        super("ForbiddenError", 403, error)
    }
}

export class NotFoundError extends AppError {
    constructor(error: string | string[] = "NotFoundError") {
        super("NotFoundError", 404, error)
    }
}

export class InternalServerError extends AppError {
    constructor(error: string | string[] = "InternalServerError") {
        super("InternalServerError", 500, error)
    }
}