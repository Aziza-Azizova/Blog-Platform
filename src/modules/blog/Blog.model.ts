import { Schema, model } from "mongoose";
import { IBlog } from "./Blog.type";


const blogSchema = new Schema<IBlog>({
    author_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String], required: true },
    created_at: { type: Date, default: Date.now, required: true },
    updated_at: { type: Date, default: Date.now, required: true },
});

blogSchema.pre("save", function (next) {
    this.updated_at = new Date();
    next();
});

export const Blog = model<IBlog>("Blog", blogSchema);