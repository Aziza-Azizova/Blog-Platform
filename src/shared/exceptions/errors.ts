export class NotFoundError extends Error {
    public status: number;

    constructor(message: string) {
        super(message);
        this.status = 404;
        this.name = 'NotFoundError';
    }
}


export class UnauthorizedError extends Error {
    public status: number;

    constructor(message: string) {
        super(message);
        this.status = 401;
        this.name = 'Unauthorized';
    }
}


export class ConflictError extends Error {
    public status: number;
    constructor(message: string) {
        super(message);
        this.status = 409;
        this.name = 'ConflictError';
    }
}


export class ForbiddenError extends Error {
    public status: number;
    constructor(message: string) {
        super(message);
        this.status = 403;
        this.name = 'ForbiddenError';
    }
}