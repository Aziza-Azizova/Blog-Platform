import { Router } from "express";
import { commentDtoSchema } from "./dto/comment.dto";
import { CommentService } from "./Comment.service";
import { validate } from "../../shared/validators/validator";
import { authTokenMiddleware } from "../../shared/middlewares/authToken";


export const CommentController = Router();

CommentController.post(
    '/:id/comments',
    validate(commentDtoSchema),
    authTokenMiddleware,
    async (req, res, next) => {
        try {
            const comment = await CommentService.create(req)

            return res.status(201).json({
                message: "Comment successfully created",
                comment
            })
        } catch (error) {
            next(error)
        }
    }
);


CommentController.get(
    '/:id/comments',
    authTokenMiddleware,
    async (req, res, next) => {
        try {
            const comments = await CommentService.get(req, res)

            return res.status(200).json({
                message: "Successfully fetched all comments",
                comments
            });
        } catch (error) {
            next(error)
        }
    }
);

CommentController.put(
    '/:id/comments/:commentId',
    validate(commentDtoSchema),
    authTokenMiddleware,
    async (req, res, next) => {
        try {
            const comment = await CommentService.update(req, res);

            return res.status(200).json({
                message: "Comment successfully updated",
                comment
            })
        } catch (error) {
            next(error)
        }
    }
);

CommentController.delete(
    '/:id/comments/:commentId',
    authTokenMiddleware,
    async (req, res, next) => {
        try {
            const comment = await CommentService.delete(req, res);

            return res.status(200).json({
                message: "Comment successfully deleted",
                comment
            });
        } catch (error) {
            next(error)
        }
    }
);