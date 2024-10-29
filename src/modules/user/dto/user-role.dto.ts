import { z } from "zod";

export const userRoleDtoSchema = z.object({
    roles: z.enum(["admin", "user"]),
});

export type UserRoleDto = z.infer<typeof userRoleDtoSchema>;
