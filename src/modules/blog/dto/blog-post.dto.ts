import { z } from "zod";

export const blogDtoSchema = z.object({
    title: z.string(),
    content: z.string(),
    tags: z.string().array().nonempty(),
});

export type BlogDto = z.infer<typeof blogDtoSchema>;


export const updateBlogDtoSchema = z.object({
    title: z.string().optional(),
    content: z.string().optional(),
    tags: z.string().array().nonempty().optional(),
});

export type UpdateBlogDto = z.infer<typeof updateBlogDtoSchema>;