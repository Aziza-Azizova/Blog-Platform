import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { BadRequestError, ConflictError, ForbiddenError, NotFoundError, UnauthorizedError } from './errors';

export function errorHandler(error: unknown, req: Request, res: Response, next: NextFunction) {
    const status = res.statusCode === 200 ? 500 : res.statusCode;

    if (error instanceof ZodError) {
        return res.status(status).json({ message: "Validation error", error: error.errors });

    } else if (error instanceof NotFoundError) {
        return res.status(error.status).json({ message: error.message });

    } else if (error instanceof UnauthorizedError) {
        return res.status(error.status).json({ message: error.message });

    } else if (error instanceof ConflictError) {
        return res.status(error.status).json({ message: error.message });

    } else if (error instanceof ForbiddenError) {
        return res.status(error.status).json({ message: error.message });

    } else if (error instanceof BadRequestError) {
        return res.status(error.status).json({ message: error.message });

    } else if (error instanceof Error) {
        return res.status(status).json({ message: error.message, error });

    }

    return res.status(500).json({ message: "Unexpected Error" });
}
