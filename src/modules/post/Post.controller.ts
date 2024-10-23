import { Router } from "express";
import { postDtoSchema, updatePostDtoSchema } from "./dto/blog-post.dto";
import { PostService } from "./Post.service";
import { validate } from "../../shared/validators/validator";
import { authTokenMiddleware } from "../../shared/middlewares/authToken";

export const PostController = Router();

PostController.post("/", validate(postDtoSchema), authTokenMiddleware, async (req, res, next) => {
    try {
        const post = await PostService.create(req);

        return res.status(201).json({
            message: "Post successfully created",
            post,
        });
    } catch (error) {
        next(error);
    }
});

PostController.get("/", authTokenMiddleware, async (req, res, next) => {
    try {
        const posts = await PostService.get(req);

        return res.status(200).json({
            message: "Successfully fetched all posts",
            posts,
        });
    } catch (error) {
        next(error);
    }
});

PostController.get("/:id", authTokenMiddleware, async (req, res, next) => {
    try {
        const post = await PostService.getById(req, res);

        return res.status(200).json({
            message: "Post found successfully",
            post,
        });
    } catch (error) {
        next(error);
    }
});

PostController.put("/:id", validate(updatePostDtoSchema), authTokenMiddleware, async (req, res, next) => {
    try {
        const post = await PostService.update(req);

        return res.status(200).json({
            message: "Post successfully updated",
            post,
        });
    } catch (error) {
        next(error);
    }
});

PostController.delete("/:id", authTokenMiddleware, async (req, res, next) => {
    try {
        const post = await PostService.delete(req);

        return res.status(200).json({
            message: "Post successfully deleted",
            post,
        });
    } catch (error) {
        next(error);
    }
});

PostController.post("/:id/like", authTokenMiddleware, async (req, res, next) => {
    try {
        const post = await PostService.like(req);

        return res.status(200).json({
            message: "Post liked successfully",
            post,
        });
    } catch (error) {
        next(error);
    }
});

PostController.post("/:id/dislike", authTokenMiddleware, async (req, res, next) => {
    try {
        const post = await PostService.dislike(req);

        return res.status(200).json({
            message: "Post disliked successfully",
            post,
        });
    } catch (error) {
        next(error);
    }
});