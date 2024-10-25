import { Schema, model } from "mongoose";
import { IPost } from "./Post.type";

const postSchema = new Schema<IPost>({
    author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: { type: [String] },
    likes: {
        type: [{ userId: { type: Schema.Types.ObjectId, ref: "User", required: true } }],
        default: [],
    },
    created_at: { type: Date, default: Date.now, required: true },
    updated_at: { type: Date, default: Date.now, required: true },
});

postSchema.pre("save", function (next) {
    this.updated_at = new Date();
    next();
});

export const Post = model<IPost>("Post", postSchema);
