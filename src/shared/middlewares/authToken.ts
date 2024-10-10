import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from "express";

export function authTokenMiddleware(req: Request, res: Response, next: NextFunction) {
    const jwtKey = process.env.JWT_SECRET_KEY;
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(403).json({ message: "User unauthorized" });
        }

        const userData = jwt.verify(token, jwtKey);
        req.user = userData;
        next();
    } catch (error) {
        return res.status(403).json({ message: "User unauthorized", error })
    }
}