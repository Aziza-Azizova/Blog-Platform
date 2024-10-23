import mongoose from "mongoose";
import supertest from "supertest";
import dotenv from "dotenv";

import { app } from "../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User, UserRole } from "../modules/auth/Auth.model";
import { generateAccessToken } from "../modules/auth/Auth.service";

dotenv.config();
let mongoServer: MongoMemoryServer;

const mockUser = {
    id: new mongoose.Types.ObjectId().toString(),
    email: "mock@email.com",
    username: "Mock User",
    roles: UserRole.USER,
    password: "mock123",
};

const mockAdmin = {
    id: new mongoose.Types.ObjectId().toString(),
    email: "mock-admin@email.com",
    username: "Mock Admin",
    roles: UserRole.ADMIN,
    password: "mock1234",
};

describe("User management", () => {
    let token: string;
    let adminToken: string;
    let user: any;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.disconnect();
        await mongoose.connect(uri);
    });

    beforeEach(async () => {
        user = await User.create(mockUser);
        token = generateAccessToken(user.id, user.roles);

        const admin = await User.create(mockAdmin);
        adminToken = generateAccessToken(admin.id, admin.roles);
    });

    afterEach(async () => {
        await mongoose.connection.collection("users").deleteMany({});
    });

    it("should return 200 status and fetch user profile data", async () => {
        const res = await supertest(app).get("/user/profile").set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Profile data received successfully");
        expect(res.body.data).toBeDefined();
    });

    it("should return 200 status and update user profile data", async () => {
        const res = await supertest(app).put("/user/profile").set("Authorization", `Bearer ${token}`).send({
            username: "New User",
            email: "new@email.com",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Profile data successfully updated");
        expect(res.body.data).toBeDefined();
    });

    it("should return 200 status and update user profile data", async () => {
        const res = await supertest(app).put(`/user/${user.id}/role`).set("Authorization", `Bearer ${adminToken}`).send({
            roles: "admin",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("User role successfully updated");
        expect(res.body.data).toBeDefined();
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });
});
