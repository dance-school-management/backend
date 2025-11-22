import request from "supertest";
import { Express } from "express";
import { createApp } from "../../utils/createApp";
import {
  setupTestDatabase,
  teardownTestDatabase,
  cleanTestDatabase,
} from "../helpers/testDatabase";
import { BlogPost, PrismaClient } from "../../../generated/client";
import { createMockUserContext } from "../helpers/testHelpers";

// Mock prisma to use test database (will be set in beforeAll)
let testPrisma: PrismaClient;
jest.mock("../../utils/prisma", () => ({
  __esModule: true,
  get default() {
    return testPrisma;
  },
}));

describe("Post Routes (E2E Tests)", () => {
  let app: Express;
  let prisma: PrismaClient;
  let adminUserContext: string;

  beforeAll(async () => {
    prisma = await setupTestDatabase();
    testPrisma = prisma; // Set the test prisma instance
    app = createApp();
    adminUserContext = createMockUserContext({
      id: "user-123",
      role: "ADMINISTRATOR",
      email: "admin@test.com",
    });
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  describe("POST /blog/posts", () => {
    it("should create a draft post", async () => {
      const response = await request(app)
        .post("/blog/posts")
        .set("user-context", adminUserContext)
        .send({
          title: "Test Draft Post",
          content: "This is test content for a draft post.",
          excerpt: "Test excerpt",
          tags: ["test", "draft"],
          status: "draft",
        });

      expect(response.status).toBe(201);
      expect(response.body.title).toBe("Test Draft Post");
      expect(response.body.status).toBe("draft");
      expect(response.body.slug).toBeTruthy();
      expect(response.body.readingTime).toBeGreaterThan(0);
    });

    it("should create a published post", async () => {
      const response = await request(app)
        .post("/blog/posts")
        .set("user-context", adminUserContext)
        .send({
          title: "Test Published Post",
          content: "This is test content.",
          excerpt: "Test excerpt",
          status: "published",
        });

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("published");
      expect(response.body.publishedAt).toBeTruthy();
    });

    it("should return 400 for missing required fields", async () => {
      const response = await request(app)
        .post("/blog/posts")
        .set("user-context", adminUserContext)
        .send({
          title: "Test Post",
          // Missing content and excerpt
        });

      expect(response.status).toBe(400);
    });

    it("should return 400 for invalid status", async () => {
      const response = await request(app)
        .post("/blog/posts")
        .set("user-context", adminUserContext)
        .send({
          title: "Test Post",
          content: "Content",
          excerpt: "Excerpt",
          status: "invalid",
        });

      expect(response.status).toBe(400);
    });
  });

  describe("PATCH /blog/posts/:idOrSlug", () => {
    it("should update a post", async () => {
      const post = await prisma.blogPost.create({
        data: {
          title: "Original Title",
          slug: "original-title",
          content: "Original content",
          excerpt: "Original excerpt",
          authorId: "user-123",
          status: "draft",
          tags: [],
        },
      });

      const response = await request(app)
        .patch(`/blog/posts/${post.id}`)
        .set("user-context", adminUserContext)
        .send({
          title: "Updated Title",
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("Updated Title");
      expect(response.body.slug).toContain("updated-title");
    });

    it("should return 404 for non-existent post", async () => {
      const response = await request(app)
        .patch("/blog/posts/99999")
        .set("user-context", adminUserContext)
        .send({
          title: "Updated Title",
        });

      expect(response.status).toBe(404);
    });
  });

  describe("DELETE /blog/posts/:idOrSlug", () => {
    it("should delete a post", async () => {
      const post = await prisma.blogPost.create({
        data: {
          title: "Test Post",
          slug: "test-post",
          content: "Content",
          excerpt: "Excerpt",
          authorId: "user-123",
          status: "draft",
          tags: [],
        },
      });

      const response = await request(app)
        .delete(`/blog/posts/${post.id}`)
        .set("user-context", adminUserContext);

      expect(response.status).toBe(204);

      const deletedPost = await prisma.blogPost.findUnique({
        where: { id: post.id },
      });
      expect(deletedPost).toBeNull();
    });

    it("should return 404 for non-existent post", async () => {
      const response = await request(app)
        .delete("/blog/posts/99999")
        .set("user-context", adminUserContext);

      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /blog/posts/:idOrSlug/publish", () => {
    it("should publish a draft post", async () => {
      const post = await prisma.blogPost.create({
        data: {
          title: "Test Post",
          slug: "test-post",
          content: "Content",
          excerpt: "Excerpt",
          authorId: "user-123",
          status: "draft",
          tags: [],
        },
      });

      const response = await request(app)
        .patch(`/blog/posts/${post.id}/publish`)
        .set("user-context", adminUserContext)
        .send({});

      expect(response.status).toBe(204);

      const updatedPost = await prisma.blogPost.findUnique({
        where: { id: post.id },
      });
      expect(updatedPost?.status).toBe("published");
      expect(updatedPost?.publishedAt).toBeTruthy();
    });
  });

  describe("PATCH /blog/posts/:idOrSlug/unpublish", () => {
    it("should unpublish a published post", async () => {
      const post = await prisma.blogPost.create({
        data: {
          title: "Test Post",
          slug: "test-post",
          content: "Content",
          excerpt: "Excerpt",
          authorId: "user-123",
          status: "published",
          publishedAt: new Date(),
          tags: [],
        },
      });

      const response = await request(app)
        .patch(`/blog/posts/${post.id}/unpublish`)
        .set("user-context", adminUserContext);

      expect(response.status).toBe(204);

      const updatedPost = await prisma.blogPost.findUnique({
        where: { id: post.id },
      });
      expect(updatedPost?.status).toBe("draft");
      expect(updatedPost?.publishedAt).toBeNull();
    });
  });

  describe("PATCH /blog/posts/:idOrSlug/pin", () => {
    it("should pin a post", async () => {
      const post = await prisma.blogPost.create({
        data: {
          title: "Test Post",
          slug: "test-post",
          content: "Content",
          excerpt: "Excerpt",
          authorId: "user-123",
          status: "published",
          publishedAt: new Date(),
          tags: [],
        },
      });

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 7);

      const response = await request(app)
        .patch(`/blog/posts/${post.id}/pin`)
        .set("user-context", adminUserContext)
        .send({
          pinnedUntil: futureDate.toISOString(),
        });

      expect(response.status).toBe(204);

      const updatedPost = await prisma.blogPost.findUnique({
        where: { id: post.id },
      });
      expect(updatedPost?.isPinned).toBe(true);
      expect(updatedPost?.pinnedUntil).toBeTruthy();
    });
  });

  describe("GET /blog/posts", () => {
    it("should get all posts with pagination", async () => {
      await prisma.blogPost.createMany({
        data: [
          {
            title: "Post 1",
            slug: "post-1",
            content: "Content 1",
            excerpt: "Excerpt 1",
            authorId: "user-123",
            status: "draft",
            tags: [],
          },
          {
            title: "Post 2",
            slug: "post-2",
            content: "Content 2",
            excerpt: "Excerpt 2",
            authorId: "user-123",
            status: "published",
            publishedAt: new Date(),
            tags: [],
          },
        ],
      });

      const response = await request(app)
        .get("/blog/posts")
        .set("user-context", adminUserContext)
        .query({ page: "1", limit: "10" });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination.total).toBe(2);
    });

    it("should filter by status", async () => {
      await prisma.blogPost.createMany({
        data: [
          {
            title: "Draft Post",
            slug: "draft-post",
            content: "Content",
            excerpt: "Excerpt",
            authorId: "user-123",
            status: "draft",
            tags: [],
          },
          {
            title: "Published Post",
            slug: "published-post",
            content: "Content",
            excerpt: "Excerpt",
            authorId: "user-123",
            status: "published",
            publishedAt: new Date(),
            tags: [],
          },
        ],
      });

      const response = await request(app)
        .get("/blog/posts")
        .set("user-context", adminUserContext)
        .query({ status: "published" });

      expect(response.status).toBe(200);
      expect(response.body.data.every((p: BlogPost) => p.status === "published")).toBe(true);
    });
  });

  describe("GET /blog/posts/:idOrSlug", () => {
    it("should get post by ID", async () => {
      const post = await prisma.blogPost.create({
        data: {
          title: "Test Post",
          slug: "test-post",
          content: "Content",
          excerpt: "Excerpt",
          authorId: "user-123",
          status: "draft",
          tags: [],
        },
      });

      const response = await request(app)
        .get(`/blog/posts/${post.id}`)
        .set("user-context", adminUserContext);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(post.id);
    });

    it("should get post by slug", async () => {
      await prisma.blogPost.create({
        data: {
          title: "Test Post",
          slug: "test-post-slug",
          content: "Content",
          excerpt: "Excerpt",
          authorId: "user-123",
          status: "draft",
          tags: [],
        },
      });

      const response = await request(app)
        .get("/blog/posts/test-post-slug")
        .set("user-context", adminUserContext);

      expect(response.status).toBe(200);
      expect(response.body.slug).toBe("test-post-slug");
    });
  });
});

