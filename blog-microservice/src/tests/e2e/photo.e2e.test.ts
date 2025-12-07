import request from "supertest";
import { createApp } from "../../utils/createApp";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { Express } from "express";
import { PrismaClient } from "../../../generated/client";
import { createMockUserContext } from "../helpers/testHelpers";
import {
  cleanTestDatabase,
  setupTestDatabase,
  teardownTestDatabase,
} from "../helpers/testDatabase";

jest.mock("../../utils/aws-s3/crud", () => ({
  uploadPublicPhoto: jest.fn().mockResolvedValue("mocked-s3-path.jpg"),
  deletePublicPhoto: jest.fn().mockResolvedValue(undefined),
  uploadMultiplePublicPhotos: jest
    .fn()
    .mockResolvedValue(["mocked-s3-path1.jpg", "mocked-s3-path2.jpg"]),
  deleteMultiplePublicPhotos: jest.fn().mockResolvedValue(undefined),
}));

let testPrisma: PrismaClient;
jest.mock("../../utils/prisma", () => ({
  __esModule: true,
  get default() {
    return testPrisma;
  },
}));

describe("Photo Routes (E2E Tests)", () => {
  let app: Express;
  let prisma: PrismaClient;
  let adminUserContext: string;

  beforeAll(async () => {
    prisma = await setupTestDatabase();
    testPrisma = prisma;
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

  describe("POST /photo", () => {
    it("should upload a photo and return 201 status", async () => {
      const buffer = Buffer.from("fake image content");

      const response = await request(app)
        .post("/photo")
        .set("user-context", adminUserContext)
        .attach("photo", buffer, "test-image.jpg");
      expect(response.status).toBe(StatusCodes.CREATED);
      expect(response.body).toHaveProperty("id");
      expect(response.body.path).toBe("mocked-s3-path.jpg");
    });

    it("should return 400 if no file is provided", async () => {
      const response = await request(app)
        .post("/photo")
        .set("user-context", adminUserContext);
      expect(response.status).toBe(StatusCodes.BAD_REQUEST);
    });
  });
});
