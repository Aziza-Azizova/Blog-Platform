import mongoose from "mongoose";
import supertest from "supertest";
import dotenv from 'dotenv';

import { app } from "../app";
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserRole } from "../modules/user/User.model";
import { generateAccessToken } from "../modules/user/User.service";

dotenv.config();
let mongoServer: MongoMemoryServer;

const mockUser = {
    id: new mongoose.Types.ObjectId().toString(),
    email: "mock@email.com",
    username: "Mock User",
    roles: UserRole.USER,
    password: "mock123"
}

describe("Blog post management", () => {
    let token: string;
    let blogId: string;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.disconnect();
        await mongoose.connect(uri);

        token = generateAccessToken(mockUser.id, mockUser.roles)
    });

    afterEach(async () => {
        await mongoose.connection.collection('blogs').deleteMany({});
    });

    it("should return 201 status and create a new blog post", async () => {
        const res = await supertest(app)
            .post('/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Example title',
                content: 'Example content',
                tags: ['tag1', 'tag2', 'tag3']
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.message).toBe('Blog successfully created');
        expect(res.body.blog).toBeDefined();
    });

    it("should return 200 status and get all blog posts with pagination", async () => {
        const res = await supertest(app)
            .get('/blogs')
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Successfully fetched all blog posts');
        expect(res.body.page).toBeDefined();
        expect(res.body.limit).toBeDefined();
        expect(res.body.totalBlogs).toBeDefined();
        expect(res.body.pages).toBeDefined();
        expect(res.body.data).toBeDefined();
    });

    it("should return 200 status and update blog post by ID", async () => {
        const createBlogRes = await supertest(app)
            .post('/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Example title',
                content: 'Example content',
                tags: ['tag1', 'tag2', 'tag3']
            });
        blogId = createBlogRes.body.blog._id.toString();

        const res = await supertest(app)
            .put(`/blogs/${blogId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: "Updated title"
            })

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Blog post successfully updated');
        expect(res.body.blog).toBeDefined();
    });

    it("should return 200 status and delete blog post by ID", async () => {
        const createBlogRes = await supertest(app)
            .post('/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Example title',
                content: 'Example content',
                tags: ['tag1', 'tag2', 'tag3']
            });
        blogId = createBlogRes.body.blog._id.toString();

        const res = await supertest(app)
            .delete(`/blogs/${blogId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Blog post successfully deleted');
        expect(res.body.blog).toBeDefined();
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });


    it("should return 200 status and get blog post by ID", async () => {
        const createBlogRes = await supertest(app)
            .post('/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send({
                title: 'Example title',
                content: 'Example content',
                tags: ['tag1', 'tag2', 'tag3']
            });
        blogId = createBlogRes.body.blog._id.toString();

        const res = await supertest(app)
            .get(`/blogs/${blogId}`)
            .set('Authorization', `Bearer ${token}`)

        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('Blog found successfully');
        expect(res.body.blog).toBeDefined();
    });

    afterAll(async () => {
        await mongoose.connection.close();
        await mongoServer.stop();
    });
});