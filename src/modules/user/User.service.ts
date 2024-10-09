import { Request, Response } from "express";
import { User, UserRole } from "./User.model";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config();
const jwtKey = process.env.JWT_SECRET_KEY;

export function generateAccessToken(id: unknown, roles: UserRole) {
    const payload = {
        id,
        roles
    }

    return jwt.sign(payload, jwtKey, { expiresIn: "1h" });
}

export class UserService {
    static async register(req: Request, res: Response) {
        const { email, username, password } = req.body;
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            res.status(409).json({ message: 'Email already exists' });
            return;
        }
        const newUser = new User({ email, username, password });
        await newUser.save();
        res.status(201).json({
            message: "User successfully registered",
            user: newUser
        });
        return;
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;
        const registeredUser = await User.findOne({ email });
        if (!registeredUser) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        const isValidUserPassword = await registeredUser.isValidPassword(password);
        if (!isValidUserPassword) {
            res.status(401).json({ message: 'Wrong password' });
            return;
        }

        const token = generateAccessToken(registeredUser._id, registeredUser.roles)

        res.status(200).json({
            message: "User successfully logged in",
            user: registeredUser,
            token
        });
        return;
    }
}