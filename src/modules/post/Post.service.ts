import { Request } from "express";
import { PostDto } from "./dto/blog-post.dto";
import { Post } from "./Post.model";
import mongoose from "mongoose";
import { ForbiddenError, NotFoundError } from "../../shared/exceptions/errors";

export class PostService {
    static async create(req: Request) {
        const { title, content, tags }: PostDto = req.body;
        const author = req.user?.id;

        const newPost = new Post({ author_id: author, title, content, tags });
        await newPost.save();

        return newPost;
    }

    static async update(req: Request) {
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

    static async delete(req: Request) {
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
        const page = parseInt(req.query["page"] as string) || 1;
        const limit = parseInt(req.query["limit"] as string) || 10;

        const startIndex = (page - 1) * limit;

        const { title, content, tags } = req.query;

        const searchQuery: any = {};

        if (tags) searchQuery.tags = { $eq: tags };
        if (title) searchQuery.title = { $regex: title, $options: "i" };
        if (content) searchQuery.content = { $regex: content };

        const posts = await Post.find(searchQuery).skip(startIndex).limit(limit);

        return posts;
    }

    static async getById(req: Request) {
        const { id } = req.params;
        const post = await Post.findOne({ _id: id });
        if (!post) {
            throw new NotFoundError("Post not found");
        }

        return post;
    }

    static async like(req: Request) {
        const userId = req.user?.id;
        const postId = req.params["id"];

        const post = await Post.findById(postId);
        if (!post) throw new NotFoundError("Post not found");

        const liked = post.likes.some(like => like.userId.toString() === userId);
        if (!liked) {
            post.likes.push({ userId });
        }

        await post.save();
        return post;
    }

    static async dislike(req: Request) {
        const userId = req.user?.id;
        const postId = req.params["id"];

        const post = await Post.findById(postId);
        if (!post) throw new NotFoundError("Post not found");

        const liked = post.likes.some(like => like.userId.toString() === userId);
        if (liked) {
            post.likes = post.likes.filter(like => like.userId.toString() !== userId);
        }

        await post.save();
        return post;
    }
}
