import { IUser } from "#/modules/user/User.type";

declare global {
    namespace Express {
        interface Request {
            user: any
        }
    }
}
