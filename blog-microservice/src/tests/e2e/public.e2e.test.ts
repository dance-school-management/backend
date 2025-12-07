import request from "supertest";
import { Express } from "express";
import { createApp } from "../../utils/createApp";
import {
  setupTestDatabase,
  teardownTestDatabase,
  cleanTestDatabase,
} from "../helpers/testDatabase";
import { BlogPost, PrismaClient } from "../../../generated/client";

jest.mock("../../utils/aws-s3/crud", () => ({
  uploadPublicPhoto: jest.fn().mockResolvedValue("mocked-s3-path.jpg"),
  deletePublicPhoto: jest.fn().mockResolvedValue(undefined),
  uploadMultiplePublicPhotos: jest
    .fn()
    .mockResolvedValue(["mocked-s3-path1.jpg", "mocked-s3-path2.jpg"]),
  deleteMultiplePublicPhotos: jest.fn().mockResolvedValue(undefined),
}));

// Mock prisma to use test database (will be set in beforeAll)
let testPrisma: PrismaClient;
jest.mock("../../utils/prisma", () => ({
  __esModule: true,
  get default() {
    return testPrisma;
  },
}));

describe("Public Routes (E2E Tests)", () => {
  let app: Express;
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = await setupTestDatabase();
    testPrisma = prisma; // Set the test prisma instance
    app = createApp();
  });

  afterAll(async () => {
    await teardownTestDatabase();
  });

  beforeEach(async () => {
    await cleanTestDatabase();
  });

  describe("GET /public/posts", () => {
    it("should get published posts with pagination", async () => {
      await prisma.blogPost.createMany({
        data: [
          {
            title: "Published Post 1",
            slug: "published-post-1",
            content: "Content 1",
            excerpt: "Excerpt 1",
            authorId: "user-123",
            status: "published",
            publishedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
            tags: [],
          },
          {
            title: "Published Post 2",
            slug: "published-post-2",
            content: "Content 2",
            excerpt: "Excerpt 2",
            authorId: "user-123",
            status: "published",
            publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
            tags: [],
          },
        ],
      });

      const response = await request(app)
        .get("/public/posts")
        .query({ page: "1", limit: "10" });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.pagination.total).toBe(2);
      expect(
        response.body.data.every((p: BlogPost) => p.status === "published")
      ).toBe(true);
    });

    it("should not return draft posts", async () => {
      await prisma.blogPost.createMany({
        data: [
          {
            title: "Published Post",
            slug: "published-post",
            content: "Content",
            excerpt: "Excerpt",
            authorId: "user-123",
            status: "published",
            publishedAt: new Date(Date.now() - 1000 * 60 * 60),
            tags: [],
          },
          {
            title: "Draft Post",
            slug: "draft-post",
            content: "Content",
            excerpt: "Excerpt",
            authorId: "user-123",
            status: "draft",
            tags: [],
          },
        ],
      });

      const response = await request(app).get("/public/posts");

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].status).toBe("published");
    });

    it("should not return future-dated posts", async () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24); // 1 day from now
      await prisma.blogPost.create({
        data: {
          title: "Future Post",
          slug: "future-post",
          content: "Content",
          excerpt: "Excerpt",
          authorId: "user-123",
          status: "published",
          publishedAt: futureDate,
          tags: [],
        },
      });

      const response = await request(app).get("/public/posts");

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(0);
    });

    it("should filter by tag", async () => {
      await prisma.blogPost.createMany({
        data: [
          {
            title: "Dance Post",
            slug: "dance-post",
            content: "Content",
            excerpt: "Excerpt",
            authorId: "user-123",
            status: "published",
            publishedAt: new Date(Date.now() - 1000 * 60 * 60),
            tags: ["dance", "tutorial"],
          },
          {
            title: "Music Post",
            slug: "music-post",
            content: "Content",
            excerpt: "Excerpt",
            authorId: "user-123",
            status: "published",
            publishedAt: new Date(Date.now() - 1000 * 60 * 60),
            tags: ["music"],
          },
        ],
      });

      const response = await request(app)
        .get("/public/posts")
        .query({ tag: "dance" });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].tags).toContain("dance");
    });

    it("should search by query", async () => {
      await prisma.blogPost.createMany({
        data: [
          {
            title: "Dance Tutorial",
            slug: "dance-tutorial",
            content: "Learn to dance with this tutorial",
            excerpt: "Excerpt",
            authorId: "user-123",
            status: "published",
            publishedAt: new Date(Date.now() - 1000 * 60 * 60),
            tags: [],
          },
          {
            title: "Music Lesson",
            slug: "music-lesson",
            content: "Learn music theory",
            excerpt: "Excerpt",
            authorId: "user-123",
            status: "published",
            publishedAt: new Date(Date.now() - 1000 * 60 * 60),
            tags: [],
          },
        ],
      });

      const response = await request(app)
        .get("/public/posts")
        .query({ q: "dance" });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
      expect(response.body.data[0].title.toLowerCase()).toContain("dance");
    });

    it("should sort pinned posts first", async () => {
      const now = new Date();
      const futureDate = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 7); // 7 days from now

      await prisma.blogPost.createMany({
        data: [
          {
            title: "Regular Post",
            slug: "regular-post",
            content: "Content",
            excerpt: "Excerpt",
            authorId: "user-123",
            status: "published",
            publishedAt: new Date(now.getTime() - 1000 * 60 * 60),
            tags: [],
            isPinned: false,
          },
          {
            title: "Pinned Post",
            slug: "pinned-post",
            content: "Content",
            excerpt: "Excerpt",
            authorId: "user-123",
            status: "published",
            publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 2),
            tags: [],
            isPinned: true,
            pinnedUntil: futureDate,
          },
        ],
      });

      const response = await request(app).get("/public/posts");

      expect(response.status).toBe(200);
      expect(response.body.data[0].isPinned).toBe(true);
      expect(response.body.data[0].title).toBe("Pinned Post");
    });

    it("should handle pagination correctly", async () => {
      await prisma.blogPost.createMany({
        data: Array.from({ length: 15 }, (_, i) => ({
          title: `Post ${i + 1}`,
          slug: `post-${i + 1}`,
          content: "Content",
          excerpt: "Excerpt",
          authorId: "user-123",
          status: "published",
          publishedAt: new Date(Date.now() - 1000 * 60 * 60),
          tags: [],
        })),
      });

      const response = await request(app)
        .get("/public/posts")
        .query({ page: "1", limit: "10" });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(10);
      expect(response.body.pagination.total).toBe(15);
      expect(response.body.pagination.totalPages).toBe(2);
    });

    it("should limit to maximum 100 posts per page", async () => {
      await prisma.blogPost.createMany({
        data: Array.from({ length: 5 }, (_, i) => ({
          title: `Post ${i + 1}`,
          slug: `post-${i + 1}`,
          content: "Content",
          excerpt: "Excerpt",
          authorId: "user-123",
          status: "published",
          publishedAt: new Date(Date.now() - 1000 * 60 * 60),
          tags: [],
        })),
      });

      const response = await request(app)
        .get("/public/posts")
        .query({ page: "1", limit: "200" });

      expect(response.status).toBe(400);
      expect(response.body.errors.length).toBe(1);
    });
  });

  describe("GET /public/posts/:idOrSlug", () => {
    it("should get published post by ID", async () => {
      const post = await prisma.blogPost.create({
        data: {
          title: "Test Post",
          slug: "test-post",
          content: "Content",
          excerpt: "Excerpt",
          authorId: "user-123",
          status: "published",
          publishedAt: new Date(Date.now() - 1000 * 60 * 60),
          tags: [],
        },
      });

      const response = await request(app).get(`/public/posts/${post.id}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(post.id);
      expect(response.body.status).toBe("published");
    });

    it("should get published post by slug", async () => {
      await prisma.blogPost.create({
        data: {
          title: "Test Post",
          slug: "test-post-slug",
          content: "Content",
          excerpt: "Excerpt",
          authorId: "user-123",
          status: "published",
          publishedAt: new Date(Date.now() - 1000 * 60 * 60),
          tags: [],
        },
      });

      const response = await request(app).get(
        "/public/posts/test-post-slug"
      );

      expect(response.status).toBe(200);
      expect(response.body.slug).toBe("test-post-slug");
    });

    it("should return 404 for draft post", async () => {
      const post = await prisma.blogPost.create({
        data: {
          title: "Draft Post",
          slug: "draft-post",
          content: "Content",
          excerpt: "Excerpt",
          authorId: "user-123",
          status: "draft",
          tags: [],
        },
      });

      const response = await request(app).get(`/public/posts/${post.id}`);

      expect(response.status).toBe(404);
    });

    it("should return 404 for future-dated post", async () => {
      const futureDate = new Date(Date.now() + 1000 * 60 * 60 * 24);
      const post = await prisma.blogPost.create({
        data: {
          title: "Future Post",
          slug: "future-post",
          content: "Content",
          excerpt: "Excerpt",
          authorId: "user-123",
          status: "published",
          publishedAt: futureDate,
          tags: [],
        },
      });

      const response = await request(app).get(`/public/posts/${post.id}`);

      expect(response.status).toBe(404);
    });

    it("should return 404 for non-existent post", async () => {
      const response = await request(app).get("/public/posts/99999");

      expect(response.status).toBe(404);
    });
  });
});
