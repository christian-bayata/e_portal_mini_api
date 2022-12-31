import request from "supertest";
import mongoose from "mongoose";
import User from "../../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

let server: any;
let baseURL = "/api/payment";

describe("Payment Controller", () => {
  beforeAll(async () => {
    const mod = await import("../../server");
    server = (mod as any).default;
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  afterAll(() => {
    if (server) {
      server.close();
    }
    mongoose.disconnect();
  });

  /*****************************************************************************************************************************
   *
   **************************************** Initialize Payment **********************************
   *
   ******************************************************************************************************************************
   */

  describe("Initialize Payment", () => {
    it("should fail if user is not found", async () => {
      const token = jwt.sign({ _id: new mongoose.Types.ObjectId(), matricNo: "CSC/2021/022", isStudent: true }, process.env.JWT_SECRET_KEY as string);

      const payload = {
        amount: 1000,
        email: "user@gmail.com",
        session: "2012/2013",
      };

      const response = await request(server)
        .post(`${baseURL}/initialize-payment`)
        .set("authorization", token as string)
        .send(payload);
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/user not found/i);
    });

    it("should succeed if all requirements are met", async () => {
      const user = await User.create({
        firstName: "user_firstname",
        lastName: "user_lastname",
        email: "user_email@gmail.com",
        password: await bcrypt.hash("user_password", 10),
        dept: "user_dept",
        faculty: "user_faculty",
        matricNo: "CSC/2022/009",
        phone: "08190876574",
        isStudent: true,
      });

      const token = jwt.sign({ _id: user._id, matricNo: user.matricNo, isStudent: true }, process.env.JWT_SECRET_KEY as string);

      const payload = {
        amount: 1000,
        email: user.email,
        session: "2012/2013",
      };

      const response = await request(server)
        .post(`${baseURL}/initialize-payment`)
        .set("authorization", token as string)
        .send(payload);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/authorization url/i);
      expect(response.body.message).toMatch(/created/i);
      expect(response.body.body).not.toContain("data");
    });
  });

  /*****************************************************************************************************************************
   *
   **************************************** Verify Payment **********************************
   *
   ******************************************************************************************************************************
   */

  describe("Verify Payment", () => {
    it("should fail if reference ID is not provided", async () => {
      const token = jwt.sign({ _id: new mongoose.Types.ObjectId(), matricNo: "CSC/2021/022", isStudent: true }, process.env.JWT_SECRET_KEY as string);

      const response = await request(server)
        .get(`${baseURL}/verify-payment?refId=`)
        .set("authorization", token as string);
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/provide your reference id/i);
    });

    it("should succed if all requirements are met", async () => {
      const token = jwt.sign({ _id: new mongoose.Types.ObjectId(), matricNo: "CSC/2021/022", isStudent: true }, process.env.JWT_SECRET_KEY as string);

      const response = await request(server)
        .get(`${baseURL}/verify-payment?refId=scakgfvman`)
        .set("authorization", token as string);
      expect(response.status).toBe(200);
      expect(response.body.message).toMatch(/payment successfully verified/i);
    });
  });
});
