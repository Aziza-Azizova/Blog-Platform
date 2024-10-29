import mongoose from "mongoose";
import { Request } from "express";
import { PostService } from "../../modules/post/Post.service";
import { Post } from "../../modules/post/Post.model";

jest.mock("../../modules/post/Post.model");

describe("Post Service", () => {
    let req: Partial<Request>;

    beforeEach(() => {
        req = {
            user: { id: "test-user-id", roles: "user" },
            body: {},
            params: {},
            query: {},
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create Post", () => {
        it("should create a new post", async () => {
            const saveMock = jest.fn().mockResolvedValue({
                _id: "post-id",
                title: "Post Title",
                content: "Post Content",
                tags: ["tag1"],
                author_id: "test-user-id",
                likes: [],
                created_at: new Date(),
                updated_at: new Date(),
            });

            (Post as any).mockImplementation(() => ({
                save: saveMock,
                _id: "post-id",
                title: "Post Title",
                content: "Post Content",
                tags: ["tag1"],
                author_id: "test-user-id",
                likes: [],
                created_at: new Date(),
                updated_at: new Date(),
            }));

            req.body = {
                title: "Post Title",
                content: "Post Content",
                tags: ["tag1"],
            };

            const result = await PostService.create(req as Request);

            expect(saveMock).toHaveBeenCalled();
            expect(result.title).toBe("Post Title");
            expect(result.content).toBe("Post Content");
            expect(result.tags).toEqual(["tag1"]);
            expect(result.author_id).toBe("test-user-id");
        });
    });

    describe("Update Post", () => {
        it("should update post content by its ID", async () => {
            const post = {
                save: jest.fn().mockResolvedValue({ title: "Updated Title" }),
                _id: "post-id",
                title: "Post Title",
                content: "Post Content",
                tags: ["tag1"],
                author_id: "test-user-id",
                likes: [],
                created_at: new Date(),
                updated_at: new Date(),
            };

            jest.spyOn(Post, "findById").mockResolvedValue(post);

            req.params = {
                id: "post-id",
            };

            req.body = {
                title: "Updated title",
            };

            const result = await PostService.update(req as Request);

            expect(Post.findById).toHaveBeenCalledWith("post-id");
            expect(post.save).toHaveBeenCalled();
            expect(result.title).toBe("Updated title");
        });
    });

    describe("Delete Post", () => {
        it("should delete post by ID", async () => {
            const post = {
                save: jest.fn(),
                _id: "post-id",
                title: "Post Title",
                content: "Post Content",
                tags: ["tag1"],
                author_id: "test-user-id",
                likes: [],
                created_at: new Date(),
                updated_at: new Date(),
            };

            jest.spyOn(Post, "findById").mockResolvedValue(post);

            req.params = {
                id: "6706c0903b676216e794e4c8",
            };

            const result = await PostService.delete(req as Request);

            expect(Post.deleteOne).toHaveBeenCalledWith({ _id: new mongoose.Types.ObjectId("6706c0903b676216e794e4c8") });
            expect(result.author_id).toBe("test-user-id");
        });
    });

    describe("Get Post", () => {
        it("should get a list of posts with pagination", async () => {
            jest.spyOn(Post, "find").mockReturnValue({
                skip: jest.fn().mockReturnThis(),
                limit: jest.fn().mockResolvedValue([
                    { title: "Post 1", content: "Post 1 content" },
                    { title: "Post 2", content: "Post 2 content" },
                    { title: "Post 3", content: "Post 3 content" },
                ]),
            } as unknown as mongoose.Query<any, any>);

            req.query = {
                title: "Post",
            };

            const result = await PostService.get(req as Request);

            expect(Post.find).toHaveBeenCalled();
            expect(result).toEqual([
                { title: "Post 1", content: "Post 1 content" },
                { title: "Post 2", content: "Post 2 content" },
                { title: "Post 3", content: "Post 3 content" },
            ]);
        });
    });
});
