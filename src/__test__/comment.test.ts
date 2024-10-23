import mongoose from "mongoose";
import supertest from "supertest";
import dotenv from "dotenv";

import { app } from "../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { UserRole } from "../modules/auth/Auth.model";
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

describe("Comment management", () => {
    let token: string;
    let commentId: string;
    let createNewPost: () => object;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.disconnect();
        await mongoose.connect(uri);

        token = generateAccessToken(mockUser.id, mockUser.roles);

        createNewPost = async () => {
            const resPost = await supertest(app)
                .post("/blogs")
                .set("Authorization", `Bearer ${token}`)
                .send({
                    title: "Example title",
                    content: "Example content",
                    tags: ["tag1", "tag2", "tag3"],
                });
            return resPost.body.post._id.toString();
        };
    });

    afterEach(async () => {
        await mongoose.connection.collection("posts").deleteMany({});
        await mongoose.connection.collection("comments").deleteMany({});
    });

    it("should return 201 status and create a new comment", async () => {
        const postId = await createNewPost();

        const res = await supertest(app).post(`/blogs/${postId}/comments`).set("Authorization", `Bearer ${token}`).send({
            content: "Example comment content",
        });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Comment successfully created");
        expect(res.body.comment).toBeDefined();
    });

    it("should return 200 status and get all comments for post", async () => {
        const postId = await createNewPost();

        const res = await supertest(app).get(`/blogs/${postId}/comments`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Successfully fetched all comments");
        expect(res.body.comments).toBeDefined();
    });

    it("should return 200 status and update comment by ID", async () => {
        const postId = await createNewPost();

        const commentRes = await supertest(app).post(`/blogs/${postId}/comments`).set("Authorization", `Bearer ${token}`).send({
            content: "Example comment content",
        });

        commentId = commentRes.body.comment._id.toString();

        const res = await supertest(app).put(`/blogs/${postId}/comments/${commentId}`).set("Authorization", `Bearer ${token}`).send({
            content: "Updated comment content",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Comment successfully updated");
        expect(res.body.comment).toBeDefined();
    });

    it("should return 200 status and delete comment by ID", async () => {
        const postId = await createNewPost();

        const commentRes = await supertest(app).post(`/blogs/${postId}/comments`).set("Authorization", `Bearer ${token}`).send({
            content: "Example comment content",
        });
        commentId = commentRes.body.comment._id.toString();

        const res = await supertest(app).delete(`/blogs/${postId}/comments/${commentId}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Comment successfully deleted");
        expect(res.body.comment).toBeDefined();
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });
});
