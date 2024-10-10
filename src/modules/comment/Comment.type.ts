import { Schema } from "mongoose";
import { Document } from "mongoose";

export interface IComment extends Document {
  post_id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  content: string;
  created_at: Date
  updated_at: Date
}
