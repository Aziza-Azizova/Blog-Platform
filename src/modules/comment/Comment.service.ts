import { Request, Response } from "express";
import { CommentDto } from "./dto/comment.dto";
import { Comment } from "./Comment.model";
import { ForbiddenError, NotFoundError } from "../../shared/exceptions/errors";
import sanitize from "sanitize-html";
import { Post } from "../post/Post.model";


export class CommentService {
    
    static async create(req: Request) {
        const { content }: CommentDto = req.body;
        const sanitizedContent = sanitize(content);
        const authorId = req.user?.id;

        const { id } = req.params;
        if(!id){
            throw new NotFoundError("Post ID required");
        }

        const post = await Post.findOne({_id: id});
        if(!post){
            throw new NotFoundError("Post not found");
        }

        const newComment = new Comment({ post_id: id, user_id: authorId, content: sanitizedContent });
        await newComment.save();

        return newComment;
    }


    static async update(req: Request, res: Response) {
        const { id, commentId } = req.params;
        const post = await Post.findOne({ _id: id });
        if(!post){
            throw new NotFoundError("Post not found");
        }

        const comment = await Comment.findOne({ _id: commentId, post_id: id });
        if (!comment) {
            throw new NotFoundError("Comment not found");
        }

        if (comment.user_id.toString() !== req.user.id) {
            throw new ForbiddenError("Do not have permission to update this comment");
        }

        const { content }: CommentDto = req.body;
        const sanitizedContent = sanitize(content);

        comment.content = sanitizedContent || comment.content;
        await comment.save();

        return comment;
    }


    static async delete(req: Request, res: Response) {
        const { id, commentId } = req.params;
        const post = await Post.findOne({ _id: id });
        if(!post){
            throw new NotFoundError("Post not found");
        }

        const comment = await Comment.findOne({ _id: commentId, post_id: id });
        if (!comment) {
            throw new NotFoundError("Comment not found");
        }

        if (comment.user_id.toString() !== req.user.id && req.user.roles !== "admin") {
            throw new ForbiddenError("Do not have permission to delete this comment");
        }

        await Comment.deleteOne({ _id: commentId });

        return comment;
    }


    static async get(req: Request, res: Response) {
        const { id } = req.params;
        const post = await Post.findOne({ _id: id });
        if(!post){
            throw new NotFoundError("Post not found");
        }

        const comments = await Comment.find({ post_id: id });
        if (!comments) {
            throw new NotFoundError("Comment not found");
        }

        return comments;
    }
}