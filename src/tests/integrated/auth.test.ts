import request from "supertest";
import mongoose from "mongoose";
import Code from "../../models/code.model";
import User from "../../models/user.model";
// import sequelize from "../../connection";
//import { Express } from "express-serve-static-core";

//let server: Express;
let server: any;
let baseURL = "/api/auth";

describe("User Controller", () => {
  beforeAll(async () => {
    // server = require("../../server");
    const mod = await import("../../server");
    server = (mod as any).default;
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Code.deleteMany({});
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
    mongoose.disconnect();
  });

  describe("Get verification code", () => {
    it("should fail if user does not provide an email", async () => {
      const payload = { email: "" };

      const response = await request(server).post(`${baseURL}/verification-code`).send(payload);
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/please provide an email/i);
    });
  });
});
