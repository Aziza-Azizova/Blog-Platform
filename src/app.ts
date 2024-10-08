import express from "express";
import cors from "cors";
import { start } from "./database/database";


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

// ==== Routes ==== //

app.get('/', (req, res) => {
    res.json({message: "Server works"});
})

// ==== DataBase Call ==== //
start();
