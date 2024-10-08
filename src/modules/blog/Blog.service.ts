import { Request, Response } from "express";
import { BlogDto } from "./dto/blog-post.dto";
import { Blog } from "./Blog.model";
import { MongoClient } from "mongodb";
import mongoose from "mongoose";


export class BlogService {
    static async create(req: Request, res: Response) {
        const { title, content, tags }: BlogDto = req.body;
        const author = req.user?.id

        const newBlog = new Blog({ author_id: author, title, content, tags });
        await newBlog.save();

        return res.status(201).json({
            message: "Blog successfully created",
            blog: newBlog
        })
    }


    static async update(req: Request, res: Response) {
        const { id } = req.params;
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        if (blog.author_id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Do not have permission to update this blog post" });
        }

        const { title, content, tags }: BlogDto = req.body;

        blog.title = title || blog.title;
        blog.content = content || blog.content;
        blog.tags = tags || blog.tags;
        await blog.save();

        res.status(200).json({
            message: "Blog post successfully updated",
            blog
        })
    }


    static async delete(req: Request, res: Response) {
        const { id } = req.params;
        const objId = new mongoose.Types.ObjectId(id);
        const blog = await Blog.findById(objId);
        if (!blog) {
            return res.status(404).json({ message: "Blog post not found" });
        }

        if (blog.author_id.toString() !== req.user.id && req.user.roles !== "admin") {
            return res.status(403).json({ message: "Do not have permission to delete this blog post" });
        }

        const client = new MongoClient(process.env.MONGODB_URI);
        const database = client.db("blog-platform");
        const blogs = database.collection("blogs");

        await blogs.deleteOne({ _id: objId });

        res.status(200).json({
            message: "Blog post successfully deleted",
            blog
        })
    }


    static async get(req: Request, res: Response) {
        const page = parseInt(req.query['page'] as string) || 1;
        const limit = parseInt(req.query['limit'] as string) || 10;

        const startIndex = (page - 1) * limit;
        const totalBlogs = await Blog.countDocuments();

        const blogs = await Blog.find().skip(startIndex).limit(limit);

        return res.status(200).json({
            page,
            limit,
            totalBlogs,
            pages: Math.ceil(totalBlogs / limit),
            data: blogs
        });
    }

    static async getById(req: Request, res: Response) {
        const { id } = req.params;
        const getBlogById = await Blog.findOne({ _id: id });
        if (!getBlogById) {
            return res.status(404).json({ message: "Blog post not found" })
        }

        return res.status(200).json({
            message: "Blog found successfully",
            blog: getBlogById
        });
    }
}