import { Router } from "express";
import { blogDtoSchema, updateBlogDtoSchema } from "./dto/blog-post.dto";
import { BlogService } from "./Blog.service";
import { validateAuth } from "../../shared/validators/auth.validator";
import { authTokenMiddleware } from "../../shared/middlewares/authToken";


export const BlogController = Router();

BlogController.post(
    '/',
    validateAuth(blogDtoSchema),
    authTokenMiddleware,
    BlogService.create
);

BlogController.get(
    '/',
    authTokenMiddleware,
    BlogService.get
);

BlogController.get(
    '/:id',
    authTokenMiddleware,
    BlogService.getById
);

BlogController.put(
    '/:id',
    validateAuth(updateBlogDtoSchema),
    authTokenMiddleware,
    BlogService.update
);

BlogController.delete(
    '/:id',
    authTokenMiddleware,
    BlogService.delete
);