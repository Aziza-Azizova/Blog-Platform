import mongoose from "mongoose";
import supertest from "supertest";
import dotenv from "dotenv";

import { app } from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "../../modules/auth/Auth.model";

dotenv.config();
let mongoServer: MongoMemoryServer;

describe("User sign up route", () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.disconnect();
        await mongoose.connect(uri);
    });

    afterEach(async () => {
        await mongoose.connection.collection("users").deleteMany({});
    });

    it("should return 201 status and register a new user", async () => {
        const res = await supertest(app).post("/auth/signup").send({
            email: "test@example.com",
            username: "Username",
            password: "password123",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("User successfully registered");
        expect(res.body.user).toBeDefined();
        expect(res.body.user.email).toBe("test@example.com");
    });

    it("should return 409 if email exists", async () => {
        await User.create({
            email: "existing@example.com",
            username: "Existing User",
            password: "password123",
        });

        const res = await supertest(app).post("/auth/signup").send({
            email: "existing@example.com",
            username: "Existing User",
            password: "password123",
        });

        expect(res.statusCode).toBe(409);
        expect(res.body.message).toBe("Email already exists");
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });
});

describe("User login route", () => {
    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.disconnect();
        await mongoose.connect(uri);
    });

    afterEach(async () => {
        await mongoose.connection.collection("users").deleteMany({});
    });

    it("should return 200 status and log in user", async () => {
        await User.create({
            email: "test@example.com",
            username: "Test User",
            password: "password123",
        });

        const res = await supertest(app).post("/auth/login").send({
            email: "test@example.com",
            password: "password123",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User successfully logged in");
        expect(res.body.user).toBeDefined();
        expect(res.body.token).toBeDefined();
    });

    it("should return 401 status if password is wrong", async () => {
        await User.create({
            email: "test@example.com",
            username: "Username",
            password: "password123",
        });

        const res = await supertest(app).post("/auth/login").send({
            email: "test@example.com",
            password: "wrongPassword",
        });

        expect(res.statusCode).toBe(401);
        expect(res.body.message).toBe("Wrong password");
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });
});
