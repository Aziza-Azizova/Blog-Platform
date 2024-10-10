import { z } from "zod";

export const postDtoSchema = z.object({
    title: z.string(),
    content: z.string(),
    tags: z.string().array().nonempty(),
});

export type PostDto = z.infer<typeof postDtoSchema>;


export const updatePostDtoSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    tags: z.string().array().nonempty().optional(),
});

export type UpdatePostDto = z.infer<typeof updatePostDtoSchema>;