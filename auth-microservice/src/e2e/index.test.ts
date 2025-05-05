import request from "supertest";
import { createApp } from "../utils/createApp";
import { Express } from "express";
describe("/coordinator", () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  it("should return test msg when getting /coordinator", async () => {
    const response = await request(app).get("/coordinator");
    expect(response.text).toStrictEqual("hello test");
  });
});
