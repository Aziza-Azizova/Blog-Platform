import { BadRequestError } from './shared/exceptions/errors';
import express from "express";
import cors from "cors";
import { connectDB } from "./database/database";
import { UserController } from "./modules/user/User.controller";
import { PostController } from "./modules/post/Post.controller";
import { errorHandler } from "./shared/exceptions/errorHandler";
import { CommentController } from "./modules/comment/Comment.controller";


export const app = express();

// ==== DataBase Call ==== //
connectDB();

// ==== Middlewares ==== //
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==== Routes ==== //
app.use('/auth', UserController);
app.use('/blogs', PostController);
app.use('/blogs', CommentController);


// ==== Handle Error Middlewares ==== //
app.use(errorHandler);