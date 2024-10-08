import { z } from "zod";

export const userSignupDtoSchema = z.object({
    email: z.string().email(),
    username: z.string().min(4),
    password: z.string().min(6),
});

export type UserSignupDto = z.infer<typeof userSignupDtoSchema>;


export const userLoginDtoSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export type UserLoginDto = z.infer<typeof userLoginDtoSchema>;
