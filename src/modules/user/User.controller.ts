import { Router } from "express";
import { userLoginDtoSchema, userSignupDtoSchema } from "./dto/user-auth.dto";
import { UserService } from "./User.service";
import { validateAuth } from "../../shared/validators/auth.validator";


export const UserController = Router();

UserController.post(
    '/signup',
    validateAuth(userSignupDtoSchema),
    UserService.register
);

UserController.post(
    '/login',
    validateAuth(userLoginDtoSchema),
    UserService.login
);