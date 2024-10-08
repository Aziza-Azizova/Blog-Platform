import { Request, Response } from "express";
import { PostDto } from "./dto/blog-post.dto";
import { Post } from "./Post.model";
import mongoose from "mongoose";
import { ForbiddenError, NotFoundError } from "../../shared/exceptions/errors";


export class PostService {
    static async create(req: Request) {
        const { title, content, tags }: PostDto = req.body;
        const author = req.user?.id

        const newPost = new Post({ author_id: author, title, content, tags });
        await newPost.save();

        return newPost;
    }


    static async update(req: Request, res: Response) {
        const { id } = req.params;
        const post = await Post.findById(id);
        if (!post) {
            throw new NotFoundError("Post not found");
        }

        if (post.author_id.toString() !== req.user.id) {
            throw new ForbiddenError("Do not have permission to update this post");
        }

        const { title, content, tags }: PostDto = req.body;

        post.title = title || post.title;
        post.content = content || post.content;
        post.tags = tags || post.tags;
        await post.save();

        return post;
    }


    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const objId = new mongoose.Types.ObjectId(id);
        const post = await Post.findById(objId);
        if (!post) {
            throw new NotFoundError("Post not found");
        }

        if (post.author_id.toString() !== req.user.id && req.user.roles !== "admin") {
            throw new ForbiddenError("Do not have permission to delete this post");
        }

        await Post.deleteOne({ _id: objId });

        return post;
    }


    static async get(req: Request) {
        const page = parseInt(req.query['page'] as string) || 1;
        const limit = parseInt(req.query['limit'] as string) || 10;

        const startIndex = (page - 1) * limit;
        const posts = await Post.find().skip(startIndex).limit(limit);

        return posts;
    }


    static async getById(req: Request, res: Response) {
        const { id } = req.params;
        const post = await Post.findOne({ _id: id });
        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        return post;
    }
}