import { Request } from "express";
import { CommentService } from "./../../modules/comment/Comment.service";
import { Comment } from "../../modules/comment/Comment.model";
import { Post } from "../../modules/post/Post.model";

jest.mock("../../modules/comment/Comment.model");
jest.mock("../../modules/post/Post.model");

describe("Comment Service", () => {
    let req: Partial<Request>;

    beforeEach(() => {
        req = {
            params: { id: "post-id", commentId: "comment-id" },
            user: { id: "user-id", roles: "user" },
            body: {},
            query: {},
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("Create Comment", () => {
        it("should create a new comment for a post", async () => {
            jest.spyOn(Post, "findOne").mockResolvedValue({ _id: "post-id" });

            const saveMock = jest.fn().mockResolvedValue({
                _id: "comment-id",
                post_id: "post-id",
                user_id: "user-id",
                content: "Comment Content",
                created_at: new Date(),
                updated_at: new Date(),
            });

            (Comment as any).mockImplementation(() => ({
                save: saveMock,
                _id: "comment-id",
                post_id: "post-id",
                user_id: "user-id",
                content: "Comment Content",
                created_at: new Date(),
                updated_at: new Date(),
            }));

            const result = await CommentService.create(req as Request);

            expect(saveMock).toHaveBeenCalled();
            expect(result.content).toBe("Comment Content");
            expect(result.user_id).toBe("user-id");
        });
    });

    describe("Update Comment", () => {
        it("should update comment by its ID", async () => {
            jest.spyOn(Post, "findOne").mockResolvedValue({ _id: "post-id" });

            const comment = {
                save: jest.fn().mockResolvedValue({ content: "Updated Comment content" }),
                _id: "comment-id",
                post_id: "post-id",
                user_id: "user-id",
                content: "Comment Content",
                created_at: new Date(),
                updated_at: new Date(),
            };

            jest.spyOn(Comment, "findOne").mockResolvedValue(comment);

            req.body = {
                content: "Updated Comment content",
            };

            const result = await CommentService.update(req as Request);

            expect(Post.findOne).toHaveBeenCalled();
            expect(Comment.findOne).toHaveBeenCalled();
            expect(comment.save).toHaveBeenCalled();
            expect(result.content).toBe("Updated Comment content");
        });
    });

    describe("Delete Comment", () => {
        it("should delete comment by ID", async () => {
            jest.spyOn(Post, "findOne").mockResolvedValue({ _id: "post-id" });

            const comment = {
                save: jest.fn().mockResolvedValue({ content: "Updated Comment content" }),
                _id: "comment-id",
                post_id: "post-id",
                user_id: "user-id",
                content: "Comment Content",
                created_at: new Date(),
                updated_at: new Date(),
            };

            jest.spyOn(Comment, "findOne").mockResolvedValue(comment);

            const result = await CommentService.delete(req as Request);

            expect(Post.findOne).toHaveBeenCalled();
            expect(Comment.deleteOne).toHaveBeenCalled();
            expect(result._id).toBe("comment-id");
        });
    });

    describe("Get Comment", () => {
        it("should get a comment by ID", async () => {
            jest.spyOn(Post, "findOne").mockResolvedValue({ _id: "post-id" });

            const comments = [
                { _id: "comment-id-1", content: "Comment Content 1" },
                { _id: "comment-id-2", content: "Comment Content 2" },
            ];

            jest.spyOn(Comment, "find").mockResolvedValue(comments);

            const result = await CommentService.get(req as Request);

            expect(Post.findOne).toHaveBeenCalledWith({ _id: "post-id" });
            expect(Comment.find).toHaveBeenCalledWith({ post_id: "post-id" });
            expect(result).toEqual([
                { _id: "comment-id-1", content: "Comment Content 1" },
                { _id: "comment-id-2", content: "Comment Content 2" },
            ]);
        });
    });
});
