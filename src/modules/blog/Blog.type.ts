import { Schema } from "mongoose";
import { Document } from "mongoose";

export interface IBlog extends Document {
  author_id: Schema.Types.ObjectId;
  title: string;
  content: string;
  tags: string[];
  created_at: Date
  updated_at: Date
}
