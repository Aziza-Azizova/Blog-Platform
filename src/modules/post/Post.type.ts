import { Schema } from "mongoose";
import { Document } from "mongoose";

export interface IPost extends Document {
    author_id: Schema.Types.ObjectId;
    title: string;
    content: string;
    tags: string[];
    likes: { userId: Schema.Types.ObjectId }[];
    created_at: Date;
    updated_at: Date;
}
