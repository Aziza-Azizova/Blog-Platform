import mongoose from "mongoose";
import supertest from "supertest";
import dotenv from "dotenv";

import { app } from "../../app";
import { MongoMemoryServer } from "mongodb-memory-server";
import { UserRole } from "../../modules/auth/Auth.model";
import { generateAccessToken } from "../../modules/auth/Auth.service";

dotenv.config();
let mongoServer: MongoMemoryServer;

const mockUser = {
    id: new mongoose.Types.ObjectId().toString(),
    email: "mock@email.com",
    username: "Mock User",
    roles: UserRole.USER,
    password: "mock123",
};

describe("Blog post management", () => {
    let token: string;
    let postId: string;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.disconnect();
        await mongoose.connect(uri);

        token = generateAccessToken(mockUser.id, mockUser.roles);
    });

    afterEach(async () => {
        await mongoose.connection.collection("posts").deleteMany({});
    });

    it("should return 201 status and create a new post", async () => {
        const res = await supertest(app)
            .post("/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Example title",
                content: "Example content",
                tags: ["tag1", "tag2", "tag3"],
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe("Post successfully created");
        expect(res.body.post).toBeDefined();
    });

    it("should return 200 status and get all posts", async () => {
        const res = await supertest(app).get("/blogs").set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Successfully fetched all posts");
        expect(res.body.posts).toBeDefined();
    });

    it("should return 200 status and get all posts with pagination", async () => {
        const res = await supertest(app).get("/blogs?page=2&limit=5").set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Successfully fetched all posts");
        expect(res.body.posts).toBeDefined();
    });

    it("should return posts matching the search query for title", async () => {
        await supertest(app)
            .post("/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Express.js",
                content: "Example content",
                tags: ["tag1", "tag2", "tag3"],
            });

        const res = await supertest(app).get("/blogs?title=express.js").set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Successfully fetched all posts");
        expect(res.body.posts).toBeDefined();
    });

    it("should return 200 status and update post by ID", async () => {
        const createBlogRes = await supertest(app)
            .post("/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Example title",
                content: "Example content",
                tags: ["tag1", "tag2", "tag3"],
            });
        postId = createBlogRes.body.post._id.toString();

        const res = await supertest(app).put(`/blogs/${postId}`).set("Authorization", `Bearer ${token}`).send({
            title: "Updated title",
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Post successfully updated");
        expect(res.body.post).toBeDefined();
    });

    it("should return 200 status and delete post by ID", async () => {
        const createBlogRes = await supertest(app)
            .post("/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Example title",
                content: "Example content",
                tags: ["tag1", "tag2", "tag3"],
            });
        postId = createBlogRes.body.post._id.toString();

        const res = await supertest(app).delete(`/blogs/${postId}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Post successfully deleted");
        expect(res.body.post).toBeDefined();
    });

    it("should return 200 status and get post by ID", async () => {
        const createBlogRes = await supertest(app)
            .post("/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Example title",
                content: "Example content",
                tags: ["tag1", "tag2", "tag3"],
            });
        postId = createBlogRes.body.post._id.toString();

        const res = await supertest(app).get(`/blogs/${postId}`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Post found successfully");
        expect(res.body.post).toBeDefined();
    });

    it("should return 200 status and like post by ID", async () => {
        const createBlogRes = await supertest(app)
            .post("/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Example title",
                content: "Example content",
                tags: ["tag1", "tag2", "tag3"],
            });
        postId = createBlogRes.body.post._id.toString();

        const res = await supertest(app).post(`/blogs/${postId}/like`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Post liked successfully");
        expect(res.body.post).toBeDefined();
    });

    it("should return 200 status and dislike post by ID", async () => {
        const createBlogRes = await supertest(app)
            .post("/blogs")
            .set("Authorization", `Bearer ${token}`)
            .send({
                title: "Example title",
                content: "Example content",
                tags: ["tag1", "tag2", "tag3"],
            });
        postId = createBlogRes.body.post._id.toString();

        const res = await supertest(app).post(`/blogs/${postId}/dislike`).set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe("Post disliked successfully");
        expect(res.body.post).toBeDefined();
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });
});
