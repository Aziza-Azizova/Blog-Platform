import { Router } from "express";
import { userLoginDtoSchema, userSignupDtoSchema } from "./dto/user-auth-dto";
import { UserServices } from "./User.service";
import { validateAuth } from "../../shared/validators/auth.validator";


export const UserController = Router();

UserController.post(
    '/signup',
    validateAuth(userSignupDtoSchema),
    UserServices.registration
);

UserController.post(
    '/login',
    validateAuth(userLoginDtoSchema),
    UserServices.login
);