import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

export function validate(schema: z.ZodObject<any, any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = req.body;
            const parsedValues = schema.parse(data);
            req.body = parsedValues;
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const errorMessages = error.errors.map(error => error.message);

                res.status(400).json({
                    message: "Bad Request",
                    errors: errorMessages,
                });
                return;
            }

            res.status(400).json({
                message: "Bad Request",
                error,
            });
            return;
        }
    };
}
