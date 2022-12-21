import request from "supertest";
import mongoose from "mongoose";
import Code from "../../models/code.model";
import User from "../../models/user.model";
import bcrypt from "bcrypt";

let server: any;
let baseURL = "/api/auth";

describe("User Controller", () => {
  beforeAll(async () => {
    const mod = await import("../../server");
    server = (mod as any).default;
  });

  afterEach(async () => {
    await User.deleteMany({});
    await Code.deleteMany({});
  });

  afterAll(() => {
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
      expect(response.body.message).toMatch(/please provide an email/i);
    });

    it("should fail if user email already exists", async () => {
      await User.create({
        firstName: "user_firstname",
        lastName: "user_lastname",
        email: "user_email@gmail.com",
        password: await bcrypt.hash("user_password", 10),
        dept: "user_dept",
        faculty: "user_faculty",
        matricNo: "CSC/2022/009",
        phone: "08190876574",
        isStudent: true,
        isStaff: false,
      });

      const payload = { email: "user_email@gmail.com" };

      const response = await request(server).post(`${baseURL}/verification-code`).send(payload);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch("You already have an account with us");
    });
  });
});
