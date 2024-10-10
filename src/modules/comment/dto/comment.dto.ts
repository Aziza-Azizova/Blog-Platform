import { z } from "zod";

export const commentDtoSchema = z.object({
    content: z.string().min(1),
});

export type CommentDto = z.infer<typeof commentDtoSchema>;