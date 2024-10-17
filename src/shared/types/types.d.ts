import { IUser } from "#/modules/auth/Auth.type";

declare global {
    namespace Express {
        interface Request {
            user: any
        }
    }
}
