import { Schema, model } from "mongoose";
import { IComment } from "./Comment.type";

const commentSchema = new Schema<IComment>({
    post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now, required: true },
    updated_at: { type: Date, default: Date.now, required: true },
});

commentSchema.pre("save", function (next) {
    this.updated_at = new Date();
    next();
});

export const Comment = model<IComment>("Comment", commentSchema);
