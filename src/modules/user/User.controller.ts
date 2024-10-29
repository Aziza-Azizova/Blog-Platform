import { Router } from "express";
import { UserService } from "./User.service";
import { validate } from "../../shared/validators/validator";
import { authTokenMiddleware } from "../../shared/middlewares/authToken";
import { userProfileDtoSchema } from "./dto/user-profile.dto";
import { userRoleDtoSchema } from "./dto/user-role.dto";

export const UserController = Router();

UserController.get("/profile", authTokenMiddleware, async (req, res, next) => {
    try {
        const profileData = await UserService.showProfile(req);

        return res.status(200).json({
            message: "Profile data received successfully",
            data: profileData,
        });
    } catch (error) {
        next(error);
    }
});

UserController.put("/profile", validate(userProfileDtoSchema), authTokenMiddleware, async (req, res, next) => {
    try {
        const updatedProfileData = await UserService.updateProfile(req);

        return res.status(200).json({
            message: "Profile data successfully updated",
            data: updatedProfileData,
        });
    } catch (error) {
        next(error);
    }
});

UserController.put("/:id/role", validate(userRoleDtoSchema), authTokenMiddleware, async (req, res, next) => {
    try {
        const updatedUserRole = await UserService.updateUserRole(req);

        return res.status(200).json({
            message: "User role successfully updated",
            data: updatedUserRole,
        });
    } catch (error) {
        next(error);
    }
});
