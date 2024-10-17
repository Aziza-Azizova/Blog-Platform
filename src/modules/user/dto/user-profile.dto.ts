import { z } from "zod";

export const userProfileDtoSchema = z.object({
    email: z.string().email().optional(),
    username: z.string().min(4).optional(),
    password: z.string().min(6).optional(),
});

export type UserProfileDto = z.infer<typeof userProfileDtoSchema>;

