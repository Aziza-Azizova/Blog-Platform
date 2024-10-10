import { Router } from "express";
import { userLoginDtoSchema, userSignupDtoSchema } from "./dto/user-auth.dto";
import { UserService } from "./User.service";
import { validate } from "../../shared/validators/validator";


export const UserController = Router();

UserController.post(
    '/signup',
    validate(userSignupDtoSchema),
    async (req, res, next) => {
        try {
            const user = await UserService.register(req, res);

            return res.status(201).json({
                message: "User successfully registered",
                user: user
            });
        } catch (error) {
            next(error);
        }
    }
);

UserController.post(
    '/login',
    validate(userLoginDtoSchema),
    async (req, res, next) => {
        try {
            const { user, token } = await UserService.login(req, res);

            return res.status(200).json({
                message: "User successfully logged in",
                user,
                token
            });
        } catch (error) {
            next(error);
        }
    }
);