import { Request } from "express";
import { User, UserRole } from "../auth/Auth.model";
import { ForbiddenError, NotFoundError } from "../../shared/exceptions/errors";
import { UserProfileDto } from "./dto/user-profile.dto";

export class UserService {
    static async showProfile(req: Request) {
        const userId = req.user?.id;
        const user = await User.findById(userId);

        if (!user) throw new NotFoundError("User does not exist");
        const userData = { username: user.username, email: user.email };

        return userData;
    }

    static async updateProfile(req: Request) {
        const userId = req.user?.id;
        const user = await User.findById(userId);

        if (!user) throw new NotFoundError("User does not exist");

        const { email, username, password }: UserProfileDto = req.body;

        user.email = email || user.email;
        user.username = username || user.username;
        user.password = password || user.password;
        await user.save();

        return user;
    }

    static async updateUserRole(req: Request) {
        const userId = req.user?.id;
        const user = await User.findById(userId);

        if (!user) throw new NotFoundError("User does not exist");
        if (user.roles !== UserRole.ADMIN) throw new ForbiddenError("Only admin can update user role");

        const { id } = req.params;
        const userToUpdate = await User.findById(id);
        if (!userToUpdate) throw new NotFoundError("User not found");

        const { roles } = req.body;

        userToUpdate.roles = roles || userToUpdate.roles;

        await userToUpdate.save();

        return userToUpdate;
    }
}
