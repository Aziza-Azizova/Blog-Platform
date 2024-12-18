import { Request } from "express";
import { User, UserRole } from "./Auth.model";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "./Auth.type";
import { ConflictError, NotFoundError, UnauthorizedError } from "../../shared/exceptions/errors";

dotenv.config();
const jwtKey = process.env.JWT_SECRET_KEY;

export function generateAccessToken(id: unknown, roles: UserRole) {
    const payload = {
        id,
        roles,
    };

    return jwt.sign(payload, jwtKey, { expiresIn: "1h" });
}

export class AuthService {
    static async register(req: Request) {
        const { email, username, password } = req.body;

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            throw new ConflictError("Email already exists");
        }

        const newUser = new User({ email, username, password });
        await newUser.save();
        return newUser;
    }

    static async login(req: Request): Promise<{ user: IUser; token: string }> {
        const { email, password } = req.body;

        const registeredUser = await User.findOne({ email });
        if (!registeredUser) {
            throw new NotFoundError("User not found");
        }

        const isValidUserPassword = await registeredUser.isValidPassword(password);
        if (!isValidUserPassword) {
            throw new UnauthorizedError("Wrong password");
        }

        const token = generateAccessToken(registeredUser._id, registeredUser.roles);

        return { user: registeredUser, token };
    }
}
