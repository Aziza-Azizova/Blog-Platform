import { Router } from "express";
import { userLoginDtoSchema, userSignupDtoSchema } from "./dto/auth.dto";
import { AuthService } from "./Auth.service";
import { validate } from "../../shared/validators/validator";

export const AuthController = Router();

AuthController.post("/signup", validate(userSignupDtoSchema), async (req, res, next) => {
    try {
        const user = await AuthService.register(req);

        return res.status(201).json({
            message: "User successfully registered",
            user: user,
        });
    } catch (error) {
        next(error);
    }
});

AuthController.post("/login", validate(userLoginDtoSchema), async (req, res, next) => {
    try {
        const { user, token } = await AuthService.login(req);

        return res.status(200).json({
            message: "User successfully logged in",
            user,
            token,
        });
    } catch (error) {
        next(error);
    }
});
