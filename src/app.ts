import express from "express";
import cors from "cors";
import { connectDB } from "./database/database";
import { UserController } from "./modules/user/User.controller";


export const app = express();

// ==== Middlewares ==== //
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ==== DataBase Call ==== //
connectDB();


// ==== Routes ==== //
app.use('/auth', UserController);
